'use client';

import React from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Chip,
  Avatar,
  Stack,
} from '@mui/material';
import {
  RestaurantMenu,
  ShoppingCart,
  History,
  AccountCircle,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import AnimatedButton from '@/components/ui/AnimatedButton';
import AnimatedCard from '@/components/ui/AnimatedCard';
import FloatingEmojis from '@/components/ui/FloatingEmojis';
import PageWrapper from '@/components/ui/PageWrapper';
import { staggerContainer, staggerItem } from '@/lib/theme';

const dashboardItems = [
  {
    title: 'Browse Menu',
    description: 'Check out our delicious food and beverages',
    icon: <RestaurantMenu fontSize="large" />,
    emoji: '🍽️',
    href: '/customer/menu',
    color: '#FF6B6B',
  },
  {
    title: 'My Orders',
    description: 'View your current and upcoming orders',
    icon: <ShoppingCart fontSize="large" />,
    emoji: '🛒',
    href: '/customer/orders',
    color: '#4ECDC4',
  },
  {
    title: 'Order History',
    description: 'See all your past orders and favorites',
    icon: <History fontSize="large" />,
    emoji: '📋',
    href: '/customer/history',
    color: '#45B7D1',
  },
  {
    title: 'My Profile',
    description: 'Update your information and preferences',
    icon: <AccountCircle fontSize="large" />,
    emoji: '👤',
    href: '/customer/profile',
    color: '#FFA726',
  },
];

export default function CustomerDashboard() {
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
    router.push('/login');
    return null;
  }

  const extendedSession = session as any;

  return (
    <>
      <FloatingEmojis category="food" count={8} />
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
                  bgcolor: 'primary.main',
                  fontSize: '2rem',
                }}
              >
                👋
              </Avatar>
              <Typography variant="h3" gutterBottom>
                {extendedSession?.greeting_word || 'Hello'}, {session?.user?.name?.split(' ')[0]}!
              </Typography>
              <Typography variant="h6" color="text.secondary" paragraph>
                Welcome to your food cart dashboard! 🎉
              </Typography>
              <Chip
                label={`User ID: ${extendedSession?.user_id}`}
                variant="outlined"
                sx={{ mt: 1 }}
              />
            </Box>
          </motion.div>

          {/* Dashboard Grid */}
          <motion.div variants={staggerItem}>
            <Box 
              display="grid" 
              gridTemplateColumns={{ xs: '1fr', sm: 'repeat(2, 1fr)' }}
              gap={4}
            >
              {dashboardItems.map((item, index) => (
                <AnimatedCard 
                  key={index}
                  delay={index * 0.1}
                  sx={{ 
                    cursor: 'pointer',
                    background: `linear-gradient(135deg, ${item.color}15 0%, ${item.color}05 100%)`,
                    border: `2px solid ${item.color}30`,
                    '&:hover': {
                      borderColor: item.color,
                    },
                  }}
                  onClick={() => router.push(item.href)}
                >
                  <CardContent sx={{ textAlign: 'center', p: 4 }}>
                    <motion.div
                      animate={{ 
                        rotate: [0, 5, -5, 0],
                        scale: [1, 1.1, 1],
                      }}
                      transition={{ 
                        duration: 3, 
                        repeat: Infinity,
                        repeatDelay: index * 0.5 + 2
                      }}
                    >
                      <Box 
                        sx={{
                          fontSize: '3rem',
                          mb: 2,
                        }}
                      >
                        {item.emoji}
                      </Box>
                    </motion.div>
                    
                    <Box color={item.color} mb={2}>
                      {item.icon}
                    </Box>
                    
                    <Typography variant="h5" gutterBottom fontWeight={600}>
                      {item.title}
                    </Typography>
                    
                    <Typography variant="body2" color="text.secondary">
                      {item.description}
                    </Typography>
                  </CardContent>
                  
                  <CardActions sx={{ justifyContent: 'center', pb: 3 }}>
                    <AnimatedButton
                      variant="contained"
                      sx={{
                        backgroundColor: item.color,
                        '&:hover': {
                          backgroundColor: item.color,
                          filter: 'brightness(1.1)',
                        },
                      }}
                    >
                      Go to {item.title}
                    </AnimatedButton>
                  </CardActions>
                </AnimatedCard>
              ))}
            </Box>
          </motion.div>

          {/* Quick Info Card */}
          <motion.div variants={staggerItem}>
            <AnimatedCard 
              sx={{ 
                mt: 6, 
                p: 4, 
                textAlign: 'center',
                background: 'linear-gradient(135deg, #FF6B6B20, #4ECDC420)',
              }}
            >
              <Typography variant="h5" gutterBottom fontWeight={600}>
                🎯 Quick Tips for Ordering
              </Typography>
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} mt={2}>
                <Box>
                  <Typography variant="h6" color="primary" gutterBottom>
                    ⏰ Order Early
                  </Typography>
                  <Typography variant="body2">
                    Orders close before event day. Don&apos;t miss out on your favorites!
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="h6" color="secondary" gutterBottom>
                    📱 QR Code Pickup
                  </Typography>
                  <Typography variant="body2">
                    Your order confirmation includes a QR code for easy pickup.
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="h6" color="primary" gutterBottom>
                    💰 Cash Only
                  </Typography>
                  <Typography variant="body2">
                    Please bring exact change for pickup. Kids love counting money!
                  </Typography>
                </Box>
              </Stack>
            </AnimatedCard>
          </motion.div>
        </motion.div>
      </PageWrapper>
    </>
  );
}