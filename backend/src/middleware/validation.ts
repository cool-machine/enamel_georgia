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
    type: Joi.string().valid('TRANSPARENT', 'OPAQUE', 'OPALE').optional(),
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

// Authentication validation schemas
export const authSchemas = {
  // User registration
  register: Joi.object({
    email: Joi.string().email().max(255).required(),
    password: Joi.string().min(8).max(128).required()
      .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)'))
      .message('Password must contain at least one lowercase letter, one uppercase letter, and one number'),
    firstName: Joi.string().min(2).max(50).required(),
    lastName: Joi.string().min(2).max(50).required()
  }),

  // User login
  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  }),

  // Refresh token
  refreshToken: Joi.object({
    refreshToken: Joi.string().required()
  }),

  // Update profile
  updateProfile: Joi.object({
    firstName: Joi.string().min(2).max(50).optional(),
    lastName: Joi.string().min(2).max(50).optional()
  }),

  // Change password
  changePassword: Joi.object({
    oldPassword: Joi.string().required(),
    newPassword: Joi.string().min(8).max(128).required()
      .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)'))
      .message('New password must contain at least one lowercase letter, one uppercase letter, and one number')
  }),

  // Password reset request
  passwordResetRequest: Joi.object({
    email: Joi.string().email().required()
  }),

  // Password reset
  passwordReset: Joi.object({
    token: Joi.string().required(),
    newPassword: Joi.string().min(8).max(128).required()
      .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)'))
      .message('Password must contain at least one lowercase letter, one uppercase letter, and one number')
  }),

  // Email verification
  emailVerification: Joi.object({
    token: Joi.string().required()
  }),

  // Delete account
  deleteAccount: Joi.object({
    password: Joi.string().required()
  })
};

// Cart validation schemas
export const cartSchemas = {
  // Add to cart
  addToCart: Joi.object({
    productId: Joi.string().min(1).required(),
    quantity: Joi.number().integer().min(1).max(100).required()
  }),

  // Update cart item
  updateCartItem: Joi.object({
    quantity: Joi.number().integer().min(0).max(100).required()
  }),

  // Transfer guest cart
  transferGuestCart: Joi.object({
    sessionId: Joi.string().min(1).required()
  })
};

// Order validation schemas
export const orderSchemas = {
  // Create order
  createOrder: Joi.object({
    shippingAddressId: Joi.string().min(1).required(),
    billingAddressId: Joi.string().min(1).optional(),
    paymentMethod: Joi.string().valid('stripe', 'bank_transfer', 'cash_on_delivery').required(),
    notes: Joi.string().max(500).optional()
  }),

  // Update order status (admin only)
  updateOrderStatus: Joi.object({
    status: Joi.string().valid('PENDING', 'PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED').required(),
    trackingNumber: Joi.string().max(100).optional(),
    notes: Joi.string().max(500).optional()
  }),

  // Order filters
  orderFilters: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(20),
    status: Joi.string().valid('PENDING', 'PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED').optional(),
    userId: Joi.string().min(1).optional(), // Admin only
    startDate: Joi.date().iso().optional(),
    endDate: Joi.date().iso().optional(),
    minTotal: Joi.number().positive().optional(),
    maxTotal: Joi.number().positive().optional(),
    sortBy: Joi.string().valid('orderNumber', 'total', 'status', 'createdAt').default('createdAt'),
    sortOrder: Joi.string().valid('asc', 'desc').default('desc')
  }).custom((value, helpers) => {
    // Validate date range
    if (value.startDate && value.endDate && value.startDate >= value.endDate) {
      return helpers.error('custom.date-range');
    }
    // Validate total range
    if (value.minTotal && value.maxTotal && value.minTotal >= value.maxTotal) {
      return helpers.error('custom.total-range');
    }
    return value;
  }).messages({
    'custom.date-range': 'startDate must be before endDate',
    'custom.total-range': 'minTotal must be less than maxTotal'
  })
};

// Address validation schemas
export const addressSchemas = {
  // Create/update address
  address: Joi.object({
    type: Joi.string().valid('SHIPPING', 'BILLING', 'BOTH').required(),
    firstName: Joi.string().min(2).max(50).required(),
    lastName: Joi.string().min(2).max(50).required(),
    company: Joi.string().max(100).optional().allow(''),
    address1: Joi.string().min(5).max(200).required(),
    address2: Joi.string().max(200).optional().allow(''),
    city: Joi.string().min(2).max(100).required(),
    state: Joi.string().min(2).max(100).required(),
    postalCode: Joi.string().min(3).max(20).required(),
    country: Joi.string().length(2).uppercase().default('GE'),
    phone: Joi.string().pattern(/^\+?[\d\s\-\(\)]{7,20}$/).optional().allow(''),
    isDefault: Joi.boolean().default(false)
  })
};

// Payment validation schemas
export const paymentSchemas = {
  // Create payment intent
  createPaymentIntent: Joi.object({
    orderId: Joi.string().min(1).required(),
    returnUrl: Joi.string().uri().optional()
  }),

  // Confirm payment
  confirmPayment: Joi.object({
    paymentIntentId: Joi.string().min(1).required(),
    paymentMethodId: Joi.string().min(1).optional()
  }),

  // Refund payment (admin only)
  refundPayment: Joi.object({
    paymentIntentId: Joi.string().min(1).required(),
    amount: Joi.number().positive().precision(2).optional(),
    reason: Joi.string().valid('duplicate', 'fraudulent', 'requested_by_customer').optional()
  })
};

// Admin validation schemas
export const adminSchemas = {
  // User filters
  userFilters: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(20),
    role: Joi.string().valid('CUSTOMER', 'ADMIN').optional(),
    isEmailVerified: Joi.string().valid('true', 'false').optional(),
    search: Joi.string().min(1).max(100).optional(),
    sortBy: Joi.string().valid('createdAt', 'lastLoginAt', 'email', 'firstName').default('createdAt'),
    sortOrder: Joi.string().valid('asc', 'desc').default('desc')
  }),

  // Update user role
  updateUserRole: Joi.object({
    role: Joi.string().valid('CUSTOMER', 'ADMIN').required()
  }),

  // System settings
  systemSettings: Joi.object({
    siteName: Joi.string().min(1).max(100).optional(),
    siteDescription: Joi.string().max(500).optional(),
    currency: Joi.string().length(3).uppercase().optional(),
    taxRate: Joi.number().min(0).max(1).optional(),
    shippingCost: Joi.number().min(0).optional(),
    minOrderAmount: Joi.number().min(0).optional(),
    maintenanceMode: Joi.boolean().optional(),
    allowRegistration: Joi.boolean().optional(),
    emailVerificationRequired: Joi.boolean().optional()
  }),

  // Report filters
  reportFilters: Joi.object({
    startDate: Joi.date().iso().optional(),
    endDate: Joi.date().iso().optional(),
    groupBy: Joi.string().valid('day', 'week', 'month', 'year').default('day')
  }).custom((value, helpers) => {
    if (value.startDate && value.endDate && value.startDate >= value.endDate) {
      return helpers.error('custom.date-range');
    }
    return value;
  }).messages({
    'custom.date-range': 'startDate must be before endDate'
  }),

  // Export filters
  exportFilters: Joi.object({
    format: Joi.string().valid('csv', 'xlsx').required(),
    startDate: Joi.date().iso().optional(),
    endDate: Joi.date().iso().optional()
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