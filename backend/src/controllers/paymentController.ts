import { Request, Response, NextFunction } from 'express';
import { PaymentService } from '@/services/paymentService';
import { AppError } from '@/middleware/errorHandler';
import { AuthRequest } from '@/types';
import { ApiResponse } from '@/types';
import { logger } from '@/utils/logger';
import { stripe, STRIPE_CONFIG, isWebhookConfigured } from '@/config/stripe';
import Stripe from 'stripe';

export class PaymentController {
  static async createPaymentIntent(req: Request, res: Response<ApiResponse>, next: NextFunction) {
    try {
      const authReq = req as AuthRequest;
      const userId = authReq.user?.id;

      if (!userId) {
        throw new AppError('Authentication required', 401);
      }

      const { orderId, returnUrl } = req.body;

      logger.info('Creating payment intent', {
        userId,
        orderId,
        returnUrl
      });

      const result = await PaymentService.createPaymentIntent({
        orderId,
        userId,
        returnUrl
      });

      res.status(201).json({
        success: true,
        message: 'Payment intent created successfully',
        data: {
          clientSecret: result.clientSecret,
          paymentIntentId: result.paymentIntent.id,
          status: result.status,
          amount: result.order?.total,
          currency: STRIPE_CONFIG.CURRENCY,
          order: {
            id: result.order?.id,
            orderNumber: result.order?.orderNumber,
            total: result.order?.total
          }
        }
      });
    } catch (error) {
      next(error);
    }
  }

  static async confirmPayment(req: Request, res: Response<ApiResponse>, next: NextFunction) {
    try {
      const authReq = req as AuthRequest;
      const userId = authReq.user?.id;

      if (!userId) {
        throw new AppError('Authentication required', 401);
      }

      const { paymentIntentId, paymentMethodId } = req.body;

      logger.info('Confirming payment', {
        userId,
        paymentIntentId,
        paymentMethodId
      });

      const result = await PaymentService.confirmPayment({
        paymentIntentId,
        paymentMethodId
      });

      res.json({
        success: true,
        message: 'Payment confirmation initiated',
        data: {
          paymentIntentId: result.paymentIntent.id,
          status: result.status,
          clientSecret: result.clientSecret,
          requiresAction: result.status === 'requires_action',
          order: result.order ? {
            id: result.order.id,
            orderNumber: result.order.orderNumber,
            status: result.order.status
          } : undefined
        }
      });
    } catch (error) {
      next(error);
    }
  }

  static async getPaymentStatus(req: Request, res: Response<ApiResponse>, next: NextFunction) {
    try {
      const authReq = req as AuthRequest;
      const userId = authReq.user?.id;

      if (!userId) {
        throw new AppError('Authentication required', 401);
      }

      const { paymentIntentId } = req.params;

      logger.info('Getting payment status', {
        userId,
        paymentIntentId
      });

      const status = await PaymentService.getPaymentStatus(paymentIntentId);

      res.json({
        success: true,
        message: 'Payment status retrieved successfully',
        data: status
      });
    } catch (error) {
      next(error);
    }
  }

  static async listUserPayments(req: Request, res: Response<ApiResponse>, next: NextFunction) {
    try {
      const authReq = req as AuthRequest;
      const userId = authReq.user?.id;

      if (!userId) {
        throw new AppError('Authentication required', 401);
      }

      logger.info('Getting user payments', { userId });

      const payments = await PaymentService.listCustomerPayments(userId);

      res.json({
        success: true,
        message: 'User payments retrieved successfully',
        data: {
          payments: payments.map(payment => ({
            id: payment.id,
            amount: payment.amount / 100, // Convert from tetri to GEL
            currency: payment.currency,
            status: payment.status,
            created: payment.created,
            orderId: payment.metadata.orderId
          }))
        }
      });
    } catch (error) {
      next(error);
    }
  }

  static async refundPayment(req: Request, res: Response<ApiResponse>, next: NextFunction) {
    try {
      const authReq = req as AuthRequest;
      const userRole = authReq.user?.role;

      // Only admins can issue refunds
      if (userRole !== 'ADMIN') {
        throw new AppError('Admin access required', 403);
      }

      const { paymentIntentId, amount, reason } = req.body;

      logger.info('Processing refund', {
        paymentIntentId,
        amount,
        reason,
        adminUserId: authReq.user?.id
      });

      const refund = await PaymentService.refundPayment({
        paymentIntentId,
        amount,
        reason
      });

      res.json({
        success: true,
        message: 'Refund processed successfully',
        data: {
          refundId: refund.id,
          amount: refund.amount ? refund.amount / 100 : undefined, // Convert to GEL
          currency: refund.currency,
          status: refund.status,
          reason: refund.reason
        }
      });
    } catch (error) {
      next(error);
    }
  }

  static async handleWebhook(req: Request, res: Response, next: NextFunction) {
    try {
      if (!isWebhookConfigured()) {
        logger.warn('Webhook received but STRIPE_WEBHOOK_SECRET not configured');
        return res.status(400).send('Webhook secret not configured');
      }

      const sig = req.headers['stripe-signature'] as string;
      const body = req.body;

      if (!sig) {
        throw new AppError('Missing stripe-signature header', 400);
      }

      let event: Stripe.Event;

      try {
        event = stripe.webhooks.constructEvent(body, sig, STRIPE_CONFIG.WEBHOOK_SECRET!);
      } catch (err) {
        logger.error('Webhook signature verification failed', {
          error: err instanceof Error ? err.message : 'Unknown error'
        });
        throw new AppError('Webhook signature verification failed', 400);
      }

      logger.info('Webhook received', {
        type: event.type,
        id: event.id
      });

      // Process the webhook event
      await PaymentService.handleWebhookEvent(event);

      res.json({ received: true });
    } catch (error) {
      next(error);
    }
  }

  static async getPaymentMethods(req: Request, res: Response<ApiResponse>, next: NextFunction) {
    try {
      res.json({
        success: true,
        message: 'Available payment methods',
        data: {
          paymentMethods: STRIPE_CONFIG.PAYMENT_METHODS,
          currency: STRIPE_CONFIG.CURRENCY,
          currencySymbol: STRIPE_CONFIG.CURRENCY_SYMBOL,
          minAmount: STRIPE_CONFIG.MIN_CHARGE_AMOUNT / 100, // Convert to GEL
          maxAmount: STRIPE_CONFIG.MAX_CHARGE_AMOUNT / 100, // Convert to GEL
          testMode: process.env.STRIPE_SECRET_KEY?.startsWith('sk_test_') || false
        }
      });
    } catch (error) {
      next(error);
    }
  }

  static async getStripeConfig(req: Request, res: Response<ApiResponse>, next: NextFunction) {
    try {
      // Return public configuration for frontend
      res.json({
        success: true,
        message: 'Stripe configuration',
        data: {
          currency: STRIPE_CONFIG.CURRENCY,
          currencySymbol: STRIPE_CONFIG.CURRENCY_SYMBOL,
          paymentMethods: STRIPE_CONFIG.PAYMENT_METHODS,
          returnUrl: STRIPE_CONFIG.RETURN_URL,
          testMode: process.env.STRIPE_SECRET_KEY?.startsWith('sk_test_') || false,
          // Note: Never return secret keys to frontend
          publishableKey: process.env.STRIPE_PUBLISHABLE_KEY // Will be added to env later
        }
      });
    } catch (error) {
      next(error);
    }
  }
}