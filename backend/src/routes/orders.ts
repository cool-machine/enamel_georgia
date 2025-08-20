import express from 'express';
import { OrderController } from '@/controllers/orderController';
import { validate, validateQuery, validateParams, orderSchemas } from '@/middleware/validation';
import { authenticate, adminOnly } from '@/middleware/auth';
import Joi from 'joi';

const router = express.Router();

// All order routes require authentication

// GET /orders/my - Get current user's orders
router.get(
  '/my',
  authenticate,
  validateQuery(orderSchemas.orderFilters.fork(['userId'], (schema) => schema.forbidden())), // Remove userId from user queries
  OrderController.getUserOrders
);

// GET /orders/my/stats - Get current user's order statistics
router.get(
  '/my/stats',
  authenticate,
  OrderController.getOrderStats
);

// POST /orders - Create new order
router.post(
  '/',
  authenticate,
  validate(orderSchemas.createOrder),
  OrderController.createOrder
);

// GET /orders/:id - Get order by ID
router.get(
  '/:id',
  authenticate,
  validateParams('id', Joi.string().min(1).required()),
  OrderController.getOrder
);

// GET /orders/number/:orderNumber - Get order by order number
router.get(
  '/number/:orderNumber',
  authenticate,
  validateParams('orderNumber', Joi.string().min(1).required()),
  OrderController.getOrderByNumber
);

// POST /orders/:id/cancel - Cancel order
router.post(
  '/:id/cancel',
  authenticate,
  validateParams('id', Joi.string().min(1).required()),
  OrderController.cancelOrder
);

// Admin-only routes

// GET /orders - Get all orders (admin only)
router.get(
  '/',
  authenticate,
  adminOnly,
  validateQuery(orderSchemas.orderFilters),
  OrderController.getOrders
);

// PUT /orders/:id/status - Update order status (admin only)
router.put(
  '/:id/status',
  authenticate,
  adminOnly,
  validateParams('id', Joi.string().min(1).required()),
  validate(orderSchemas.updateOrderStatus),
  OrderController.updateOrderStatus
);

// GET /orders/stats/admin - Get admin order statistics (admin only)
router.get(
  '/stats/admin',
  authenticate,
  adminOnly,
  OrderController.getOrderStats
);

export default router;