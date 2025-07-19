import React from 'react';
import { motion } from 'framer-motion';

const LumenLogo = ({ className = 'w-16 h-16', textClassName = 'text-2xl', showText = true }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const pathVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: {
        duration: 1.5,
        ease: 'easeInOut',
      },
    },
  };

  const textVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: 'easeOut',
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-col items-center justify-center space-y-3"
    >
      <svg
        viewBox="0 0 100 100"
        className={className}
        style={{ overflow: 'visible' }}
      >
        <defs>
          <linearGradient id="lumen-gradient-main" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8B5CF6" />
            <stop offset="100%" stopColor="#3B82F6" />
          </linearGradient>
          <filter id="lumen-glow">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
            <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.7 0" result="glow" />
            <feComposite in="glow" in2="SourceGraphic" operator="over" />
          </filter>
        </defs>
        
        <g filter="url(#lumen-glow)">
          <motion.path
            d="M50 15 L85 50 L50 85"
            fill="none"
            stroke="url(#lumen-gradient-main)"
            strokeWidth="8"
            strokeLinecap="round"
            strokeLinejoin="round"
            variants={pathVariants}
          />
          <motion.path
            d="M50 15 L15 50 L50 85"
            fill="none"
            stroke="url(#lumen-gradient-main)"
            strokeWidth="8"
            strokeLinecap="round"
            strokeLinejoin="round"
            variants={pathVariants}
          />
        </g>
      </svg>
      {showText && (
        <motion.span variants={textVariants} className={`${textClassName} font-bold tracking-wider uppercase bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent`}>
          Lumen
        </motion.span>
      )}
    </motion.div>
  );
};

export default LumenLogo;