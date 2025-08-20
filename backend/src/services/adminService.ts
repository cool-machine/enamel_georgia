import { prisma } from '@/models';
import { AppError } from '@/middleware/errorHandler';
import { logger } from '@/utils/logger';
import { OrderStatus, UserRole } from '@prisma/client';
import { OrderService } from '@/services/orderService';
import { PaymentService } from '@/services/paymentService';

export interface DashboardStats {
  overview: {
    totalProducts: number;
    totalOrders: number;
    totalUsers: number;
    totalRevenue: number;
    averageOrderValue: number;
  };
  recentActivity: {
    recentOrders: any[];
    recentUsers: any[];
    lowStockProducts: any[];
  };
  salesMetrics: {
    dailySales: any[];
    topProducts: any[];
    ordersByStatus: Record<OrderStatus, number>;
  };
  timeRangeStats: {
    thisMonth: {
      orders: number;
      revenue: number;
      newUsers: number;
    };
    lastMonth: {
      orders: number;
      revenue: number;
      newUsers: number;
    };
    growth: {
      ordersGrowth: number;
      revenueGrowth: number;
      usersGrowth: number;
    };
  };
}

export interface AdminUserFilters {
  page?: number;
  limit?: number;
  role?: UserRole;
  isEmailVerified?: boolean;
  search?: string;
  sortBy?: 'createdAt' | 'lastLoginAt' | 'email' | 'firstName';
  sortOrder?: 'asc' | 'desc';
}

export interface SystemSettings {
  siteName: string;
  siteDescription: string;
  currency: string;
  taxRate: number;
  shippingCost: number;
  minOrderAmount: number;
  maintenanceMode: boolean;
  allowRegistration: boolean;
  emailVerificationRequired: boolean;
}

export class AdminService {
  
  static async getDashboardStats(): Promise<DashboardStats> {
    try {
      logger.info('Generating admin dashboard stats');

      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

      // Get overview stats
      const [
        totalProducts,
        totalOrders,
        totalUsers,
        orders,
        users,
        products
      ] = await Promise.all([
        prisma.product.count({ where: { isActive: true } }),
        prisma.order.count(),
        prisma.user.count(),
        prisma.order.findMany({
          select: {
            id: true,
            total: true,
            status: true,
            createdAt: true,
            orderNumber: true,
            user: {
              select: { firstName: true, lastName: true, email: true }
            }
          },
          orderBy: { createdAt: 'desc' }
        }),
        prisma.user.findMany({
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            role: true,
            createdAt: true,
            lastLoginAt: true,
            isEmailVerified: true
          },
          orderBy: { createdAt: 'desc' }
        }),
        prisma.product.findMany({
          select: {
            id: true,
            name: true,
            quantity: true,
            price: true,
            enamelNumber: true,
            inStock: true
          },
          where: { isActive: true },
          orderBy: { quantity: 'asc' }
        })
      ]);

      // Calculate totals
      const totalRevenue = orders.reduce((sum, order) => sum + Number(order.total), 0);
      const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

      // Recent activity
      const recentOrders = orders.slice(0, 10);
      const recentUsers = users.slice(0, 10);
      const lowStockProducts = products.filter(p => p.quantity < 10).slice(0, 10);

      // Sales metrics
      const ordersByStatus = orders.reduce((acc, order) => {
        acc[order.status] = (acc[order.status] || 0) + 1;
        return acc;
      }, {} as Record<OrderStatus, number>);

      // Ensure all statuses are represented
      Object.values(OrderStatus).forEach(status => {
        if (!(status in ordersByStatus)) {
          ordersByStatus[status] = 0;
        }
      });

      // Daily sales for last 30 days
      const dailySales = await this.getDailySales(30);

      // Top products by order frequency
      const topProducts = await this.getTopProducts(10);

      // Time range stats
      const thisMonthOrders = orders.filter(o => o.createdAt >= startOfMonth);
      const lastMonthOrders = orders.filter(o => 
        o.createdAt >= startOfLastMonth && o.createdAt <= endOfLastMonth
      );
      const thisMonthUsers = users.filter(u => u.createdAt >= startOfMonth);
      const lastMonthUsers = users.filter(u => 
        u.createdAt >= startOfLastMonth && u.createdAt <= endOfLastMonth
      );

      const thisMonthRevenue = thisMonthOrders.reduce((sum, order) => sum + Number(order.total), 0);
      const lastMonthRevenue = lastMonthOrders.reduce((sum, order) => sum + Number(order.total), 0);

      // Calculate growth percentages
      const ordersGrowth = lastMonthOrders.length > 0 
        ? ((thisMonthOrders.length - lastMonthOrders.length) / lastMonthOrders.length) * 100 
        : 0;
      const revenueGrowth = lastMonthRevenue > 0 
        ? ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100 
        : 0;
      const usersGrowth = lastMonthUsers.length > 0 
        ? ((thisMonthUsers.length - lastMonthUsers.length) / lastMonthUsers.length) * 100 
        : 0;

      return {
        overview: {
          totalProducts,
          totalOrders,
          totalUsers,
          totalRevenue,
          averageOrderValue
        },
        recentActivity: {
          recentOrders,
          recentUsers,
          lowStockProducts
        },
        salesMetrics: {
          dailySales,
          topProducts,
          ordersByStatus
        },
        timeRangeStats: {
          thisMonth: {
            orders: thisMonthOrders.length,
            revenue: thisMonthRevenue,
            newUsers: thisMonthUsers.length
          },
          lastMonth: {
            orders: lastMonthOrders.length,
            revenue: lastMonthRevenue,
            newUsers: lastMonthUsers.length
          },
          growth: {
            ordersGrowth,
            revenueGrowth,
            usersGrowth
          }
        }
      };
    } catch (error) {
      logger.error('Failed to generate dashboard stats', {
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      throw new AppError('Failed to generate dashboard statistics', 500);
    }
  }

  private static async getDailySales(days: number): Promise<any[]> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const orders = await prisma.order.findMany({
      where: {
        createdAt: { gte: startDate },
        status: { in: [OrderStatus.PAID, OrderStatus.PROCESSING, OrderStatus.SHIPPED, OrderStatus.DELIVERED] }
      },
      select: {
        total: true,
        createdAt: true
      }
    });

    // Group by date
    const salesByDate = new Map<string, { date: string; revenue: number; orders: number }>();

    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      salesByDate.set(dateStr, { date: dateStr, revenue: 0, orders: 0 });
    }

