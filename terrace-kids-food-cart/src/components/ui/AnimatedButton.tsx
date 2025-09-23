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
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              style={{
                width: 20,
                height: 20,
                border: '2px solid transparent',
                borderTop: '2px solid currentColor',
                borderRadius: '50%',
              }}
              animate={{ rotate: 360 }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: 'linear',
              }}
            />
          </motion.div>
        )}
      </Button>
    </motion.div>
  );
};

export default AnimatedButton;