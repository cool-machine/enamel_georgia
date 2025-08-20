# Enamel Georgia Backend API

Modern Node.js + Express + TypeScript backend for the Enamel Georgia e-commerce platform.

## 🚀 Features

- **Modern TypeScript**: Full type safety and modern JavaScript features
- **Express.js**: Fast, minimalist web framework
- **Security**: Helmet, CORS, rate limiting, input validation
- **Database**: PostgreSQL with Prisma ORM (coming in Phase 1.2)
- **Authentication**: JWT-based auth system (coming in Phase 2)
- **Payments**: Stripe integration (coming in Phase 4)
- **Monitoring**: Health checks, logging, error handling
- **Development**: Hot reload, linting, testing setup

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm 9+
- PostgreSQL (for Phase 1.2)

### Setup
```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env with your configuration
nano .env

# Start development server
npm run dev
```

## 🛠️ Development

### Available Scripts
```bash
npm run dev          # Start development server with hot reload
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Run ESLint
npm test             # Run tests
npm run db:migrate   # Run database migrations (Phase 1.2)
npm run db:generate  # Generate Prisma client (Phase 1.2)
npm run db:seed      # Seed database (Phase 1.2)
```

### Development Server
```bash
npm run dev
```
Server will start on http://localhost:3001

## 🔗 API Endpoints

### Current (Phase 1.1)
- `GET /` - Welcome message
- `GET /api/health` - Health check
- `GET /api/health/status` - Detailed system status

### Coming Soon
- `GET /api/v1/products` - List products (Phase 1.3)
- `POST /api/v1/auth/login` - User login (Phase 2)
- `POST /api/v1/orders` - Create order (Phase 3)

## 🏗️ Architecture

```
backend/
├── src/
│   ├── config/          # Configuration files
│   ├── controllers/     # Route controllers (Phase 1.3)
│   ├── middleware/      # Express middleware
│   ├── models/          # Database models (Phase 1.2)
│   ├── routes/          # API routes
│   ├── services/        # Business logic (Phase 1.3)
│   ├── types/           # TypeScript type definitions
│   ├── utils/           # Utility functions
│   ├── app.ts           # Express app configuration
│   └── index.ts         # Server entry point
├── prisma/              # Database schema (Phase 1.2)
├── dist/                # Compiled JavaScript
└── package.json
```

## 🔧 Configuration

### Environment Variables
Copy `.env.example` to `.env` and configure:

```env
# Server
NODE_ENV=development
PORT=3001

# Database (Phase 1.2)
DATABASE_URL="postgresql://user:pass@localhost:5432/enamel_georgia"

# JWT (Phase 2)
JWT_SECRET=your-secret-key

# CORS
CORS_ORIGIN=http://localhost:3000,https://cool-machine.github.io
```

## 🔒 Security Features

- **Helmet**: Security headers
- **CORS**: Configurable cross-origin requests
- **Rate Limiting**: Request throttling
- **Input Validation**: Joi schema validation
- **Error Handling**: Structured error responses
- **Logging**: Request/response logging

## 🧪 Testing

### Health Check
```bash
curl http://localhost:3001/api/health
```

Expected response:
```json
{
  "success": true,
  "message": "Enamel Georgia API is healthy",
  "data": {
    "status": "healthy",
    "timestamp": "2025-08-20T...",
    "version": "v1",
    "environment": "development",
    "uptime": 123.45
  }
}
```

## 📋 Development Roadmap

### ✅ Phase 1.1 - Backend Foundation (COMPLETED)
- Express + TypeScript setup
- Security middleware
- Health endpoints
- Error handling
- Logging system

### 🔄 Phase 1.2 - Database Setup (NEXT)
- PostgreSQL schema design
- Prisma ORM setup
- Database migrations
- Product models

### 📅 Phase 1.3 - API Endpoints
- Product CRUD operations
- Data validation
- Filtering and pagination

### 📅 Phase 2 - Authentication
- User registration/login
- JWT tokens
- Role-based access

### 📅 Phase 3 - Shopping & Orders
- Cart management
- Order processing
- Inventory tracking

### 📅 Phase 4 - Payments
- Stripe integration
- Checkout flow
- Payment webhooks

## 🤝 Frontend Integration

This backend is designed to work with the existing React frontend at:
- **Development**: http://localhost:3000
- **Production**: https://cool-machine.github.io/enamel_georgia/

CORS is configured to allow requests from both environments.

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Kill process on port 3001
lsof -ti:3001 | xargs kill -9
```

### Module Resolution Issues
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### TypeScript Errors
```bash
# Rebuild TypeScript
npm run build
```

## 📄 License

MIT License - see LICENSE file for details.

---

**Phase 1.1 Status**: ✅ Complete - Backend foundation established
**Next**: Phase 1.2 - Database schema and Prisma setup