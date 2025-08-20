import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';

import { env, isDevelopment } from '@/config/env';
import { corsConfig } from '@/config/cors';
import { errorHandler, notFound } from '@/middleware/errorHandler';
import { logger } from '@/utils/logger';

// Route imports
import healthRoutes from '@/routes/health';
import productRoutes from '@/routes/products';

const app = express();

// Trust proxy for rate limiting
app.set('trust proxy', 1);

// Rate limiting
const limiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.RATE_LIMIT_MAX_REQUESTS,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Security middleware
app.use(helmet({
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: isDevelopment ? false : undefined
}));

// CORS
app.use(cors(corsConfig));

// Rate limiting
app.use('/api/', limiter);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Compression
app.use(compression());

// Logging
if (isDevelopment) {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined', {
    stream: {
      write: (message: string) => logger.info(message.trim())
    }
  }));
}

// Custom request logging
app.use((req, res, next) => {
  logger.request(req);
  next();
});

// API routes
app.use('/api', healthRoutes);
app.use('/api/v1/products', productRoutes);

// Welcome route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to Enamel Georgia API',
    data: {
      version: env.API_VERSION,
      environment: env.NODE_ENV,
      endpoints: {
        health: '/api/health',
        products: '/api/v1/products',
        search: '/api/v1/products/search',
        featured: '/api/v1/products/featured',
        stats: '/api/v1/products/stats'
      },
      documentation: '/api/health/status'
    }
  });
});

// 404 handler
app.use('*', notFound);

// Error handler (must be last)
app.use(errorHandler);

export default app;