"use client";

export const dynamic = 'force-dynamic';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Box, Typography, Paper } from '@mui/material';
import { motion } from 'framer-motion';
import CustomerLoginForm from '@/components/customer/CustomerLoginForm';
import FloatingEmojis from '@/components/ui/FloatingEmojis';
import PageWrapper from '@/components/ui/PageWrapper';
import { staggerContainer, staggerItem } from '@/lib/theme';
import Image from 'next/image';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

// no tab panels needed — this page only exposes customer login to public

export default function LoginPage() {
  // If a user hits /login?tab=admin, redirect to the dedicated admin login page
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    try {
      // If already authenticated, send user to customer dashboard
      if (session) {
        router.replace('/customer/dashboard');
        return;
      }
      const search = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
      const tab = search ? search.get('tab') : null;
      if (tab === 'admin') {
        // client-side redirect to avoid route/page conflict
        router.replace('/admin');
      }
    } catch (e) {
      // ignore in non-browser environments
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <FloatingEmojis category="hearts" count={6} />
      <PageWrapper maxWidth="sm">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            minHeight="80vh"
          >
            <motion.div variants={staggerItem}>
              <Box sx={{ mb: 2 }}>
                <Image
                  src="/images/TKFC-5.jpg"
                  alt="Terrace Kids Food Cart Logo"
                  width={96}
                  height={96}
                  style={{ borderRadius: '12px', display: 'block', margin: '0 auto' }}
                />
              </Box>

              <Typography 
                variant="h3" 
                component="h1" 
                textAlign="center" 
                gutterBottom
                sx={{ mb: 4 }}
              >
                🌈 Welcome Back! 🌈
              </Typography>
            </motion.div>

            <motion.div variants={staggerItem}>
              <Paper 
                elevation={8}
                sx={{ 
                  width: '100%',
                  maxWidth: 500,
                  background: 'linear-gradient(135deg, rgba(255,107,107,0.1) 0%, rgba(78,205,196,0.1) 100%)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.3)',
                }}
              >
                <Box p={3}>
                  <Box display="flex" justifyContent="center">
                    <CustomerLoginForm />
                  </Box>
                </Box>
              </Paper>
            </motion.div>

            <motion.div variants={staggerItem}>
              <Box mt={4} textAlign="center">
                <Typography variant="body2" color="text.secondary">
                  🏠 Terrace Kids Food Cart - Making learning delicious! 🏠
                </Typography>
              </Box>
            </motion.div>
          </Box>
        </motion.div>
      </PageWrapper>
    </>
  );
}