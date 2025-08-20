import { prisma } from '@/models';
import { AppError } from '@/middleware/errorHandler';
import { logger } from '@/utils/logger';
import { CartService } from '@/services/cartService';
import { Order, OrderItem, OrderStatus, Address, User, Product } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

export interface OrderWithDetails extends Order {
  items: (OrderItem & {
    product: Product;
  })[];
  user: User;
  shippingAddress: Address;
  billingAddress?: Address | null;
}

export interface CreateOrderData {
  shippingAddressId: string;
  billingAddressId?: string;
  paymentMethod: string;
  notes?: string;
}

export interface UpdateOrderStatusData {
  status: OrderStatus;
  trackingNumber?: string;
  notes?: string;
}

export interface OrderFilters {
  page?: number;
  limit?: number;
  status?: OrderStatus;
  userId?: string;
  startDate?: Date;
  endDate?: Date;
  minTotal?: number;
  maxTotal?: number;
  sortBy?: 'orderNumber' | 'total' | 'status' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

export class OrderService {
  private static generateOrderNumber(): string {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `EG-${timestamp}-${random}`;
  }

  static async createOrder(
    userId: string,
    data: CreateOrderData,
    sessionId?: string
  ): Promise<OrderWithDetails> {
    const { shippingAddressId, billingAddressId, paymentMethod, notes } = data;

    // Validate cart first
    const cartValidation = await CartService.validateCartForCheckout(userId, sessionId);
    if (!cartValidation.valid) {
      throw new AppError(`Cart validation failed: ${cartValidation.errors.join(', ')}`, 400);
    }

    const cart = cartValidation.cart!;

    // Verify addresses belong to user
    const shippingAddress = await prisma.address.findFirst({
      where: { id: shippingAddressId, userId }
    });

    if (!shippingAddress) {
      throw new AppError('Shipping address not found', 404);
    }

    let billingAddress = null;
    if (billingAddressId) {
      billingAddress = await prisma.address.findFirst({
        where: { id: billingAddressId, userId }
      });
      if (!billingAddress) {
        throw new AppError('Billing address not found', 404);
      }
    }

    // Calculate totals
    const subtotal = cart.items.reduce((total, item) => {
      return total + (Number(item.product.price) * item.quantity);
    }, 0);

    // TODO: Implement shipping cost, tax, and discount calculations
    const shippingCost = 0; // Will be calculated based on address and cart weight
    const taxAmount = 0; // Will be calculated based on address and local tax rates
    const discountAmount = 0; // Will be calculated based on applied coupons/promotions
    const total = subtotal + shippingCost + taxAmount - discountAmount;

    // Generate unique order number
    const orderNumber = this.generateOrderNumber();

    // Create order in transaction
    const order = await prisma.$transaction(async (tx) => {
      // Create order
      const newOrder = await tx.order.create({
        data: {
          userId,
          orderNumber,
          status: OrderStatus.PENDING,
          subtotal: new Decimal(subtotal),
          shippingCost: new Decimal(shippingCost),
          taxAmount: new Decimal(taxAmount),
          discountAmount: new Decimal(discountAmount),
          total: new Decimal(total),
          shippingAddressId,
          billingAddressId,
          paymentMethod,
          notes
        }
      });

      // Create order items
      for (const cartItem of cart.items) {
        await tx.orderItem.create({
          data: {
            orderId: newOrder.id,
            productId: cartItem.productId,
            quantity: cartItem.quantity,
            unitPrice: cartItem.product.price,
            total: new Decimal(Number(cartItem.product.price) * cartItem.quantity)
          }
        });

        // Update product quantity (reserve stock)
        await tx.product.update({
          where: { id: cartItem.productId },
          data: {
            quantity: {
              decrement: cartItem.quantity
            }
          }
        });
      }

      return newOrder;
    });

    // Clear cart after successful order creation
    await CartService.clearCart(userId, sessionId);

    logger.info('Order created successfully', {
      orderId: order.id,
      orderNumber: order.orderNumber,
      userId,
      total,
      itemCount: cart.items.length
    });

    // Return order with full details
    return await this.getOrderById(order.id) as OrderWithDetails;
  }

  static async getOrderById(orderId: string, userId?: string): Promise<OrderWithDetails | null> {
    const order = await prisma.order.findUnique({
      where: { 
        id: orderId,
        ...(userId && { userId }) // If userId provided, ensure order belongs to user
      },
      include: {
        items: {
          include: {
            product: true
          }
        },
        user: true,
        shippingAddress: true,
        billingAddress: true
      }
    });

    return order as OrderWithDetails | null;
  }

  static async getOrderByNumber(
    orderNumber: string, 
    userId?: string
  ): Promise<OrderWithDetails | null> {
    const order = await prisma.order.findUnique({
      where: { 
        orderNumber,
        ...(userId && { userId })
      },
      include: {
        items: {
          include: {
            product: true
          }
        },
        user: true,
        shippingAddress: true,
        billingAddress: true
      }
    });

    return order as OrderWithDetails | null;
  }

