'use client';

import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { successVariants } from '@/lib/theme';

interface SuccessAnimationProps {
  show: boolean;
  message?: string;
  emoji?: string;
  onComplete?: () => void;
  duration?: number;
}

const SuccessAnimation: React.FC<SuccessAnimationProps> = ({
  show,
  message = 'Success!',
  emoji = '🎉',
  onComplete,
  duration = 3000,
}) => {
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    if (show) {
      setShowCelebration(true);
      
      const timer = setTimeout(() => {
        setShowCelebration(false);
        onComplete?.();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [show, duration, onComplete]);

  return (
    <AnimatePresence>
      {showCelebration && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
          }}
        >
          <Box
            bgcolor="background.paper"
            borderRadius={4}
            p={6}
            textAlign="center"
            boxShadow="0 20px 60px rgba(0,0,0,0.3)"
            maxWidth={400}
            mx={2}
          >
            <motion.div
              variants={successVariants}
              initial="initial"
              animate={["animate", "celebrate"]}
              style={{
                fontSize: '4rem',
                marginBottom: '1rem',
              }}
            >
              {emoji}
            </motion.div>
            
            <motion.div
              variants={successVariants}
              initial="initial"
              animate="animate"
            >
              <Typography variant="h4" gutterBottom fontWeight="bold" color="primary">
                {message}
              </Typography>
            </motion.div>

            {/* Confetti effect */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                pointerEvents: 'none',
              }}
            >
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{
                    x: '50%',
                    y: '50%',
                    scale: 0,
                    rotate: 0,
                  }}
                  animate={{
                    x: `${Math.random() * 100}%`,
                    y: `${Math.random() * 100}%`,
                    scale: [0, 1, 0],
                    rotate: 360,
                  }}
                  transition={{
                    duration: 2,
                    delay: Math.random() * 0.5,
                    ease: [0.4, 0.0, 0.2, 1],
                  }}
                  style={{
                    position: 'absolute',
                    width: 8,
                    height: 8,
                    backgroundColor: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA726'][i % 4],
                    borderRadius: '50%',
                  }}
                />
              ))}
            </motion.div>
          </Box>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SuccessAnimation;