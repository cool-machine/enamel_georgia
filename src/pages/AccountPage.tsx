import React, { useState } from 'react';
import { User, Package, Settings, LogOut, Edit3 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const AccountPage: React.FC = () => {
  const { state: authState, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);

  if (!authState.user) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <p className="text-gray-600">Please log in to view your account.</p>
        </div>
      </div>
    );
  }

  const mockOrders = [
    {
      id: 'ORD-001',
      date: '2024-01-15',
      status: 'Delivered',
      total: 127.50,
      items: ['Rouge Bordeaux T (25g)', 'Bleu Royal O (100g)']
    },
    {
      id: 'ORD-002',
      date: '2024-01-10',
      status: 'Processing',
      total: 89.00,
      items: ['Argent Metallic (25g)', 'Blanc Opale O (25g)']
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Account</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <nav className="space-y-2">
            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full text-left px-4 py-2 rounded-lg flex items-center gap-3 transition-colors ${
                activeTab === 'profile' 
                  ? 'bg-red-800 text-white' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <User className="h-5 w-5" />
              Profile
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full text-left px-4 py-2 rounded-lg flex items-center gap-3 transition-colors ${
                activeTab === 'orders' 
                  ? 'bg-red-800 text-white' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Package className="h-5 w-5" />
              Orders
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
            <button
              onClick={logout}
              className="w-full text-left px-4 py-2 rounded-lg flex items-center gap-3 text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="h-5 w-5" />
              Sign Out
            </button>
          </nav>
        </div>
        
        {/* Main Content */}
        <div className="lg:col-span-3">
          {activeTab === 'profile' && (
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Profile Information</h2>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="flex items-center gap-2 text-red-800 hover:text-red-900"
                >
                  <Edit3 className="h-4 w-4" />
                  {isEditing ? 'Cancel' : 'Edit'}
                </button>
              </div>
              
              <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={authState.user.name}
                    disabled={!isEditing}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-lg ${
                      isEditing 
                        ? 'focus:outline-none focus:ring-2 focus:ring-red-800' 
                        : 'bg-gray-50 text-gray-600'
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={authState.user.email}
                    disabled={!isEditing}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-lg ${
                      isEditing 
                        ? 'focus:outline-none focus:ring-2 focus:ring-red-800' 
                        : 'bg-gray-50 text-gray-600'
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    placeholder="Enter phone number"
                    disabled={!isEditing}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-lg ${
                      isEditing 
                        ? 'focus:outline-none focus:ring-2 focus:ring-red-800' 
                        : 'bg-gray-50 text-gray-600'
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    placeholder="City, Country"
                    disabled={!isEditing}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-lg ${
                      isEditing 
                        ? 'focus:outline-none focus:ring-2 focus:ring-red-800' 
                        : 'bg-gray-50 text-gray-600'
                    }`}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address
                  </label>
                  <input
                    type="text"
                    placeholder="Full address"
                    disabled={!isEditing}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-lg ${
                      isEditing 
                        ? 'focus:outline-none focus:ring-2 focus:ring-red-800' 
                        : 'bg-gray-50 text-gray-600'
                    }`}
                  />
                </div>
                
                {isEditing && (
                  <div className="md:col-span-2 flex gap-4">
                    <button
                      type="submit"
                      className="bg-red-800 text-white px-6 py-2 rounded-lg font-medium hover:bg-red-900 transition-colors"
                    >
                      Save Changes
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </form>
            </div>
          )}
          
          {activeTab === 'orders' && (
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6 border-b">
                <h2 className="text-xl font-semibold text-gray-900">Order History</h2>
              </div>
              
              <div className="divide-y">
                {mockOrders.map(order => (
                  <div key={order.id} className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-semibold text-gray-900">Order {order.id}</h3>
                        <p className="text-gray-600 text-sm">Placed on {order.date}</p>
                      </div>
                      <div className="text-right">
                        <div className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                          order.status === 'Delivered' 
                            ? 'bg-green-100 text-green-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {order.status}
                        </div>
                        <div className="text-lg font-bold text-gray-900 mt-1">
                          ₾{order.total.toFixed(2)}
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      {order.items.map((item, index) => (
                        <p key={index} className="text-gray-600 text-sm">• {item}</p>
                      ))}
                    </div>
                    
                    <div className="flex gap-3 mt-4">
                      <button className="text-red-800 hover:text-red-900 text-sm font-medium">
                        View Details
                      </button>
                      <button className="text-gray-600 hover:text-gray-800 text-sm font-medium">
                        Track Order
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Account Settings</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Notifications</h3>
                    <div className="space-y-3">
                      <label className="flex items-center">
                        <input type="checkbox" defaultChecked className="h-4 w-4 text-red-800 focus:ring-red-800 border-gray-300 rounded" />
                        <span className="ml-2 text-gray-700">Email notifications for order updates</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" defaultChecked className="h-4 w-4 text-red-800 focus:ring-red-800 border-gray-300 rounded" />
                        <span className="ml-2 text-gray-700">Newsletter and product updates</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="h-4 w-4 text-red-800 focus:ring-red-800 border-gray-300 rounded" />
                        <span className="ml-2 text-gray-700">SMS notifications</span>
                      </label>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Privacy</h3>
                    <div className="space-y-3">
                      <label className="flex items-center">
                        <input type="checkbox" defaultChecked className="h-4 w-4 text-red-800 focus:ring-red-800 border-gray-300 rounded" />
                        <span className="ml-2 text-gray-700">Make my purchases private</span>
                      </label>
                      <label className="flex items-center">
                        <input type="checkbox" className="h-4 w-4 text-red-800 focus:ring-red-800 border-gray-300 rounded" />
                        <span className="ml-2 text-gray-700">Allow marketing communications</span>
                      </label>
                    </div>
                  </div>
                </div>
                
                <button className="bg-red-800 text-white px-6 py-2 rounded-lg font-medium hover:bg-red-900 transition-colors mt-6">
                  Save Settings
                </button>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Danger Zone</h2>
                <p className="text-gray-600 mb-4">
                  Once you delete your account, there is no going back. Please be certain.
                </p>
                <button className="bg-red-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors">
                  Delete Account
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AccountPage;