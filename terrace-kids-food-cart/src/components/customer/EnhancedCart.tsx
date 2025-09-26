'use client';

import React from 'react';
import { 
  Box, 
  Typography, 
  IconButton, 
  Divider, 
  Chip,
  Badge,
  Collapse,
  Avatar
} from '@mui/material';
import { 
  Add, 
  Remove, 
  ShoppingCart, 
  DeleteOutline,
  ExpandMore,
  ExpandLess
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import AnimatedCard from '@/components/ui/AnimatedCard';
import AnimatedButton from '@/components/ui/AnimatedButton';

interface CartItem {
  menu_item_id: number;
  name: string;
  quantity: number;
  unit_price: number;
  image?: string;
}

interface EnhancedCartProps {
  cart: CartItem[];
  onUpdateQuantity: (itemId: number, quantity: number) => void;
  onRemoveItem: (itemId: number) => void;
  onCheckout: () => void;
  loading?: boolean;
  isExpanded?: boolean;
  onToggleExpanded?: () => void;
}

const EnhancedCart: React.FC<EnhancedCartProps> = ({
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
  loading = false,
  isExpanded = true,
  onToggleExpanded
}) => {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + (item.unit_price * item.quantity), 0);

  const cartVariants = {
    empty: {
      scale: 0.95,
      opacity: 0.7
    },
    filled: {
      scale: 1,
      opacity: 1
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20, scale: 0.9 },
    visible: { opacity: 1, x: 0, scale: 1 },
    exit: { opacity: 0, x: 20, scale: 0.9 }
  };

  const isEmpty = cart.length === 0;

  return (
    <motion.div
      variants={cartVariants}
      animate={isEmpty ? 'empty' : 'filled'}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
    >
      <AnimatedCard
        sx={{
          width: { xs: '100%', md: 400 },
          maxWidth: '90vw',
          position: 'sticky',
          top: 20,
          background: 'linear-gradient(135deg, #fff 0%, #f8f9fa 100%)',
          boxShadow: isEmpty ? 2 : 4,
          border: isEmpty ? '2px dashed #e0e0e0' : '2px solid transparent',
          '&:hover': {
            boxShadow: isEmpty ? 3 : 6,
          }
        }}
      >
        {/* Cart Header */}
        <Box 
          p={3} 
          pb={cart.length > 0 ? 2 : 3}
          display="flex" 
          alignItems="center" 
          justifyContent="space-between"
          sx={{ cursor: onToggleExpanded ? 'pointer' : 'default' }}
          onClick={onToggleExpanded}
        >
          <Box display="flex" alignItems="center" gap={2}>
            <Badge 
              badgeContent={totalItems} 
              color="primary"
              sx={{
                '& .MuiBadge-badge': {
                  fontWeight: 700,
                  fontSize: '0.75rem'
                }
              }}
            >
              <ShoppingCart 
                sx={{ 
                  fontSize: '1.5rem',
                  color: isEmpty ? 'text.disabled' : 'primary.main'
                }} 
              />
            </Badge>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 700,
                color: isEmpty ? 'text.disabled' : 'text.primary'
              }}
            >
              Your Cart
            </Typography>
          </Box>

          <Box display="flex" alignItems="center" gap={1}>
            {!isEmpty && (
              <Chip
                label={`$${totalPrice.toFixed(2)}`}
                color="primary"
                size="small"
                sx={{ fontWeight: 700 }}
              />
            )}
            {onToggleExpanded && (
              <IconButton size="small">
                {isExpanded ? <ExpandLess /> : <ExpandMore />}
              </IconButton>
            )}
          </Box>
        </Box>

        {/* Cart Content */}
        <Collapse in={isExpanded} timeout="auto" unmountOnExit>
          <Box px={3} pb={3}>
            {isEmpty ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Box textAlign="center" py={4}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2, fontStyle: 'italic' }}
                  >
                    Your cart is empty 🛒
                  </Typography>
                  <Typography variant="caption" color="text.disabled">
                    Add some delicious items to get started!
                  </Typography>
                </Box>
              </motion.div>
            ) : (
              <>
                {/* Cart Items */}
                <Box sx={{ maxHeight: 300, overflowY: 'auto', mb: 2 }}>
                  <AnimatePresence mode="popLayout">
                    {cart.map((item, index) => (
                      <motion.div
                        key={item.menu_item_id}
                        variants={itemVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        transition={{ delay: index * 0.1 }}
                        layout
                      >
                        <Box
                          display="flex"
                          alignItems="center"
                          gap={2}
                          py={2}
                          sx={{
                            borderBottom: '1px solid #f0f0f0',
                            '&:last-child': { borderBottom: 'none' }
                          }}
                        >
                          {/* Item Image */}
                          <Avatar
                            src={item.image || '/images/TKFC-5.jpg'}
                            sx={{ width: 40, height: 40, borderRadius: 1 }}
                            alt={item.name}
                          />

                          {/* Item Details */}
                          <Box flex={1} minWidth={0}>
                            <Typography
                              variant="body2"
                              sx={{
                                fontWeight: 600,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                              }}
                            >
                              {item.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              ${item.unit_price.toFixed(2)} each
                            </Typography>
                          </Box>

                          {/* Quantity Controls */}
                          <Box display="flex" alignItems="center" gap={1}>
                            <IconButton
                              size="small"
                              onClick={() => onUpdateQuantity(item.menu_item_id, Math.max(0, item.quantity - 1))}
                              sx={{ 
                                bgcolor: 'grey.100',
                                '&:hover': { bgcolor: 'grey.200' }
                              }}
                            >
                              <Remove fontSize="small" />
                            </IconButton>
                            
                            <Chip
                              label={item.quantity}
                              size="small"
                              variant="outlined"
                              sx={{ minWidth: 32, fontWeight: 700 }}
                            />
                            
                            <IconButton
                              size="small"
                              onClick={() => onUpdateQuantity(item.menu_item_id, item.quantity + 1)}
                              sx={{ 
                                bgcolor: 'primary.50',
                                color: 'primary.main',
                                '&:hover': { bgcolor: 'primary.100' }
                              }}
                            >
                              <Add fontSize="small" />
                            </IconButton>

                            <IconButton
                              size="small"
                              onClick={() => onRemoveItem(item.menu_item_id)}
                              sx={{ 
                                color: 'error.main',
                                '&:hover': { bgcolor: 'error.50' }
                              }}
                            >
                              <DeleteOutline fontSize="small" />
                            </IconButton>
                          </Box>

                          {/* Item Total */}
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: 700, minWidth: 50, textAlign: 'right' }}
                          >
                            ${(item.unit_price * item.quantity).toFixed(2)}
                          </Typography>
                        </Box>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </Box>

                {/* Cart Summary */}
                <Divider sx={{ my: 2 }} />
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    Total ({totalItems} {totalItems === 1 ? 'item' : 'items'})
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 800, color: 'primary.main' }}>
                    ${totalPrice.toFixed(2)}
                  </Typography>
                </Box>

                {/* Checkout Button */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <AnimatedButton
                    variant="contained"
                    fullWidth
                    size="large"
                    disabled={loading || isEmpty}
                    onClick={onCheckout}
                    sx={{
                      py: 1.5,
                      borderRadius: 3,
                      fontWeight: 700,
                      fontSize: '1.1rem',
                      textTransform: 'none',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
                      }
                    }}
                  >
                    {loading ? 'Processing...' : `Checkout • $${totalPrice.toFixed(2)}`}
                  </AnimatedButton>
                </motion.div>
              </>
            )}
          </Box>
        </Collapse>
      </AnimatedCard>
    </motion.div>
  );
};

export default EnhancedCart;