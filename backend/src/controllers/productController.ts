import { Request, Response } from 'express';
import { ProductService } from '@/services/productService';
import { asyncHandler } from '@/middleware/errorHandler';
import { ApiResponse, ProductFilters } from '@/types';
import { logger } from '@/utils/logger';

export class ProductController {
  // GET /api/v1/products - Get all products with filtering
  static getProducts = asyncHandler(async (req: Request, res: Response<ApiResponse>) => {
    const filters = req.query as unknown as ProductFilters;
    
    logger.info('Fetching products with filters', { filters });

    const result = await ProductService.getProducts(filters);

    res.status(200).json({
      success: true,
      message: 'Products retrieved successfully',
      data: result.products,
      meta: {
        page: result.pagination.page,
        limit: result.pagination.limit,
        total: result.pagination.total,
        totalPages: result.pagination.totalPages
      }
    });
  });

  // GET /api/v1/products/:id - Get single product
  static getProduct = asyncHandler(async (req: Request, res: Response<ApiResponse>) => {
    const { id } = req.params;
    
    logger.info('Fetching product', { productId: id });

    const product = await ProductService.getProductById(id);

    res.status(200).json({
      success: true,
      message: 'Product retrieved successfully',
      data: product
    });
  });

  // GET /api/v1/products/types/summary - Get products grouped by type
  static getProductTypes = asyncHandler(async (req: Request, res: Response<ApiResponse>) => {
    logger.info('Fetching product types summary');

    const types = await ProductService.getProductsByType();

    res.status(200).json({
      success: true,
      message: 'Product types retrieved successfully',
      data: types
    });
  });

  // GET /api/v1/products/featured - Get featured products
  static getFeaturedProducts = asyncHandler(async (req: Request, res: Response<ApiResponse>) => {
    const limit = parseInt(req.query.limit as string) || 12;
    
    logger.info('Fetching featured products', { limit });

    const products = await ProductService.getFeaturedProducts(limit);

    res.status(200).json({
      success: true,
      message: 'Featured products retrieved successfully',
      data: products
    });
  });

  // GET /api/v1/products/search - Search products
  static searchProducts = asyncHandler(async (req: Request, res: Response<ApiResponse>) => {
    const { q: query, limit = 10 } = req.query as { q: string; limit?: number };
    
    logger.info('Searching products', { query, limit });

    const products = await ProductService.searchProducts(query, Number(limit));

    res.status(200).json({
      success: true,
      message: 'Search completed successfully',
      data: products
    });
  });

  // GET /api/v1/products/stats - Get product statistics
  static getProductStats = asyncHandler(async (req: Request, res: Response<ApiResponse>) => {
    logger.info('Fetching product statistics');

    const stats = await ProductService.getProductStats();

    res.status(200).json({
      success: true,
      message: 'Product statistics retrieved successfully',
      data: stats
    });
  });

  // GET /api/v1/products/:id/availability - Check product availability
  static checkAvailability = asyncHandler(async (req: Request, res: Response<ApiResponse>) => {
    const { id } = req.params;
    const { quantity = 1 } = req.query as { quantity?: number };
    
    logger.info('Checking product availability', { productId: id, quantity });

    const availability = await ProductService.checkAvailability(id, Number(quantity));

    res.status(200).json({
      success: true,
      message: 'Availability checked successfully',
      data: availability
    });
  });

  // POST /api/v1/products - Create new product (Admin only)
  static createProduct = asyncHandler(async (req: Request, res: Response<ApiResponse>) => {
    logger.info('Creating new product', { productData: req.body });

    const product = await ProductService.createProduct(req.body);

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product
    });
  });

  // PUT /api/v1/products/:id - Update product (Admin only)
  static updateProduct = asyncHandler(async (req: Request, res: Response<ApiResponse>) => {
    const { id } = req.params;
    
    logger.info('Updating product', { productId: id, updateData: req.body });

    const product = await ProductService.updateProduct(id, req.body);

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: product
    });
  });

  // DELETE /api/v1/products/:id - Delete product (Admin only)
  static deleteProduct = asyncHandler(async (req: Request, res: Response<ApiResponse>) => {
    const { id } = req.params;
    
    logger.info('Deleting product', { productId: id });

    const result = await ProductService.deleteProduct(id);

    res.status(200).json({
      success: true,
      message: result.message
    });
  });
}