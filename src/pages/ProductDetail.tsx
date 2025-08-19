import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Heart, Share2, Truck, Shield, RotateCcw } from 'lucide-react';
import { mockProducts } from '../data/mockProducts';
import { useCart } from '../contexts/CartContext';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [selectedWeight, setSelectedWeight] = useState('25g');
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();

  const product = mockProducts.find(p => p.id === id);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <p className="text-center text-gray-500">Product not found.</p>
      </div>
    );
  }

  const handleAddToCart = () => {
    addItem({
      id: `${product.id}-${selectedWeight}`,
      name: `${product.name} (${selectedWeight})`,
      price: product.price,
      quantity,
      color: product.colorCode,
      size: selectedWeight,
      image: product.image
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="mb-8">
        <Link
          to="/products"
          className="inline-flex items-center text-red-800 hover:text-red-900 font-medium"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Products
        </Link>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Image */}
        <div className="space-y-6">
          <div className="w-64 h-64 mx-auto rounded-2xl overflow-hidden shadow-lg bg-gray-100">
            <img 
              src={product.image} 
              alt={product.name}
              className="w-full h-full object-cover object-center"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.parentElement!.style.backgroundColor = '#f3f4f6';
              }}
            />
          </div>
          
          {/* Enamel Information */}
          <div className="bg-gray-50 rounded-xl p-4">
            <h3 className="font-semibold text-gray-900 mb-2">Enamel Details</h3>
            <div className="space-y-1 text-sm text-gray-600">
              <div><span className="font-medium">Reference:</span> {product.enamelNumber}</div>
              <div><span className="font-medium">Type:</span> {product.type.charAt(0).toUpperCase() + product.type.slice(1)}</div>
              <div><span className="font-medium">Category:</span> {product.category}</div>
            </div>
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="bg-red-100 text-red-800 text-sm font-medium px-3 py-1 rounded-full">
                {product.type.toUpperCase()}
              </span>
              <span className="bg-gray-100 text-gray-800 text-sm font-medium px-3 py-1 rounded-full">
                {product.category.toUpperCase()}
              </span>
              <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full font-mono">
                {product.enamelNumber}
              </span>
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              {product.name}
            </h1>
            <div className="flex items-center justify-between mb-6">
              <span className="text-3xl font-bold text-red-800">₾{product.price}</span>
              <div className="flex items-center gap-4">
                <button className="text-gray-400 hover:text-red-600">
                  <Heart className="h-6 w-6" />
                </button>
                <button className="text-gray-400 hover:text-gray-600">
                  <Share2 className="h-6 w-6" />
                </button>
              </div>
            </div>
            <p className="text-gray-600 text-lg leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Product Options */}
          <div className="space-y-6">
            {/* Weight Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-3">
                Weight
              </label>
              <div className="flex flex-wrap gap-3">
                {product.specifications.weight.map(weight => (
                  <button
                    key={weight}
                    onClick={() => setSelectedWeight(weight)}
                    className={`px-6 py-3 rounded-lg border-2 font-medium transition-colors ${
                      selectedWeight === weight
                        ? 'border-red-800 bg-red-800 text-white'
                        : 'border-gray-300 bg-white text-gray-700 hover:border-red-300'
                    }`}
                  >
                    {weight}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-3">
                Quantity
              </label>
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
                <span className="text-sm text-gray-500">
                  {product.quantity} in stock
                </span>
              </div>
            </div>
          </div>

          {/* Add to Cart */}
          <div className="space-y-4">
            <button
              onClick={handleAddToCart}
              className="w-full bg-red-800 text-white py-4 px-8 rounded-lg font-semibold text-lg hover:bg-red-900 transition-colors flex items-center justify-center gap-3"
            >
              <ShoppingCart className="h-5 w-5" />
              Add to Cart
            </button>
            <p className="text-center text-sm text-gray-500">
              Total: ₾{(product.price * quantity).toFixed(2)}
            </p>
          </div>

          {/* Features */}
          <div className="border-t pt-8">
            <div className="grid grid-cols-3 gap-6 text-center">
              <div className="space-y-2">
                <Truck className="h-8 w-8 text-red-800 mx-auto" />
                <div className="text-sm font-medium">Free Shipping</div>
                <div className="text-xs text-gray-500">On orders over ₾100</div>
              </div>
              <div className="space-y-2">
                <Shield className="h-8 w-8 text-red-800 mx-auto" />
                <div className="text-sm font-medium">Quality Guarantee</div>
                <div className="text-xs text-gray-500">Premium quality enamel</div>
              </div>
              <div className="space-y-2">
                <RotateCcw className="h-8 w-8 text-red-800 mx-auto" />
                <div className="text-sm font-medium">Easy Returns</div>
                <div className="text-xs text-gray-500">30-day return policy</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Specifications */}
      <div className="mt-16 border-t pt-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Technical Specifications</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-lg border p-6">
            <h3 className="font-semibold text-gray-900 mb-2">Enamel Number</h3>
            <p className="text-gray-600 font-mono text-lg">{product.enamelNumber}</p>
          </div>
          <div className="bg-white rounded-lg border p-6">
            <h3 className="font-semibold text-gray-900 mb-2">Firing Temperature</h3>
            <p className="text-gray-600">{product.specifications.firingTemp}</p>
          </div>
          <div className="bg-white rounded-lg border p-6">
            <h3 className="font-semibold text-gray-900 mb-2">Mesh Size</h3>
            <p className="text-gray-600">{product.specifications.mesh}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;