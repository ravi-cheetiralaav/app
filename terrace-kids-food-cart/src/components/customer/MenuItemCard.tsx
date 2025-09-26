'use client';

import React from 'react';
import { Box, Typography, Avatar, IconButton, Chip } from '@mui/material';
import { Add, RemoveRedEye } from '@mui/icons-material';
import { motion } from 'framer-motion';
import AnimatedCard from '@/components/ui/AnimatedCard';
import AnimatedButton from '@/components/ui/AnimatedButton';

interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  quantity_available?: number;
  is_active?: boolean;
}

interface MenuItemCardProps {
  item: MenuItem;
  onAddToCart: (item: MenuItem) => void;
  onViewDetails: (item: MenuItem) => void;
  cartQuantity?: number;
}

const MenuItemCard: React.FC<MenuItemCardProps> = ({
  item,
  onAddToCart,
  onViewDetails,
  cartQuantity = 0
}) => {
  const isAvailable = item.is_active && (item.quantity_available ?? 0) > 0;
  const price = typeof item.price === 'number' ? item.price.toFixed(2) : item.price;

  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <AnimatedCard
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          overflow: 'visible',
          '&:hover': {
            boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
          }
        }}
      >
        {/* Availability indicator */}
        {!isAvailable && (
          <Chip
            label="Unavailable"
            color="error"
            size="small"
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              zIndex: 1,
              fontSize: '0.75rem'
            }}
          />
        )}

        {/* Cart quantity indicator */}
        {cartQuantity > 0 && (
          <Chip
            label={`${cartQuantity} in cart`}
            color="primary"
            size="small"
            sx={{
              position: 'absolute',
              top: 8,
              left: 8,
              zIndex: 1,
              fontSize: '0.75rem'
            }}
          />
        )}

        <Box p={3} textAlign="center" sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
          {/* Image intentionally removed per UX request - no spacer to avoid extra vertical gap */}

          {/* Item Details */}
          <Typography
            variant="h6"
            gutterBottom
            sx={{
              fontWeight: 700,
              color: 'text.primary',
              minHeight: 32,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}
          >
            {item.name}
          </Typography>

          {item.description && item.description.trim() !== item.name.trim() && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mb: 2,
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden'
              }}
            >
              {item.description}
            </Typography>
          )}

          {/* Price */}
          <Typography
            variant="h6"
            sx={{
              fontWeight: 800,
              color: 'primary.main',
              mb: 2,
              fontSize: '1.25rem'
            }}
          >
            ${price}
          </Typography>

          {/* Quantity Available */}
          {item.quantity_available !== undefined && (
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ mb: 2, fontStyle: 'italic' }}
            >
              {item.quantity_available} available
            </Typography>
          )}

          {/* Action Buttons */}
          <Box display="flex" gap={1} justifyContent="center" mt="auto">
            <AnimatedButton
              variant="contained"
              size="small"
              startIcon={<Add />}
              onClick={() => onAddToCart(item)}
              disabled={!isAvailable}
              sx={{
                borderRadius: 3,
                px: 2,
                flex: 1,
                maxWidth: 120,
                textTransform: 'none',
                fontWeight: 600
              }}
            >
              Add
            </AnimatedButton>
            
            <IconButton
              onClick={() => onViewDetails(item)}
              size="small"
              sx={{
                bgcolor: 'grey.100',
                '&:hover': {
                  bgcolor: 'grey.200',
                  transform: 'scale(1.1)'
                },
                transition: 'all 0.2s ease'
              }}
            >
              <RemoveRedEye fontSize="small" />
            </IconButton>
          </Box>
        </Box>
      </AnimatedCard>
    </motion.div>
  );
};

export default MenuItemCard;