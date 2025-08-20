import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '@/types';

// Validation middleware factory
export const validate = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const errors = error.details.map(detail => detail.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }

    req.body = value;
    next();
  };
};

// Query validation middleware
export const validateQuery = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
    const { error, value } = schema.validate(req.query, {
      abortEarly: false,
      stripUnknown: true,
      convert: true
    });

    if (error) {
      const errors = error.details.map(detail => detail.message);
      return res.status(400).json({
        success: false,
        message: 'Query validation failed',
        errors
      });
    }

    req.query = value;
    next();
  };
};

// Product validation schemas
export const productSchemas = {
  // Create product
  create: Joi.object({
    name: Joi.string().min(2).max(200).required(),
    description: Joi.string().min(10).max(1000).required(),
    price: Joi.number().positive().precision(2).required(),
    colorCode: Joi.string().allow('').optional(),
    category: Joi.string().min(2).max(100).required(),
    type: Joi.string().valid('TRANSPARENT', 'OPAQUE', 'OPALE').required(),
    image: Joi.string().min(1).max(500).required(),
    inStock: Joi.boolean().default(true),
    quantity: Joi.number().integer().min(0).default(0),
    enamelNumber: Joi.string().min(2).max(50).required(),
    specifications: Joi.object({
      firingTemp: Joi.string().required(),
      mesh: Joi.string().required(),
      weight: Joi.array().items(Joi.string()).required()
    }).required(),
    slug: Joi.string().min(2).max(200).optional(),
    metaTitle: Joi.string().max(200).optional(),
    metaDescription: Joi.string().max(500).optional(),
    isActive: Joi.boolean().default(true),
    sortOrder: Joi.number().integer().default(0)
  }),

  // Update product
  update: Joi.object({
    name: Joi.string().min(2).max(200).optional(),
    description: Joi.string().min(10).max(1000).optional(),
    price: Joi.number().positive().precision(2).optional(),
    colorCode: Joi.string().allow('').optional(),
    category: Joi.string().min(2).max(100).optional(),
    type: Joi.string().valid('TRANSPARENT', 'OPAQUE', 'OPALE').optional(),
    image: Joi.string().min(1).max(500).optional(),
    inStock: Joi.boolean().optional(),
    quantity: Joi.number().integer().min(0).optional(),
    enamelNumber: Joi.string().min(2).max(50).optional(),
    specifications: Joi.object({
      firingTemp: Joi.string().required(),
      mesh: Joi.string().required(),
      weight: Joi.array().items(Joi.string()).required()
    }).optional(),
    slug: Joi.string().min(2).max(200).optional(),
    metaTitle: Joi.string().max(200).optional(),
    metaDescription: Joi.string().max(500).optional(),
    isActive: Joi.boolean().optional(),
    sortOrder: Joi.number().integer().optional()
  }),

  // Product filters query
  filters: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(20),
    search: Joi.string().min(1).max(100).optional(),
    type: Joi.string().valid('transparent', 'opaque', 'opale').optional(),
    category: Joi.string().min(1).max(100).optional(),
    minPrice: Joi.number().positive().optional(),
    maxPrice: Joi.number().positive().optional(),
    inStock: Joi.boolean().optional(),
    sortBy: Joi.string().valid('name', 'price', 'created', 'enamelNumber', 'type').default('name'),
    sortOrder: Joi.string().valid('asc', 'desc').default('asc')
  }).custom((value, helpers) => {
    // Validate price range
    if (value.minPrice && value.maxPrice && value.minPrice >= value.maxPrice) {
      return helpers.error('custom.price-range');
    }
    return value;
  }).messages({
    'custom.price-range': 'minPrice must be less than maxPrice'
  }),

  // Search query
  search: Joi.object({
    q: Joi.string().min(2).max(100).required(),
    limit: Joi.number().integer().min(1).max(50).default(10)
  }),

  // Availability check
  availability: Joi.object({
    quantity: Joi.number().integer().min(1).default(1)
  })
};

// Common validation schemas
export const commonSchemas = {
  // MongoDB ObjectId
  mongoId: Joi.string().length(24).hex(),
  
  // UUID
  uuid: Joi.string().guid({ version: 'uuidv4' }),
  
  // Pagination
  pagination: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(20)
  })
};

// Parameter validation middleware
export const validateParams = (paramName: string, schema: Joi.Schema) => {
  return (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
    const { error, value } = schema.validate(req.params[paramName]);

    if (error) {
      return res.status(400).json({
        success: false,
        message: `Invalid ${paramName}`,
        errors: [error.message]
      });
    }

    req.params[paramName] = value;
    next();
  };
};