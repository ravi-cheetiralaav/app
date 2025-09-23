'use client';

import React from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Typography,
  Avatar,
  Chip,
} from '@mui/material';
import { motion } from 'framer-motion';
import FloatingEmojis from '@/components/ui/FloatingEmojis';
import PageWrapper from '@/components/ui/PageWrapper';
import { staggerContainer, staggerItem } from '@/lib/theme';

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === 'loading') {
    return (
      <PageWrapper>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
          <Typography variant="h5">Loading... 🌟</Typography>
        </Box>
      </PageWrapper>
    );
  }

  if (status === 'unauthenticated') {
    router.push('/login?tab=admin');
    return null;
  }

  const extendedSession = session as any;

  // Check if user is admin
  if (!extendedSession?.is_admin) {
    router.push('/customer/dashboard');
    return null;
  }

  return (
    <>
      <FloatingEmojis category="celebration" count={6} />
      <PageWrapper maxWidth="lg">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          {/* Welcome Header */}
          <motion.div variants={staggerItem}>
            <Box textAlign="center" mb={6}>
              <Avatar
                sx={{
                  width: 80,
                  height: 80,
                  mx: 'auto',
                  mb: 2,
                  bgcolor: 'secondary.main',
                  fontSize: '2rem',
                }}
              >
                ⚙️
              </Avatar>
              <Typography variant="h3" gutterBottom>
                Admin Dashboard
              </Typography>
              <Typography variant="h6" color="text.secondary" paragraph>
                Welcome to the admin panel! 🎉
              </Typography>
              <Chip
                label={`Admin: ${session?.user?.name}`}
                variant="outlined"
                color="secondary"
                sx={{ mt: 1 }}
              />
            </Box>
          </motion.div>

          {/* Coming Soon Message */}
          <motion.div variants={staggerItem}>
            <Box 
              textAlign="center" 
              py={8}
              sx={{
                background: 'linear-gradient(135deg, #4ECDC420, #45B7D120)',
                borderRadius: 4,
                border: '2px dashed #4ECDC4',
              }}
            >
              <Typography variant="h4" gutterBottom>
                🚧 Coming Soon! 🚧
              </Typography>
              <Typography variant="h6" color="text.secondary" paragraph>
                Admin features are being built with love by our development team.
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Soon you&apos;ll be able to:
              </Typography>
              <Box mt={2}>
                <Typography variant="body2" paragraph>
                  👥 Manage Users • 🍕 Update Menu • 📊 View Orders • 📈 Generate Reports
                </Typography>
              </Box>
            </Box>
          </motion.div>
        </motion.div>
      </PageWrapper>
    </>
  );
}