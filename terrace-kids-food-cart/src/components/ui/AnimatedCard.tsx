'use client';

import React from 'react';
import { Card, CardProps } from '@mui/material';
import { motion } from 'framer-motion';
import { cardVariants } from '@/lib/theme';

interface AnimatedCardProps extends Omit<CardProps, 'component'> {
  children: React.ReactNode;
  hoverable?: boolean;
  delay?: number;
}

const AnimatedCard: React.FC<AnimatedCardProps> = ({
  children,
  hoverable = true,
  delay = 0,
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
          ...props.sx,
        }}
      >
        {children}
      </Card>
    </motion.div>
  );
};

export default AnimatedCard;