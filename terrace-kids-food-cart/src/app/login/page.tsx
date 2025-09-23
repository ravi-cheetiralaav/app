'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Box,
  Tabs,
  Tab,
  Typography,
  Paper,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import CustomerLoginForm from '@/components/customer/CustomerLoginForm';
import AdminLoginForm from '@/components/admin/AdminLoginForm';
import FloatingEmojis from '@/components/ui/FloatingEmojis';
import PageWrapper from '@/components/ui/PageWrapper';
import { staggerContainer, staggerItem } from '@/lib/theme';
import Image from 'next/image';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel({ children, value, index, ...other }: TabPanelProps) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`login-tabpanel-${index}`}
      aria-labelledby={`login-tab-${index}`}
      {...other}
    >
      {value === index && (
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Box pt={4}>
              {children}
            </Box>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `login-tab-${index}`,
    'aria-controls': `login-tabpanel-${index}`,
  };
}

export default function LoginPage() {
  const searchParams = useSearchParams();
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    // Check URL params to set initial tab
    const tab = searchParams?.get('tab');
    if (tab === 'admin') {
      setTabValue(1);
    }
  }, [searchParams]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

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
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs 
                    value={tabValue} 
                    onChange={handleTabChange} 
                    variant="fullWidth"
                    sx={{
                      '& .MuiTab-root': {
                        textTransform: 'none',
                        fontSize: '1.1rem',
                        fontWeight: 600,
                        py: 2,
                      },
                    }}
                  >
                    <Tab 
                      label={
                        <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          👨‍👩‍👧‍👦 Customer
                        </span>
                      } 
                      {...a11yProps(0)} 
                    />
                    <Tab 
                      label={
                        <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          ⚙️ Admin
                        </span>
                      } 
                      {...a11yProps(1)} 
                    />
                  </Tabs>
                </Box>

                <TabPanel value={tabValue} index={0}>
                  <Box display="flex" justifyContent="center" p={3}>
                    <CustomerLoginForm />
                  </Box>
                </TabPanel>

                <TabPanel value={tabValue} index={1}>
                  <Box display="flex" justifyContent="center" p={3}>
                    <AdminLoginForm />
                  </Box>
                </TabPanel>
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