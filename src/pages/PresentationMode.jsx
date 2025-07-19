import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Star } from 'lucide-react';
import ReactPlayer from 'react-player/youtube';
import LumenLogo from '@/components/LumenLogo';

const transitionVariants = {
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  slide: {
    initial: { opacity: 0, y: 50 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -50 },
  },
  zoom: {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 1.2 },
  },
};

const AnimatedIdleLogo = () => {
  const pathVariants = {
    initial: { pathLength: 0, pathOffset: 1, opacity: 0.5 },
    animate: { 
      pathLength: [0, 1, 1],
      pathOffset: [1, 0, 0],
      opacity: [0.5, 1, 0.5],
      transition: {
        duration: 3,
        ease: 'easeInOut',
        repeat: Infinity,
        repeatDelay: 1
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <svg
        viewBox="0 0 100 100"
        className="w-32 h-32"
        style={{ overflow: 'visible' }}
      >
        <defs>
          <linearGradient id="idle-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#A855F7" />
            <stop offset="50%" stopColor="#EC4899" />
            <stop offset="100%" stopColor="#F59E0B" />
          </linearGradient>
          <filter id="idle-glow">
            <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
          </filter>
        </defs>
        
        <g filter="url(#idle-glow)">
          <motion.path
            d="M50 10 L90 50 L50 90 L10 50 Z"
            fill="none"
            stroke="url(#idle-gradient)"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
            variants={pathVariants}
            initial="initial"
            animate="animate"
          />
        </g>
      </svg>
      <p className="text-white/70 text-2xl tracking-widest font-light">LUMEN</p>
    </div>
  );
};


function PresentationMode() {
  const [displayContent, setDisplayContent] = useState(null);
  const [settings, setSettings] = useState({
    fontSize: 48,
    fontFamily: 'Inter, sans-serif',
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
  });

  useEffect(() => {
    if (window.opener) {
      window.opener.postMessage({ type: 'presentation-control', action: 'ready' }, '*');
    }
    
    const handleMessage = (event) => {
      if (event.source !== window.opener) return;
      
      if (event.data.type === 'presentation-control') {
        const { action, data } = event.data;
        if (action === 'display') setDisplayContent(data);
        if (action === 'hide') setDisplayContent(null);
        if (action === 'settings') {
          setSettings(prev => ({ ...prev, ...data }));
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const selectedTransition = useMemo(() => {
    return transitionVariants[settings.transitionType] || transitionVariants.fade;
  }, [settings.transitionType]);

  const BackgroundLayer = () => {
    let backgroundSource = null;
    let opacity = 1;

    if (displayContent?.type === 'image') {
       return <div className="absolute inset-0 -z-20 bg-black" />;
    }

    if (!displayContent) { // Idle Screen
      if (settings.idleScreen.type === 'video' && settings.idleScreen.videoUrl) {
        return (
          <div className="absolute inset-0 -z-10 w-full h-full overflow-hidden">
            <ReactPlayer
              url={settings.idleScreen.videoUrl} playing loop muted width="100%" height="100%"
              className="react-player-cover"
            />
          </div>
        );
      }
      backgroundSource = settings.idleScreen.type === 'image' ? settings.idleScreen.backgroundUrl : null;
    } else { // Active Content
      if (settings.backgroundType === 'image') {
        backgroundSource = settings.backgroundUrl;
        opacity = settings.backgroundOpacity || 1;
      } else if (settings.backgroundType === 'iframe' && settings.iframeUrl) {
         return (
          <iframe
            src={settings.iframeUrl}
            className="absolute inset-0 w-full h-full -z-10 border-none"
            frameBorder="0" scrolling="no" allowFullScreen
          ></iframe>
        );
      }
    }

    const baseBgStyle = {
      backgroundImage: backgroundSource ? `url(${backgroundSource})` : 'none',
      backgroundColor: 'transparent',
      opacity: opacity,
    };

    return (
      <div
        className="absolute inset-0 bg-cover bg-center -z-10 transition-all duration-500"
        style={baseBgStyle}
      />
    );
  };
  
  const ColorLayer = () => {
      const isIdleWithImage = !displayContent && settings.idleScreen.type === 'image' && settings.idleScreen.backgroundUrl;
      const isActiveWithImage = displayContent && settings.backgroundType === 'image' && settings.backgroundUrl;
      
      if (displayContent?.type === 'image') {
        return <div className="absolute inset-0 -z-20 bg-black" />;
      }
      if (isIdleWithImage || isActiveWithImage) {
        return <div className="absolute inset-0 -z-20 bg-gray-900" />;
      }

      let bgColor;
      if (!displayContent) {
          bgColor = 'bg-gray-900';
      } else {
        if (settings.backgroundColor === 'gradient') {
          bgColor = 'bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800';
        } else if (settings.backgroundColor === 'dark') {
          bgColor = 'bg-gray-900';
        } else if (settings.backgroundColor === 'light') {
          bgColor = 'bg-gray-100';
        } else {
          return (
            <div className="absolute inset-0 -z-20 transition-colors duration-500" style={{ backgroundColor: settings.backgroundColor }} />
          );
        }
      }
      return <div className={`absolute inset-0 -z-20 transition-colors duration-500 ${bgColor}`} />;
  }

  const renderContent = () => {
    if (!displayContent) {
      if (settings.idleScreen.type === 'logo') {
        return (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center p-4">
            <AnimatedIdleLogo />
          </motion.div>
        );
      }
      return null;
    }
    
    const key = displayContent.key || `${displayContent.type}-${displayContent.title || displayContent.name || displayContent.verses?.[0]?.reference}`;

    const MotionComponent = ({ children, ...props }) => (
      <motion.div
        key={key}
        variants={selectedTransition}
        initial="initial"
        animate="animate"
        exit="exit"
        className="w-full h-full flex flex-col items-center justify-center text-center px-16"
        {...props}
      >
        {children}
      </motion.div>
    );

    switch (displayContent.type) {
      case 'verse':
        const currentVerse = displayContent.verses?.[displayContent.currentVerseIndex || 0];
        if (!currentVerse) return null;
        return (
          <MotionComponent key={`${key}-${displayContent.currentVerseIndex}`} className="w-full flex flex-col items-center justify-center text-center px-16">
            <p className="verse-display mb-8" style={{ fontSize: `${settings.fontSize}px`, color: settings.textColor, fontFamily: settings.fontFamily, textAlign: settings.textAlign }}>
              {currentVerse.text}
            </p>
            <div className="text-2xl font-medium" style={{ color: settings.textColor, opacity: 0.9 }}>
              {currentVerse.reference} ({displayContent.version})
            </div>
          </MotionComponent>
        );
      case 'song':
        const currentSection = displayContent.sections?.[displayContent.currentSection || 0];
        return (
          <MotionComponent key={`${key}-${displayContent.currentSection}`} className="w-full flex flex-col items-center justify-center text-center px-16">
            <div className="mb-8">
              <h1 className="text-4xl font-bold" style={{ color: settings.textColor }}>{displayContent.title}</h1>
              {displayContent.author && <p className="text-xl" style={{ color: settings.textColor, opacity: 0.8 }}>{displayContent.author}</p>}
            </div>
            {currentSection && (
              <div className="max-w-4xl">
                <h2 className="text-2xl font-semibold mb-6" style={{ color: settings.textColor, opacity: 0.9 }}>{currentSection.title}</h2>
                <div className="song-display whitespace-pre-line" style={{ fontSize: `${settings.fontSize}px`, color: settings.textColor, fontFamily: settings.fontFamily, textAlign: settings.textAlign }}>
                  {currentSection.content}
                </div>
              </div>
            )}
          </MotionComponent>
        );
      case 'image':
        return (
          <MotionComponent>
            <img 
              src={displayContent.url} 
              alt={displayContent.name} 
              className="w-full h-full"
              style={{ objectFit: displayContent.fit || 'contain' }}
            />
          </MotionComponent>
        );
      case 'event':
        return (
          <MotionComponent className="w-full flex flex-col items-center justify-center text-center px-16">
             <Star className="w-16 h-16 mb-6" style={{ color: settings.textColor, opacity: 0.8 }} />
            <h1 style={{ fontSize: `${settings.fontSize * 1.2}px`, color: settings.textColor, fontFamily: settings.fontFamily, textAlign: settings.textAlign }} className="font-bold">
              {displayContent.title}
            </h1>
            {displayContent.subtitle && (
              <p style={{ fontSize: `${settings.fontSize * 0.7}px`, color: settings.textColor, fontFamily: settings.fontFamily, textAlign: settings.textAlign }} className="mt-4 opacity-90">
                {displayContent.subtitle}
              </p>
            )}
          </MotionComponent>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Helmet>
        <title>Apresentação - Lumen</title>
        <meta name="description" content="Tela de apresentação do Lumen." />
      </Helmet>
      <div className="presentation-mode min-h-screen w-full h-screen overflow-hidden relative flex items-center justify-center">
        <ColorLayer />
        <BackgroundLayer />
        <div className="relative z-10 w-full h-full flex items-center justify-center">
          <AnimatePresence mode="wait">
            {renderContent()}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}

export default PresentationMode;