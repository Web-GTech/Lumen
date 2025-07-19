import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';

const AppStateContext = createContext();

const defaultSettings = {
  presentation: {
    fontSize: 48,
    fontFamily: 'Inter',
    backgroundColor: 'gradient',
    textColor: '#ffffff',
    textAlign: 'center',
    backgroundUrl: '',
    backgroundType: 'color',
    backgroundOpacity: 1,
    iframeUrl: '',
    transitionType: 'fade',
    idleScreen: {
      type: 'logo',
      backgroundUrl: '',
      videoUrl: 'https://youtu.be/SWQwPXtxIXg',
    }
  },
  bible: {
    lastBook: 'Gênesis',
    lastChapter: 1,
  },
};

export function AppStateProvider({ children }) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [services, setServices] = useState([]);
  const [songs, setSongs] = useState([]);
  const [media, setMedia] = useState([]);
  const [logs, setLogs] = useState([]);
  const [settings, setSettings] = useState(defaultSettings);

  const fetchAllData = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const [songsRes, servicesRes, settingsRes, mediaRes] = await Promise.all([
        supabase.from('songs').select('*'),
        supabase.from('services').select('*, service_items(*)'),
        supabase.from('user_settings').select('settings').eq('user_id', user.id).maybeSingle(),
        supabase.from('media_assets').select('*')
      ]);

      if (songsRes.error) throw songsRes.error;
      if (servicesRes.error) throw servicesRes.error;
      if (mediaRes.error) throw mediaRes.error;
      if (settingsRes.error && settingsRes.code !== 'PGRST116') {
        throw settingsRes.error;
      }

      setSongs(songsRes.data || []);
      setServices(servicesRes.data.map(s => ({ ...s, items: s.service_items || [] })) || []);
      setMedia(mediaRes.data || []);
      
      if (settingsRes.data?.settings) {
        const dbSettings = settingsRes.data.settings;
        setSettings(prev => ({
            ...defaultSettings,
            ...dbSettings,
            presentation: { 
              ...defaultSettings.presentation, 
              ...(dbSettings.presentation || {}),
              idleScreen: {
                ...defaultSettings.presentation.idleScreen,
                ...(dbSettings.presentation?.idleScreen || {})
              }
            },
            bible: { 
              ...defaultSettings.bible, 
              ...(dbSettings.bible || {}) 
            }
        }));
      } else {
        setSettings(defaultSettings);
      }

    } catch (error) {
      toast({ title: "Erro ao carregar dados", description: error.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  const addLog = useCallback((action) => {
    const newLog = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      action,
    };
    setLogs(prev => [newLog, ...prev].slice(0, 100));
  }, []);
  
  const updateSettings = useCallback(async (newSettings) => {
    if (!user) return;
    
    const updatedSettings = {
        ...settings,
        ...newSettings,
        presentation: {
            ...settings.presentation,
            ...(newSettings.presentation || {}),
            idleScreen: {
              ...settings.presentation.idleScreen,
              ...(newSettings.presentation?.idleScreen || {})
            }
        },
        bible: {
            ...settings.bible,
            ...(newSettings.bible || {}),
        }
    };
    
    setSettings(updatedSettings);

    const { error } = await supabase
      .from('user_settings')
      .upsert({ user_id: user.id, settings: updatedSettings, updated_at: new Date().toISOString() });

    if (error) {
      toast({ title: "Erro ao salvar configurações", description: error.message, variant: 'destructive' });
      setSettings(settings); // Revert on error
    }
  }, [user, settings, toast]);

  const value = {
    services,
    setServices,
    songs,
    setSongs,
    media,
    setMedia,
    logs,
    addLog,
    loading,
    settings,
    updateSettings,
    fetchAllData
  };

  return (
    <AppStateContext.Provider value={value}>
      {children}
    </AppStateContext.Provider>
  );
}

export function useAppState() {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error('useAppState must be used within an AppStateProvider');
  }
  return context;
}
