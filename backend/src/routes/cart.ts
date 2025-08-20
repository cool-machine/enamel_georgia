import express from 'express';
import { CartController } from '@/controllers/cartController';
import { validate, validateParams, cartSchemas } from '@/middleware/validation';
import { optionalAuth, authenticate } from '@/middleware/auth';
import Joi from 'joi';

const router = express.Router();

// All cart routes use optional authentication (works for both guests and users)
// Session ID should be provided in header for guest carts: x-session-id

// GET /cart - Get current cart
router.get(
  '/',
  optionalAuth, // Optional auth allows both guests and authenticated users
  CartController.getCart
);

// GET /cart/summary - Get cart summary (item count, totals)
router.get(
  '/summary',
  optionalAuth,
  CartController.getCartSummary
);

// POST /cart/items - Add item to cart
router.post(
  '/items',
  optionalAuth,
  validate(cartSchemas.addToCart),
  CartController.addToCart
);

// PUT /cart/items/:itemId - Update cart item quantity
router.put(
  '/items/:itemId',
  optionalAuth,
  validateParams('itemId', Joi.string().min(1).required()),
  validate(cartSchemas.updateCartItem),
  CartController.updateCartItem
);

// DELETE /cart/items/:itemId - Remove item from cart
router.delete(
  '/items/:itemId',
  optionalAuth,
  validateParams('itemId', Joi.string().min(1).required()),
  CartController.removeFromCart
);

// DELETE /cart - Clear entire cart
router.delete(
  '/',
  optionalAuth,
  CartController.clearCart
);

// POST /cart/transfer - Transfer guest cart to authenticated user
router.post(
  '/transfer',
  authenticate, // Requires authentication
  validate(cartSchemas.transferGuestCart),
  CartController.transferGuestCart
);

// GET /cart/validate - Validate cart for checkout
router.get(
  '/validate',
  optionalAuth,
  CartController.validateCart
);

export default router;