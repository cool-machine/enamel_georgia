import express from 'express';
import { ProductController } from '@/controllers/productController';
import { validate, validateQuery, validateParams, productSchemas } from '@/middleware/validation';
import { authenticate, adminOnly, getUserFromToken } from '@/middleware/auth';
import Joi from 'joi';

const router = express.Router();

// Public routes (no authentication required)

// GET /products - Get all products with filtering and pagination
router.get(
  '/',
  getUserFromToken, // Optional auth to personalize results
  validateQuery(productSchemas.filters),
  ProductController.getProducts
);

// GET /products/types/summary - Get product types with counts
router.get(
  '/types/summary',
  ProductController.getProductTypes
);

// GET /products/featured - Get featured products
router.get(
  '/featured',
  validateQuery(Joi.object({
    limit: Joi.number().integer().min(1).max(50).default(12)
  })),
  ProductController.getFeaturedProducts
);

// GET /products/search - Search products
router.get(
  '/search',
  validateQuery(productSchemas.search),
  ProductController.searchProducts
);

// GET /products/stats - Get product statistics
router.get(
  '/stats',
  ProductController.getProductStats
);

// GET /products/:id - Get single product by ID or slug
router.get(
  '/:id',
  validateParams('id', Joi.string().min(1).max(100).required()),
  ProductController.getProduct
);

// GET /products/:id/availability - Check product availability
router.get(
  '/:id/availability',
  validateParams('id', Joi.string().min(1).max(100).required()),
  validateQuery(productSchemas.availability),
  ProductController.checkAvailability
);

// Admin routes (authentication and authorization required)

// POST /products - Create new product (Admin only)
router.post(
  '/',
  authenticate,
  adminOnly,
  validate(productSchemas.create),
  ProductController.createProduct
);

// PUT /products/:id - Update product (Admin only)
router.put(
  '/:id',
  authenticate,
  adminOnly,
  validateParams('id', Joi.string().min(1).max(100).required()),
  validate(productSchemas.update),
  ProductController.updateProduct
);

// DELETE /products/:id - Delete product (Admin only)
router.delete(
  '/:id',
  authenticate,
  adminOnly,
  validateParams('id', Joi.string().min(1).max(100).required()),
  ProductController.deleteProduct
);

export default router;