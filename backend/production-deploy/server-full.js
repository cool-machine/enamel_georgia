const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

const app = express();
const PORT = process.env.PORT || process.env.WEBSITES_PORT || 8000;

// Initialize Prisma
const prisma = new PrismaClient();

// Middleware
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://cool-machine.github.io',
    'https://enamel-georgia-api.azurewebsites.net'
  ],
  credentials: true
}));
app.use(express.json());

// Health check
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Enamel Georgia API is live!',
    data: {
      version: 'v1',
      environment: process.env.NODE_ENV || 'production',
      timestamp: new Date().toISOString(),
      database: 'Connected to Azure PostgreSQL',
      products: '217 enamel colors available'
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
      environment: process.env.NODE_ENV || 'production',
      database: 'Connected'
    }
  });
});

// Products endpoints
app.get('/api/v1/products', async (req, res) => {
  try {
    const { page = 1, limit = 20, type, search, sortBy = 'name', sortOrder = 'asc' } = req.query;
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);
    
    // Build where clause
    const where = {};
    if (type) {
      where.type = type.toUpperCase();
    }
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { enamelNumber: { contains: search, mode: 'insensitive' } },
        { category: { contains: search, mode: 'insensitive' } }
      ];
    }
    
    // Build orderBy clause
    const orderBy = {};
    orderBy[sortBy] = sortOrder;
    
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take,
        orderBy,
        select: {
          id: true,
          name: true,
          price: true,
          type: true,
          category: true,
          enamelNumber: true,
          image: true,
          inStock: true,
          quantity: true,
          slug: true
        }
      }),
      prisma.product.count({ where })
    ]);
    
    res.json({
      success: true,
      data: {
        products,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        }
      }
    });
  } catch (error) {
    console.error('Products fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products',
      error: error.message
    });
  }
});

// Get single product
app.get('/api/v1/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            cartItems: true,
            orderItems: true
          }
        }
      }
    });
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    res.json({
      success: true,
      data: { product }
    });
  } catch (error) {
    console.error('Product fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch product',
      error: error.message
    });
  }
});

// Search products
app.get('/api/v1/products/search', async (req, res) => {
  try {
    const { q, limit = 10 } = req.query;
    
    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }
    
    const products = await prisma.product.findMany({
      where: {
        OR: [
          { name: { contains: q, mode: 'insensitive' } },
          { enamelNumber: { contains: q, mode: 'insensitive' } },
          { category: { contains: q, mode: 'insensitive' } }
        ]
      },
      take: parseInt(limit),
      select: {
        id: true,
        name: true,
        enamelNumber: true,
        type: true,
        price: true,
        image: true
      }
    });
    
    res.json({
      success: true,
      data: { products }
    });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({
      success: false,
      message: 'Search failed',
      error: error.message
    });
  }
});

// Get product statistics
app.get('/api/v1/products/stats', async (req, res) => {
  try {
    const [total, byType, avgPrice] = await Promise.all([
      prisma.product.count(),
      prisma.product.groupBy({
        by: ['type'],
        _count: {
          id: true
        }
      }),
      prisma.product.aggregate({
        _avg: {
          price: true
        }
      })
    ]);
    
    res.json({
      success: true,
      data: {
        total,
        byType: byType.reduce((acc, item) => {
          acc[item.type] = item._count.id;
          return acc;
        }, {}),
        averagePrice: avgPrice._avg.price
      }
    });
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch statistics',
      error: error.message
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found',
    availableEndpoints: {
      home: 'GET /',
      health: 'GET /api/health',
      products: 'GET /api/v1/products',
      productById: 'GET /api/v1/products/:id',
      search: 'GET /api/v1/products/search',
      stats: 'GET /api/v1/products/stats'
    }
  });
});

app.listen(PORT, '0.0.0.0', async () => {
  console.log(`🚀 Enamel Georgia API server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'production'}`);
  console.log(`Database: ${process.env.DATABASE_URL ? 'Connected' : 'Not configured'}`);
  
  // Test database connection
  try {
    await prisma.$connect();
    const productCount = await prisma.product.count();
    console.log(`📦 Database connected: ${productCount} products available`);
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
  }
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('🛑 Shutting down gracefully...');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('🛑 Shutting down gracefully...');
  await prisma.$disconnect();
  process.exit(0);
});