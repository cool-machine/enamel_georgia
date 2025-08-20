import express from 'express';
import { asyncHandler } from '@/middleware/errorHandler';
import { ApiResponse } from '@/types';
import { env } from '@/config/env';

const router = express.Router();

// Health check endpoint
router.get('/health', asyncHandler(async (req, res) => {
  const response: ApiResponse = {
    success: true,
    message: 'Enamel Georgia API is healthy',
    data: {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: env.API_VERSION,
      environment: env.NODE_ENV,
      uptime: process.uptime()
    }
  };

  res.status(200).json(response);
}));

// Detailed status endpoint
router.get('/status', asyncHandler(async (req, res) => {
  const memoryUsage = process.memoryUsage();
  
  const response: ApiResponse = {
    success: true,
    message: 'System status',
    data: {
      status: 'operational',
      timestamp: new Date().toISOString(),
      version: env.API_VERSION,
      environment: env.NODE_ENV,
      uptime: process.uptime(),
      memory: {
        rss: `${Math.round(memoryUsage.rss / 1024 / 1024)}MB`,
        heapTotal: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)}MB`,
        heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)}MB`,
        external: `${Math.round(memoryUsage.external / 1024 / 1024)}MB`
      },
      nodeVersion: process.version,
      platform: process.platform,
      arch: process.arch
    }
  };

  res.status(200).json(response);
}));

export default router;