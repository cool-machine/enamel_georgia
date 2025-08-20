import express from 'express';
import { AuthController } from '@/controllers/authController';
import { validate, authSchemas } from '@/middleware/validation';
import { authenticate, authRateLimit } from '@/middleware/auth';

const router = express.Router();

// Rate limiting for auth endpoints (5 attempts per 15 minutes)
const authLimiter = authRateLimit(5, 15 * 60 * 1000);

// Public authentication routes

// POST /auth/register - Register new user
router.post(
  '/register',
  authLimiter,
  validate(authSchemas.register),
  AuthController.register
);

// POST /auth/login - Login user
router.post(
  '/login',
  authLimiter,
  validate(authSchemas.login),
  AuthController.login
);

// POST /auth/refresh - Refresh access token
router.post(
  '/refresh',
  validate(authSchemas.refreshToken),
  AuthController.refreshToken
);

// POST /auth/forgot-password - Request password reset
router.post(
  '/forgot-password',
  authRateLimit(3, 60 * 60 * 1000), // 3 attempts per hour
  validate(authSchemas.passwordResetRequest),
  AuthController.forgotPassword
);

// POST /auth/reset-password - Reset password with token
router.post(
  '/reset-password',
  authLimiter,
  validate(authSchemas.passwordReset),
  AuthController.resetPassword
);

// POST /auth/verify-email - Verify email address
router.post(
  '/verify-email',
  validate(authSchemas.emailVerification),
  AuthController.verifyEmail
);

// Protected authentication routes (require authentication)

// POST /auth/logout - Logout user (clear tokens)
router.post(
  '/logout',
  authenticate,
  AuthController.logout
);

// GET /auth/me - Get current user profile
router.get(
  '/me',
  authenticate,
  AuthController.getCurrentUser
);

// PUT /auth/profile - Update user profile
router.put(
  '/profile',
  authenticate,
  validate(authSchemas.updateProfile),
  AuthController.updateProfile
);

// PUT /auth/password - Change password
router.put(
  '/password',
  authenticate,
  authRateLimit(3, 60 * 60 * 1000), // 3 attempts per hour
  validate(authSchemas.changePassword),
  AuthController.changePassword
);

// DELETE /auth/account - Delete user account
router.delete(
  '/account',
  authenticate,
  authRateLimit(2, 24 * 60 * 60 * 1000), // 2 attempts per day
  validate(authSchemas.deleteAccount),
  AuthController.deleteAccount
);

export default router;