import app from './app';
import { env } from '@/config/env';
import { logger } from '@/utils/logger';

const startServer = async () => {
  try {
    // Start the server
    const server = app.listen(env.PORT, () => {
      logger.info(`🚀 Enamel Georgia API Server started successfully`);
      logger.info(`📍 Environment: ${env.NODE_ENV}`);
      logger.info(`🌐 Server running on port ${env.PORT}`);
      logger.info(`📋 API Version: ${env.API_VERSION}`);
      logger.info(`🔗 Health check: http://localhost:${env.PORT}/api/health`);
      
      if (env.NODE_ENV === 'development') {
        logger.info(`🔧 Frontend CORS allowed from: ${env.CORS_ORIGIN.join(', ')}`);
      }
    });

    // Graceful shutdown handling
    const gracefulShutdown = (signal: string) => {
      logger.info(`Received ${signal}. Starting graceful shutdown...`);
      
      server.close((err) => {
        if (err) {
          logger.error('Error during server shutdown:', err);
          process.exit(1);
        }
        
        logger.info('Server closed successfully');
        process.exit(0);
      });
    };

    // Handle shutdown signals
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

    // Handle uncaught exceptions
    process.on('uncaughtException', (err) => {
      logger.error('Uncaught Exception:', err);
      process.exit(1);
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (reason, promise) => {
      logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
      process.exit(1);
    });

  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Start the server
startServer();