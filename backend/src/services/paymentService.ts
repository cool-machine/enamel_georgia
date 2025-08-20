import Stripe from 'stripe';
import { prisma } from '@/models';
import { AppError } from '@/middleware/errorHandler';
import { logger } from '@/utils/logger';
import { stripe, STRIPE_CONFIG, gelToTetri, tetriToGel, validatePaymentAmount, formatGelAmount } from '@/config/stripe';
import { OrderService } from '@/services/orderService';
import { Order, OrderStatus } from '@prisma/client';

export interface CreatePaymentIntentData {
  orderId: string;
  userId: string;
  returnUrl?: string;
}

export interface ConfirmPaymentData {
  paymentIntentId: string;
  paymentMethodId?: string;
}

export interface PaymentResult {
  paymentIntent: Stripe.PaymentIntent;
  clientSecret: string;
  status: string;
  order?: Order;
}

export interface RefundData {
  paymentIntentId: string;
  amount?: number; // Partial refund amount in GEL, if not provided - full refund
  reason?: string;
}

export class PaymentService {
  
  static async createPaymentIntent(data: CreatePaymentIntentData): Promise<PaymentResult> {
    const { orderId, userId, returnUrl } = data;

    // Get order details
    const order = await OrderService.getOrderById(orderId, userId);
    if (!order) {
      throw new AppError('Order not found', 404);
    }

    // Verify order belongs to user
    if (order.userId !== userId) {
      throw new AppError('Order not found', 404);
    }

    // Check order status
    if (order.status !== OrderStatus.PENDING) {
      throw new AppError(`Cannot create payment for order with status: ${order.status}`, 400);
    }

    // Validate payment amount
    const orderTotal = Number(order.total);
    validatePaymentAmount(orderTotal);
    const amountInTetri = gelToTetri(orderTotal);

    // Check if payment intent already exists for this order
    if (order.paymentIntentId) {
      try {
        const existingIntent = await stripe.paymentIntents.retrieve(order.paymentIntentId);
        
        // If payment intent is in a usable state, return it
        if (['requires_payment_method', 'requires_confirmation', 'requires_action'].includes(existingIntent.status)) {
          logger.info('Returning existing payment intent', {
            orderId,
            paymentIntentId: existingIntent.id,
            status: existingIntent.status
          });

          return {
            paymentIntent: existingIntent,
            clientSecret: existingIntent.client_secret!,
            status: existingIntent.status,
            order
          };
        }
      } catch (error) {
        logger.warn('Failed to retrieve existing payment intent, creating new one', {
          orderId,
          paymentIntentId: order.paymentIntentId,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    // Create new payment intent
    const paymentIntentParams: Stripe.PaymentIntentCreateParams = {
      amount: amountInTetri,
      currency: STRIPE_CONFIG.CURRENCY,
      payment_method_types: STRIPE_CONFIG.PAYMENT_METHODS,
      capture_method: STRIPE_CONFIG.CAPTURE_METHOD,
      metadata: {
        orderId: order.id,
        orderNumber: order.orderNumber,
        userId: order.userId,
        customerEmail: order.user.email,
        itemCount: order.items.length.toString()
      },
      description: `Enamel Georgia Order ${order.orderNumber}`,
      ...(returnUrl && { return_url: returnUrl })
    };

    try {
      const paymentIntent = await stripe.paymentIntents.create(paymentIntentParams);

      // Update order with payment intent ID
      await prisma.order.update({
        where: { id: orderId },
        data: { paymentIntentId: paymentIntent.id }
      });

      logger.info('Payment intent created successfully', {
        orderId,
        paymentIntentId: paymentIntent.id,
        amount: orderTotal,
        currency: STRIPE_CONFIG.CURRENCY,
        status: paymentIntent.status
      });

      return {
        paymentIntent,
        clientSecret: paymentIntent.client_secret!,
        status: paymentIntent.status,
        order
      };
    } catch (error) {
      logger.error('Failed to create payment intent', {
        orderId,
        amount: orderTotal,
        error: error instanceof Error ? error.message : 'Unknown error'
      });

      throw new AppError('Failed to create payment intent', 500);
    }
  }

  static async confirmPayment(data: ConfirmPaymentData): Promise<PaymentResult> {
    const { paymentIntentId, paymentMethodId } = data;

    try {
      // Retrieve payment intent to get order info
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      const orderId = paymentIntent.metadata.orderId;

      if (!orderId) {
        throw new AppError('Order ID not found in payment intent metadata', 400);
      }

      // Confirm payment intent
      const confirmedIntent = await stripe.paymentIntents.confirm(paymentIntentId, {
        ...(paymentMethodId && { payment_method: paymentMethodId }),
        return_url: STRIPE_CONFIG.RETURN_URL
      });

      // Get updated order
      const order = await OrderService.getOrderById(orderId);

      logger.info('Payment confirmation initiated', {
        orderId,
        paymentIntentId,
        status: confirmedIntent.status
      });

      return {
        paymentIntent: confirmedIntent,
        clientSecret: confirmedIntent.client_secret!,
        status: confirmedIntent.status,
        order: order || undefined
      };
    } catch (error) {
      logger.error('Failed to confirm payment', {
        paymentIntentId,
        error: error instanceof Error ? error.message : 'Unknown error'
      });

      if (error instanceof Stripe.errors.StripeError) {
        throw new AppError(`Payment failed: ${error.message}`, 400);
      }

      throw new AppError('Failed to confirm payment', 500);
    }
  }

  static async handleWebhookEvent(event: Stripe.Event): Promise<void> {
    logger.info('Processing Stripe webhook event', {
      type: event.type,
      id: event.id
    });

    try {
      switch (event.type) {
        case 'payment_intent.succeeded':
          await this.handlePaymentSucceeded(event.data.object as Stripe.PaymentIntent);
          break;

        case 'payment_intent.payment_failed':
          await this.handlePaymentFailed(event.data.object as Stripe.PaymentIntent);
          break;

        case 'payment_intent.canceled':
          await this.handlePaymentCanceled(event.data.object as Stripe.PaymentIntent);
          break;

        case 'payment_intent.requires_action':
          await this.handlePaymentRequiresAction(event.data.object as Stripe.PaymentIntent);
          break;

        default:
          logger.info('Unhandled webhook event type', { type: event.type });
      }
    } catch (error) {
      logger.error('Error processing webhook event', {
        type: event.type,
        id: event.id,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      throw error;
    }
  }

  private static async handlePaymentSucceeded(paymentIntent: Stripe.PaymentIntent): Promise<void> {
    const orderId = paymentIntent.metadata.orderId;
    
    if (!orderId) {
      logger.error('Order ID not found in payment intent metadata', {
        paymentIntentId: paymentIntent.id
      });
      return;
    }

    try {
      // Update order status to PAID
      const order = await OrderService.updateOrderStatus(orderId, {
        status: OrderStatus.PAID
      });

      logger.info('Order marked as paid', {
        orderId,
        orderNumber: order.orderNumber,
        paymentIntentId: paymentIntent.id,
        amount: tetriToGel(paymentIntent.amount)
      });

      // TODO: Send order confirmation email
      // TODO: Trigger fulfillment process

    } catch (error) {
      logger.error('Failed to update order after successful payment', {
        orderId,
        paymentIntentId: paymentIntent.id,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  private static async handlePaymentFailed(paymentIntent: Stripe.PaymentIntent): Promise<void> {
    const orderId = paymentIntent.metadata.orderId;
    
    if (!orderId) {
      logger.error('Order ID not found in payment intent metadata', {
        paymentIntentId: paymentIntent.id
      });
      return;
    }

    logger.warn('Payment failed for order', {
      orderId,
      paymentIntentId: paymentIntent.id,
      lastPaymentError: paymentIntent.last_payment_error?.message
    });

    // TODO: Send payment failed notification email
    // TODO: Update order notes with failure reason
  }

  private static async handlePaymentCanceled(paymentIntent: Stripe.PaymentIntent): Promise<void> {
    const orderId = paymentIntent.metadata.orderId;
    
    if (!orderId) {
      logger.error('Order ID not found in payment intent metadata', {
        paymentIntentId: paymentIntent.id
      });
      return;
    }

    logger.info('Payment canceled for order', {
      orderId,
      paymentIntentId: paymentIntent.id
    });

    // TODO: Handle payment cancellation
    // Order remains in PENDING status, user can retry payment
  }

  private static async handlePaymentRequiresAction(paymentIntent: Stripe.PaymentIntent): Promise<void> {
    const orderId = paymentIntent.metadata.orderId;
    
    logger.info('Payment requires additional action', {
      orderId,
      paymentIntentId: paymentIntent.id,
      nextAction: paymentIntent.next_action?.type
    });

    // TODO: Send notification about required action
  }

  static async refundPayment(data: RefundData): Promise<Stripe.Refund> {
    const { paymentIntentId, amount, reason } = data;

    try {
      // Retrieve payment intent to get order info and validate
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      const orderId = paymentIntent.metadata.orderId;

      if (paymentIntent.status !== 'succeeded') {
        throw new AppError('Can only refund succeeded payments', 400);
      }

      const refundParams: Stripe.RefundCreateParams = {
        payment_intent: paymentIntentId,
        ...(amount && { amount: gelToTetri(amount) }),
        ...(reason && { reason: reason as Stripe.RefundCreateParams.Reason }),
        metadata: {
          orderId: orderId || 'unknown',
          refundReason: reason || 'Customer request'
        }
      };

      const refund = await stripe.refunds.create(refundParams);

      // Update order status to REFUNDED if full refund
      if (orderId && (!amount || gelToTetri(amount) === paymentIntent.amount)) {
        await OrderService.updateOrderStatus(orderId, {
          status: OrderStatus.REFUNDED,
          notes: `Full refund processed: ${refund.id}`
        });
      }

      logger.info('Refund processed successfully', {
        orderId,
        paymentIntentId,
        refundId: refund.id,
        amount: amount ? formatGelAmount(amount) : 'full refund',
        reason
      });

      return refund;
    } catch (error) {
      logger.error('Failed to process refund', {
        paymentIntentId,
        amount,
        error: error instanceof Error ? error.message : 'Unknown error'
      });

      if (error instanceof Stripe.errors.StripeError) {
        throw new AppError(`Refund failed: ${error.message}`, 400);
      }

      throw new AppError('Failed to process refund', 500);
    }
  }

  static async getPaymentStatus(paymentIntentId: string): Promise<{
    status: string;
    amount: number;
    currency: string;
    orderId?: string;
    lastError?: string;
  }> {
    try {
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

      return {
        status: paymentIntent.status,
        amount: tetriToGel(paymentIntent.amount),
        currency: paymentIntent.currency,
        orderId: paymentIntent.metadata.orderId,
        lastError: paymentIntent.last_payment_error?.message
      };
    } catch (error) {
      logger.error('Failed to get payment status', {
        paymentIntentId,
        error: error instanceof Error ? error.message : 'Unknown error'
      });

      throw new AppError('Failed to get payment status', 500);
    }
  }

  static async listCustomerPayments(userId: string): Promise<Stripe.PaymentIntent[]> {
    try {
      // Get all orders for the user
      const userOrders = await OrderService.getUserOrders(userId, {
        limit: 100 // Limit to recent orders
      });

      // Get payment intents for orders that have them
      const paymentIntentIds = userOrders.orders
        .filter(order => order.paymentIntentId)
        .map(order => order.paymentIntentId!);

      if (paymentIntentIds.length === 0) {
        return [];
      }

      // Retrieve payment intents from Stripe
      const paymentIntents = await Promise.all(
        paymentIntentIds.map(id => stripe.paymentIntents.retrieve(id))
      );

      return paymentIntents;
    } catch (error) {
      logger.error('Failed to list customer payments', {
        userId,
        error: error instanceof Error ? error.message : 'Unknown error'
      });

      throw new AppError('Failed to list customer payments', 500);
    }
  }
}