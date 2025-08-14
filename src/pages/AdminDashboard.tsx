import React, { useState } from 'react';
import { BarChart3, Package, Users, DollarSign, Edit3, Trash2, Plus, Settings, Globe, Upload, Image as ImageIcon, FileText, Save, X } from 'lucide-react';
import { mockProducts, Product } from '../data/mockProducts';
import { useLanguage } from '../contexts/LanguageContext';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [products, setProducts] = useState(mockProducts);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingTranslations, setEditingTranslations] = useState<Record<string, string>>({});
  const [showAddProduct, setShowAddProduct] = useState(false);
  const { currentLanguage, setLanguage, t } = useLanguage();

  const updateProductPrice = (id: string, newPrice: number) => {
    setProducts(prev => 
      prev.map(product => 
        product.id === id ? { ...product, price: newPrice } : product
      )
    );
  };

  const deleteProduct = (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      setProducts(prev => prev.filter(product => product.id !== id));
    }
  };

  const saveProduct = (product: Product) => {
    if (editingProduct) {
      setProducts(prev => prev.map(p => p.id === product.id ? product : p));
    } else {
      setProducts(prev => [...prev, { ...product, id: `new-${Date.now()}` }]);
    }
    setEditingProduct(null);
    setShowAddProduct(false);
  };

  const stats = {
    totalRevenue: 2450.50,
    totalOrders: 42,
    totalCustomers: 28,
    totalProducts: products.length
  };

  const sampleTranslationKeys = [
    'header.title',
    'header.subtitle', 
    'home.hero.title',
    'home.hero.subtitle',
    'products.title',
    'products.subtitle'
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">Current Language: {currentLanguage.toUpperCase()}</span>
          <button
            onClick={() => setLanguage(currentLanguage === 'en' ? 'ka' : 'en')}
            className="bg-red-800 text-white px-3 py-1 rounded text-sm"
          >
            Switch to {currentLanguage === 'en' ? 'Georgian' : 'English'}
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <nav className="space-y-2">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full text-left px-4 py-2 rounded-lg flex items-center gap-3 transition-colors ${
                activeTab === 'overview' 
                  ? 'bg-red-800 text-white' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <BarChart3 className="h-5 w-5" />
              Overview
            </button>
            <button
              onClick={() => setActiveTab('products')}
              className={`w-full text-left px-4 py-2 rounded-lg flex items-center gap-3 transition-colors ${
                activeTab === 'products' 
                  ? 'bg-red-800 text-white' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Package className="h-5 w-5" />
              Products
            </button>
            <button
              onClick={() => setActiveTab('translations')}
              className={`w-full text-left px-4 py-2 rounded-lg flex items-center gap-3 transition-colors ${
                activeTab === 'translations' 
                  ? 'bg-red-800 text-white' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Globe className="h-5 w-5" />
              Translations
            </button>
            <button
              onClick={() => setActiveTab('images')}
              className={`w-full text-left px-4 py-2 rounded-lg flex items-center gap-3 transition-colors ${
                activeTab === 'images' 
                  ? 'bg-red-800 text-white' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <ImageIcon className="h-5 w-5" />
              Images
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full text-left px-4 py-2 rounded-lg flex items-center gap-3 transition-colors ${
                activeTab === 'orders' 
                  ? 'bg-red-800 text-white' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <DollarSign className="h-5 w-5" />
              Orders
            </button>
            <button
              onClick={() => setActiveTab('customers')}
              className={`w-full text-left px-4 py-2 rounded-lg flex items-center gap-3 transition-colors ${
                activeTab === 'customers' 
                  ? 'bg-red-800 text-white' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Users className="h-5 w-5" />
              Customers
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full text-left px-4 py-2 rounded-lg flex items-center gap-3 transition-colors ${
                activeTab === 'settings' 
                  ? 'bg-red-800 text-white' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Settings className="h-5 w-5" />
              Settings
            </button>
          </nav>
        </div>
        
        {/* Main Content */}
        <div className="lg:col-span-3">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <div className="flex items-center">
                    <DollarSign className="h-8 w-8 text-green-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">Total Revenue</p>
                      <p className="text-2xl font-bold text-gray-900">₾{stats.totalRevenue}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <div className="flex items-center">
                    <Package className="h-8 w-8 text-blue-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">Total Orders</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <div className="flex items-center">
                    <Users className="h-8 w-8 text-purple-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">Customers</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.totalCustomers}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <div className="flex items-center">
                    <BarChart3 className="h-8 w-8 text-red-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">Products</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.totalProducts}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Recent Activity */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Activity</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b border-gray-200">
                    <div>
                      <p className="font-medium text-gray-900">New order #ORD-003</p>
                      <p className="text-sm text-gray-500">Customer ordered Rouge Bordeaux T</p>
                    </div>
                    <span className="text-sm text-gray-500">2 hours ago</span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-gray-200">
                    <div>
                      <p className="font-medium text-gray-900">Low stock alert</p>
                      <p className="text-sm text-gray-500">Or Metallic - Only 6 units remaining</p>
                    </div>
                    <span className="text-sm text-gray-500">4 hours ago</span>
                  </div>
                  <div className="flex items-center justify-between py-3">
                    <div>
                      <p className="font-medium text-gray-900">New customer registered</p>
                      <p className="text-sm text-gray-500">John Doe from Tbilisi</p>
                    </div>
                    <span className="text-sm text-gray-500">1 day ago</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'products' && (
            <div className="space-y-6">
              {/* Add/Edit Product Modal */}
              {(editingProduct || showAddProduct) && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-96 overflow-y-auto">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold">
                        {editingProduct ? 'Edit Product' : 'Add New Product'}
                      </h3>
                      <button
                        onClick={() => {
                          setEditingProduct(null);
                          setShowAddProduct(false);
                        }}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <X className="h-6 w-6" />
                      </button>
                    </div>
                    
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        const formData = new FormData(e.currentTarget);
                        const product: Product = {
                          id: editingProduct?.id || `new-${Date.now()}`,
                          name: formData.get('name') as string,
                          description: formData.get('description') as string,
                          price: parseFloat(formData.get('price') as string),
                          colorCode: formData.get('colorCode') as string,
                          category: formData.get('category') as string,
                          type: formData.get('type') as 'transparent' | 'opaque' | 'opale',
                          image: formData.get('image') as string,
                          inStock: true,
                          quantity: parseInt(formData.get('quantity') as string),
                          enamelNumber: formData.get('enamelNumber') as string,
                          specifications: {
                            firingTemp: formData.get('firingTemp') as string,
                            mesh: formData.get('mesh') as string,
                            weight: (formData.get('weights') as string).split(',').map(w => w.trim())
                          }
                        };
                        saveProduct(product);
                      }}
                      className="space-y-4"
                    >
                      <div className="grid grid-cols-2 gap-4">
                        <input
                          name="name"
                          placeholder="Product Name"
                          defaultValue={editingProduct?.name || ''}
                          className="px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-red-800"
                          required
                        />
                        <input
                          name="enamelNumber"
                          placeholder="Enamel Number (e.g., T-1045)"
                          defaultValue={editingProduct?.enamelNumber || ''}
                          className="px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-red-800"
                          required
                        />
                        <input
                          name="price"
                          type="number"
                          step="0.01"
                          placeholder="Price"
                          defaultValue={editingProduct?.price || ''}
                          className="px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-red-800"
                          required
                        />
                        <input
                          name="quantity"
                          type="number"
                          placeholder="Quantity"
                          defaultValue={editingProduct?.quantity || ''}
                          className="px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-red-800"
                          required
                        />
                        <input
                          name="colorCode"
                          placeholder="Color Code (e.g., #FF0000)"
                          defaultValue={editingProduct?.colorCode || ''}
                          className="px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-red-800"
                          required
                        />
                        <select
                          name="type"
                          defaultValue={editingProduct?.type || 'transparent'}
                          className="px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-red-800"
                          required
                        >
                          <option value="transparent">Transparent</option>
                          <option value="opaque">Opaque</option>
                          <option value="opale">Opale</option>
                        </select>
                        <input
                          name="category"
                          placeholder="Category (e.g., red, blue)"
                          defaultValue={editingProduct?.category || ''}
                          className="px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-red-800"
                          required
                        />
                        <input
                          name="image"
                          placeholder="Image filename (e.g., 1045.jpg)"
                          defaultValue={editingProduct?.image || ''}
                          className="px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-red-800"
                          required
                        />
                        <input
                          name="firingTemp"
                          placeholder="Firing Temp (e.g., 780-820°C)"
                          defaultValue={editingProduct?.specifications.firingTemp || '780-820°C'}
                          className="px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-red-800"
                          required
                        />
                        <input
                          name="weights"
                          placeholder="Weights (e.g., 25g, 100g, 250g)"
                          defaultValue={editingProduct?.specifications.weight.join(', ') || '25g, 100g'}
                          className="px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-red-800"
                          required
                        />
                      </div>
                      <textarea
                        name="description"
                        placeholder="Product Description"
                        defaultValue={editingProduct?.description || ''}
                        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-red-800"
                        rows={3}
                        required
                      />
                      <div className="flex gap-2">
                        <button
                          type="submit"
                          className="bg-red-800 text-white px-4 py-2 rounded hover:bg-red-900"
                        >
                          <Save className="h-4 w-4 inline mr-2" />
                          Save Product
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setEditingProduct(null);
                            setShowAddProduct(false);
                          }}
                          className="border border-gray-300 px-4 py-2 rounded hover:bg-gray-50"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              <div className="bg-white rounded-lg shadow-sm border">
                <div className="p-6 border-b flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-gray-900">Product Management</h2>
                  <button 
                    onClick={() => setShowAddProduct(true)}
                    className="bg-red-800 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-900 transition-colors flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Add Product
                  </button>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Product
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Category
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Price
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Stock
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {products.slice(0, 15).map(product => (
                        <tr key={product.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div 
                                className="w-10 h-10 rounded-lg mr-3"
                                style={{ backgroundColor: product.colorCode }}
                              />
                              <div>
                                <div className="text-sm font-medium text-gray-900">{product.name}</div>
                                <div className="text-sm text-gray-500">{product.enamelNumber} - {product.type}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {product.category}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <input
                              type="number"
                              value={product.price}
                              onChange={(e) => updateProductPrice(product.id, parseFloat(e.target.value) || 0)}
                              className="w-20 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-red-800"
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              product.quantity > 10 
                                ? 'bg-green-100 text-green-800' 
                                : product.quantity > 5 
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {product.quantity} units
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex gap-2">
                              <button 
                                onClick={() => setEditingProduct(product)}
                                className="text-red-800 hover:text-red-900"
                              >
                                <Edit3 className="h-4 w-4" />
                              </button>
                              <button 
                                onClick={() => deleteProduct(product.id)}
                                className="text-red-600 hover:text-red-800"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'translations' && (
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Translation Management</h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => setLanguage('en')}
                    className={`px-3 py-1 rounded ${currentLanguage === 'en' ? 'bg-red-800 text-white' : 'bg-gray-200'}`}
                  >
                    English
                  </button>
                  <button
                    onClick={() => setLanguage('ka')}
                    className={`px-3 py-1 rounded ${currentLanguage === 'ka' ? 'bg-red-800 text-white' : 'bg-gray-200'}`}
                  >
                    Georgian
                  </button>
                </div>
              </div>
              
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  Currently editing: <strong>{currentLanguage === 'en' ? 'English' : 'Georgian'}</strong> translations
                </p>
                
                {sampleTranslationKeys.map(key => (
                  <div key={key} className="border rounded-lg p-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {key}
                    </label>
                    <div className="grid grid-cols-1 gap-2">
                      <div>
                        <span className="text-xs text-gray-500">Current: </span>
                        <span className="text-sm">{t(key)}</span>
                      </div>
                      <input
                        type="text"
                        placeholder={`Edit ${currentLanguage === 'en' ? 'English' : 'Georgian'} translation...`}
                        value={editingTranslations[key] || ''}
                        onChange={(e) => setEditingTranslations(prev => ({ ...prev, [key]: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-800"
                      />
                    </div>
                  </div>
                ))}
                
                <button className="bg-red-800 text-white px-4 py-2 rounded hover:bg-red-900">
                  <Save className="h-4 w-4 inline mr-2" />
                  Save Translations
                </button>
              </div>
            </div>
          )}
          
          {activeTab === 'images' && (
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Image Management</h2>
              
              <div className="space-y-6">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-lg font-medium text-gray-900 mb-2">Upload Enamel Images</p>
                  <p className="text-gray-600 mb-4">
                    Drag and drop images here, or click to browse
                  </p>
                  <button className="bg-red-800 text-white px-4 py-2 rounded hover:bg-red-900">
                    Choose Files
                  </button>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Image Directory Structure</h3>
                  <div className="bg-gray-50 rounded-lg p-4 font-mono text-sm">
                    <div>/public/transparent_colors/</div>
                    <div className="ml-4 text-gray-600">
                      ├── 1.jpg (T-1)<br/>
                      ├── 2.jpg (T-2)<br/>
                      ├── 1045.jpg (T-1045)<br/>
                      └── cr_34.jpg (T-CR_34)
                    </div>
                    <div>/public/opale_colors/</div>
                    <div className="ml-4 text-gray-600">
                      ├── 8.jpg (OP-8)<br/>
                      └── 6B10B.jpg (OP-6B10B)
                    </div>
                    <div>/public/opaques/</div>
                    <div className="ml-4 text-gray-600">
                      ├── 62.jpg (O-62)<br/>
                      └── 68.jpg (O-68)
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'orders' && (
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Management</h2>
              <p className="text-gray-600">Order management features coming soon...</p>
            </div>
          )}
          
          {activeTab === 'customers' && (
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Customer Management</h2>
              <p className="text-gray-600">Customer management features coming soon...</p>
            </div>
          )}
          
          {activeTab === 'settings' && (
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Website Settings</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">General Settings</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Site Name (English)
                      </label>
                      <input
                        type="text"
                        defaultValue="Émaux Georgia"
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-800"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Site Name (Georgian)
                      </label>
                      <input
                        type="text"
                        defaultValue="ემოხი საქართველო"
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-800"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Currency Symbol
                      </label>
                      <input
                        type="text"
                        defaultValue="₾"
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-800"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Default Language
                      </label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-800">
                        <option value="en">English</option>
                        <option value="ka">Georgian</option>
                      </select>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="email"
                      placeholder="Email"
                      defaultValue="info@emauxgeorgia.ge"
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-800"
                    />
                    <input
                      type="tel"
                      placeholder="Phone"
                      defaultValue="+995 555 123 456"
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-800"
                    />
                    <input
                      type="text"
                      placeholder="Address"
                      defaultValue="Tbilisi, Georgia"
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-800"
                    />
                  </div>
                </div>
                
                <button className="bg-red-800 text-white px-6 py-2 rounded hover:bg-red-900">
                  <Save className="h-4 w-4 inline mr-2" />
                  Save Settings
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;