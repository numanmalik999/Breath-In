import { useState, useEffect } from 'react';
import { Save, Globe, Mail, Shield, Bell, CreditCard, Loader2, Truck } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';

const Settings = () => {
  const { settings, loading: settingsLoading, updateSetting } = useSettings();
  const [activeSection, setActiveSection] = useState('general');
  const [announcementText, setAnnouncementText] = useState('');
  const [shippingSettings, setShippingSettings] = useState({
    threshold: '2500',
    punjab: '200',
    other: '300',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  useEffect(() => {
    if (settings) {
      setAnnouncementText(settings.announcement_text || '');
      setShippingSettings({
        threshold: settings.shipping_free_threshold || '2500',
        punjab: settings.shipping_cost_punjab || '200',
        other: settings.shipping_cost_other || '300',
      });
    }
  }, [settings]);

  const handleSaveChanges = async () => {
    setIsSaving(true);
    setSaveMessage('');
    try {
      await Promise.all([
        updateSetting('announcement_text', announcementText),
        updateSetting('shipping_free_threshold', shippingSettings.threshold),
        updateSetting('shipping_cost_punjab', shippingSettings.punjab),
        updateSetting('shipping_cost_other', shippingSettings.other),
      ]);
      setSaveMessage('Settings saved successfully!');
    } catch (error) {
      setSaveMessage('Error saving settings.');
    }
    setIsSaving(false);
    setTimeout(() => setSaveMessage(''), 3000);
  };

  const sections = [
    { id: 'general', label: 'General', icon: Globe },
    { id: 'shipping', label: 'Shipping', icon: Truck },
    { id: 'email', label: 'Email', icon: Mail },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'payments', label: 'Payments', icon: CreditCard },
  ];

  const renderShippingSettings = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Free Shipping Threshold
        </label>
        <input
          type="number"
          value={shippingSettings.threshold}
          onChange={(e) => setShippingSettings(prev => ({ ...prev, threshold: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          placeholder="e.g., 2500"
        />
        <p className="text-xs text-gray-500 mt-1">Orders above this amount will have free shipping.</p>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Shipping Cost (Punjab)
          </label>
          <input
            type="number"
            value={shippingSettings.punjab}
            onChange={(e) => setShippingSettings(prev => ({ ...prev, punjab: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            placeholder="e.g., 200"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Shipping Cost (Other Provinces)
          </label>
          <input
            type="number"
            value={shippingSettings.other}
            onChange={(e) => setShippingSettings(prev => ({ ...prev, other: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            placeholder="e.g., 300"
          />
        </div>
      </div>
    </div>
  );

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Announcement Bar Text
        </label>
        <input
          type="text"
          value={announcementText}
          onChange={(e) => setAnnouncementText(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sageGreen focus:border-transparent"
          disabled={settingsLoading}
        />
      </div>
      {/* ... other general settings ... */}
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'general':
        return renderGeneralSettings();
      case 'shipping':
        return renderShippingSettings();
      // ... other cases
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
            
            <div className="mt-6 pt-6 border-t border-gray-200 flex items-center space-x-4">
              <button 
                onClick={handleSaveChanges}
                disabled={isSaving}
                className="bg-sageGreen text-white px-6 py-2 rounded-lg hover:bg-opacity-90 transition-colors duration-200 flex items-center space-x-2 disabled:bg-opacity-50"
              >
                {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
              </button>
              {saveMessage && <p className="text-sm text-gray-600">{saveMessage}</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;