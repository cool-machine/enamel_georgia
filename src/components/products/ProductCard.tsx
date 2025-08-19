import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Eye } from 'lucide-react';
import { Product } from '../../data/mockProducts';
import { useCart } from '../../contexts/CartContext';
import { useLanguage } from '../../contexts/LanguageContext';

interface ProductCardProps {
  product: Product;
  viewMode?: 'grid' | 'list';
}

const ProductCard: React.FC<ProductCardProps> = ({ product, viewMode = 'grid' }) => {
  const { addItem } = useCart();
  const { t } = useLanguage();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      color: product.enamelNumber,
      size: '25g',
      image: product.image
    });
  };

  if (viewMode === 'list') {
    return (
      <Link to={`/products/${product.id}`} className="block">
        <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border p-6">
          <div className="flex gap-6">
            <div className="w-16 h-16 rounded-lg shrink-0 overflow-hidden bg-gray-100">
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
            <div className="flex-1">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
                  <p className="text-xs text-gray-500 font-mono">{product.enamelNumber}</p>
                  <p className="text-sm text-gray-500">{product.category} • {product.type.toUpperCase()}</p>
                </div>
                <span className="text-xl font-bold text-red-800">₾{product.price}</span>
              </div>
              <p className="text-gray-600 text-sm mb-4">{product.description}</p>
              <div className="flex gap-2">
                <button
                  onClick={handleAddToCart}
                  className="bg-red-800 text-white px-4 py-2 rounded-lg hover:bg-red-900 transition-colors flex items-center gap-2 text-sm"
                >
                  <ShoppingCart className="h-4 w-4" />
                  {t('products.addToCart')}
                </button>
                <Link
                  to={`/products/${product.id}`}
                  className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 text-sm"
                >
                  <Eye className="h-4 w-4" />
                  {t('products.viewDetails')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link to={`/products/${product.id}`} className="block group">
      <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-200 overflow-hidden border">
        <div className="w-32 h-32 relative overflow-hidden bg-gray-100 rounded-lg mx-auto">
          <img 
            src={product.image} 
            alt={product.name}
            className="w-full h-full object-cover object-center"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              e.currentTarget.parentElement!.style.backgroundColor = '#f3f4f6';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-black/20"></div>
        </div>
        <div className="p-6">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-red-800 transition-colors">
              {product.name}
            </h3>
            <span className="text-lg font-bold text-red-800">₾{product.price}</span>
          </div>
          <div className="text-xs text-gray-500 font-mono mb-1">{product.enamelNumber}</div>
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>
          <div className="flex gap-2">
            <button
              onClick={handleAddToCart}
              className="flex-1 bg-red-800 text-white py-2 px-4 rounded-lg font-medium hover:bg-red-900 transition-colors flex items-center justify-center gap-2"
            >
              <ShoppingCart className="h-4 w-4" />
              {t('products.addToCart')}
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;