const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || process.env.WEBSITES_PORT || 8000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Enamel Georgia API is live!',
    data: {
      version: 'v1',
      environment: process.env.NODE_ENV || 'production',
      timestamp: new Date().toISOString()
    }
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Enamel Georgia API is healthy',
    data: {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: 'v1',
      environment: process.env.NODE_ENV || 'production'
    }
  });
});

// Basic product endpoint
app.get('/api/v1/products', (req, res) => {
  res.json({
    success: true,
    message: 'Products endpoint ready',
    data: {
      products: [],
      total: 0,
      message: 'Database connection pending'
    }
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Enamel Georgia API server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'production'}`);
  console.log(`Available endpoints:`);
  console.log(`  - GET / (Homepage)`);
  console.log(`  - GET /api/health (Health check)`);
  console.log(`  - GET /api/v1/products (Products)`);
});

// Handle uncaught errors
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});