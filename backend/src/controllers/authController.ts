import { Request, Response } from 'express';
import { AuthService } from '@/services/authService';
import { asyncHandler } from '@/middleware/errorHandler';
import { ApiResponse, AuthRequest } from '@/types';
import { logger } from '@/utils/logger';

export class AuthController {
  // POST /api/v1/auth/register - Register new user
  static register = asyncHandler(async (req: Request, res: Response<ApiResponse>) => {
    const { email, password, firstName, lastName } = req.body;
    
    logger.info('User registration attempt', { email, firstName, lastName });

    const result = await AuthService.register({
      email,
      password,
      firstName,
      lastName
    });

    // Set HTTP-only cookies for tokens (optional, can also return in response)
    res.cookie('accessToken', result.tokens.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.cookie('refreshToken', result.tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
    });

    logger.info('User registered successfully', { userId: result.user.id, email });

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: result.user,
        tokens: result.tokens
      }
    });
  });

  // POST /api/v1/auth/login - Login user
  static login = asyncHandler(async (req: Request, res: Response<ApiResponse>) => {
    const { email, password } = req.body;
    
    logger.info('User login attempt', { email });

    const result = await AuthService.login({ email, password });

    // Set HTTP-only cookies for tokens
    res.cookie('accessToken', result.tokens.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.cookie('refreshToken', result.tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
    });

    logger.info('User logged in successfully', { userId: result.user.id, email });

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: result.user,
        tokens: result.tokens
      }
    });
  });

  // POST /api/v1/auth/logout - Logout user
  static logout = asyncHandler(async (req: Request, res: Response<ApiResponse>) => {
    const authReq = req as AuthRequest;
    
    logger.info('User logout', { userId: authReq.user?.id });

    // Clear cookies
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');

    // TODO: Add token blacklisting for enhanced security
    // await TokenBlacklistService.blacklistToken(authReq.headers.authorization);

    res.status(200).json({
      success: true,
      message: 'Logged out successfully'
    });
  });

  // POST /api/v1/auth/refresh - Refresh access token
  static refreshToken = asyncHandler(async (req: Request, res: Response<ApiResponse>) => {
    const { refreshToken } = req.body;
    const cookieRefreshToken = req.cookies.refreshToken;
    
    // Use token from body or cookie
    const tokenToUse = refreshToken || cookieRefreshToken;
    
    if (!tokenToUse) {
      return res.status(400).json({
        success: false,
        message: 'Refresh token is required'
      });
    }

    logger.info('Token refresh attempt');

    const result = await AuthService.refreshToken(tokenToUse);

    // Update cookies with new tokens
    res.cookie('accessToken', result.tokens.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.cookie('refreshToken', result.tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000
    });

    logger.info('Token refreshed successfully', { userId: result.user.id });

    res.status(200).json({
      success: true,
      message: 'Token refreshed successfully',
      data: {
        user: result.user,
        tokens: result.tokens
      }
    });
  });

  // GET /api/v1/auth/me - Get current user
  static getCurrentUser = asyncHandler(async (req: AuthRequest, res: Response<ApiResponse>) => {
    const userId = req.user!.id;
    
    logger.info('Get current user', { userId });

    const user = await AuthService.getCurrentUser(userId);

    res.status(200).json({
      success: true,
      message: 'User retrieved successfully',
      data: user
    });
  });

  // PUT /api/v1/auth/profile - Update user profile
  static updateProfile = asyncHandler(async (req: AuthRequest, res: Response<ApiResponse>) => {
    const userId = req.user!.id;
    const { firstName, lastName } = req.body;
    
    logger.info('Update user profile', { userId, firstName, lastName });

    const user = await AuthService.updateProfile(userId, { firstName, lastName });

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: user
    });
  });

  // PUT /api/v1/auth/password - Change password
  static changePassword = asyncHandler(async (req: AuthRequest, res: Response<ApiResponse>) => {
    const userId = req.user!.id;
    const { oldPassword, newPassword } = req.body;
    
    logger.info('Change password attempt', { userId });

    const result = await AuthService.changePassword(userId, oldPassword, newPassword);

    res.status(200).json({
      success: true,
      message: result.message
    });
  });

  // POST /api/v1/auth/forgot-password - Request password reset
  static forgotPassword = asyncHandler(async (req: Request, res: Response<ApiResponse>) => {
    const { email } = req.body;
    
    logger.info('Password reset request', { email });

    const result = await AuthService.generatePasswordResetToken(email);

    res.status(200).json({
      success: true,
      message: result.message
    });
  });

  // POST /api/v1/auth/reset-password - Reset password with token
  static resetPassword = asyncHandler(async (req: Request, res: Response<ApiResponse>) => {
    const { token, newPassword } = req.body;
    
    logger.info('Password reset attempt');

    const result = await AuthService.resetPassword(token, newPassword);

    res.status(200).json({
      success: true,
      message: result.message
    });
  });

  // POST /api/v1/auth/verify-email - Verify email address
  static verifyEmail = asyncHandler(async (req: Request, res: Response<ApiResponse>) => {
    const { token } = req.body;
    
    logger.info('Email verification attempt');

    const result = await AuthService.verifyEmail(token);

    res.status(200).json({
      success: true,
      message: result.message
    });
  });

  // DELETE /api/v1/auth/account - Delete user account
  static deleteAccount = asyncHandler(async (req: AuthRequest, res: Response<ApiResponse>) => {
    const userId = req.user!.id;
    const { password } = req.body;
    
    logger.info('Account deletion attempt', { userId });

    const result = await AuthService.deleteAccount(userId, password);

    // Clear cookies
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');

    res.status(200).json({
      success: true,
      message: result.message
    });
  });
}