'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Avatar,
  Chip,
  IconButton,
  Divider,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { Close, Restaurant, LocalDining } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import AnimatedButton from '@/components/ui/AnimatedButton';
import QuantitySelector from './QuantitySelector';

interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  quantity_available?: number;
  is_active?: boolean;
  nutritional_info?: {
    calories?: number;
    protein?: string;
    carbs?: string;
    fat?: string;
    allergens?: string[];
  };
  ingredients?: string[];
  customization_options?: string[];
}

interface ItemDetailModalProps {
  item: MenuItem | null;
  open: boolean;
  onClose: () => void;
  onAddToCart: (item: MenuItem, quantity: number) => void;
  cartQuantity?: number;
}

const ItemDetailModal: React.FC<ItemDetailModalProps> = ({
  item,
  open,
  onClose,
  onAddToCart,
  cartQuantity = 0
}) => {
  const [quantity, setQuantity] = useState(1);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  if (!item) return null;

  const isAvailable = item.is_active && (item.quantity_available ?? 0) > 0;
  const price = typeof item.price === 'number' ? item.price.toFixed(2) : item.price;

  const handleAddToCart = () => {
    onAddToCart(item, quantity);
    setQuantity(1);
    onClose();
  };

  // Mock nutritional info if not provided
  const nutritionalInfo = item.nutritional_info || {
    calories: Math.floor(Math.random() * 400) + 200,
    protein: `${Math.floor(Math.random() * 20) + 5}g`,
    carbs: `${Math.floor(Math.random() * 40) + 10}g`,
    fat: `${Math.floor(Math.random() * 15) + 3}g`,
    allergens: ['gluten', 'dairy'].filter(() => Math.random() > 0.5)
  };

  const ingredients = item.ingredients || [
    'Fresh ingredients',
    'Premium quality',
    'Made with love'
  ];

  return (
    <AnimatePresence>
      {open && (
        <Dialog
          open={open}
          onClose={onClose}
          fullScreen={fullScreen}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: fullScreen ? 0 : 3,
              maxHeight: '90vh',
              overflow: 'hidden'
            }
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          >
            {/* Header */}
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              p={2}
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white'
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Item Details
              </Typography>
              <IconButton
                onClick={onClose}
                sx={{ color: 'white' }}
                size="small"
              >
                <Close />
              </IconButton>
            </Box>

            <DialogContent sx={{ p: 0, overflow: 'hidden' }}>
              <Box sx={{ maxHeight: '70vh', overflowY: 'auto' }}>
                {/* Item Image */}
                <Box
                  position="relative"
                  height={250}
                  sx={{
                    background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <Avatar
                      src={item.image || '/images/TKFC-5.jpg'}
                      sx={{
                        width: 150,
                        height: 150,
                        borderRadius: 3,
                        border: '4px solid white',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
                      }}
                      alt={item.name}
                    />
                  </motion.div>

                  {/* Status Chips */}
                  <Box position="absolute" top={16} right={16}>
                    {!isAvailable && (
                      <Chip
                        label="Unavailable"
                        color="error"
                        size="small"
                        sx={{ mb: 1 }}
                      />
                    )}
                    {cartQuantity > 0 && (
                      <Chip
                        label={`${cartQuantity} in cart`}
                        color="primary"
                        size="small"
                      />
                    )}
                  </Box>
                </Box>

                {/* Item Information */}
                <Box p={3}>
                  {/* Title and Price */}
                  <Box mb={2}>
                    <Typography
                      variant="h4"
                      sx={{ fontWeight: 800, mb: 1, color: 'text.primary' }}
                    >
                      {item.name}
                    </Typography>
                    <Typography
                      variant="h5"
                      sx={{ fontWeight: 700, color: 'primary.main' }}
                    >
                      ${price}
                    </Typography>
                  </Box>

                  {/* Category and Availability */}
                  <Box display="flex" gap={1} mb={2}>
                    <Chip
                      label={item.category}
                      color="secondary"
                      size="small"
                      icon={<Restaurant />}
                    />
                    {item.quantity_available !== undefined && (
                      <Chip
                        label={`${item.quantity_available} available`}
                        color={isAvailable ? 'success' : 'error'}
                        size="small"
                        variant="outlined"
                      />
                    )}
                  </Box>

                  {/* Description */}
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{ mb: 3, lineHeight: 1.6 }}
                  >
                    {item.description}
                  </Typography>

                  <Divider sx={{ my: 3 }} />

                  {/* Nutritional Information */}
                  <Box mb={3}>
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: 700, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}
                    >
                      <LocalDining color="primary" />
                      Nutritional Information
                    </Typography>
                    <Box
                      display="grid"
                      gridTemplateColumns="repeat(auto-fit, minmax(120px, 1fr))"
                      gap={2}
                    >
                      <Box textAlign="center" p={2} sx={{ bgcolor: 'grey.50', borderRadius: 2 }}>
                        <Typography variant="h6" color="primary.main" sx={{ fontWeight: 700 }}>
                          {nutritionalInfo.calories}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Calories
                        </Typography>
                      </Box>
                      <Box textAlign="center" p={2} sx={{ bgcolor: 'grey.50', borderRadius: 2 }}>
                        <Typography variant="h6" color="primary.main" sx={{ fontWeight: 700 }}>
                          {nutritionalInfo.protein}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Protein
                        </Typography>
                      </Box>
                      <Box textAlign="center" p={2} sx={{ bgcolor: 'grey.50', borderRadius: 2 }}>
                        <Typography variant="h6" color="primary.main" sx={{ fontWeight: 700 }}>
                          {nutritionalInfo.carbs}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Carbs
                        </Typography>
                      </Box>
                      <Box textAlign="center" p={2} sx={{ bgcolor: 'grey.50', borderRadius: 2 }}>
                        <Typography variant="h6" color="primary.main" sx={{ fontWeight: 700 }}>
                          {nutritionalInfo.fat}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Fat
                        </Typography>
                      </Box>
                    </Box>
                  </Box>

                  {/* Ingredients */}
                  {ingredients.length > 0 && (
                    <Box mb={3}>
                      <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                        Ingredients
                      </Typography>
                      <Box display="flex" flexWrap="wrap" gap={1}>
                        {ingredients.map((ingredient, index) => (
                          <Chip
                            key={index}
                            label={ingredient}
                            size="small"
                            variant="outlined"
                            sx={{ borderRadius: 4 }}
                          />
                        ))}
                      </Box>
                    </Box>
                  )}

                  {/* Allergens */}
                  {nutritionalInfo.allergens && nutritionalInfo.allergens.length > 0 && (
                    <Box mb={3}>
                      <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: 'warning.main' }}>
                        Contains Allergens
                      </Typography>
                      <Box display="flex" flexWrap="wrap" gap={1}>
                        {nutritionalInfo.allergens.map((allergen, index) => (
                          <Chip
                            key={index}
                            label={allergen}
                            size="small"
                            color="warning"
                            variant="outlined"
                          />
                        ))}
                      </Box>
                    </Box>
                  )}
                </Box>
              </Box>
            </DialogContent>

            {/* Actions */}
            <DialogActions sx={{ p: 3, pt: 1, background: 'rgba(0,0,0,0.02)' }}>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                width="100%"
                gap={2}
              >
                <QuantitySelector
                  quantity={quantity}
                  onQuantityChange={setQuantity}
                  min={1}
                  max={item.quantity_available || 99}
                  disabled={!isAvailable}
                  showLabel
                />

                <AnimatedButton
                  variant="contained"
                  size="large"
                  disabled={!isAvailable}
                  onClick={handleAddToCart}
                  sx={{
                    px: 4,
                    py: 1.5,
                    borderRadius: 3,
                    fontWeight: 700,
                    textTransform: 'none',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
                    }
                  }}
                >
                  Add {quantity} to Cart • ${(item.price * quantity).toFixed(2)}
                </AnimatedButton>
              </Box>
            </DialogActions>
          </motion.div>
        </Dialog>
      )}
    </AnimatePresence>
  );
};

export default ItemDetailModal;