import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

interface ProductFilterProps {
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  selectedType: string;
  setSelectedType: (type: string) => void;
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
}

const ProductFilter: React.FC<ProductFilterProps> = ({
  selectedCategory,
  setSelectedCategory,
  selectedType,
  setSelectedType,
  priceRange,
  setPriceRange,
}) => {
  const { t } = useLanguage();

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('filters.title')}</h3>
      </div>

      {/* Category Filter */}
      <div>
        <h4 className="text-sm font-medium text-gray-900 mb-3">{t('filters.category')}</h4>
        <div className="space-y-2">
          {[
            { value: 'all', label: t('filters.allCategories') },
            { value: 'red', label: 'Rouge (Red)' },
            { value: 'blue', label: 'Bleu (Blue)' },
            { value: 'green', label: 'Vert (Green)' },
            { value: 'yellow', label: 'Jaune (Yellow)' },
            { value: 'violet', label: 'Violet (Purple)' },
            { value: 'orange', label: 'Orange' },
            { value: 'pink', label: 'Rose (Pink)' },
            { value: 'beige', label: 'Beige' },
            { value: 'gray', label: 'Gris (Gray)' },
            { value: 'black', label: 'Noir (Black)' },
            { value: 'white', label: 'Blanc (White)' },
          ].map(category => (
            <label key={category.value} className="flex items-center">
              <input
                type="radio"
                name="category"
                value={category.value}
                checked={selectedCategory === category.value}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="h-4 w-4 text-red-800 focus:ring-red-800 border-gray-300"
              />
              <span className="ml-2 text-sm text-gray-700">{category.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Type Filter */}
      <div>
        <h4 className="text-sm font-medium text-gray-900 mb-3">{t('filters.type')}</h4>
        <div className="space-y-2">
          {[
            { value: 'all', label: t('filters.allTypes') },
            { value: 'transparent', label: t('filters.transparent') },
            { value: 'opaque', label: t('filters.opaque') },
            { value: 'opale', label: t('filters.opale') },
          ].map(type => (
            <label key={type.value} className="flex items-center">
              <input
                type="radio"
                name="type"
                value={type.value}
                checked={selectedType === type.value}
                onChange={(e) => setSelectedType(e.target.value)}
                className="h-4 w-4 text-red-800 focus:ring-red-800 border-gray-300"
              />
              <span className="ml-2 text-sm text-gray-700">{type.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h4 className="text-sm font-medium text-gray-900 mb-3">{t('filters.priceRange')}</h4>
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <input
              type="number"
              min="0"
              max="80"
              value={priceRange[0]}
              onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])}
              className="w-20 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-red-800"
            />
            <span className="text-gray-500">{t('filters.to')}</span>
            <input
              type="number"
              min="0"
              max="80"
              value={priceRange[1]}
              onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || 100])}
              className="w-20 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-red-800"
            />
          </div>
          <input
            type="range"
            min="0"
            max="80"
            value={priceRange[1]}
            onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
            className="w-full accent-red-800"
          />
        </div>
      </div>

      {/* Clear Filters */}
      <button
        onClick={() => {
          setSelectedCategory('all');
          setSelectedType('all');
          setPriceRange([0, 80]);
        }}
        className="w-full text-red-800 hover:text-red-900 text-sm font-medium"
      >
        {t('filters.clearAll')}
      </button>
    </div>
  );
};

export default ProductFilter;