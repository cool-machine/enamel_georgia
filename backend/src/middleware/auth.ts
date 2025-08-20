import { Request, Response, NextFunction } from 'express';
import { AuthService } from '@/services/authService';
import { AppError } from '@/middleware/errorHandler';
import { AuthRequest } from '@/types';
import { ApiResponse } from '@/types';
import { UserRole } from '@prisma/client';
import { logger } from '@/utils/logger';

// Authentication middleware - Verify JWT token
export const authenticate = async (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
  try {
    let token: string | undefined;

    // Check for token in Authorization header (Bearer token)
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    }

    // If no Bearer token, check cookies
    if (!token && req.cookies.accessToken) {
      token = req.cookies.accessToken;
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token is required'
      });
    }

    // Verify token
    const decoded = AuthService.verifyToken(token);

    if (decoded.type !== 'access') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token type'
      });
    }

    // Get current user to ensure they still exist
    const user = await AuthService.getCurrentUser(decoded.userId);

    // Attach user to request
    (req as AuthRequest).user = user;

    logger.debug('User authenticated', { userId: user.id, email: user.email, role: user.role });

    next();
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message
      });
    }

    logger.error('Authentication error', error);
    return res.status(401).json({
      success: false,
      message: 'Authentication failed'
    });
  }
};

// Optional authentication - User may or may not be authenticated
export const optionalAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let token: string | undefined;

    // Check for token in Authorization header
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    }

    // If no Bearer token, check cookies
    if (!token && req.cookies.accessToken) {
      token = req.cookies.accessToken;
    }

    // If no token, continue without authentication
    if (!token) {
      return next();
    }

    // Try to verify token
    const decoded = AuthService.verifyToken(token);

    if (decoded.type === 'access') {
      const user = await AuthService.getCurrentUser(decoded.userId);
      (req as AuthRequest).user = user;
    }

    next();
  } catch (error) {
    // On error, continue without authentication
    logger.debug('Optional auth failed, continuing without user', error);
    next();
  }
};

// Role-based authorization middleware factory
export const authorize = (...roles: UserRole[]) => {
  return (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
    const authReq = req as AuthRequest;

    // Check if user is authenticated
    if (!authReq.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    // Check if user has required role
    if (!roles.includes(authReq.user.role)) {
      logger.warn('Authorization failed', { 
        userId: authReq.user.id, 
        userRole: authReq.user.role, 
        requiredRoles: roles 
      });

      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions'
      });
    }

    logger.debug('User authorized', { 
      userId: authReq.user.id, 
      userRole: authReq.user.role 
    });

    next();
  };
};

// Admin only middleware
export const adminOnly = authorize(UserRole.ADMIN);

// Customer or Admin middleware
export const customerOrAdmin = authorize(UserRole.CUSTOMER, UserRole.ADMIN);

// Email verification required middleware
export const requireEmailVerification = (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
  const authReq = req as AuthRequest;

  if (!authReq.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required'
    });
  }

  if (!authReq.user.isEmailVerified) {
    return res.status(403).json({
      success: false,
      message: 'Email verification required',
      data: {
        emailVerificationRequired: true
      }
    });
  }

  next();
};

// Rate limiting for authentication endpoints
export const authRateLimit = (maxAttempts: number = 5, windowMs: number = 15 * 60 * 1000) => {
  const attempts = new Map<string, { count: number; resetTime: number }>();

  return (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
    const ip = req.ip;
    const now = Date.now();

    // Clean up expired entries
    for (const [key, value] of attempts.entries()) {
      if (now > value.resetTime) {
        attempts.delete(key);
      }
    }

    const userAttempts = attempts.get(ip);

    if (!userAttempts) {
      attempts.set(ip, { count: 1, resetTime: now + windowMs });
      return next();
    }

    if (userAttempts.count >= maxAttempts) {
      const remainingTime = Math.ceil((userAttempts.resetTime - now) / 1000 / 60);
      
      logger.warn('Rate limit exceeded for authentication', { ip, attempts: userAttempts.count });

      return res.status(429).json({
        success: false,
        message: `Too many authentication attempts. Try again in ${remainingTime} minutes.`
      });
    }

    userAttempts.count++;
    next();
  };
};

// Middleware to extract user from token without requiring authentication
export const getUserFromToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let token: string | undefined;

    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    }

    if (!token && req.cookies.accessToken) {
      token = req.cookies.accessToken;
    }

    if (token) {
      const decoded = AuthService.verifyToken(token);
      if (decoded.type === 'access') {
        const user = await AuthService.getCurrentUser(decoded.userId);
        (req as AuthRequest).user = user;
      }
    }
  } catch (error) {
    // Silently continue if token is invalid
    logger.debug('Failed to extract user from token', error);
  }

  next();
};