import React, { useState, useEffect } from 'react';
import { Search, Filter, Grid, List, Loader2 } from 'lucide-react';
import ProductCard from '../components/products/ProductCard';
import ProductFilter from '../components/products/ProductFilter';
import { useLanguage } from '../contexts/LanguageContext';
import { productApi } from '../services/productService';
import { Product, ProductFilters } from '../config/api';

const ProductsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 80]);
  const [sortBy, setSortBy] = useState('name');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  
  // API state
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 60,
    total: 0,
    pages: 0
  });

  const { t } = useLanguage();

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const filters: ProductFilters = {
          page: pagination.page,
          limit: pagination.limit,
          sortBy: sortBy === 'name' ? 'name' : sortBy === 'number' ? 'enamelNumber' : 'price',
          sortOrder: sortBy === 'price-high' ? 'desc' : 'asc'
        };
        
        if (selectedType !== 'all') {
          filters.type = selectedType.toUpperCase() as 'TRANSPARENT' | 'OPAQUE' | 'OPALE';
        }
        
        if (searchTerm) {
          filters.search = searchTerm;
        }
        
        const response = await productApi.getProducts(filters);
        setProducts(response.products);
        setPagination(response.pagination);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load products');
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchTerm, selectedType, sortBy, pagination.page]);

  // Filter products locally for additional filters not supported by API
  const filteredProducts = products.filter(product => {
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
    return matchesPrice;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">{t('products.title')}</h1>
        <p className="text-gray-600 text-lg">
          {t('products.subtitle')}
        </p>
      </div>

      {/* Search and Controls */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder={t('products.search')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-800 focus:border-transparent"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>

          {/* Sort */}
          <div className="flex gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-800"
            >
            <option value="name">{t('products.sortByName')}</option>
            <option value="number">{t('products.sortByNumber')}</option>
            <option value="price-low">{t('products.sortByPriceLow')}</option>
            <option value="price-high">{t('products.sortByPriceHigh')}</option>
            </select>

            {/* View Mode */}
            <div className="flex border border-gray-300 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-3 ${viewMode === 'grid' ? 'bg-red-800 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
              >
                <Grid className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-3 ${viewMode === 'list' ? 'bg-red-800 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
              >
                <List className="h-5 w-5" />
              </button>
            </div>

            {/* Filter Toggle (Mobile) */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center gap-2"
            >
              <Filter className="h-5 w-5" />
              {t('products.filters')}
            </button>
          </div>
        </div>
      </div>

      <div className="flex gap-8">
        {/* Filters Sidebar */}
        <div className={`${showFilters ? 'block' : 'hidden'} lg:block w-full lg:w-64 shrink-0`}>
          <ProductFilter
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            selectedType={selectedType}
            setSelectedType={setSelectedType}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
          />
        </div>

        {/* Products */}
        <div className="flex-1">
          <div className="mb-4 flex justify-between items-center">
            <p className="text-gray-600">
              {loading ? 'Loading...' : `${t('products.showing')} ${filteredProducts.length} ${t('products.of')} ${pagination.total} ${t('products.products')}`}
            </p>
          </div>

          {error ? (
            <div className="text-center py-12">
              <p className="text-red-500 text-lg mb-4">Error: {error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-red-800 text-white rounded-lg hover:bg-red-900"
              >
                Retry
              </button>
            </div>
          ) : loading ? (
            <div className="text-center py-12">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-red-800" />
              <p className="text-gray-500">Loading products...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">{t('products.noResults')}</p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                  setSelectedType('all');
                  setPriceRange([0, 100]);
                }}
                className="mt-4 text-red-800 hover:text-red-900 font-medium"
              >
                {t('products.clearFilters')}
              </button>
            </div>
          ) : (
            <div className="space-y-12">
              {/* Group products by type */}
              {['TRANSPARENT', 'OPAQUE', 'OPALE'].map(type => {
                const typeProducts = filteredProducts.filter(p => p.type === type);
                if (typeProducts.length === 0) return null;

                const typeInfo = {
                  TRANSPARENT: {
                    title: 'Transparent Enamels',
                    description: 'Crystal clear enamels perfect for layering and depth effects',
                    icon: '💎',
                    color: 'from-blue-500 to-cyan-500'
                  },
                  OPAQUE: {
                    title: 'Opaque Enamels', 
                    description: 'Rich, solid colors with excellent coverage and vibrancy',
                    icon: '🎨',
                    color: 'from-purple-500 to-pink-500'
                  },
                  OPALE: {
                    title: 'Opale Enamels',
                    description: 'Lustrous opalescent effects with unique shimmer properties', 
                    icon: '✨',
                    color: 'from-amber-500 to-orange-500'
                  }
                };

                return (
                  <div key={type} className="space-y-6">
                    {/* Section Header */}
                    <div className="relative">
                      <div className={`bg-gradient-to-r ${typeInfo[type as keyof typeof typeInfo].color} rounded-2xl p-8 text-white`}>
                        <div className="flex items-center gap-4 mb-4">
                          <span className="text-4xl">{typeInfo[type as keyof typeof typeInfo].icon}</span>
                          <div>
                            <h2 className="text-3xl font-bold">{typeInfo[type as keyof typeof typeInfo].title}</h2>
                            <p className="text-white/90 text-lg">{typeInfo[type as keyof typeof typeInfo].description}</p>
                          </div>
                        </div>
                        <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 inline-block">
                          <span className="font-semibold">{typeProducts.length} colors available</span>
                        </div>
                      </div>
                    </div>

                    {/* Products Grid */}
                    <div className={`${
                      viewMode === 'grid' 
                        ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6' 
                        : 'space-y-6'
                    }`}>
                      {typeProducts.map(product => (
                        <ProductCard 
                          key={product.id} 
                          product={{
                            ...product,
                            type: product.type.toLowerCase() as 'transparent' | 'opaque' | 'opale',
                            description: product.description || `${product.type.toLowerCase()} enamel color`,
                            colorCode: product.colorCode || product.enamelNumber,
                            specifications: product.specifications || {
                              firingTemp: '800-850°C',
                              mesh: '80-200',
                              weight: ['25g', '100g']
                            }
                          }} 
                          viewMode={viewMode}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;