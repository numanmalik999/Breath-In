import { useState, useEffect } from 'react';
import { Save, Globe, Shield, Bell, CreditCard, Loader2, Truck, UploadCloud, Trash2, LayoutTemplate, Info, Mail, Package, FileText } from 'lucide-react';
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
  const [shippingSettings, setShippingSettings] = useState({ threshold: '1499', punjab: '200', other: '300' });
  const [whatsappSettings, setWhatsappSettings] = useState({ number: '', templateName: '' });
  const [whatsappContactNumber, setWhatsappContactNumber] = useState('');
  
  // Page Content States
  const [homepageContent, setHomepageContent] = useState({ heroTitle: '', heroSubtitle: '', howToTitle: '', howToSubtitle: '', videoUrl: '', benefitsTitle: '' });
  const [aboutPageContent, setAboutPageContent] = useState({ title: '', subtitle: '', storyText1: '', storyText2: '' });
  const [contactPageContent, setContactPageContent] = useState({ title: '', subtitle: '' });
  const [shippingPageContent, setShippingPageContent] = useState({ title: '', subtitle: '', processingText: '', ratesText: '', returnsText: '' });
  const [trackOrderPageContent, setTrackOrderPageContent] = useState({ title: '', subtitle: '' });

  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  useEffect(() => {
    if (settings) {
      // General Settings
      setAnnouncementText(settings.announcement_text || '');
      setSiteInfo({ name: settings.store_name || 'Breathin', logoUrl: settings.store_logo_url || '', description: settings.store_description || '' });
      setContactInfo({ email: settings.contact_email || '', phone: settings.contact_phone || '', address: settings.contact_address || '' });
      setEmailSettings({ admin: settings.admin_notification_email || '', sender: settings.sender_email || '' });
      setShippingSettings({ threshold: settings.shipping_free_threshold || '1499', punjab: settings.shipping_cost_punjab || '200', other: settings.shipping_cost_other || '300' });
      setWhatsappSettings({ number: settings.admin_whatsapp_number || '', templateName: settings.whatsapp_template_name || 'new_order_admin_notification' });
      setWhatsappContactNumber(settings.whatsapp_contact_number || '');
      
      // Page Content
      setHomepageContent({
        heroTitle: settings.homepage_hero_title || "The Last Nasal Strip You'll Ever Need.",
        heroSubtitle: settings.homepage_hero_subtitle || "Experience instant, drug-free relief from nasal congestion and snoring with our revolutionary magnetic strips. Breathe freely all night, every night.",
        howToTitle: settings.homepage_howto_title || "How To Use Breathin",
        howToSubtitle: settings.homepage_howto_subtitle || "Traditional nasal strips use sticky, irritating adhesives. Breathin uses a revolutionary magnetic system that's comfortable, reusable, and more effective. Watch the video to see it in action.",
        videoUrl: settings.homepage_video_url || "https://www.youtube.com/embed/wzYSozVzZrM?si=RQ1Y2-VwJepyu0ih",
        benefitsTitle: settings.homepage_benefits_title || "Breathe Easy, Live Better.",
      });
      setAboutPageContent({
        title: settings.about_page_title || "About Breathin",
        subtitle: settings.about_page_subtitle || "We believe that better breathing leads to a better life. Discover the story and the mission behind our innovative wellness solutions.",
        storyText1: settings.about_page_story_p1 || "At Breathin, we started with a simple observation: the quality of our breath has a profound impact on our overall well-being, especially our sleep. Frustrated by the lack of comfortable and effective solutions for nasal congestion, we set out to create something revolutionary.",
        storyText2: settings.about_page_story_p2 || "Our journey led us to develop innovative magnetic nasal strips that gently open nasal passages without harsh adhesives or discomfort. It’s a simple idea powered by smart technology, designed to help you experience the transformative difference that effortless breathing can make.",
      });
      setContactPageContent({
        title: settings.contact_page_title || "Get in Touch",
        subtitle: settings.contact_page_subtitle || "We'd love to hear from you! Whether you have a question about our products, need assistance, or just want to say hello, please feel free to reach out.",
      });
      setShippingPageContent({
        title: settings.shipping_page_title || "Shipping & Returns",
        subtitle: settings.shipping_page_subtitle || "Everything you need to know about our shipping process and how to make a return.",
        processingText: settings.shipping_processing_text || "Orders are processed within 1-2 business days. You will receive a notification when your order has shipped.",
        ratesText: settings.shipping_rates_text || "Shipping charges for your order will be calculated and displayed at checkout.",
        returnsText: settings.shipping_returns_text || "We have a 30-day return policy, which means you have 30 days after receiving your item to request a return.",
      });
      setTrackOrderPageContent({
        title: settings.track_order_page_title || "Track Your Order",
        subtitle: settings.track_order_page_subtitle || "Enter your tracking number below to see the status of your shipment.",
      });
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
      if (publicUrl) setSiteInfo(prev => ({ ...prev, logoUrl: publicUrl }));
    }
    setIsUploadingLogo(false);
  };

  const handleSaveChanges = async () => {
    setIsSaving(true);
    setSaveMessage('');
    try {
      await Promise.all([
        // General
        updateSetting('announcement_text', announcementText),
        updateSetting('store_name', siteInfo.name),
        updateSetting('store_logo_url', siteInfo.logoUrl),
        updateSetting('store_description', siteInfo.description),
        updateSetting('contact_email', contactInfo.email),
        updateSetting('contact_phone', contactInfo.phone),
        updateSetting('contact_address', contactInfo.address),
        updateSetting('whatsapp_contact_number', whatsappContactNumber),
        // Homepage
        updateSetting('homepage_hero_title', homepageContent.heroTitle),
        updateSetting('homepage_hero_subtitle', homepageContent.heroSubtitle),
        updateSetting('homepage_howto_title', homepageContent.howToTitle),
        updateSetting('homepage_howto_subtitle', homepageContent.howToSubtitle),
        updateSetting('homepage_video_url', homepageContent.videoUrl),
        updateSetting('homepage_benefits_title', homepageContent.benefitsTitle),
        // Other Pages
        updateSetting('about_page_title', aboutPageContent.title),
        updateSetting('about_page_subtitle', aboutPageContent.subtitle),
        updateSetting('about_page_story_p1', aboutPageContent.storyText1),
        updateSetting('about_page_story_p2', aboutPageContent.storyText2),
        updateSetting('contact_page_title', contactPageContent.title),
        updateSetting('contact_page_subtitle', contactPageContent.subtitle),
        updateSetting('shipping_page_title', shippingPageContent.title),
        updateSetting('shipping_page_subtitle', shippingPageContent.subtitle),
        updateSetting('shipping_processing_text', shippingPageContent.processingText),
        updateSetting('shipping_rates_text', shippingPageContent.ratesText),
        updateSetting('shipping_returns_text', shippingPageContent.returnsText),
        updateSetting('track_order_page_title', trackOrderPageContent.title),
        updateSetting('track_order_page_subtitle', trackOrderPageContent.subtitle),
        // Shipping & Notifications
        updateSetting('shipping_free_threshold', shippingSettings.threshold),
        updateSetting('shipping_cost_punjab', shippingSettings.punjab),
        updateSetting('shipping_cost_other', shippingSettings.other),
        updateSetting('admin_notification_email', emailSettings.admin),
        updateSetting('sender_email', emailSettings.sender),
        updateSetting('admin_whatsapp_number', whatsappSettings.number),
        updateSetting('whatsapp_template_name', whatsappSettings.templateName),
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
    { id: 'homepage', label: 'Homepage', icon: LayoutTemplate },
    { id: 'about', label: 'About Page', icon: Info },
    { id: 'contact', label: 'Contact Page', icon: Mail },
    { id: 'shipping_returns', label: 'Shipping/Returns Page', icon: FileText },
    { id: 'track_order', label: 'Track Order Page', icon: Package },
    { id: 'shipping_rates', label: 'Shipping Rates', icon: Truck },
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

  const renderHomepageSettings = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">Hero Section</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
          <input type="text" value={homepageContent.heroTitle} onChange={(e) => setHomepageContent(prev => ({ ...prev, heroTitle: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
          <textarea value={homepageContent.heroSubtitle} onChange={(e) => setHomepageContent(prev => ({ ...prev, heroSubtitle: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg" rows={3}></textarea>
        </div>
      </div>
      <div className="pt-6 border-t">
        <h3 className="text-lg font-medium text-gray-900">"How To Use" Section</h3>
        <div className="mt-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
            <input type="text" value={homepageContent.howToTitle} onChange={(e) => setHomepageContent(prev => ({ ...prev, howToTitle: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
            <textarea value={homepageContent.howToSubtitle} onChange={(e) => setHomepageContent(prev => ({ ...prev, howToSubtitle: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg" rows={3}></textarea>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">YouTube Video URL</label>
            <input type="text" value={homepageContent.videoUrl} onChange={(e) => setHomepageContent(prev => ({ ...prev, videoUrl: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
          </div>
        </div>
      </div>
      <div className="pt-6 border-t">
        <h3 className="text-lg font-medium text-gray-900">Benefits Section</h3>
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
          <input type="text" value={homepageContent.benefitsTitle} onChange={(e) => setHomepageContent(prev => ({ ...prev, benefitsTitle: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
        </div>
      </div>
    </div>
  );

  const renderAboutPageSettings = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">Header</h3>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
        <input type="text" value={aboutPageContent.title} onChange={(e) => setAboutPageContent(prev => ({ ...prev, title: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
        <textarea value={aboutPageContent.subtitle} onChange={(e) => setAboutPageContent(prev => ({ ...prev, subtitle: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg" rows={3}></textarea>
      </div>
      <div className="pt-6 border-t">
        <h3 className="text-lg font-medium text-gray-900">Our Story Section</h3>
        <div className="mt-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Paragraph 1</label>
            <textarea value={aboutPageContent.storyText1} onChange={(e) => setAboutPageContent(prev => ({ ...prev, storyText1: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg" rows={4}></textarea>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Paragraph 2</label>
            <textarea value={aboutPageContent.storyText2} onChange={(e) => setAboutPageContent(prev => ({ ...prev, storyText2: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg" rows={4}></textarea>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContactPageSettings = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">Header</h3>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
        <input type="text" value={contactPageContent.title} onChange={(e) => setContactPageContent(prev => ({ ...prev, title: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
        <textarea value={contactPageContent.subtitle} onChange={(e) => setContactPageContent(prev => ({ ...prev, subtitle: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg" rows={3}></textarea>
      </div>
    </div>
  );

  const renderShippingReturnsPageSettings = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">Header</h3>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
        <input type="text" value={shippingPageContent.title} onChange={(e) => setShippingPageContent(prev => ({ ...prev, title: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
        <textarea value={shippingPageContent.subtitle} onChange={(e) => setShippingPageContent(prev => ({ ...prev, subtitle: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg" rows={3}></textarea>
      </div>
      <div className="pt-6 border-t">
        <h3 className="text-lg font-medium text-gray-900">Shipping Policy</h3>
        <div className="mt-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Processing Time Text</label>
            <textarea value={shippingPageContent.processingText} onChange={(e) => setShippingPageContent(prev => ({ ...prev, processingText: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg" rows={2}></textarea>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Shipping Rates Text</label>
            <textarea value={shippingPageContent.ratesText} onChange={(e) => setShippingPageContent(prev => ({ ...prev, ratesText: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg" rows={2}></textarea>
          </div>
        </div>
      </div>
      <div className="pt-6 border-t">
        <h3 className="text-lg font-medium text-gray-900">Return Policy</h3>
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Main Return Policy Text</label>
          <textarea value={shippingPageContent.returnsText} onChange={(e) => setShippingPageContent(prev => ({ ...prev, returnsText: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg" rows={3}></textarea>
        </div>
      </div>
    </div>
  );

  const renderTrackOrderPageSettings = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">Header</h3>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
        <input type="text" value={trackOrderPageContent.title} onChange={(e) => setTrackOrderPageContent(prev => ({ ...prev, title: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
        <textarea value={trackOrderPageContent.subtitle} onChange={(e) => setTrackOrderPageContent(prev => ({ ...prev, subtitle: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg" rows={3}></textarea>
      </div>
    </div>
  );

  const renderShippingRatesSettings = () => (
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
      case 'homepage': return renderHomepageSettings();
      case 'about': return renderAboutPageSettings();
      case 'contact': return renderContactPageSettings();
      case 'shipping_returns': return renderShippingReturnsPageSettings();
      case 'track_order': return renderTrackOrderPageSettings();
      case 'shipping_rates': return renderShippingRatesSettings();
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