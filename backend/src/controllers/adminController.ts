import { Request, Response, NextFunction } from 'express';
import { AdminService } from '@/services/adminService';
import { OrderService } from '@/services/orderService';
import { PaymentService } from '@/services/paymentService';
import { AppError } from '@/middleware/errorHandler';
import { AuthRequest } from '@/types';
import { ApiResponse } from '@/types';
import { logger } from '@/utils/logger';
import { UserRole } from '@prisma/client';

export class AdminController {
  
  // Dashboard and Analytics
  static async getDashboard(req: Request, res: Response<ApiResponse>, next: NextFunction) {
    try {
      logger.info('Admin dashboard requested', {
        adminId: (req as AuthRequest).user?.id
      });

      const dashboardStats = await AdminService.getDashboardStats();

      res.json({
        success: true,
        message: 'Dashboard statistics retrieved successfully',
        data: dashboardStats
      });
    } catch (error) {
      next(error);
    }
  }

  static async getSystemHealth(req: Request, res: Response<ApiResponse>, next: NextFunction) {
    try {
      logger.info('System health check requested', {
        adminId: (req as AuthRequest).user?.id
      });

      const healthStatus = await AdminService.getSystemHealth();

      res.json({
        success: true,
        message: 'System health retrieved successfully',
        data: healthStatus
      });
    } catch (error) {
      next(error);
    }
  }

