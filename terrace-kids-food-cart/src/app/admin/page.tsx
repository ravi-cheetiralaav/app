"use client";

import React from 'react';
import { Box, Typography } from '@mui/material';
import PageWrapper from '@/components/ui/PageWrapper';
import AdminLoginForm from '@/components/admin/AdminLoginForm';
import { motion } from 'framer-motion';
import FloatingEmojis from '@/components/ui/FloatingEmojis';
import { staggerContainer, staggerItem } from '@/lib/theme';

export default function AdminLanding() {
  return (
    <>
      <FloatingEmojis category="celebration" count={4} />
      <PageWrapper maxWidth="sm">
        <motion.div variants={staggerContainer} initial="hidden" animate="visible">
          <motion.div variants={staggerItem}>
            <Box textAlign="center" my={6}>
              <Typography variant="h4" gutterBottom>
                Admin Login
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                Access the admin dashboard to manage menu, users, and orders.
              </Typography>
            </Box>
          </motion.div>

          <motion.div variants={staggerItem}>
            <Box display="flex" justifyContent="center" mb={6}>
              <AdminLoginForm />
            </Box>
          </motion.div>
        </motion.div>
      </PageWrapper>
    </>
  );
}
