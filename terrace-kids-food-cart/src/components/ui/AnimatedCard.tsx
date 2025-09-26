'use client';

import React from 'react';
import { Card, CardProps } from '@mui/material';
import { motion } from 'framer-motion';
import { cardVariants } from '@/lib/theme';

interface AnimatedCardProps extends Omit<CardProps, 'component'> {
  children: React.ReactNode;
  hoverable?: boolean;
  delay?: number;
  glowColor?: string;
}

const AnimatedCard: React.FC<AnimatedCardProps> = ({
  children,
  hoverable = true,
  delay = 0,
  glowColor,
  ...props
}) => {
  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={hoverable ? "hover" : undefined}
      transition={{ delay }}
    >
      <Card
        {...props}
        sx={{
          position: 'relative',
          '&::after': glowColor ? {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            borderRadius: 'inherit',
            padding: '2px',
            background: `linear-gradient(45deg, ${glowColor}, transparent, ${glowColor})`,
            mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            maskComposite: 'exclude',
            opacity: 0,
            transition: 'opacity 0.3s ease',
          } : {},
          '&:hover::after': glowColor ? {
            opacity: 0.6,
          } : {},
          ...props.sx,
        }}
      >
        {children}
      </Card>
    </motion.div>
  );
};

export default AnimatedCard;