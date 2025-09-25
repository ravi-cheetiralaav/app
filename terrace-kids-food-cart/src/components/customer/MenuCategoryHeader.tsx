'use client';

import React from 'react';
import { Box, Typography, Avatar } from '@mui/material';
import { motion } from 'framer-motion';
import AnimatedCard from '@/components/ui/AnimatedCard';

interface MenuCategoryHeaderProps {
  category: string;
  itemCount: number;
  image?: string;
}

const MenuCategoryHeader: React.FC<MenuCategoryHeaderProps> = ({
  category,
  itemCount,
  image
}) => {
  // Category-specific images and emojis
  const categoryConfig: Record<string, { emoji: string; defaultImage: string; gradient: string }> = {
    'Food': { 
      emoji: '🍔', 
      // use the provided healthy-food GIF
      defaultImage: '/images/healthy-food.gif',
      gradient: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%)'
    },
    'Meals': { 
      emoji: '🍔', 
      defaultImage: '/images/healthy-food.gif',
      gradient: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%)'
    },
    'Drink': { 
      emoji: '🥤', 
      defaultImage: '/images/beverage.gif',
      gradient: 'linear-gradient(135deg, #4ECDC4 0%, #44A08D 100%)'
    },
    'Drinks': { 
      emoji: '🥤', 
      // use the provided beverage GIF
      defaultImage: '/images/beverage.gif',
      gradient: 'linear-gradient(135deg, #4ECDC4 0%, #44A08D 100%)'
    },
    'Beverage': { 
      emoji: '🥤', 
      defaultImage: '/images/beverage.gif',
      gradient: 'linear-gradient(135deg, #4ECDC4 0%, #44A08D 100%)'
    },
    'Beverages': { 
      emoji: '🥤', 
      defaultImage: '/images/beverage.gif',
      gradient: 'linear-gradient(135deg, #4ECDC4 0%, #44A08D 100%)'
    },
    'Snacks': { 
      emoji: '🍪', 
      defaultImage: '/images/categories/snack-category.jpg',
      gradient: 'linear-gradient(135deg, #FFD93D 0%, #FF8C1A 100%)'
    },
    'Desserts': { 
      emoji: '🍰', 
      defaultImage: '/images/categories/dessert-category.jpg',
      gradient: 'linear-gradient(135deg, #A8E6CF 0%, #7FCDCD 100%)'
    },
    'Dessert': { 
      emoji: '🍰', 
      defaultImage: '/images/categories/dessert-category.jpg',
      gradient: 'linear-gradient(135deg, #A8E6CF 0%, #7FCDCD 100%)'
    },
    'Uncategorized': { 
      emoji: '🍽️', 
      defaultImage: '/images/TKFC-5.jpg',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }
  };

  // Normalize category lookup (case-insensitive, trimmed) so variants map correctly
  const key = (category || 'Uncategorized').toString().trim();
  const normalized = key.charAt(0).toUpperCase() + key.slice(1).toLowerCase();
  let config = categoryConfig[normalized] || categoryConfig['Uncategorized'];

  // If exact match failed, try substring matching for common variants
  if (!categoryConfig[normalized]) {
    const lower = key.toLowerCase();
    if (lower.includes('bever')) {
      config = categoryConfig['Beverages'];
    } else if (lower.includes('drink')) {
      config = categoryConfig['Drinks'];
    } else if (lower.includes('food') || lower.includes('meal')) {
      config = categoryConfig['Food'];
    }
  }
  const categoryImage = image || config.defaultImage;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <AnimatedCard
        sx={{
          background: config.gradient,
          color: 'white',
          mb: 3,
          overflow: 'hidden',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(255,255,255,0.1)',
            backdropFilter: 'blur(10px)',
            zIndex: 0
          }
        }}
      >
        <Box
          display="flex"
          alignItems="center"
          gap={3}
          p={4}
          position="relative"
          zIndex={1}
        >
          {/* Category Image */}
          <motion.div
            whileHover={{ scale: 1.05, rotate: 5 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            <Avatar
              sx={{
                width: 100,
                height: 100,
                borderRadius: 3,
                border: '4px solid rgba(255,255,255,0.3)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                '&:hover': {
                  boxShadow: '0 12px 48px rgba(0,0,0,0.4)',
                },
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              alt={category}
            >
              {categoryImage ? (
                <img
                  src={categoryImage}
                  alt={category}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
              ) : null}
            </Avatar>
          </motion.div>

          {/* Category Info */}
          <Box flex={1}>
            <Box display="flex" alignItems="center" gap={2} mb={1}>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 800,
                  textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                  letterSpacing: '-0.02em'
                }}
              >
                {category}
              </Typography>
              <Typography
                variant="h4"
                sx={{
                  fontSize: '2rem',
                  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
                }}
              >
                {config.emoji}
              </Typography>
            </Box>
            
            <Typography
              variant="body1"
              sx={{
                opacity: 0.9,
                fontWeight: 500,
                textShadow: '0 1px 2px rgba(0,0,0,0.2)'
              }}
            >
              {itemCount} delicious {itemCount === 1 ? 'item' : 'items'} available
            </Typography>
          </Box>

          {/* Decorative Elements */}
          <Box
            position="absolute"
            top={-20}
            right={-20}
            sx={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.1)',
              opacity: 0.5
            }}
          />
          <Box
            position="absolute"
            bottom={-30}
            right={20}
            sx={{
              width: 60,
              height: 60,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.05)',
              opacity: 0.7
            }}
          />
        </Box>
      </AnimatedCard>
    </motion.div>
  );
};

export default MenuCategoryHeader;