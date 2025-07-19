import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAppState } from '@/contexts/AppStateContext';

const PresentationContext = createContext();

export const usePresentation = () => {
  const context = useContext(PresentationContext);
  if (!context) {
    throw new Error('usePresentation must be used within a PresentationProvider');
  }
  return context;
};

export function PresentationProvider({ children }) {
  const { settings: appSettings, updateSettings: updateAppSettings } = useAppState();
  const [currentDisplay, setCurrentDisplay] = useState(null);
  const [isPresenting, setIsPresenting] = useState(false);
  const [presentationWindow, setPresentationWindow] = useState(null);
  
  const defaultSettings = {
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
  };

  const presentationSettings = React.useMemo(() => ({
    ...defaultSettings,
    ...(appSettings?.presentation || {}),
    idleScreen: {
      ...defaultSettings.idleScreen,
      ...(appSettings?.presentation?.idleScreen || {}),
    }
  }), [appSettings]);

  const postToPresentationWindow = useCallback((message) => {
    if (presentationWindow && !presentationWindow.closed) {
      presentationWindow.postMessage(message, '*');
    }
  }, [presentationWindow]);
  
  const updateSettings = useCallback((newSettings) => {
    updateAppSettings(newSettings);
  }, [updateAppSettings]);

  useEffect(() => {
    if (presentationWindow && !presentationWindow.closed) {
      postToPresentationWindow({
        type: 'presentation-control',
        action: 'settings',
        data: presentationSettings
      });
    }
  }, [presentationSettings, presentationWindow, postToPresentationWindow]);

  const displayContent = useCallback((content) => {
    const newContent = { ...content, key: `${content.type}-${Date.now()}` };
    setCurrentDisplay(newContent);
    if (!isPresenting) setIsPresenting(true);
    postToPresentationWindow({
      type: 'presentation-control',
      action: 'display',
      data: newContent,
    });
  }, [postToPresentationWindow, isPresenting]);

  const hideContent = useCallback(() => {
    setCurrentDisplay(null);
    if (isPresenting) setIsPresenting(false);
    postToPresentationWindow({ type: 'presentation-control', action: 'hide' });
  }, [postToPresentationWindow, isPresenting]);

  const openPresentationWindow = useCallback(() => {
    if (presentationWindow && !presentationWindow.closed) {
      presentationWindow.focus();
      return;
    }
    const newWindow = window.open('/presentation', 'presentation', 'fullscreen=yes,scrollbars=no,resizable=no');
    setPresentationWindow(newWindow); 
  }, [presentationWindow]);

  const advanceItem = useCallback(() => {
    if (!currentDisplay) return;
    let newContent = { ...currentDisplay };
    let changed = false;

    if (currentDisplay.type === 'song' && currentDisplay.sections) {
      const nextSection = Math.min((currentDisplay.currentSection || 0) + 1, currentDisplay.sections.length - 1);
      if (nextSection !== (currentDisplay.currentSection || 0)) {
        newContent.currentSection = nextSection;
        changed = true;
      }
    } else if (currentDisplay.type === 'verse' && currentDisplay.verses) {
      const nextVerse = Math.min((currentDisplay.currentVerseIndex || 0) + 1, currentDisplay.verses.length - 1);
      if (nextVerse !== (currentDisplay.currentVerseIndex || 0)) {
        newContent.currentVerseIndex = nextVerse;
        changed = true;
      }
    }
    
    if (changed) {
      displayContent(newContent);
    }
  }, [currentDisplay, displayContent]);

  const retreatItem = useCallback(() => {
    if (!currentDisplay) return;
    let newContent = { ...currentDisplay };
    let changed = false;

    if (currentDisplay.type === 'song') {
      const prevSection = Math.max((currentDisplay.currentSection || 0) - 1, 0);
      if (prevSection !== (currentDisplay.currentSection || 0)) {
        newContent.currentSection = prevSection;
        changed = true;
      }
    } else if (currentDisplay.type === 'verse') {
      const prevVerse = Math.max((currentDisplay.currentVerseIndex || 0) - 1, 0);
      if (prevVerse !== (currentDisplay.currentVerseIndex || 0)) {
        newContent.currentVerseIndex = prevVerse;
        changed = true;
      }
    }

    if (changed) {
      displayContent(newContent);
    }
  }, [currentDisplay, displayContent]);

  const goToItem = useCallback((index) => {
    if (!currentDisplay) return;
    let newContent = { ...currentDisplay };
    let changed = false;

    if (currentDisplay.type === 'song' && currentDisplay.sections && index >= 0 && index < currentDisplay.sections.length) {
      newContent.currentSection = index;
      changed = true;
    } else if (currentDisplay.type === 'verse' && currentDisplay.verses && index >= 0 && index < currentDisplay.verses.length) {
      newContent.currentVerseIndex = index;
      changed = true;
    }

    if (changed) {
      displayContent(newContent);
    }
  }, [currentDisplay, displayContent]);

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.source !== presentationWindow) return;

      if (event.data.type === 'presentation-control' && event.data.action === 'ready') {
          setIsPresenting(true);
          postToPresentationWindow({
            type: 'presentation-control',
            action: 'settings',
            data: presentationSettings
          });
          if (currentDisplay) {
            postToPresentationWindow({
              type: 'presentation-control',
              action: 'display',
              data: currentDisplay,
            });
          }
      }
    };
    window.addEventListener('message', handleMessage);
    
    const interval = setInterval(() => {
        if (presentationWindow && presentationWindow.closed) {
            setPresentationWindow(null);
            setIsPresenting(false);
            setCurrentDisplay(null);
        }
    }, 1000);

    return () => {
      window.removeEventListener('message', handleMessage);
      clearInterval(interval);
    };
  }, [presentationWindow, currentDisplay, presentationSettings, postToPresentationWindow]);

  return (
    <PresentationContext.Provider value={{
      currentDisplay,
      isPresenting,
      presentationSettings,
      displayContent,
      hideContent,
      openPresentationWindow,
      updateSettings,
      advanceItem,
      retreatItem,
      goToItem
    }}>
      {children}
    </PresentationContext.Provider>
  );
}