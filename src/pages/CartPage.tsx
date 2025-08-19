import React from 'react';
import { Link } from 'react-router-dom';
import { Minus, Plus, X, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../contexts/CartContext';

const CartPage: React.FC = () => {
  const { state: cartState, removeItem, updateQuantity } = useCart();

  if (cartState.items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <ShoppingBag className="h-24 w-24 text-gray-400 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
          <p className="text-gray-600 mb-8">
            Looks like you haven't added any enamels to your cart yet.
          </p>
          <Link
            to="/products"
            className="inline-flex items-center bg-red-800 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-900 transition-colors"
          >
            Continue Shopping
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b">
              <h2 className="text-lg font-semibold text-gray-900">
                Cart Items ({cartState.items.reduce((sum, item) => sum + item.quantity, 0)})
              </h2>
            </div>
            
            <div className="divide-y">
              {cartState.items.map(item => (
                <div key={item.id} className="p-6">
                  <div className="flex items-center gap-6">
                    {/* Color Swatch */}
                    <div 
                      className="w-20 h-20 rounded-lg shrink-0"
                      style={{ backgroundColor: item.color }}
                    >
                      <div className="w-full h-full bg-gradient-to-br from-white/20 to-black/20 rounded-lg"></div>
                    </div>
                    
                    {/* Item Details */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                      <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                        <span>Size: {item.size}</span>
                        <span>Color: {item.color}</span>
                      </div>
                      <div className="text-lg font-bold text-red-800 mt-2">₾{item.price}</div>
                    </div>
                    
                    {/* Quantity Controls */}
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => updateQuantity(item.id, Math.max(0, item.quantity - 1))}
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="w-8 text-center font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                    
                    {/* Total & Remove */}
                    <div className="text-right">
                      <div className="text-lg font-bold text-gray-900">
                        ₾{(item.price * item.quantity).toFixed(2)}
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-red-600 hover:text-red-800 mt-2"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Order Summary</h2>
            
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">₾{cartState.total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium">
                  {cartState.total >= 100 ? 'Free' : '₾15.00'}
                </span>
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-red-800">
                    ₾{(cartState.total + (cartState.total >= 100 ? 0 : 15)).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
            
            {cartState.total < 100 && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  Add ₾{(100 - cartState.total).toFixed(2)} more for free shipping!
                </p>
              </div>
            )}
            
            <Link
              to="/checkout"
              className="w-full bg-red-800 text-white py-3 px-6 rounded-lg font-semibold text-center hover:bg-red-900 transition-colors mt-6 block"
            >
              Proceed to Checkout
            </Link>
            
            <Link
              to="/products"
              className="w-full text-center text-red-800 hover:text-red-900 font-medium mt-4 block"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;