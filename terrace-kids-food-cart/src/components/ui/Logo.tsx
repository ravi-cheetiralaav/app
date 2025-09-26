'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { logoVariants } from '@/lib/theme';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  animated?: boolean;
  hoverable?: boolean;
  alt?: string;
  style?: React.CSSProperties;
}

const LOGO_SIZES = {
  small: { width: 64, height: 64, borderRadius: 12 },
  medium: { width: 120, height: 120, borderRadius: 16 },
  large: { width: 200, height: 200, borderRadius: '50%' },
};

const Logo: React.FC<LogoProps> = ({
  size = 'medium',
  animated = false,
  hoverable = false,
  alt = 'Terrace Kids Food Cart Logo',
  style = {},
}) => {
  const sizeConfig = LOGO_SIZES[size];

  const getInitialState = () => {
    if (animated) return 'animated';
    return 'idle';
  };

  const getWhileHover = () => {
    if (hoverable || animated) return 'hover';
    return 'idle';
  };

  return (
    <motion.div
      variants={logoVariants}
      initial="idle"
      animate={getInitialState()}
      whileHover={getWhileHover()}
      style={{
        display: 'inline-block',
        ...style,
      }}
    >
      <Image
        src="/images/TKFC-5.jpg"
        alt={alt}
        width={sizeConfig.width}
        height={sizeConfig.height}
        style={{
          borderRadius: sizeConfig.borderRadius,
          boxShadow: size === 'large' 
            ? '0 8px 32px rgba(0,0,0,0.2)' 
            : '0 4px 16px rgba(0,0,0,0.15)',
          display: 'block',
          transition: 'all 0.3s cubic-bezier(0.4, 0.0, 0.2, 1)',
        }}
        priority={size === 'large'}
      />
    </motion.div>
  );
};

export default Logo;