import { Prisma, EnamelType } from '@prisma/client';
import { prisma } from '@/models';
import { ProductFilters, ApiResponse } from '@/types';
import { AppError } from '@/middleware/errorHandler';

export class ProductService {
  // Get all products with filtering, search, and pagination
  static async getProducts(filters: ProductFilters) {
    const {
      page = 1,
      limit = 20,
      search,
      type,
      category,
      minPrice,
      maxPrice,
      inStock,
      sortBy = 'name',
      sortOrder = 'asc'
    } = filters;

    // Calculate pagination
    const skip = (page - 1) * limit;
    const take = Math.min(limit, 100); // Max 100 items per page

    // Build where clause
    const where: Prisma.ProductWhereInput = {
      isActive: true,
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
          { enamelNumber: { contains: search, mode: 'insensitive' } },
          { category: { contains: search, mode: 'insensitive' } }
        ]
      }),
      ...(type && { type: type as EnamelType }),
      ...(category && { category: { equals: category, mode: 'insensitive' } }),
      ...(minPrice !== undefined || maxPrice !== undefined) && {
        price: {
          ...(minPrice !== undefined && { gte: minPrice }),
          ...(maxPrice !== undefined && { lte: maxPrice })
        }
      },
      ...(inStock !== undefined && { inStock })
    };

    // Build order by clause
    const orderBy: Prisma.ProductOrderByWithRelationInput = {};
    switch (sortBy) {
      case 'price':
        orderBy.price = sortOrder;
        break;
      case 'name':
        orderBy.name = sortOrder;
        break;
      case 'created':
        orderBy.createdAt = sortOrder;
        break;
      case 'enamelNumber':
        orderBy.enamelNumber = sortOrder;
        break;
      case 'type':
        orderBy.type = sortOrder;
        break;
      default:
        orderBy.name = 'asc';
    }

    // Execute queries in parallel
    const [products, totalCount] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy,
        skip,
        take,
        select: {
          id: true,
          name: true,
          description: true,
          price: true,
          colorCode: true,
          category: true,
          type: true,
          image: true,
          inStock: true,
          quantity: true,
          enamelNumber: true,
          specifications: true,
          slug: true,
          createdAt: true,
          updatedAt: true
        }
      }),
      prisma.product.count({ where })
    ]);

    const totalPages = Math.ceil(totalCount / take);

    return {
      products,
      pagination: {
        page,
        limit: take,
        total: totalCount,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    };
  }

  // Get single product by ID or slug
  static async getProductById(identifier: string) {
    const product = await prisma.product.findFirst({
      where: {
        OR: [
          { id: identifier },
          { slug: identifier }
        ],
        isActive: true
      }
    });

    if (!product) {
      throw new AppError('Product not found', 404);
    }

    return product;
  }

  // Get products by type with counts
  static async getProductsByType() {
    const results = await prisma.product.groupBy({
      by: ['type'],
      where: { isActive: true },
      _count: {
        id: true
      },
      orderBy: {
        type: 'asc'
      }
    });

    const typeMapping = {
      TRANSPARENT: 'transparent',
      OPAQUE: 'opaque', 
      OPALE: 'opale'
    };

    return results.map(result => ({
      type: typeMapping[result.type as keyof typeof typeMapping],
      count: result._count.id
    }));
  }

  // Get featured products (high stock, good ratings, etc.)
  static async getFeaturedProducts(limit: number = 12) {
    const products = await prisma.product.findMany({
      where: {
        isActive: true,
        inStock: true,
        quantity: { gt: 5 }
      },
      orderBy: [
        { quantity: 'desc' },
        { createdAt: 'desc' }
      ],
      take: limit,
      select: {
        id: true,
        name: true,
        price: true,
        type: true,
        image: true,
        enamelNumber: true,
        slug: true
      }
    });

    return products;
  }

  // Search products with suggestions
  static async searchProducts(query: string, limit: number = 10) {
    if (!query || query.length < 2) {
      throw new AppError('Search query must be at least 2 characters', 400);
    }

    const products = await prisma.product.findMany({
      where: {
        isActive: true,
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { enamelNumber: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } }
        ]
      },
      orderBy: [
        // Prioritize exact enamel number matches
        {
          enamelNumber: query.toUpperCase().includes('T-') || query.toUpperCase().includes('O-') || query.toUpperCase().includes('OP-') ? 'asc' : 'desc'
        },
        { name: 'asc' }
      ],
      take: limit,
      select: {
        id: true,
        name: true,
        enamelNumber: true,
        type: true,
        image: true,
        price: true,
        slug: true
      }
    });

    return products;
  }

  // Get product statistics
  static async getProductStats() {
    const stats = await prisma.product.aggregate({
      where: { isActive: true },
      _count: { id: true },
      _avg: { price: true },
      _min: { price: true },
      _max: { price: true }
    });

    const typeStats = await prisma.product.groupBy({
      by: ['type'],
      where: { isActive: true },
      _count: { id: true },
      _avg: { price: true }
    });

    return {
      total: stats._count.id,
      averagePrice: stats._avg.price,
      priceRange: {
        min: stats._min.price,
        max: stats._max.price
      },
      byType: typeStats.map(stat => ({
        type: stat.type.toLowerCase(),
        count: stat._count.id,
        averagePrice: stat._avg.price
      }))
    };
  }

  // Create new product (Admin only)
  static async createProduct(data: Prisma.ProductCreateInput) {
    // Check if enamel number already exists
    const existing = await prisma.product.findUnique({
      where: { enamelNumber: data.enamelNumber }
    });

    if (existing) {
      throw new AppError('Product with this enamel number already exists', 409);
    }

    // Generate slug if not provided
    if (!data.slug) {
      data.slug = this.generateSlug(data.name);
    }

    const product = await prisma.product.create({
      data
    });

    return product;
  }

  // Update product (Admin only)
  static async updateProduct(id: string, data: Prisma.ProductUpdateInput) {
    const product = await prisma.product.findUnique({
      where: { id }
    });

    if (!product) {
      throw new AppError('Product not found', 404);
    }

    // If name is being updated, regenerate slug
    if (data.name && typeof data.name === 'string') {
      data.slug = this.generateSlug(data.name);
    }

    const updated = await prisma.product.update({
      where: { id },
      data
    });

    return updated;
  }

  // Delete product (Admin only - soft delete)
  static async deleteProduct(id: string) {
    const product = await prisma.product.findUnique({
      where: { id }
    });

    if (!product) {
      throw new AppError('Product not found', 404);
    }

    // Soft delete by setting isActive to false
    await prisma.product.update({
      where: { id },
      data: { isActive: false }
    });

    return { message: 'Product deleted successfully' };
  }

  // Helper method to generate slug
  private static generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }

  // Check product availability
  static async checkAvailability(id: string, quantity: number = 1) {
    const product = await prisma.product.findUnique({
      where: { id },
      select: { inStock: true, quantity: true, isActive: true }
    });

    if (!product || !product.isActive) {
      throw new AppError('Product not found', 404);
    }

    return {
      available: product.inStock && product.quantity >= quantity,
      inStock: product.inStock,
      quantity: product.quantity,
      requestedQuantity: quantity
    };
  }
}