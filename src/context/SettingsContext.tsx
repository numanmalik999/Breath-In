import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../integrations/supabase/client';

interface Settings {
  [key: string]: string;
}

interface SettingsContextType {
  settings: Settings | null;
  loading: boolean;
  updateSetting: (key: string, value: string) => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    const { data, error } = await supabase.from('settings').select('*');
    if (error) {
      console.error('Error fetching settings:', error);
      setSettings({});
    } else {
      const settingsMap = data.reduce((acc, setting) => {
        acc[setting.key] = setting.value;
        return acc;
      }, {} as Settings);
      setSettings(settingsMap);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const updateSetting = async (key: string, value: string) => {
    const { error } = await supabase
      .from('settings')
      .upsert({ key, value }, { onConflict: 'key' });
    
    if (error) {
      console.error(`Error updating setting ${key}:`, error);
      throw error;
    } else {
      await fetchSettings(); // Refetch to update state
    }
  };

  const value = { settings, loading, updateSetting };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}