# Enamel Georgia API Endpoints

Complete REST API for the Enamel Georgia e-commerce platform.

## 🔗 Base URL

- **Development**: `http://localhost:3001`
- **API Version**: `v1`

## 📋 Health & System

### Health Check
```
GET /api/health
```
Basic health check endpoint.

**Response:**
```json
{
  "success": true,
  "message": "Enamel Georgia API is healthy",
  "data": {
    "status": "healthy",
    "timestamp": "2025-08-20T...",
    "version": "v1",
    "environment": "development",
    "uptime": 137.20
  }
}
```

### System Status
```
GET /api/status
```
Detailed system information including memory usage and performance metrics.

## 🎨 Products API

### Get All Products
```
GET /api/v1/products
```

**Query Parameters:**
- `page` (number, default: 1) - Page number
- `limit` (number, default: 20, max: 100) - Items per page
- `search` (string) - Search in name, description, enamel number
- `type` (string) - Filter by enamel type: `transparent`, `opaque`, `opale`
- `category` (string) - Filter by category
- `minPrice` (number) - Minimum price filter
- `maxPrice` (number) - Maximum price filter
- `inStock` (boolean) - Filter by stock availability
- `sortBy` (string) - Sort by: `name`, `price`, `created`, `enamelNumber`, `type`
- `sortOrder` (string) - Sort order: `asc`, `desc`

**Example:**
```
GET /api/v1/products?type=transparent&sortBy=price&sortOrder=asc&page=1&limit=20
```

**Response:**
```json
{
  "success": true,
  "message": "Products retrieved successfully",
  "data": [
    {
      "id": "uuid",
      "name": "Transparent T-272_hq",
      "description": "Premium transparent enamel...",
      "price": 63.00,
      "type": "TRANSPARENT",
      "image": "transparent_colors/272_hq.jpg",
      "enamelNumber": "T-272_hq",
      "specifications": {
        "firingTemp": "780-820°C",
        "mesh": "80 mesh",
        "weight": ["25g", "100g", "250g"]
      },
      "inStock": true,
      "quantity": 15
    }
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 217,
    "totalPages": 11
  }
}
```

### Get Single Product
```
GET /api/v1/products/:id
```

Get product by ID or slug.

**Response:**
```json
{
  "success": true,
  "message": "Product retrieved successfully",
  "data": {
    "id": "uuid",
    "name": "Opaque O-RUBIS31_hq",
    "description": "Premium opaque enamel...",
    "price": 42.00,
    "type": "OPAQUE",
    "image": "opaques/RUBIS31_hq.jpg",
    "enamelNumber": "O-RUBIS31_hq",
    "slug": "opaque-o-rubis31-hq"
  }
}
```

### Search Products
```
GET /api/v1/products/search
```

**Query Parameters:**
- `q` (string, required, min: 2 chars) - Search query
- `limit` (number, default: 10, max: 50) - Max results

**Example:**
```
GET /api/v1/products/search?q=blue&limit=5
```

**Response:**
```json
{
  "success": true,
  "message": "Search completed successfully",
  "data": [
    {
      "id": "uuid",
      "name": "Opaque Blue 62F",
      "enamelNumber": "O-62_hq",
      "type": "OPAQUE",
      "image": "opaques/62_hq.jpg",
      "price": 44.00,
      "slug": "opaque-blue-62f"
    }
  ]
}
```

### Get Featured Products
```
GET /api/v1/products/featured
```

**Query Parameters:**
- `limit` (number, default: 12, max: 50) - Number of featured products

**Response:**
```json
{
  "success": true,
  "message": "Featured products retrieved successfully",
  "data": [
    {
      "id": "uuid",
      "name": "Transparent T-383",
      "price": 49.00,
      "type": "TRANSPARENT",
      "image": "transparent_colors/383.jpg",
      "enamelNumber": "T-383"
    }
  ]
}
```

### Get Product Types Summary
```
GET /api/v1/products/types/summary
```

Get count of products by enamel type.

**Response:**
```json
{
  "success": true,
  "message": "Product types retrieved successfully",
  "data": [
    {
      "type": "transparent",
      "count": 26
    },
    {
      "type": "opaque", 
      "count": 182
    },
    {
      "type": "opale",
      "count": 9
    }
  ]
}
```

### Get Product Statistics
```
GET /api/v1/products/stats
```

**Response:**
```json
{
  "success": true,
  "message": "Product statistics retrieved successfully",
  "data": {
    "total": 217,
    "averagePrice": 47.23,
    "priceRange": {
      "min": 41.00,
      "max": 65.00
    },
    "byType": [
      {
        "type": "transparent",
        "count": 26,
        "averagePrice": 53.50
      },
      {
        "type": "opaque",
        "count": 182,
        "averagePrice": 43.75
      },
      {
        "type": "opale",
        "count": 9,
        "averagePrice": 56.80
      }
    ]
  }
}
```

### Check Product Availability
```
GET /api/v1/products/:id/availability
```

**Query Parameters:**
- `quantity` (number, default: 1) - Requested quantity

**Response:**
```json
{
  "success": true,
  "message": "Availability checked successfully",
  "data": {
    "available": true,
    "inStock": true,
    "quantity": 15,
    "requestedQuantity": 2
  }
}
```

## 🔒 Admin Endpoints

### Create Product
```
POST /api/v1/products
```

**Body:**
```json
{
  "name": "New Transparent Enamel",
  "description": "A beautiful new transparent enamel color",
  "price": 45.50,
  "colorCode": "",
  "category": "transparent",
  "type": "TRANSPARENT",
  "image": "transparent_colors/new_color.jpg",
  "enamelNumber": "T-NEW-001",
  "specifications": {
    "firingTemp": "780-820°C",
    "mesh": "80 mesh",
    "weight": ["25g", "100g"]
  }
}
```

### Update Product
```
PUT /api/v1/products/:id
```

**Body:** (partial update)
```json
{
  "price": 50.00,
  "quantity": 20,
  "inStock": true
}
```

### Delete Product
```
DELETE /api/v1/products/:id
```

Soft delete (sets `isActive: false`).

## ❌ Error Responses

### Validation Error
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    "\"price\" must be a positive number",
    "\"name\" is required"
  ]
}
```

### Not Found Error
```json
{
  "success": false,
  "message": "Product not found"
}
```

### Server Error
```json
{
  "success": false,
  "message": "Internal Server Error"
}
```

## 📊 Response Format

All responses follow this structure:

```typescript
interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: string[];
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}
```

## 🧪 Testing

Test all endpoints:
```bash
npm run test:api
```

Test database connection:
```bash
npm run db:test
```

## 🔧 Development

Start development server:
```bash
npm run dev
```

Server runs on: `http://localhost:3001`

---

**Status**: Phase 1.3 API Endpoints Complete
**Database**: Required for full functionality
**Next**: Phase 2 Authentication System