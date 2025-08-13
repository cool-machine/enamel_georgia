import React, { useState } from 'react';
import { BarChart3, Package, Users, DollarSign, Edit3, Trash2, Plus } from 'lucide-react';
import { mockProducts } from '../data/mockProducts';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [products, setProducts] = useState(mockProducts);

  const updateProductPrice = (id: string, newPrice: number) => {
    setProducts(prev => 
      prev.map(product => 
        product.id === id ? { ...product, price: newPrice } : product
      )
    );
  };

  const stats = {
    totalRevenue: 2450.50,
    totalOrders: 42,
    totalCustomers: 28,
    totalProducts: products.length
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <div className="text-sm text-gray-500">
          Welcome back, Admin
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
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6 border-b flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">Product Management</h2>
                <button className="bg-red-800 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-900 transition-colors flex items-center gap-2">
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
                    {products.slice(0, 10).map(product => (
                      <tr key={product.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div 
                              className="w-10 h-10 rounded-lg mr-3"
                              style={{ backgroundColor: product.colorCode }}
                            />
                            <div>
                              <div className="text-sm font-medium text-gray-900">{product.name}</div>
                              <div className="text-sm text-gray-500">{product.type}</div>
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
                            <button className="text-red-800 hover:text-red-900">
                              <Edit3 className="h-4 w-4" />
                            </button>
                            <button className="text-red-600 hover:text-red-800">
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
          )}
          
          {/* Orders and Customers tabs would be implemented similarly */}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;