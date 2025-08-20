import { prisma } from '@/models';
import { AppError } from '@/middleware/errorHandler';
import { logger } from '@/utils/logger';
import { Cart, CartItem, Product, User } from '@prisma/client';

export interface CartWithItems extends Cart {
  items: (CartItem & {
    product: Product;
  })[];
  user?: User | null;
}

export interface AddToCartData {
  productId: string;
  quantity: number;
}

export interface UpdateCartItemData {
  quantity: number;
}

export interface CartSummary {
  itemCount: number;
  subtotal: number;
  estimatedTotal: number;
}

export class CartService {
  static async getOrCreateCart(userId?: string, sessionId?: string): Promise<Cart> {
    if (!userId && !sessionId) {
      throw new AppError('Either userId or sessionId is required', 400);
    }

    let cart = await prisma.cart.findFirst({
      where: userId 
        ? { userId }
        : { sessionId }
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: {
          userId,
          sessionId
        }
      });

      logger.info('Created new cart', { 
        cartId: cart.id, 
        userId, 
        sessionId,
        type: userId ? 'user' : 'guest'
      });
    }

    return cart;
  }

  static async getCartWithItems(userId?: string, sessionId?: string): Promise<CartWithItems | null> {
    if (!userId && !sessionId) {
      return null;
    }

    const cart = await prisma.cart.findFirst({
      where: userId 
        ? { userId }
        : { sessionId },
      include: {
        items: {
          include: {
            product: true
          },
          orderBy: {
            addedAt: 'desc'
          }
        },
        user: true
      }
    });

    return cart as CartWithItems | null;
  }

  static async addToCart(
    data: AddToCartData, 
    userId?: string, 
    sessionId?: string
  ): Promise<CartWithItems> {
    const { productId, quantity } = data;

    if (quantity < 1) {
      throw new AppError('Quantity must be at least 1', 400);
    }

    // Verify product exists and is available
    const product = await prisma.product.findUnique({
      where: { id: productId }
    });

    if (!product) {
      throw new AppError('Product not found', 404);
    }

    if (!product.isActive) {
      throw new AppError('Product is not available', 400);
    }

    if (!product.inStock) {
      throw new AppError('Product is out of stock', 400);
    }

    if (product.quantity < quantity) {
      throw new AppError(`Only ${product.quantity} items available in stock`, 400);
    }

    // Get or create cart
    const cart = await this.getOrCreateCart(userId, sessionId);

    // Check if item already exists in cart
    const existingItem = await prisma.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId
        }
      }
    });

    if (existingItem) {
      const newQuantity = existingItem.quantity + quantity;
      
      if (newQuantity > product.quantity) {
        throw new AppError(`Cannot add ${quantity} more items. Only ${product.quantity - existingItem.quantity} more available`, 400);
      }

      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: newQuantity }
      });

      logger.info('Updated cart item quantity', { 
        cartId: cart.id, 
        productId, 
        oldQuantity: existingItem.quantity,
        newQuantity,
        userId,
        sessionId
      });
    } else {
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          quantity
        }
      });

      logger.info('Added new item to cart', { 
        cartId: cart.id, 
        productId, 
        quantity,
        userId,
        sessionId
      });
    }

    return await this.getCartWithItems(userId, sessionId) as CartWithItems;
  }

  static async updateCartItem(
    cartItemId: string,
    data: UpdateCartItemData,
    userId?: string,
    sessionId?: string
  ): Promise<CartWithItems> {
    const { quantity } = data;

    if (quantity < 0) {
      throw new AppError('Quantity cannot be negative', 400);
    }

    // Find cart item and verify ownership
    const cartItem = await prisma.cartItem.findUnique({
      where: { id: cartItemId },
      include: {
        cart: true,
        product: true
      }
    });

    if (!cartItem) {
      throw new AppError('Cart item not found', 404);
    }

    // Verify cart ownership
    const cart = cartItem.cart;
    if (userId && cart.userId !== userId) {
      throw new AppError('Cart item not found', 404);
    }
    if (!userId && cart.sessionId !== sessionId) {
      throw new AppError('Cart item not found', 404);
    }

    if (quantity === 0) {
      // Remove item from cart
      await prisma.cartItem.delete({
        where: { id: cartItemId }
      });

      logger.info('Removed item from cart', { 
        cartId: cart.id, 
        cartItemId,
        productId: cartItem.productId,
        userId,
        sessionId
      });
    } else {
      // Verify stock availability
      if (quantity > cartItem.product.quantity) {
        throw new AppError(`Only ${cartItem.product.quantity} items available in stock`, 400);
      }

      await prisma.cartItem.update({
        where: { id: cartItemId },
        data: { quantity }
      });

      logger.info('Updated cart item quantity', { 
        cartId: cart.id, 
        cartItemId,
        productId: cartItem.productId,
        oldQuantity: cartItem.quantity,
        newQuantity: quantity,
        userId,
        sessionId
      });
    }

    return await this.getCartWithItems(userId, sessionId) as CartWithItems;
  }

  static async removeFromCart(
    cartItemId: string,
    userId?: string,
    sessionId?: string
  ): Promise<CartWithItems> {
    // Find cart item and verify ownership
    const cartItem = await prisma.cartItem.findUnique({
      where: { id: cartItemId },
      include: {
        cart: true
      }
    });

    if (!cartItem) {
      throw new AppError('Cart item not found', 404);
    }

    // Verify cart ownership
    const cart = cartItem.cart;
    if (userId && cart.userId !== userId) {
      throw new AppError('Cart item not found', 404);
    }
    if (!userId && cart.sessionId !== sessionId) {
      throw new AppError('Cart item not found', 404);
    }

    await prisma.cartItem.delete({
      where: { id: cartItemId }
    });

    logger.info('Removed item from cart', { 
      cartId: cart.id, 
      cartItemId,
      productId: cartItem.productId,
      userId,
      sessionId
    });

    return await this.getCartWithItems(userId, sessionId) as CartWithItems;
  }

  static async clearCart(userId?: string, sessionId?: string): Promise<void> {
    const cart = await prisma.cart.findFirst({
      where: userId 
        ? { userId }
        : { sessionId }
    });

    if (!cart) {
      return; // Cart doesn't exist, nothing to clear
    }

    await prisma.cartItem.deleteMany({
      where: { cartId: cart.id }
    });

    logger.info('Cleared cart', { 
      cartId: cart.id, 
      userId,
      sessionId
    });
  }

  static async getCartSummary(userId?: string, sessionId?: string): Promise<CartSummary> {
    const cart = await this.getCartWithItems(userId, sessionId);

    if (!cart) {
      return {
        itemCount: 0,
        subtotal: 0,
        estimatedTotal: 0
      };
    }

    const itemCount = cart.items.reduce((total, item) => total + item.quantity, 0);
    const subtotal = cart.items.reduce((total, item) => {
      return total + (Number(item.product.price) * item.quantity);
    }, 0);

    // TODO: Calculate shipping, tax, discounts based on business rules
    const estimatedTotal = subtotal;

    return {
      itemCount,
      subtotal,
      estimatedTotal
    };
  }

  static async transferGuestCartToUser(sessionId: string, userId: string): Promise<CartWithItems | null> {
    const guestCart = await this.getCartWithItems(undefined, sessionId);
    if (!guestCart || guestCart.items.length === 0) {
      return null;
    }

    // Get or create user cart
    const userCart = await this.getOrCreateCart(userId);

    // Transfer items from guest cart to user cart
    for (const item of guestCart.items) {
      try {
        await this.addToCart(
          { productId: item.productId, quantity: item.quantity },
          userId
        );
      } catch (error) {
        // Log but don't fail the transfer for individual items
        logger.warn('Failed to transfer cart item', {
          error: error instanceof Error ? error.message : 'Unknown error',
          productId: item.productId,
          quantity: item.quantity,
          sessionId,
          userId
        });
      }
    }

    // Delete guest cart
    await prisma.cart.delete({
      where: { id: guestCart.id }
    });

    logger.info('Transferred guest cart to user', {
      guestCartId: guestCart.id,
      userCartId: userCart.id,
      itemCount: guestCart.items.length,
      sessionId,
      userId
    });

    return await this.getCartWithItems(userId);
  }

  static async validateCartForCheckout(userId?: string, sessionId?: string): Promise<{
    valid: boolean;
    errors: string[];
    cart: CartWithItems | null;
  }> {
    const cart = await this.getCartWithItems(userId, sessionId);
    const errors: string[] = [];

    if (!cart) {
      return {
        valid: false,
        errors: ['Cart not found'],
        cart: null
      };
    }

    if (cart.items.length === 0) {
      errors.push('Cart is empty');
    }

    // Validate each cart item
    for (const item of cart.items) {
      if (!item.product.isActive) {
        errors.push(`Product "${item.product.name}" is no longer available`);
      }

      if (!item.product.inStock) {
        errors.push(`Product "${item.product.name}" is out of stock`);
      }

      if (item.quantity > item.product.quantity) {
        errors.push(`Only ${item.product.quantity} of "${item.product.name}" available (you have ${item.quantity} in cart)`);
      }
    }

    return {
      valid: errors.length === 0,
      errors,
      cart
    };
  }
}