'use client';

import React from 'react';
import { Button, ButtonProps } from '@mui/material';
import { motion } from 'framer-motion';
import { buttonVariants } from '@/lib/theme';
import Logo from './Logo';

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
            <motion.span 
              style={{ fontSize: '1.2em' }} 
              role="img" 
              aria-hidden="true"
              animate={!disabled && !loading ? {
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1],
              } : {}}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 3,
              }}
            >
              {emoji}
            </motion.span>
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
            <Logo 
              size="small"
              animated={true}
              style={{
                width: '1.6rem',
                height: '1.6rem',
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