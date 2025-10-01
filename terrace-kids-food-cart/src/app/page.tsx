'use client';

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Container,
  Paper,
  Chip,
  Stack,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  RestaurantMenu,
  ShoppingCart,
  QrCode,
  People,
  Schedule,
  Star,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import AnimatedButton from '@/components/ui/AnimatedButton';
import AnimatedCard from '@/components/ui/AnimatedCard';
import FloatingEmojis from '@/components/ui/FloatingEmojis';
import PageWrapper from '@/components/ui/PageWrapper';
import { staggerContainer, staggerItem } from '@/lib/theme';

const features = [
  {
    icon: <RestaurantMenu fontSize="large" />,
    title: 'Fresh Menu',
    description: 'Browse delicious food & beverages with ingredients and health benefits',
    emoji: '🍕',
  },
  {
    icon: <ShoppingCart fontSize="large" />,
    title: 'Easy Ordering',
    description: 'Simple ordering system designed for kids and families',
    emoji: '🛒',
  },
  {
    icon: <QrCode fontSize="large" />,
    title: 'QR Pickup',
    description: 'Scan QR codes for quick and easy order pickup',
    emoji: '📱',
  },
  {
    icon: <Schedule fontSize="large" />,
    title: 'Time-Limited',
    description: 'Orders close before event day to help with planning',
    emoji: '⏰',
  },
  {
    icon: <People fontSize="large" />,
    title: 'Community',
    description: 'Connecting neighbors and friends through food',
    emoji: '🤝',
  },
  {
    icon: <Star fontSize="large" />,
    title: 'Learning',
    description: 'Kids learn business, customer service, and responsibility',
    emoji: '📚',
  },
];

const benefits = [
  'Real-time inventory tracking',
  'Mobile-first responsive design',
  'Safe neighborhood community',
  'Educational business experience',
  'Cash-only simple transactions',
  'QR code pickup system',
];

export default function LandingPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { data: session } = useSession();
  const treatHref = session ? '/customer/menu' : '/login';
  const [toastOpen, setToastOpen] = useState(false);

  const handleTreatClick = () => {
    // show a friendly toast if user is already signed in
    if (session) {
      setToastOpen(true);
      setTimeout(() => setToastOpen(false), 2200);
    }
  };

  return (
    <>
      <FloatingEmojis category="celebration" count={8} />
      <PageWrapper maxWidth="lg">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          {/* Hero Section */}
          <Box textAlign="center" py={6}>
            <motion.div variants={staggerItem}>
              <motion.div
                animate={{ 
                  scale: [1, 1.05, 1],
                  rotate: [0, 2, -2, 0] 
                }}
                transition={{ 
                  duration: 4, 
                  repeat: Infinity,
                  repeatDelay: 2
                }}
              >
                <Image
                  src="/images/TKFC-5.jpg"
                  alt="Terrace Kids Food Cart Logo"
                  width={200}
                  height={200}
                  style={{
                    borderRadius: '50%',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                    margin: '0 auto 24px auto',
                    display: 'block',
                  }}
                />
              </motion.div>
            </motion.div>

            {/* Welcome badge when signed in */}
            {session && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                <Chip label={`Hello ${((session as any)?.user?.name) || 'Friend'}! 👋`} sx={{ borderRadius: 3, bgcolor: 'rgba(255,255,255,0.9)' }} />
              </Box>
            )}

            {/* Intro paragraph intentionally removed per request */}

            {/* Hero CTA removed - button moved to the Call To Action section below */}
          </Box>

          {/* Features Section */}
          {/* Features section removed as requested */}

          {/* Benefits section removed as requested */}

          {/* Call to Action */}
          <motion.div variants={staggerItem}>
            <Paper 
              sx={{ 
                p: 6, 
                textAlign: 'center',
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
                color: 'white'
              }}
            >
              <Typography variant="h4" gutterBottom fontWeight={600}>
                Ready to Support Our Kids
              </Typography>
              
              <Typography variant="h6" paragraph sx={{ maxWidth: 600, mx: 'auto' }}>
                Join us to support young entrepreneurs, enjoy tasty treats, and help kids build real-world skills!
              </Typography>
              
              <Stack 
                direction={{ xs: 'column', sm: 'row' }} 
                spacing={3}
                justifyContent="center"
                alignItems="center"
                mt={4}
              >
                <AnimatedButton
                  component={Link}
                  href={treatHref}
                  onClick={handleTreatClick}
                  variant="contained"
                  color="secondary"
                  size="large"
                  emoji="❤️"
                  sx={{ minWidth: 200 }}
                >
                  Treat Yourself
                </AnimatedButton>
              </Stack>
            </Paper>
          </motion.div>
          {/* Temporary toast/snackbar for confirmation */}
          <Box>
            {toastOpen && (
              <Paper elevation={6} sx={{ position: 'fixed', bottom: 24, right: 24, p: 2, borderRadius: 2 }}>
                <Typography>You're already signed in — taking you to the menu! 🍰</Typography>
              </Paper>
            )}
          </Box>
        </motion.div>
      </PageWrapper>
    </>
  );
}