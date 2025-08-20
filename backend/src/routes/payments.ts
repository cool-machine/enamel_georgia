import express from 'express';
import { PaymentController } from '@/controllers/paymentController';
import { validate, validateParams, paymentSchemas } from '@/middleware/validation';
import { authenticate, adminOnly } from '@/middleware/auth';
import Joi from 'joi';

const router = express.Router();

// Public payment configuration endpoints

// GET /payments/config - Get public Stripe configuration
router.get(
  '/config',
  PaymentController.getStripeConfig
);

// GET /payments/methods - Get available payment methods
router.get(
  '/methods',
  PaymentController.getPaymentMethods
);

// User payment endpoints (require authentication)

// POST /payments/intent - Create payment intent for order
router.post(
  '/intent',
  authenticate,
  validate(paymentSchemas.createPaymentIntent),
  PaymentController.createPaymentIntent
);

// POST /payments/confirm - Confirm payment
router.post(
  '/confirm',
  authenticate,
  validate(paymentSchemas.confirmPayment),
  PaymentController.confirmPayment
);

// GET /payments/status/:paymentIntentId - Get payment status
router.get(
  '/status/:paymentIntentId',
  authenticate,
  validateParams('paymentIntentId', Joi.string().min(1).required()),
  PaymentController.getPaymentStatus
);

// GET /payments/my - Get user's payment history
router.get(
  '/my',
  authenticate,
  PaymentController.listUserPayments
);

// Admin payment endpoints (require admin role)

// POST /payments/refund - Process refund (admin only)
router.post(
  '/refund',
  authenticate,
  adminOnly,
  validate(paymentSchemas.refundPayment),
  PaymentController.refundPayment
);

// Webhook endpoint (public, no authentication - Stripe handles verification)

// POST /payments/webhook - Stripe webhook endpoint
router.post(
  '/webhook',
  PaymentController.handleWebhook
);

export default router;