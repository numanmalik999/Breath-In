import { useState } from 'react';
import { Save, Upload, Globe, Mail, Shield, Bell, CreditCard } from 'lucide-react';

const Settings = () => {
  const [activeSection, setActiveSection] = useState('general');

  const sections = [
    { id: 'general', label: 'General', icon: Globe },
    { id: 'email', label: 'Email', icon: Mail },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'payments', label: 'Payments', icon: CreditCard },
  ];

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Store Name
        </label>
        <input
          type="text"
          defaultValue="Breathin"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sageGreen focus:border-transparent"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Store Description
        </label>
        <textarea
          rows={3}
          defaultValue="Revolutionary magnetic nasal strips for better breathing and sleep quality."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sageGreen focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Store Logo
        </label>
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-sageGreen rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">B</span>
          </div>
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 flex items-center space-x-2">
            <Upload className="h-4 w-4" />
            <span>Upload New Logo</span>
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Contact Email
          </label>
          <input
            type="email"
            defaultValue="hello@breathin.store"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sageGreen focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number
          </label>
          <input
            type="tel"
            defaultValue="1-800-BREATHIN"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sageGreen focus:border-transparent"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Store Address
        </label>
        <textarea
          rows={2}
          defaultValue="San Francisco, CA"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sageGreen focus:border-transparent"
        />
      </div>
    </div>
  );

  const renderEmailSettings = () => (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            SMTP Host
          </label>
          <input
            type="text"
            placeholder="smtp.gmail.com"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sageGreen focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            SMTP Port
          </label>
          <input
            type="number"
            placeholder="587"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sageGreen focus:border-transparent"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Username
          </label>
          <input
            type="email"
            placeholder="your-email@gmail.com"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sageGreen focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Password
          </label>
          <input
            type="password"
            placeholder="••••••••"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sageGreen focus:border-transparent"
          />
        </div>
      </div>

      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-3">Email Templates</h4>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
            <span className="text-sm text-gray-900">Order Confirmation</span>
            <button className="text-sageGreen hover:text-opacity-80 text-sm font-medium">
              Edit Template
            </button>
          </div>
          <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
            <span className="text-sm text-gray-900">Shipping Notification</span>
            <button className="text-sageGreen hover:text-opacity-80 text-sm font-medium">
              Edit Template
            </button>
          </div>
          <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
            <span className="text-sm text-gray-900">Newsletter</span>
            <button className="text-sageGreen hover:text-opacity-80 text-sm font-medium">
              Edit Template
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'general':
        return renderGeneralSettings();
      case 'email':
        return renderEmailSettings();
      case 'security':
        return (
          <div className="space-y-6">
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Password Settings</h4>
              <div className="space-y-4">
                <input
                  type="password"
                  placeholder="Current Password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sageGreen focus:border-transparent"
                />
                <input
                  type="password"
                  placeholder="New Password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sageGreen focus:border-transparent"
                />
                <input
                  type="password"
                  placeholder="Confirm New Password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sageGreen focus:border-transparent"
                />
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Two-Factor Authentication</h4>
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-900">Enable 2FA</p>
                  <p className="text-xs text-gray-500">Add an extra layer of security to your account</p>
                </div>
                <button className="bg-sageGreen text-white px-4 py-2 rounded-lg text-sm hover:bg-opacity-90 transition-colors duration-200">
                  Enable
                </button>
              </div>
            </div>
          </div>
        );
      case 'notifications':
        return (
          <div className="space-y-6">
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Email Notifications</h4>
              <div className="space-y-3">
                {[
                  'New Orders',
                  'Low Stock Alerts',
                  'Customer Reviews',
                  'Weekly Reports',
                  'Security Alerts'
                ].map((notification) => (
                  <div key={notification} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <span className="text-sm text-gray-900">{notification}</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-sageGreen/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sageGreen"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case 'payments':
        return (
          <div className="space-y-6">
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Payment Methods</h4>
              <div className="space-y-3">
                {[
                  { name: 'Stripe', status: 'Connected', color: 'text-green-600' },
                  { name: 'PayPal', status: 'Not Connected', color: 'text-gray-500' },
                  { name: 'Apple Pay', status: 'Connected', color: 'text-green-600' },
                  { name: 'Google Pay', status: 'Not Connected', color: 'text-gray-500' }
                ].map((method) => (
                  <div key={method.name} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div>
                      <span className="text-sm font-medium text-gray-900">{method.name}</span>
                      <span className={`ml-2 text-xs ${method.color}`}>{method.status}</span>
                    </div>
                    <button className="text-sageGreen hover:text-opacity-80 text-sm font-medium">
                      {method.status === 'Connected' ? 'Configure' : 'Connect'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Currency Settings</h4>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sageGreen focus:border-transparent">
                <option value="USD">USD - US Dollar</option>
                <option value="EUR">EUR - Euro</option>
                <option value="GBP">GBP - British Pound</option>
                <option value="CAD">CAD - Canadian Dollar</option>
              </select>
            </div>
          </div>
        );
      default:
        return renderGeneralSettings();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
        <p className="text-gray-600">Manage your store configuration</p>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Settings Navigation */}
        <div className="lg:col-span-1">
          <nav className="space-y-1">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors duration-200 ${
                  activeSection === section.id
                    ? 'bg-sageGreen text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <section.icon className="h-4 w-4" />
                <span className="text-sm font-medium">{section.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg shadow-sm p-6">
            {renderContent()}
            
            <div className="mt-6 pt-6 border-t border-gray-200">
              <button className="bg-sageGreen text-white px-6 py-2 rounded-lg hover:bg-opacity-90 transition-colors duration-200 flex items-center space-x-2">
                <Save className="h-4 w-4" />
                <span>Save Changes</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;