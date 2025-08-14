import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Shield, Truck, Award } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const HomePage: React.FC = () => {
  const { t } = useLanguage();
  
  return (
    <div className="space-y-0">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-red-900 via-red-800 to-red-900 text-white">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="max-w-3xl">
            <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
              {t('home.hero.title')}
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-blue-100">
                {t('home.hero.subtitle')}
              </span>
            </h1>
            <p className="text-xl lg:text-2xl mb-8 text-gray-100 leading-relaxed">
              {t('home.hero.description')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/products"
                className="bg-white text-red-800 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors duration-200 flex items-center justify-center group"
              >
                {t('home.hero.shopButton')}
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/about"
                className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-red-800 transition-colors duration-200 flex items-center justify-center"
              >
                {t('home.hero.learnButton')}
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white"></div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              {t('home.features.title')}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('home.features.subtitle')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-red-800" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('home.features.quality.title')}</h3>
              <p className="text-gray-600">{t('home.features.quality.desc')}</p>
            </div>
            
            <div className="text-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="h-8 w-8 text-blue-800" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('home.features.delivery.title')}</h3>
              <p className="text-gray-600">{t('home.features.delivery.desc')}</p>
            </div>
            
            <div className="text-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-green-800" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('home.features.secure.title')}</h3>
              <p className="text-gray-600">{t('home.features.secure.desc')}</p>
            </div>
            
            <div className="text-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-purple-800" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('home.features.support.title')}</h3>
              <p className="text-gray-600">{t('home.features.support.desc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              {t('home.featured.title')}
            </h2>
            <p className="text-xl text-gray-600">
              {t('home.featured.subtitle')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Sample featured products */}
            <div className="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-200 overflow-hidden border">
              <div className="aspect-square bg-gradient-to-br from-red-600 to-red-800 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                <div className="absolute bottom-4 left-4 text-white">
                  <div className="text-xs font-medium opacity-90">TRANSPARENT</div>
                  <div className="text-lg font-bold">T-2006</div>
                </div>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">Rouge Cerise T-2006</h3>
                  <span className="text-lg font-bold text-red-800">₾48.00</span>
                </div>
                <p className="text-gray-600 text-sm mb-4">Cherry red transparent enamel with brilliant clarity and vibrant red tones.</p>
                <button className="w-full bg-red-800 text-white py-2 px-4 rounded-lg font-medium hover:bg-red-900 transition-colors">
                  {t('products.addToCart')}
                </button>
              </div>
            </div>

            <div className="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-200 overflow-hidden border">
              <div className="aspect-square bg-gradient-to-br from-blue-600 to-blue-800 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                <div className="absolute bottom-4 left-4 text-white">
                  <div className="text-xs font-medium opacity-90">OPAQUE</div>
                  <div className="text-lg font-bold">O-81</div>
                </div>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">Bleu Marine O-81</h3>
                  <span className="text-lg font-bold text-red-800">₾44.00</span>
                </div>
                <p className="text-gray-600 text-sm mb-4">Navy blue opaque enamel with deep, sophisticated blue tones.</p>
                <button className="w-full bg-red-800 text-white py-2 px-4 rounded-lg font-medium hover:bg-red-900 transition-colors">
                  {t('products.addToCart')}
                </button>
              </div>
            </div>

            <div className="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-200 overflow-hidden border">
              <div className="aspect-square bg-gradient-to-br from-pink-200 to-pink-300 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                <div className="absolute bottom-4 left-4 text-white">
                  <div className="text-xs font-medium opacity-90">OPALE</div>
                  <div className="text-lg font-bold">OP-104</div>
                </div>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">Opale Rose OP-104</h3>
                  <span className="text-lg font-bold text-red-800">₾55.00</span>
                </div>
                <p className="text-gray-600 text-sm mb-4">Rose opal enamel with delicate pink opalescent effects and subtle shimmer.</p>
                <button className="w-full bg-red-800 text-white py-2 px-4 rounded-lg font-medium hover:bg-red-900 transition-colors">
                  {t('products.addToCart')}
                </button>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <Link
              to="/products"
              className="inline-flex items-center bg-red-800 text-white px-8 py-3 rounded-lg font-semibold text-lg hover:bg-red-900 transition-colors group"
            >
              {t('home.featured.viewAll')}
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-red-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            {t('home.newsletter.title')}
          </h2>
          <p className="text-xl mb-8 text-red-100 max-w-2xl mx-auto">
            {t('home.newsletter.subtitle')}
          </p>
          <div className="max-w-md mx-auto flex flex-col sm:flex-row gap-4">
            <input
              type="email"
              placeholder={t('home.newsletter.placeholder')}
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <button className="bg-white text-red-800 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              {t('home.newsletter.subscribe')}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;