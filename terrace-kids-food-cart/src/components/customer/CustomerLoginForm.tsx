'use client';

import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
  Box,
  TextField,
  Typography,
  Alert,
  InputAdornment,
} from '@mui/material';
import { Person } from '@mui/icons-material';
import { motion } from 'framer-motion';
import AnimatedButton from '@/components/ui/AnimatedButton';
import AnimatedCard from '@/components/ui/AnimatedCard';
import { staggerItem } from '@/lib/theme';

interface CustomerLoginFormProps {
  onSuccess?: () => void;
}

const CustomerLoginForm: React.FC<CustomerLoginFormProps> = ({ onSuccess }) => {
  const [userId, setUserId] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userId.trim()) {
      setError('Please enter your User ID');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await signIn('customer', {
        user_id: userId,
        redirect: false,
      });

      if (result?.error) {
        setError('Invalid User ID. Please check and try again.');
      } else if (result?.ok) {
        onSuccess?.();
        router.push('/customer/dashboard');
        router.refresh();
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatedCard sx={{ p: 4, maxWidth: 400, width: '100%' }}>
      <motion.div variants={staggerItem}>
        <Box display="flex" flexDirection="column" alignItems="center" mb={3}>
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          >
            <Typography variant="h4" component="h2" gutterBottom>
              👋 Customer Login
            </Typography>
          </motion.div>
          <Typography variant="body1" color="text.secondary" textAlign="center">
            Enter your User ID to place orders
          </Typography>
        </Box>

        <form onSubmit={handleSubmit}>
          <motion.div variants={staggerItem}>
            <TextField
              fullWidth
              label="User ID"
              placeholder="e.g., John_ST_123"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              error={!!error && !userId}
              helperText={!userId && error ? error : ''}
              margin="normal"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Person color="primary" />
                  </InputAdornment>
                ),
              }}
              autoFocus
              disabled={loading}
            />
          </motion.div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              variants={staggerItem}
            >
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            </motion.div>
          )}

          <motion.div variants={staggerItem} style={{ marginTop: 24 }}>
            <AnimatedButton
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              emoji="🔑"
              loading={loading}
              disabled={!userId.trim()}
            >
              {loading ? 'Logging in...' : 'Login'}
            </AnimatedButton>
          </motion.div>
        </form>

        <motion.div variants={staggerItem}>
          <Box mt={3} textAlign="center">
            <Typography variant="body2" color="text.secondary">
              Don&apos;t have a User ID? Ask admin to create one for you! 😊
            </Typography>
          </Box>
        </motion.div>
      </motion.div>
    </AnimatedCard>
  );
};

export default CustomerLoginForm;