  static async getOrders(filters: OrderFilters = {}): Promise<{
    orders: OrderWithDetails[];
    totalCount: number;
    totalPages: number;
    currentPage: number;
  }> {
    const {
      page = 1,
      limit = 20,
      status,
      userId,
      startDate,
      endDate,
      minTotal,
      maxTotal,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = filters;

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};

    if (status) {
      where.status = status;
    }

    if (userId) {
      where.userId = userId;
    }

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) {
        where.createdAt.gte = startDate;
      }
      if (endDate) {
        where.createdAt.lte = endDate;
      }
    }

    if (minTotal || maxTotal) {
      where.total = {};
      if (minTotal) {
        where.total.gte = new Decimal(minTotal);
      }
      if (maxTotal) {
        where.total.lte = new Decimal(maxTotal);
      }
    }

    // Execute queries in parallel
    const [orders, totalCount] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          items: {
            include: {
              product: true
            }
          },
          user: true,
          shippingAddress: true,
          billingAddress: true
        },
        orderBy: {
          [sortBy]: sortOrder
        },
        skip,
        take: limit
      }),
      prisma.order.count({ where })
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    logger.info('Retrieved orders', {
      count: orders.length,
      totalCount,
      page,
      limit,
      filters
    });

    return {
      orders: orders as OrderWithDetails[],
      totalCount,
      totalPages,
      currentPage: page
    };
  }

  static async getUserOrders(
    userId: string,
    filters: Omit<OrderFilters, 'userId'> = {}
  ): Promise<{
    orders: OrderWithDetails[];
    totalCount: number;
    totalPages: number;
    currentPage: number;
  }> {
    return this.getOrders({ ...filters, userId });
  }

  static async updateOrderStatus(
    orderId: string,
    data: UpdateOrderStatusData
  ): Promise<OrderWithDetails> {
    const { status, trackingNumber, notes } = data;

    const existingOrder = await prisma.order.findUnique({
      where: { id: orderId }
    });

    if (!existingOrder) {
      throw new AppError('Order not found', 404);
    }

    // Business rules for status transitions
    const validTransitions: Record<OrderStatus, OrderStatus[]> = {
      PENDING: [OrderStatus.PAID, OrderStatus.CANCELLED],
      PAID: [OrderStatus.PROCESSING, OrderStatus.CANCELLED, OrderStatus.REFUNDED],
      PROCESSING: [OrderStatus.SHIPPED, OrderStatus.CANCELLED],
      SHIPPED: [OrderStatus.DELIVERED],
      DELIVERED: [OrderStatus.REFUNDED],
      CANCELLED: [], // Final state
      REFUNDED: [] // Final state
    };

    if (!validTransitions[existingOrder.status].includes(status)) {
      throw new AppError(
        `Cannot change order status from ${existingOrder.status} to ${status}`,
        400
      );
    }

    // Update order with status and optional fields
    const updateData: any = {
      status,
      updatedAt: new Date()
    };

    if (trackingNumber) {
      updateData.trackingNumber = trackingNumber;
    }

    if (notes) {
      updateData.notes = notes;
    }

    // Set timestamp fields based on status
    if (status === OrderStatus.PAID && !existingOrder.paidAt) {
      updateData.paidAt = new Date();
    }

    if (status === OrderStatus.SHIPPED && !existingOrder.shippedAt) {
      updateData.shippedAt = new Date();
    }

    if (status === OrderStatus.DELIVERED && !existingOrder.deliveredAt) {
      updateData.deliveredAt = new Date();
    }

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: updateData
    });

    logger.info('Order status updated', {
      orderId,
      orderNumber: existingOrder.orderNumber,
      oldStatus: existingOrder.status,
      newStatus: status,
      trackingNumber,
      notes
    });

    return await this.getOrderById(orderId) as OrderWithDetails;
  }

  static async cancelOrder(orderId: string, userId?: string): Promise<OrderWithDetails> {
    const order = await this.getOrderById(orderId, userId);

    if (!order) {
      throw new AppError('Order not found', 404);
    }

    // Only allow cancellation of pending or paid orders
    if (![OrderStatus.PENDING, OrderStatus.PAID].includes(order.status)) {
      throw new AppError(`Cannot cancel order with status ${order.status}`, 400);
    }

    // Restore product quantities in transaction
    await prisma.$transaction(async (tx) => {
      for (const item of order.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            quantity: {
              increment: item.quantity
            }
          }
        });
      }
    });

    return await this.updateOrderStatus(orderId, {
      status: OrderStatus.CANCELLED,
      notes: 'Order cancelled by user'
    });
  }

  static async getOrderStats(userId?: string): Promise<{
    totalOrders: number;
    totalRevenue: number;
    ordersByStatus: Record<OrderStatus, number>;
    averageOrderValue: number;
  }> {
    const where = userId ? { userId } : {};

    const [totalOrders, orders] = await Promise.all([
      prisma.order.count({ where }),
      prisma.order.findMany({
        where,
        select: {
          status: true,
          total: true
        }
      })
    ]);

    const totalRevenue = orders.reduce((sum, order) => sum + Number(order.total), 0);
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

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

    return {
      totalOrders,
      totalRevenue,
      ordersByStatus,
      averageOrderValue
    };
  }
}