  // User Management
  static async getUsers(req: Request, res: Response<ApiResponse>, next: NextFunction) {
    try {
      const {
        page,
        limit,
        role,
        isEmailVerified,
        search,
        sortBy,
        sortOrder
      } = req.query as any;

      logger.info('Admin users list requested', {
        adminId: (req as AuthRequest).user?.id,
        filters: { page, limit, role, isEmailVerified, search }
      });

      const result = await AdminService.getUsers({
        page: page ? parseInt(page) : undefined,
        limit: limit ? parseInt(limit) : undefined,
        role: role as UserRole,
        isEmailVerified: isEmailVerified === 'true' ? true : isEmailVerified === 'false' ? false : undefined,
        search,
        sortBy,
        sortOrder
      });

      res.json({
        success: true,
        message: 'Users retrieved successfully',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateUserRole(req: Request, res: Response<ApiResponse>, next: NextFunction) {
    try {
      const { userId } = req.params;
      const { role } = req.body;

      logger.info('Admin updating user role', {
        adminId: (req as AuthRequest).user?.id,
        targetUserId: userId,
        newRole: role
      });

      const updatedUser = await AdminService.updateUserRole(userId, role);

      res.json({
        success: true,
        message: 'User role updated successfully',
        data: { user: updatedUser }
      });
    } catch (error) {
      next(error);
    }
  }

  // Order Management
  static async getAllOrders(req: Request, res: Response<ApiResponse>, next: NextFunction) {
    try {
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

      logger.info('Admin orders list requested', {
        adminId: (req as AuthRequest).user?.id,
        filters: { page, limit, status, userId }
      });

      const result = await OrderService.getOrders({
        page: page ? parseInt(page) : undefined,
        limit: limit ? parseInt(limit) : undefined,
        status,
        userId,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
        minTotal: minTotal ? parseFloat(minTotal) : undefined,
        maxTotal: maxTotal ? parseFloat(maxTotal) : undefined,
        sortBy,
        sortOrder
      });

      res.json({
        success: true,
        message: 'Orders retrieved successfully',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateOrderStatus(req: Request, res: Response<ApiResponse>, next: NextFunction) {
    try {
      const { orderId } = req.params;
      const { status, trackingNumber, notes } = req.body;

      logger.info('Admin updating order status', {
        adminId: (req as AuthRequest).user?.id,
        orderId,
        newStatus: status
      });

      const updatedOrder = await OrderService.updateOrderStatus(orderId, {
        status,
        trackingNumber,
        notes
      });

      res.json({
        success: true,
        message: 'Order status updated successfully',
        data: { order: updatedOrder }
      });
    } catch (error) {
      next(error);
    }
  }

  static async getOrderStats(req: Request, res: Response<ApiResponse>, next: NextFunction) {
    try {
      logger.info('Admin order statistics requested', {
        adminId: (req as AuthRequest).user?.id
      });

      const stats = await OrderService.getOrderStats();

      res.json({
        success: true,
        message: 'Order statistics retrieved successfully',
        data: { stats }
      });
    } catch (error) {
      next(error);
    }
  }

  // Payment Management
  static async getPaymentStats(req: Request, res: Response<ApiResponse>, next: NextFunction) {
    try {
      logger.info('Admin payment statistics requested', {
        adminId: (req as AuthRequest).user?.id
      });

      // For now, return basic payment stats
      // This would be expanded with actual payment analytics
      const stats = {
        totalPayments: 0,
        successfulPayments: 0,
        failedPayments: 0,
        totalRefunds: 0,
        pendingPayments: 0
      };

      res.json({
        success: true,
        message: 'Payment statistics retrieved successfully',
        data: { stats }
      });
    } catch (error) {
      next(error);
    }
  }

  static async processRefund(req: Request, res: Response<ApiResponse>, next: NextFunction) {
    try {
      const { paymentIntentId, amount, reason } = req.body;

      logger.info('Admin processing refund', {
        adminId: (req as AuthRequest).user?.id,
        paymentIntentId,
        amount,
        reason
      });

      const refund = await PaymentService.refundPayment({
        paymentIntentId,
        amount,
        reason
      });

      res.json({
        success: true,
        message: 'Refund processed successfully',
        data: {
          refundId: refund.id,
          amount: refund.amount ? refund.amount / 100 : undefined,
          currency: refund.currency,
          status: refund.status
        }
      });
    } catch (error) {
      next(error);
    }
  }

  // System Settings
  static async getSystemSettings(req: Request, res: Response<ApiResponse>, next: NextFunction) {
    try {
      logger.info('Admin system settings requested', {
        adminId: (req as AuthRequest).user?.id
      });

      const settings = await AdminService.getSystemSettings();

      res.json({
        success: true,
        message: 'System settings retrieved successfully',
        data: { settings }
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateSystemSettings(req: Request, res: Response<ApiResponse>, next: NextFunction) {
    try {
      const settingsUpdate = req.body;

      logger.info('Admin updating system settings', {
        adminId: (req as AuthRequest).user?.id,
        updatedKeys: Object.keys(settingsUpdate)
      });

      const updatedSettings = await AdminService.updateSystemSettings(settingsUpdate);

      res.json({
        success: true,
        message: 'System settings updated successfully',
        data: { settings: updatedSettings }
      });
    } catch (error) {
      next(error);
    }
  }

  // Reports and Analytics
  static async getRevenueReport(req: Request, res: Response<ApiResponse>, next: NextFunction) {
    try {
      const { startDate, endDate, groupBy } = req.query as any;

      logger.info('Admin revenue report requested', {
        adminId: (req as AuthRequest).user?.id,
        startDate,
        endDate,
        groupBy
      });

      // This would be implemented with more sophisticated analytics
      const report = {
        totalRevenue: 0,
        orderCount: 0,
        averageOrderValue: 0,
        topProducts: [],
        revenueByPeriod: []
      };

      res.json({
        success: true,
        message: 'Revenue report generated successfully',
        data: { report }
      });
    } catch (error) {
      next(error);
    }
  }

  static async getCustomerReport(req: Request, res: Response<ApiResponse>, next: NextFunction) {
    try {
      logger.info('Admin customer report requested', {
        adminId: (req as AuthRequest).user?.id
      });

      // This would be implemented with customer analytics
      const report = {
        totalCustomers: 0,
        newCustomersThisMonth: 0,
        repeatCustomers: 0,
        customerLifetimeValue: 0,
        topCustomers: []
      };

      res.json({
        success: true,
        message: 'Customer report generated successfully',
        data: { report }
      });
    } catch (error) {
      next(error);
    }
  }

  static async getInventoryReport(req: Request, res: Response<ApiResponse>, next: NextFunction) {
    try {
      logger.info('Admin inventory report requested', {
        adminId: (req as AuthRequest).user?.id
      });

      // This would be implemented with inventory analytics
      const report = {
        totalProducts: 0,
        lowStockProducts: 0,
        outOfStockProducts: 0,
        topSellingProducts: [],
        slowMovingProducts: []
      };

      res.json({
        success: true,
        message: 'Inventory report generated successfully',
        data: { report }
      });
    } catch (error) {
      next(error);
    }
  }

  // Export functionality
  static async exportOrders(req: Request, res: Response, next: NextFunction) {
    try {
      const { format, startDate, endDate } = req.query as any;

      logger.info('Admin orders export requested', {
        adminId: (req as AuthRequest).user?.id,
        format,
        startDate,
        endDate
      });

      if (format !== 'csv' && format !== 'xlsx') {
        throw new AppError('Invalid export format. Supported formats: csv, xlsx', 400);
      }

      // This would implement actual export functionality
      res.status(501).json({
        success: false,
        message: 'Export functionality not yet implemented'
      });
    } catch (error) {
      next(error);
    }
  }

  static async exportCustomers(req: Request, res: Response, next: NextFunction) {
    try {
      const { format } = req.query as any;

      logger.info('Admin customers export requested', {
        adminId: (req as AuthRequest).user?.id,
        format
      });

      if (format !== 'csv' && format !== 'xlsx') {
        throw new AppError('Invalid export format. Supported formats: csv, xlsx', 400);
      }

      // This would implement actual export functionality
      res.status(501).json({
        success: false,
        message: 'Export functionality not yet implemented'
      });
    } catch (error) {
      next(error);
    }
  }

  static async exportProducts(req: Request, res: Response, next: NextFunction) {
    try {
      const { format } = req.query as any;

      logger.info('Admin products export requested', {
        adminId: (req as AuthRequest).user?.id,
        format
      });

      if (format !== 'csv' && format !== 'xlsx') {
        throw new AppError('Invalid export format. Supported formats: csv, xlsx', 400);
      }

      // This would implement actual export functionality
      res.status(501).json({
        success: false,
        message: 'Export functionality not yet implemented'
      });
    } catch (error) {
      next(error);
    }
  }
}