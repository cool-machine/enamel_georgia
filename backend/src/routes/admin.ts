import express from 'express';
import { AdminController } from '@/controllers/adminController';
import { validate, validateQuery, validateParams, adminSchemas, orderSchemas, paymentSchemas } from '@/middleware/validation';
import { authenticate, adminOnly } from '@/middleware/auth';
import Joi from 'joi';

const router = express.Router();

// All admin routes require authentication and admin role
router.use(authenticate);
router.use(adminOnly);

// Dashboard and Analytics
// GET /admin/dashboard - Get admin dashboard overview
router.get(
  '/dashboard',
  AdminController.getDashboard
);

// GET /admin/health - Get system health status
router.get(
  '/health',
  AdminController.getSystemHealth
);

// User Management
// GET /admin/users - Get all users with filtering
router.get(
  '/users',
  validateQuery(adminSchemas.userFilters),
  AdminController.getUsers
);

// PUT /admin/users/:userId/role - Update user role
router.put(
  '/users/:userId/role',
  validateParams('userId', Joi.string().min(1).required()),
  validate(adminSchemas.updateUserRole),
  AdminController.updateUserRole
);

// Order Management
// GET /admin/orders - Get all orders with filtering
router.get(
  '/orders',
  validateQuery(orderSchemas.orderFilters),
  AdminController.getAllOrders
);

// PUT /admin/orders/:orderId/status - Update order status
router.put(
  '/orders/:orderId/status',
  validateParams('orderId', Joi.string().min(1).required()),
  validate(orderSchemas.updateOrderStatus),
  AdminController.updateOrderStatus
);

// GET /admin/orders/stats - Get order statistics
router.get(
  '/orders/stats',
  AdminController.getOrderStats
);

// Payment Management
// GET /admin/payments/stats - Get payment statistics
router.get(
  '/payments/stats',
  AdminController.getPaymentStats
);

// POST /admin/payments/refund - Process refund
router.post(
  '/payments/refund',
  validate(paymentSchemas.refundPayment),
  AdminController.processRefund
);

// System Settings
// GET /admin/settings - Get system settings
router.get(
  '/settings',
  AdminController.getSystemSettings
);

// PUT /admin/settings - Update system settings
router.put(
  '/settings',
  validate(adminSchemas.systemSettings),
  AdminController.updateSystemSettings
);

// Reports and Analytics
// GET /admin/reports/revenue - Get revenue report
router.get(
  '/reports/revenue',
  validateQuery(adminSchemas.reportFilters),
  AdminController.getRevenueReport
);

// GET /admin/reports/customers - Get customer report
router.get(
  '/reports/customers',
  AdminController.getCustomerReport
);

// GET /admin/reports/inventory - Get inventory report
router.get(
  '/reports/inventory',
  AdminController.getInventoryReport
);

// Export functionality
// GET /admin/export/orders - Export orders
router.get(
  '/export/orders',
  validateQuery(adminSchemas.exportFilters),
  AdminController.exportOrders
);

// GET /admin/export/customers - Export customers
router.get(
  '/export/customers',
  validateQuery(adminSchemas.exportFilters),
  AdminController.exportCustomers
);

// GET /admin/export/products - Export products
router.get(
  '/export/products',
  validateQuery(adminSchemas.exportFilters),
  AdminController.exportProducts
);

export default router;