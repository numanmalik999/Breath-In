import { useState, useEffect } from 'react';
import { Save, Globe, Shield, Bell, CreditCard, Loader2, Truck, UploadCloud, Trash2 } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import { supabase } from '../../integrations/supabase/client';
import PlaceholderContent from './PlaceholderContent';

const Settings = () => {
  const { settings, loading: settingsLoading, updateSetting } = useSettings();
  const [activeSection, setActiveSection] = useState('general');
  
  // State for all settings
  const [announcementText, setAnnouncementText] = useState('');
  const [siteInfo, setSiteInfo] = useState({ name: '', logoUrl: '', description: '' });
  const [contactInfo, setContactInfo] = useState({ email: '', phone: '', address: '' });
  const [emailSettings, setEmailSettings] = useState({ admin: '', sender: '' });
  const [shippingSettings, setShippingSettings] = useState({
    threshold: '2500',
    punjab: '200',
    other: '300',
  });
  const [whatsappSettings, setWhatsappSettings] = useState({ number: '', templateName: '' });
  const [whatsappContactNumber, setWhatsappContactNumber] = useState('');

  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  useEffect(() => {
    if (settings) {
      setAnnouncementText(settings.announcement_text || '');
      setSiteInfo({
        name: settings.store_name || 'Breathin',
        logoUrl: settings.store_logo_url || '',
        description: settings.store_description || '',
      });
      setContactInfo({
        email: settings.contact_email || '',
        phone: settings.contact_phone || '',
        address: settings.contact_address || '',
      });
      setEmailSettings({
        admin: settings.admin_notification_email || '',
        sender: settings.sender_email || '',
      });
      setShippingSettings({
        threshold: settings.shipping_free_threshold || '2500',
        punjab: settings.shipping_cost_punjab || '200',
        other: settings.shipping_cost_other || '300',
      });
      setWhatsappSettings({
        number: settings.admin_whatsapp_number || '',
        templateName: settings.whatsapp_template_name || 'new_order_admin_notification',
      });
      setWhatsappContactNumber(settings.whatsapp_contact_number || '');
    }
  }, [settings]);

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingLogo(true);
    const fileName = `public/logo/${Date.now()}-${file.name}`;
    const { data, error } = await supabase.storage.from('product-images').upload(fileName, file);
    
    if (error) {
      console.error('Error uploading logo:', error);
      setSaveMessage('Error uploading logo.');
    } else {
      const { data: { publicUrl } } = supabase.storage.from('product-images').getPublicUrl(data.path);
      if (publicUrl) {
        setSiteInfo(prev => ({ ...prev, logoUrl: publicUrl }));
      }
    }
    setIsUploadingLogo(false);
  };

  const handleSaveChanges = async () => {
    setIsSaving(true);
    setSaveMessage('');
    try {
      await Promise.all([
        updateSetting('announcement_text', announcementText),
        updateSetting('store_name', siteInfo.name),
        updateSetting('store_logo_url', siteInfo.logoUrl),
        updateSetting('store_description', siteInfo.description),
        updateSetting('contact_email', contactInfo.email),
        updateSetting('contact_phone', contactInfo.phone),
        updateSetting('contact_address', contactInfo.address),
        updateSetting('admin_notification_email', emailSettings.admin),
        updateSetting('sender_email', emailSettings.sender),
        updateSetting('shipping_free_threshold', shippingSettings.threshold),
        updateSetting('shipping_cost_punjab', shippingSettings.punjab),
        updateSetting('shipping_cost_other', shippingSettings.other),
        updateSetting('admin_whatsapp_number', whatsappSettings.number),
        updateSetting('whatsapp_template_name', whatsappSettings.templateName),
        updateSetting('whatsapp_contact_number', whatsappContactNumber),
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
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'payments', label: 'Payments', icon: CreditCard },
  ];

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">Site Information</h3>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Store Name</label>
        <input type="text" value={siteInfo.name} onChange={(e) => setSiteInfo(prev => ({ ...prev, name: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Store Description</label>
        <textarea value={siteInfo.description} onChange={(e) => setSiteInfo(prev => ({ ...prev, description: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg" rows={3}></textarea>
        <p className="text-xs text-gray-500 mt-1">This description is used for SEO and may be displayed on your site.</p>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Store Logo</label>
        {siteInfo.logoUrl ? (
          <div className="flex items-center space-x-4">
            <img src={siteInfo.logoUrl} alt="Store logo" className="h-16 w-auto bg-gray-100 p-2 rounded-lg" />
            <button onClick={() => setSiteInfo(prev => ({ ...prev, logoUrl: '' }))} className="text-red-600 hover:text-red-800 text-sm flex items-center space-x-1"><Trash2 className="h-4 w-4" /><span>Remove</span></button>
          </div>
        ) : (
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
            <div className="space-y-1 text-center">
              {isUploadingLogo ? <Loader2 className="mx-auto h-12 w-12 text-gray-400 animate-spin" /> : <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />}
              <div className="flex text-sm text-gray-600">
                <label htmlFor="logo-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-sageGreen hover:text-opacity-80">
                  <span>Upload a file</span>
                  <input id="logo-upload" name="logo-upload" type="file" className="sr-only" onChange={handleLogoUpload} accept="image/*" />
                </label>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="pt-6 border-t">
        <h3 className="text-lg font-medium text-gray-900">Public Contact Information</h3>
        <div className="mt-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Contact Email</label>
            <input type="email" value={contactInfo.email} onChange={(e) => setContactInfo(prev => ({ ...prev, email: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Contact Phone</label>
            <input type="text" value={contactInfo.phone} onChange={(e) => setContactInfo(prev => ({ ...prev, phone: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Contact Address</label>
            <input type="text" value={contactInfo.address} onChange={(e) => setContactInfo(prev => ({ ...prev, address: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
          </div>
        </div>
      </div>
      <div className="pt-6 border-t">
        <h3 className="text-lg font-medium text-gray-900">Announcement Bar</h3>
        <label className="block text-sm font-medium text-gray-700 mb-2 mt-4">Announcement Text</label>
        <input type="text" value={announcementText} onChange={(e) => setAnnouncementText(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg" disabled={settingsLoading} />
      </div>
      <div className="pt-6 border-t">
        <h3 className="text-lg font-medium text-gray-900">WhatsApp Button</h3>
        <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Public Contact Number</label>
            <input type="text" value={whatsappContactNumber} onChange={(e) => setWhatsappContactNumber(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="e.g., 923001234567" />
            <p className="text-xs text-gray-500 mt-1">This number is used for the floating WhatsApp button on your site. Include country code without '+' or '00'. Leave blank to hide the button.</p>
        </div>
      </div>
    </div>
  );

  const renderShippingSettings = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">Shipping Rates</h3>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Free Shipping Threshold</label>
        <input type="number" value={shippingSettings.threshold} onChange={(e) => setShippingSettings(prev => ({ ...prev, threshold: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
        <p className="text-xs text-gray-500 mt-1">Orders above this amount will have free shipping.</p>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Shipping Cost (Punjab)</label>
          <input type="number" value={shippingSettings.punjab} onChange={(e) => setShippingSettings(prev => ({ ...prev, punjab: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Shipping Cost (Other Provinces)</label>
          <input type="number" value={shippingSettings.other} onChange={(e) => setShippingSettings(prev => ({ ...prev, other: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
        </div>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">Email Notifications</h3>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Admin Notification Email</label>
        <input type="email" value={emailSettings.admin} onChange={(e) => setEmailSettings(prev => ({ ...prev, admin: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
        <p className="text-xs text-gray-500 mt-1">The email address that receives new order and contact form notifications.</p>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Sender Email</label>
        <input type="email" value={emailSettings.sender} onChange={(e) => setEmailSettings(prev => ({ ...prev, sender: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
        <p className="text-xs text-gray-500 mt-1">The "from" address for emails sent to customers. Must be a verified domain with your email provider (e.g., Resend).</p>
      </div>
      <div className="pt-6 border-t">
        <h3 className="text-lg font-medium text-gray-900">WhatsApp Notifications</h3>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 mt-4">Admin WhatsApp Number</label>
          <input type="text" value={whatsappSettings.number} onChange={(e) => setWhatsappSettings(prev => ({ ...prev, number: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="e.g., 923001234567" />
          <p className="text-xs text-gray-500 mt-1">The number that receives new order notifications. Include country code without '+' or '00'.</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 mt-4">WhatsApp Template Name</label>
          <input type="text" value={whatsappSettings.templateName} onChange={(e) => setWhatsappSettings(prev => ({ ...prev, templateName: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
          <p className="text-xs text-gray-500 mt-1">The exact name of the approved message template from Meta.</p>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'general': return renderGeneralSettings();
      case 'shipping': return renderShippingSettings();
      case 'notifications': return renderNotificationSettings();
      case 'security': return <PlaceholderContent title="Security Settings" message="This section is under development. Future options will include managing login providers and password policies." />;
      case 'payments': return <PlaceholderContent title="Payment Settings" message="This section is under development. Future options will allow you to integrate with payment gateways." />;
      default: return renderGeneralSettings();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
        <p className="text-gray-600">Manage your store configuration</p>
      </div>
      <div className="grid lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <nav className="space-y-1">
            {sections.map((section) => (
              <button key={section.id} onClick={() => setActiveSection(section.id)} className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors duration-200 ${activeSection === section.id ? 'bg-sageGreen text-white' : 'text-gray-700 hover:bg-gray-100'}`}>
                <section.icon className="h-4 w-4" />
                <span className="text-sm font-medium">{section.label}</span>
              </button>
            ))}
          </nav>
        </div>
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6">{renderContent()}</div>
            <div className="p-6 mt-6 border-t border-gray-200 flex items-center space-x-4 bg-gray-50 rounded-b-lg">
              <button onClick={handleSaveChanges} disabled={isSaving} className="bg-sageGreen text-white px-6 py-2 rounded-lg hover:bg-opacity-90 transition-colors duration-200 flex items-center space-x-2 disabled:bg-opacity-50">
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