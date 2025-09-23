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
  IconButton,
} from '@mui/material';
import { AdminPanelSettings, Visibility, VisibilityOff } from '@mui/icons-material';
import { motion } from 'framer-motion';
import AnimatedButton from '@/components/ui/AnimatedButton';
import AnimatedCard from '@/components/ui/AnimatedCard';
import { staggerItem } from '@/lib/theme';

interface AdminLoginFormProps {
  onSuccess?: () => void;
}

const AdminLoginForm: React.FC<AdminLoginFormProps> = ({ onSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username.trim() || !password.trim()) {
      setError('Please enter both username and password');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await signIn('admin', {
        username,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('Invalid credentials. Please check your username and password.');
      } else if (result?.ok) {
        onSuccess?.();
        router.push('/admin/dashboard');
        router.refresh();
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error('Admin login error:', err);
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <AnimatedCard sx={{ p: 4, maxWidth: 400, width: '100%' }}>
      <motion.div variants={staggerItem}>
        <Box display="flex" flexDirection="column" alignItems="center" mb={3}>
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
          >
            <Typography variant="h4" component="h2" gutterBottom>
              🔐 Admin Panel
            </Typography>
          </motion.div>
          <Typography variant="body1" color="text.secondary" textAlign="center">
            Manage users, menu, and orders
          </Typography>
        </Box>

        <form onSubmit={handleSubmit}>
          <motion.div variants={staggerItem}>
            <TextField
              fullWidth
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              error={!!error && !username}
              margin="normal"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AdminPanelSettings color="primary" />
                  </InputAdornment>
                ),
              }}
              autoFocus
              disabled={loading}
              autoComplete="username"
            />
          </motion.div>

          <motion.div variants={staggerItem}>
            <TextField
              fullWidth
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={!!error && !password}
              margin="normal"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Box width={24} /> {/* Spacer for alignment */}
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={togglePasswordVisibility}
                      edge="end"
                      disabled={loading}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              disabled={loading}
              autoComplete="current-password"
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
              emoji="⚡"
              loading={loading}
              disabled={!username.trim() || !password.trim()}
              color="secondary"
            >
              {loading ? 'Logging in...' : 'Admin Login'}
            </AnimatedButton>
          </motion.div>
        </form>

        <motion.div variants={staggerItem}>
          <Box mt={3} textAlign="center">
            <Typography variant="body2" color="text.secondary">
              🔒 Admin access only
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Default: admin123 (change after first login)
            </Typography>
          </Box>
        </motion.div>
      </motion.div>
    </AnimatedCard>
  );
};

export default AdminLoginForm;