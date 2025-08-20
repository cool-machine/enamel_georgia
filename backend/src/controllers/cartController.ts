import { Request, Response, NextFunction } from 'express';
import { CartService } from '@/services/cartService';
import { AppError } from '@/middleware/errorHandler';
import { AuthRequest } from '@/types';
import { ApiResponse } from '@/types';
import { logger } from '@/utils/logger';

export class CartController {
  static async getCart(req: Request, res: Response<ApiResponse>, next: NextFunction) {
    try {
      const authReq = req as AuthRequest;
      const userId = authReq.user?.id;
      const sessionId = req.headers['x-session-id'] as string;

      logger.info('Getting cart', { userId, sessionId });

      const cart = await CartService.getCartWithItems(userId, sessionId);
      const summary = await CartService.getCartSummary(userId, sessionId);

      res.json({
        success: true,
        message: 'Cart retrieved successfully',
        data: {
          cart,
          summary
        }
      });
    } catch (error) {
      next(error);
    }
  }

  static async addToCart(req: Request, res: Response<ApiResponse>, next: NextFunction) {
    try {
      const authReq = req as AuthRequest;
      const userId = authReq.user?.id;
      const sessionId = req.headers['x-session-id'] as string;
      const { productId, quantity } = req.body;

      logger.info('Adding item to cart', { 
        userId, 
        sessionId, 
        productId, 
        quantity 
      });

      const cart = await CartService.addToCart(
        { productId, quantity },
        userId,
        sessionId
      );

      const summary = await CartService.getCartSummary(userId, sessionId);

      res.status(201).json({
        success: true,
        message: 'Item added to cart successfully',
        data: {
          cart,
          summary
        }
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateCartItem(req: Request, res: Response<ApiResponse>, next: NextFunction) {
    try {
      const authReq = req as AuthRequest;
      const userId = authReq.user?.id;
      const sessionId = req.headers['x-session-id'] as string;
      const { itemId } = req.params;
      const { quantity } = req.body;

      logger.info('Updating cart item', { 
        userId, 
        sessionId, 
        itemId, 
        quantity 
      });

      const cart = await CartService.updateCartItem(
        itemId,
        { quantity },
        userId,
        sessionId
      );

      const summary = await CartService.getCartSummary(userId, sessionId);

      res.json({
        success: true,
        message: 'Cart item updated successfully',
        data: {
          cart,
          summary
        }
      });
    } catch (error) {
      next(error);
    }
  }

  static async removeFromCart(req: Request, res: Response<ApiResponse>, next: NextFunction) {
    try {
      const authReq = req as AuthRequest;
      const userId = authReq.user?.id;
      const sessionId = req.headers['x-session-id'] as string;
      const { itemId } = req.params;

      logger.info('Removing item from cart', { 
        userId, 
        sessionId, 
        itemId 
      });

      const cart = await CartService.removeFromCart(
        itemId,
        userId,
        sessionId
      );

      const summary = await CartService.getCartSummary(userId, sessionId);

      res.json({
        success: true,
        message: 'Item removed from cart successfully',
        data: {
          cart,
          summary
        }
      });
    } catch (error) {
      next(error);
    }
  }

  static async clearCart(req: Request, res: Response<ApiResponse>, next: NextFunction) {
    try {
      const authReq = req as AuthRequest;
      const userId = authReq.user?.id;
      const sessionId = req.headers['x-session-id'] as string;

      logger.info('Clearing cart', { userId, sessionId });

      await CartService.clearCart(userId, sessionId);

      res.json({
        success: true,
        message: 'Cart cleared successfully',
        data: {
          cart: null,
          summary: {
            itemCount: 0,
            subtotal: 0,
            estimatedTotal: 0
          }
        }
      });
    } catch (error) {
      next(error);
    }
  }

  static async transferGuestCart(req: Request, res: Response<ApiResponse>, next: NextFunction) {
    try {
      const authReq = req as AuthRequest;
      const userId = authReq.user?.id;
      const { sessionId } = req.body;

      if (!userId) {
        throw new AppError('Authentication required', 401);
      }

      if (!sessionId) {
        throw new AppError('Session ID is required', 400);
      }

      logger.info('Transferring guest cart to user', { 
        userId, 
        sessionId 
      });

      const cart = await CartService.transferGuestCartToUser(sessionId, userId);
      const summary = await CartService.getCartSummary(userId);

      res.json({
        success: true,
        message: cart ? 'Guest cart transferred successfully' : 'No guest cart to transfer',
        data: {
          cart,
          summary
        }
      });
    } catch (error) {
      next(error);
    }
  }

  static async validateCart(req: Request, res: Response<ApiResponse>, next: NextFunction) {
    try {
      const authReq = req as AuthRequest;
      const userId = authReq.user?.id;
      const sessionId = req.headers['x-session-id'] as string;

      logger.info('Validating cart for checkout', { userId, sessionId });

      const validation = await CartService.validateCartForCheckout(userId, sessionId);

      res.json({
        success: true,
        message: validation.valid ? 'Cart is valid for checkout' : 'Cart validation failed',
        data: {
          valid: validation.valid,
          errors: validation.errors,
          cart: validation.cart,
          summary: validation.cart ? await CartService.getCartSummary(userId, sessionId) : null
        }
      });
    } catch (error) {
      next(error);
    }
  }

  static async getCartSummary(req: Request, res: Response<ApiResponse>, next: NextFunction) {
    try {
      const authReq = req as AuthRequest;
      const userId = authReq.user?.id;
      const sessionId = req.headers['x-session-id'] as string;

      const summary = await CartService.getCartSummary(userId, sessionId);

      res.json({
        success: true,
        message: 'Cart summary retrieved successfully',
        data: { summary }
      });
    } catch (error) {
      next(error);
    }
  }
}