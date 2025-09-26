'use client';

import React from 'react';
import { Box, Skeleton, Card } from '@mui/material';
import { motion } from 'framer-motion';

interface MenuItemSkeletonProps {
  count?: number;
}

const MenuItemSkeletonCard: React.FC = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, ease: 'easeOut' }}
  >
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        p: 3,
        borderRadius: 2,
        boxShadow: 2
      }}
    >
      {/* Image Skeleton */}
      <Box display="flex" justifyContent="center" mb={2}>
        <Skeleton
          variant="rectangular"
          width={80}
          height={80}
          sx={{ borderRadius: 2 }}
          animation="wave"
        />
      </Box>

      {/* Title Skeleton */}
      <Skeleton
        variant="text"
        height={32}
        sx={{ mb: 1, borderRadius: 1 }}
        animation="wave"
      />

      {/* Description Skeleton */}
      <Box mb={2}>
        <Skeleton
          variant="text"
          height={20}
          sx={{ mb: 0.5, borderRadius: 1 }}
          animation="wave"
        />
        <Skeleton
          variant="text"
          height={20}
          width="80%"
          sx={{ mb: 0.5, borderRadius: 1 }}
          animation="wave"
        />
        <Skeleton
          variant="text"
          height={20}
          width="60%"
          sx={{ borderRadius: 1 }}
          animation="wave"
        />
      </Box>

      {/* Price Skeleton */}
      <Skeleton
        variant="text"
        height={28}
        width={80}
        sx={{ mb: 2, borderRadius: 1 }}
        animation="wave"
      />

      {/* Buttons Skeleton */}
      <Box display="flex" gap={1} justifyContent="center" mt="auto">
        <Skeleton
          variant="rectangular"
          width={80}
          height={36}
          sx={{ borderRadius: 3 }}
          animation="wave"
        />
        <Skeleton
          variant="rectangular"
          width={40}
          height={36}
          sx={{ borderRadius: 1 }}
          animation="wave"
        />
      </Box>
    </Card>
  </motion.div>
);

const MenuItemSkeleton: React.FC<MenuItemSkeletonProps> = ({ count = 6 }) => {
  return (
    <Box
      display="grid"
      gridTemplateColumns={{
        xs: '1fr',
        sm: 'repeat(2, 1fr)',
        md: 'repeat(3, 1fr)'
      }}
      gap={3}
    >
      {Array.from({ length: count }, (_, index) => (
        <MenuItemSkeletonCard key={index} />
      ))}
    </Box>
  );
};

export default MenuItemSkeleton;