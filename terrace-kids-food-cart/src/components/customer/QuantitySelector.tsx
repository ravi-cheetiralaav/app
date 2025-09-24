'use client';

import React from 'react';
import { Box, IconButton, Typography, Chip } from '@mui/material';
import { Add, Remove } from '@mui/icons-material';
import { motion } from 'framer-motion';

interface QuantitySelectorProps {
  quantity: number;
  onQuantityChange: (quantity: number) => void;
  min?: number;
  max?: number;
  disabled?: boolean;
  size?: 'small' | 'medium' | 'large';
  showLabel?: boolean;
}

const QuantitySelector: React.FC<QuantitySelectorProps> = ({
  quantity,
  onQuantityChange,
  min = 0,
  max = 99,
  disabled = false,
  size = 'medium',
  showLabel = false
}) => {
  const increment = () => {
    if (quantity < max && !disabled) {
      onQuantityChange(quantity + 1);
    }
  };

  const decrement = () => {
    if (quantity > min && !disabled) {
      onQuantityChange(quantity - 1);
    }
  };

  const sizeConfig = {
    small: {
      buttonSize: 32,
      chipHeight: 32,
      fontSize: '0.875rem',
      iconSize: 'small' as const
    },
    medium: {
      buttonSize: 40,
      chipHeight: 40,
      fontSize: '1rem',
      iconSize: 'medium' as const
    },
    large: {
      buttonSize: 48,
      chipHeight: 48,
      fontSize: '1.125rem',
      iconSize: 'medium' as const
    }
  };

  const config = sizeConfig[size];

  return (
    <Box display="flex" flexDirection="column" alignItems="center" gap={1}>
      {showLabel && (
        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
          Quantity
        </Typography>
      )}
      
      <Box display="flex" alignItems="center" gap={1}>
        <motion.div
          whileHover={{ scale: disabled ? 1 : 1.1 }}
          whileTap={{ scale: disabled ? 1 : 0.95 }}
        >
          <IconButton
            onClick={decrement}
            disabled={disabled || quantity <= min}
            size={size}
            sx={{
              width: config.buttonSize,
              height: config.buttonSize,
              bgcolor: 'grey.100',
              border: '2px solid transparent',
              '&:hover': {
                bgcolor: 'grey.200',
                borderColor: 'primary.light'
              },
              '&:disabled': {
                bgcolor: 'grey.50',
                color: 'grey.300'
              },
              transition: 'all 0.2s ease'
            }}
          >
            <Remove fontSize={config.iconSize} />
          </IconButton>
        </motion.div>

        <motion.div
          key={quantity}
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        >
          <Chip
            label={quantity}
            variant="outlined"
            sx={{
              height: config.chipHeight,
              minWidth: config.chipHeight,
              fontSize: config.fontSize,
              fontWeight: 700,
              borderWidth: 2,
              borderColor: 'primary.main',
              color: 'primary.main',
              '& .MuiChip-label': {
                px: 1
              }
            }}
          />
        </motion.div>

        <motion.div
          whileHover={{ scale: disabled ? 1 : 1.1 }}
          whileTap={{ scale: disabled ? 1 : 0.95 }}
        >
          <IconButton
            onClick={increment}
            disabled={disabled || quantity >= max}
            size={size}
            sx={{
              width: config.buttonSize,
              height: config.buttonSize,
              bgcolor: 'primary.50',
              color: 'primary.main',
              border: '2px solid transparent',
              '&:hover': {
                bgcolor: 'primary.100',
                borderColor: 'primary.main'
              },
              '&:disabled': {
                bgcolor: 'grey.50',
                color: 'grey.300'
              },
              transition: 'all 0.2s ease'
            }}
          >
            <Add fontSize={config.iconSize} />
          </IconButton>
        </motion.div>
      </Box>

      {quantity > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
        >
          <Typography 
            variant="caption" 
            color="primary.main" 
            sx={{ fontWeight: 600 }}
          >
            {quantity} selected
          </Typography>
        </motion.div>
      )}
    </Box>
  );
};

export default QuantitySelector;