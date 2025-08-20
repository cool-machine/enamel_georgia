import { Request, Response, NextFunction } from 'express';
import { OrderService } from '@/services/orderService';
import { AppError } from '@/middleware/errorHandler';
import { AuthRequest } from '@/types';
import { ApiResponse } from '@/types';
import { logger } from '@/utils/logger';
import { OrderStatus } from '@prisma/client';

export class OrderController {
  static async createOrder(req: Request, res: Response<ApiResponse>, next: NextFunction) {
    try {
      const authReq = req as AuthRequest;
      const userId = authReq.user?.id;
      const sessionId = req.headers['x-session-id'] as string;

      if (!userId) {
        throw new AppError('Authentication required to create order', 401);
      }

      const { shippingAddressId, billingAddressId, paymentMethod, notes } = req.body;

      logger.info('Creating order', {
        userId,
        sessionId,
        shippingAddressId,
        billingAddressId,
        paymentMethod
      });

      const order = await OrderService.createOrder(
        userId,
        { shippingAddressId, billingAddressId, paymentMethod, notes },
        sessionId
      );

      res.status(201).json({
        success: true,
        message: 'Order created successfully',
        data: { order }
      });
    } catch (error) {
      next(error);
    }
  }

  static async getOrders(req: Request, res: Response<ApiResponse>, next: NextFunction) {
    try {
      const authReq = req as AuthRequest;
      const userRole = authReq.user?.role;
      const currentUserId = authReq.user?.id;

      // Parse query parameters
      const {
        page,
        limit,
        status,
        userId,
        startDate,
        endDate,
        minTotal,
        maxTotal,
        sortBy,
        sortOrder
      } = req.query as any;

      // Regular users can only see their own orders
      const filters: any = {
        page: page ? parseInt(page) : undefined,
        limit: limit ? parseInt(limit) : undefined,
        status: status as OrderStatus,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
        minTotal: minTotal ? parseFloat(minTotal) : undefined,
        maxTotal: maxTotal ? parseFloat(maxTotal) : undefined,
        sortBy,
        sortOrder
      };

      // Only admins can filter by userId, regular users see only their orders
      if (userRole === 'ADMIN') {
        filters.userId = userId;
      } else {
        filters.userId = currentUserId;
      }

      logger.info('Getting orders', { 
        userRole, 
        currentUserId, 
        filters 
      });

      const result = await OrderService.getOrders(filters);

      res.json({
        success: true,
        message: 'Orders retrieved successfully',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  static async getOrder(req: Request, res: Response<ApiResponse>, next: NextFunction) {
    try {
      const authReq = req as AuthRequest;
      const userRole = authReq.user?.role;
      const userId = authReq.user?.id;
      const { id } = req.params;

      logger.info('Getting order', { 
        orderId: id, 
        userId, 
        userRole 
      });

      // Regular users can only see their own orders
      const order = await OrderService.getOrderById(
        id,
        userRole === 'ADMIN' ? undefined : userId
      );

      if (!order) {
        throw new AppError('Order not found', 404);
      }

      res.json({
        success: true,
        message: 'Order retrieved successfully',
        data: { order }
      });
    } catch (error) {
      next(error);
    }
  }

  static async getOrderByNumber(req: Request, res: Response<ApiResponse>, next: NextFunction) {
    try {
      const authReq = req as AuthRequest;
      const userRole = authReq.user?.role;
      const userId = authReq.user?.id;
      const { orderNumber } = req.params;

      logger.info('Getting order by number', { 
        orderNumber, 
        userId, 
        userRole 
      });

      // Regular users can only see their own orders
      const order = await OrderService.getOrderByNumber(
        orderNumber,
        userRole === 'ADMIN' ? undefined : userId
      );

      if (!order) {
        throw new AppError('Order not found', 404);
      }

      res.json({
        success: true,
        message: 'Order retrieved successfully',
        data: { order }
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateOrderStatus(req: Request, res: Response<ApiResponse>, next: NextFunction) {
    try {
      const { id } = req.params;
      const { status, trackingNumber, notes } = req.body;

      logger.info('Updating order status', { 
        orderId: id, 
        status, 
        trackingNumber 
      });

      const order = await OrderService.updateOrderStatus(id, {
        status,
        trackingNumber,
        notes
      });

      res.json({
        success: true,
        message: 'Order status updated successfully',
        data: { order }
      });
    } catch (error) {
      next(error);
    }
  }

  static async cancelOrder(req: Request, res: Response<ApiResponse>, next: NextFunction) {
    try {
      const authReq = req as AuthRequest;
      const userRole = authReq.user?.role;
      const userId = authReq.user?.id;
      const { id } = req.params;

      logger.info('Cancelling order', { 
        orderId: id, 
        userId, 
        userRole 
      });

      // Regular users can only cancel their own orders
      const order = await OrderService.cancelOrder(
        id,
        userRole === 'ADMIN' ? undefined : userId
      );

      res.json({
        success: true,
        message: 'Order cancelled successfully',
        data: { order }
      });
    } catch (error) {
      next(error);
    }
  }

  static async getOrderStats(req: Request, res: Response<ApiResponse>, next: NextFunction) {
    try {
      const authReq = req as AuthRequest;
      const userRole = authReq.user?.role;
      const userId = authReq.user?.id;

      logger.info('Getting order statistics', { 
        userId, 
        userRole 
      });

      // Regular users see only their stats, admins see all stats
      const stats = await OrderService.getOrderStats(
        userRole === 'ADMIN' ? undefined : userId
      );

      res.json({
        success: true,
        message: 'Order statistics retrieved successfully',
        data: { stats }
      });
    } catch (error) {
      next(error);
    }
  }

  static async getUserOrders(req: Request, res: Response<ApiResponse>, next: NextFunction) {
    try {
      const authReq = req as AuthRequest;
      const userId = authReq.user?.id;

      if (!userId) {
        throw new AppError('Authentication required', 401);
      }

      // Parse query parameters
      const {
        page,
        limit,
        status,
        startDate,
        endDate,
        sortBy,
        sortOrder
      } = req.query as any;

      const filters = {
        page: page ? parseInt(page) : undefined,
        limit: limit ? parseInt(limit) : undefined,
        status: status as OrderStatus,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
        sortBy,
        sortOrder
      };

      logger.info('Getting user orders', { 
        userId, 
        filters 
      });

      const result = await OrderService.getUserOrders(userId, filters);

      res.json({
        success: true,
        message: 'User orders retrieved successfully',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }
}