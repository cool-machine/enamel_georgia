import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Prisma, UserRole } from '@prisma/client';
import { prisma } from '@/models';
import { env } from '@/config/env';
import { AppError } from '@/middleware/errorHandler';
import { AuthTokens, LoginRequest, RegisterRequest } from '@/types';

export class AuthService {
  // Hash password
  static async hashPassword(password: string): Promise<string> {
    const saltRounds = 12;
    return bcrypt.hash(password, saltRounds);
  }

  // Compare password
  static async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  // Generate JWT tokens
  static generateTokens(userId: string, email: string, role: UserRole): AuthTokens {
    const payload = {
      userId,
      email,
      role,
      type: 'access'
    };

    const refreshPayload = {
      userId,
      email,
      role,
      type: 'refresh'
    };

    const accessToken = jwt.sign(payload, env.JWT_SECRET, {
      expiresIn: env.JWT_EXPIRES_IN,
      issuer: 'enamel-georgia',
      audience: 'enamel-georgia-users'
    });

    const refreshToken = jwt.sign(refreshPayload, env.JWT_SECRET, {
      expiresIn: env.JWT_REFRESH_EXPIRES_IN,
      issuer: 'enamel-georgia',
      audience: 'enamel-georgia-users'
    });

    return {
      accessToken,
      refreshToken
    };
  }

  // Verify JWT token
  static verifyToken(token: string): any {
    try {
      return jwt.verify(token, env.JWT_SECRET, {
        issuer: 'enamel-georgia',
        audience: 'enamel-georgia-users'
      });
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new AppError('Token expired', 401);
      }
      if (error instanceof jwt.JsonWebTokenError) {
        throw new AppError('Invalid token', 401);
      }
      throw new AppError('Token verification failed', 401);
    }
  }

  // Register new user
  static async register(data: RegisterRequest) {
    const { email, password, firstName, lastName } = data;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (existingUser) {
      throw new AppError('User with this email already exists', 409);
    }

    // Hash password
    const passwordHash = await this.hashPassword(password);

    // Create user
    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        passwordHash,
        firstName,
        lastName,
        role: UserRole.CUSTOMER, // Default role
        isEmailVerified: false // Will be verified later
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isEmailVerified: true,
        createdAt: true
      }
    });

    // Generate tokens
    const tokens = this.generateTokens(user.id, user.email, user.role);

    // TODO: Send email verification (Phase 2 enhancement)
    // await EmailService.sendVerificationEmail(user.email, verificationToken);

    return {
      user,
      tokens
    };
  }

  // Login user
  static async login(data: LoginRequest) {
    const { email, password } = data;

    // Find user with password
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (!user) {
      throw new AppError('Invalid email or password', 401);
    }

    // Check password
    const isPasswordValid = await this.comparePassword(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new AppError('Invalid email or password', 401);
    }

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() }
    });

    // Generate tokens
    const tokens = this.generateTokens(user.id, user.email, user.role);

    // Return user without password
    const { passwordHash, resetToken, resetTokenExpires, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      tokens
    };
  }

  // Refresh access token
  static async refreshToken(refreshToken: string) {
    const decoded = this.verifyToken(refreshToken);

    if (decoded.type !== 'refresh') {
      throw new AppError('Invalid token type', 401);
    }

    // Verify user still exists
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        role: true,
        isEmailVerified: true
      }
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    // Generate new tokens
    const tokens = this.generateTokens(user.id, user.email, user.role);

    return {
      user,
      tokens
    };
  }

  // Get current user
  static async getCurrentUser(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isEmailVerified: true,
        lastLoginAt: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    return user;
  }

  // Update user profile
  static async updateProfile(userId: string, data: Partial<{ firstName: string; lastName: string }>) {
    const user = await prisma.user.update({
      where: { id: userId },
      data,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isEmailVerified: true,
        updatedAt: true
      }
    });

    return user;
  }

  // Change password
  static async changePassword(userId: string, oldPassword: string, newPassword: string) {
    // Get user with password
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    // Verify old password
    const isOldPasswordValid = await this.comparePassword(oldPassword, user.passwordHash);
    if (!isOldPasswordValid) {
      throw new AppError('Current password is incorrect', 400);
    }

    // Hash new password
    const newPasswordHash = await this.hashPassword(newPassword);

    // Update password
    await prisma.user.update({
      where: { id: userId },
      data: { passwordHash: newPasswordHash }
    });

    return { message: 'Password updated successfully' };
  }

  // Generate password reset token
  static async generatePasswordResetToken(email: string) {
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (!user) {
      // Don't reveal if email exists for security
      return { message: 'If an account with that email exists, a reset link has been sent' };
    }

    // Generate reset token
    const resetToken = jwt.sign(
      { userId: user.id, type: 'password-reset' },
      env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Save reset token to database
    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken,
        resetTokenExpires: new Date(Date.now() + 60 * 60 * 1000) // 1 hour
      }
    });

    // TODO: Send password reset email (Phase 2 enhancement)
    // await EmailService.sendPasswordResetEmail(user.email, resetToken);

    return { message: 'If an account with that email exists, a reset link has been sent' };
  }

  // Reset password with token
  static async resetPassword(token: string, newPassword: string) {
    try {
      const decoded = this.verifyToken(token);

      if (decoded.type !== 'password-reset') {
        throw new AppError('Invalid token type', 400);
      }

      // Find user with valid reset token
      const user = await prisma.user.findFirst({
        where: {
          id: decoded.userId,
          resetToken: token,
          resetTokenExpires: { gt: new Date() }
        }
      });

      if (!user) {
        throw new AppError('Invalid or expired reset token', 400);
      }

      // Hash new password
      const passwordHash = await this.hashPassword(newPassword);

      // Update password and clear reset token
      await prisma.user.update({
        where: { id: user.id },
        data: {
          passwordHash,
          resetToken: null,
          resetTokenExpires: null
        }
      });

      return { message: 'Password reset successfully' };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Invalid or expired reset token', 400);
    }
  }

  // Verify email (placeholder for email verification feature)
  static async verifyEmail(token: string) {
    try {
      const decoded = this.verifyToken(token);

      if (decoded.type !== 'email-verification') {
        throw new AppError('Invalid token type', 400);
      }

      await prisma.user.update({
        where: { id: decoded.userId },
        data: {
          isEmailVerified: true,
          emailVerifiedAt: new Date()
        }
      });

      return { message: 'Email verified successfully' };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Invalid verification token', 400);
    }
  }

  // Delete user account
  static async deleteAccount(userId: string, password: string) {
    // Get user with password
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    // Verify password
    const isPasswordValid = await this.comparePassword(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new AppError('Password is incorrect', 400);
    }

    // Delete user (this will cascade delete related data)
    await prisma.user.delete({
      where: { id: userId }
    });

    return { message: 'Account deleted successfully' };
  }
}