'use client';

import React from 'react';
import { Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { loadingVariants } from '@/lib/theme';
import Logo from './Logo';

interface LoadingSpinnerProps {
  message?: string;
  size?: 'small' | 'medium' | 'large';
  showLogo?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message = 'Loading...',
  size = 'medium',
  showLogo = true,
}) => {
  const getLogoSize = () => {
    switch (size) {
      case 'small': return 'small';
      case 'large': return 'medium';
      default: return 'small';
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      gap={2}
      p={4}
    >
      {showLogo && (
        <motion.div
          variants={loadingVariants}
          initial="initial"
          animate={["animate", "pulse"]}
        >
          <Logo 
            size={getLogoSize()} 
            animated={false}
            hoverable={false}
          />
        </motion.div>
      )}
      
      <motion.div
        variants={loadingVariants}
        initial="initial"
        animate="animate"
      >
        <Typography 
          variant={size === 'large' ? 'h6' : 'body1'} 
          color="text.secondary"
          textAlign="center"
        >
          {message}
        </Typography>
      </motion.div>

      {/* Fun loading dots */}
      <Box display="flex" alignItems="center" gap={1}>
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: i * 0.2,
              ease: [0.4, 0.0, 0.2, 1],
            }}
            style={{
              width: size === 'large' ? 12 : 8,
              height: size === 'large' ? 12 : 8,
              borderRadius: '50%',
              backgroundColor: '#FF6B6B',
            }}
          />
        ))}
      </Box>
    </Box>
  );
};

export default LoadingSpinner;