    orders.forEach(order => {
      const dateStr = order.createdAt.toISOString().split('T')[0];
      const existing = salesByDate.get(dateStr);
      if (existing) {
        existing.revenue += Number(order.total);
        existing.orders += 1;
      }
    });

    return Array.from(salesByDate.values()).reverse();
  }

  private static async getTopProducts(limit: number): Promise<any[]> {
    const topProducts = await prisma.orderItem.groupBy({
      by: ['productId'],
      _sum: { quantity: true },
      _count: { id: true },
      orderBy: { _sum: { quantity: 'desc' } },
      take: limit
    });

    const productIds = topProducts.map(tp => tp.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
      select: {
        id: true,
        name: true,
        enamelNumber: true,
        price: true,
        image: true
      }
    });

    return topProducts.map(tp => {
      const product = products.find(p => p.id === tp.productId);
      return {
        product,
        totalQuantitySold: tp._sum.quantity,
        orderCount: tp._count.id
      };
    });
  }

  static async getUsers(filters: AdminUserFilters = {}): Promise<{
    users: any[];
    totalCount: number;
    totalPages: number;
    currentPage: number;
  }> {
    const {
      page = 1,
      limit = 20,
      role,
      isEmailVerified,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = filters;

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};

    if (role) {
      where.role = role;
    }

    if (typeof isEmailVerified === 'boolean') {
      where.isEmailVerified = isEmailVerified;
    }

    if (search) {
      where.OR = [
        { email: { contains: search, mode: 'insensitive' } },
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } }
      ];
    }

    const [users, totalCount] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          isEmailVerified: true,
          lastLoginAt: true,
          createdAt: true,
          _count: {
            select: { orders: true }
          }
        },
        orderBy: { [sortBy]: sortOrder },
        skip,
        take: limit
      }),
      prisma.user.count({ where })
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    logger.info('Retrieved users for admin', {
      count: users.length,
      totalCount,
      page,
      filters
    });

    return {
      users,
      totalCount,
      totalPages,
      currentPage: page
    };
  }

  static async updateUserRole(userId: string, newRole: UserRole): Promise<any> {
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { role: newRole },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isEmailVerified: true,
        createdAt: true,
        lastLoginAt: true
      }
    });

    logger.info('User role updated by admin', {
      userId,
      oldRole: user.role,
      newRole,
      userEmail: user.email
    });

    return updatedUser;
  }

  static async getSystemSettings(): Promise<SystemSettings> {
    const settings = await prisma.setting.findMany();
    
    const settingsMap = settings.reduce((acc, setting) => {
      let value: any = setting.value;
      
      // Parse different types
      if (setting.type === 'boolean') {
        value = setting.value === 'true';
      } else if (setting.type === 'number') {
        value = parseFloat(setting.value);
      } else if (setting.type === 'json') {
        try {
          value = JSON.parse(setting.value);
        } catch {
          value = setting.value;
        }
      }
      
      acc[setting.key] = value;
      return acc;
    }, {} as any);

    // Return with defaults
    return {
      siteName: settingsMap.siteName || 'Enamel Georgia',
      siteDescription: settingsMap.siteDescription || 'Premium enamel colors for artisans',
      currency: settingsMap.currency || 'GEL',
      taxRate: settingsMap.taxRate || 0,
      shippingCost: settingsMap.shippingCost || 0,
      minOrderAmount: settingsMap.minOrderAmount || 0,
      maintenanceMode: settingsMap.maintenanceMode || false,
      allowRegistration: settingsMap.allowRegistration || true,
      emailVerificationRequired: settingsMap.emailVerificationRequired || false
    };
  }

  static async updateSystemSettings(settings: Partial<SystemSettings>): Promise<SystemSettings> {
    const updatePromises = Object.entries(settings).map(([key, value]) => {
      let stringValue: string;
      let type: string;

      if (typeof value === 'boolean') {
        stringValue = value.toString();
        type = 'boolean';
      } else if (typeof value === 'number') {
        stringValue = value.toString();
        type = 'number';
      } else if (typeof value === 'object') {
        stringValue = JSON.stringify(value);
        type = 'json';
      } else {
        stringValue = String(value);
        type = 'string';
      }

      return prisma.setting.upsert({
        where: { key },
        update: { value: stringValue, type },
        create: { key, value: stringValue, type }
      });
    });

    await Promise.all(updatePromises);

    logger.info('System settings updated by admin', {
      updatedKeys: Object.keys(settings)
    });

    return await this.getSystemSettings();
  }

  static async getSystemHealth(): Promise<{
    status: 'healthy' | 'warning' | 'error';
    checks: {
      database: { status: string; responseTime: number };
      diskSpace: { status: string; freeSpace: string };
      memory: { status: string; usage: string };
      orders: { status: string; pendingCount: number };
      products: { status: string; lowStockCount: number };
    };
  }> {
    try {
      // Database check
      const dbStart = Date.now();
      await prisma.$queryRaw`SELECT 1`;
      const dbResponseTime = Date.now() - dbStart;

      // Get system metrics
      const [pendingOrders, lowStockProducts] = await Promise.all([
        prisma.order.count({ where: { status: OrderStatus.PENDING } }),
        prisma.product.count({ where: { quantity: { lt: 10 }, isActive: true } })
      ]);

      // Memory usage
      const memUsage = process.memoryUsage();
      const memUsageMB = Math.round(memUsage.heapUsed / 1024 / 1024);

      const checks = {
        database: {
          status: dbResponseTime < 1000 ? 'healthy' : 'warning',
          responseTime: dbResponseTime
        },
        diskSpace: {
          status: 'healthy', // Would implement real disk space check in production
          freeSpace: 'N/A'
        },
        memory: {
          status: memUsageMB < 512 ? 'healthy' : 'warning',
          usage: `${memUsageMB}MB`
        },
        orders: {
          status: pendingOrders < 100 ? 'healthy' : 'warning',
          pendingCount: pendingOrders
        },
        products: {
          status: lowStockProducts < 20 ? 'healthy' : 'warning',
          lowStockCount: lowStockProducts
        }
      };

      // Determine overall status
      const hasErrors = Object.values(checks).some(check => check.status === 'error');
      const hasWarnings = Object.values(checks).some(check => check.status === 'warning');
      
      const status = hasErrors ? 'error' : hasWarnings ? 'warning' : 'healthy';

      return { status, checks };
    } catch (error) {
      logger.error('System health check failed', {
        error: error instanceof Error ? error.message : 'Unknown error'
      });

      return {
        status: 'error',
        checks: {
          database: { status: 'error', responseTime: 0 },
          diskSpace: { status: 'unknown', freeSpace: 'N/A' },
          memory: { status: 'unknown', usage: 'N/A' },
          orders: { status: 'unknown', pendingCount: 0 },
          products: { status: 'unknown', lowStockCount: 0 }
        }
      };
    }
  }
}