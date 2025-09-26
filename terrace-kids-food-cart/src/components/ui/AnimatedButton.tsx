'use client';

import React from 'react';
import { Button, ButtonProps } from '@mui/material';
import { motion } from 'framer-motion';
import { buttonVariants } from '@/lib/theme';

interface AnimatedButtonProps extends ButtonProps {
  emoji?: string;
  loading?: boolean;
  children: React.ReactNode;
}

const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  emoji,
  loading = false,
  children,
  disabled,
  ...props
}) => {
  return (
    <motion.div
      variants={buttonVariants}
      initial="idle"
      whileHover={!disabled && !loading ? "hover" : "idle"}
      whileTap={!disabled && !loading ? "tap" : "idle"}
    >
      <Button
        {...props}
        disabled={disabled || loading}
        sx={{
          minHeight: 48,
          position: 'relative',
          overflow: 'hidden',
          ...props.sx,
        }}
      >
        <motion.div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
          animate={loading ? { opacity: 0 } : { opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          {emoji && (
            <span style={{ fontSize: '1.2em' }} role="img" aria-hidden="true">
              {emoji}
            </span>
          )}
          {children}
        </motion.div>
        
        {loading && (
          <motion.div
            style={{
              position: 'absolute',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              height: '100%',
              top: 0,
              left: 0,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.15 }}
          >
            {/* Load animated GIF and fallback to JPG if the GIF fails to load */}
            <img
              src="/images/food-cart.gif"
              alt="loading"
              onError={(e) => {
                const img = e.currentTarget as HTMLImageElement;
                if (!img.dataset.fallback) {
                  img.dataset.fallback = '1';
                  img.src = '/images/TKFC-5.jpg';
                }
              }}
              style={{
                width: '1.6rem',
                height: '1.6rem',
                objectFit: 'contain',
                filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.12))',
              }}
            />
          </motion.div>
        )}
      </Button>
    </motion.div>
  );
};

export default AnimatedButton;