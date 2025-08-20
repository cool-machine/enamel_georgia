import Stripe from 'stripe';
import { env } from '@/config/env';
import { AppError } from '@/middleware/errorHandler';

if (!env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY environment variable is required');
}

// Initialize Stripe with secret key
export const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16', // Use supported API version
  typescript: true,
});

// Stripe configuration constants
export const STRIPE_CONFIG = {
  // Currency settings
  CURRENCY: 'gel', // Georgian Lari
  CURRENCY_SYMBOL: '₾',
  
  // Payment method types
  PAYMENT_METHODS: ['card'],
  
  // Minimum charge amount (in tetri - Georgian currency subunit)
  MIN_CHARGE_AMOUNT: 50, // 0.50 GEL minimum
  
  // Maximum charge amount (in tetri)
  MAX_CHARGE_AMOUNT: 100000000, // 1,000,000 GEL maximum
  
  // Automatic confirmation
  CONFIRM_PAYMENT: true,
  
  // Capture method
  CAPTURE_METHOD: 'automatic' as const,
  
  // Return URL for redirect-based payments
  RETURN_URL: env.NODE_ENV === 'production' 
    ? 'https://cool-machine.github.io/enamel_georgia/order-confirmation'
    : 'http://localhost:3000/order-confirmation',
    
  // Webhook endpoint secret
  WEBHOOK_SECRET: env.STRIPE_WEBHOOK_SECRET,
} as const;

// Helper function to convert GEL to tetri (Stripe requires smallest currency unit)
export const gelToTetri = (gel: number): number => {
  return Math.round(gel * 100);
};

// Helper function to convert tetri to GEL
export const tetriToGel = (tetri: number): number => {
  return tetri / 100;
};

// Helper function to format GEL amount for display
export const formatGelAmount = (gel: number): string => {
  return `${STRIPE_CONFIG.CURRENCY_SYMBOL}${gel.toFixed(2)}`;
};

// Helper function to validate payment amount
export const validatePaymentAmount = (amount: number): void => {
  const tetriAmount = gelToTetri(amount);
  
  if (tetriAmount < STRIPE_CONFIG.MIN_CHARGE_AMOUNT) {
    throw new AppError(
      `Payment amount must be at least ${formatGelAmount(tetriToGel(STRIPE_CONFIG.MIN_CHARGE_AMOUNT))}`,
      400
    );
  }
  
  if (tetriAmount > STRIPE_CONFIG.MAX_CHARGE_AMOUNT) {
    throw new AppError(
      `Payment amount cannot exceed ${formatGelAmount(tetriToGel(STRIPE_CONFIG.MAX_CHARGE_AMOUNT))}`,
      400
    );
  }
};

// Test mode detection
export const isStripeTestMode = (): boolean => {
  return env.STRIPE_SECRET_KEY?.startsWith('sk_test_') || false;
};

// Helper to check if webhook secret is configured
export const isWebhookConfigured = (): boolean => {
  return !!STRIPE_CONFIG.WEBHOOK_SECRET;
};