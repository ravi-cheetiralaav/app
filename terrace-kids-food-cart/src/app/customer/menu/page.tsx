"use client";

import React, { useEffect, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Box, Typography, Avatar, Button, Fab, useMediaQuery } from '@mui/material';
import { ShoppingCart, KeyboardArrowUp } from '@mui/icons-material';
import PageWrapper from '@/components/ui/PageWrapper';
import FloatingEmojis from '@/components/ui/FloatingEmojis';
import { staggerContainer, staggerItem } from '@/lib/theme';
import { motion } from 'framer-motion';
import MenuItemCard from '@/components/customer/MenuItemCard';
import MenuCategoryHeader from '@/components/customer/MenuCategoryHeader';
import EnhancedCart from '@/components/customer/EnhancedCart';
import ItemDetailModal from '@/components/customer/ItemDetailModal';
import MenuItemSkeleton from '@/components/customer/MenuItemSkeleton';
import { useTheme } from '@mui/material/styles';

interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  quantity_available?: number;
  is_active?: boolean;
  event_id?: number;
}

interface CartItem {
  menu_item_id: number;
  name: string;
  quantity: number;
  unit_price: number;
  image?: string;
}

export default function CustomerMenuPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isCartExpanded, setIsCartExpanded] = useState(!isMobile);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Scroll to top functionality
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever cart changes
  useEffect(() => {
    if (cart.length >= 0) {
      localStorage.setItem('cart', JSON.stringify(cart));
    }
  }, [cart]);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/admin/menu');
        if (!res.ok) {
          console.error('Failed to fetch menu', await res.text());
          setItems([]);
          setLoading(false);
          return;
        }
        const data = await res.json();
        setItems(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Error loading menu', err);
        setItems([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // Cart management functions
  const handleAddToCart = (item: MenuItem, quantity: number = 1) => {
    setCart(prev => {
      const existing = prev.find(p => p.menu_item_id === item.id);
      if (existing) {
        return prev.map(p => 
          p.menu_item_id === item.id 
            ? { ...p, quantity: p.quantity + quantity }
            : p
        );
      }
      return [...prev, { 
        menu_item_id: item.id, 
        name: item.name, 
        quantity, 
        unit_price: Number(item.price) || 0,
        image: item.image
      }];
    });
  };

  const handleUpdateQuantity = (itemId: number, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveItem(itemId);
      return;
    }
    setCart(prev => 
      prev.map(item => 
        item.menu_item_id === itemId 
          ? { ...item, quantity }
          : item
      )
    );
  };

  const handleRemoveItem = (itemId: number) => {
    setCart(prev => prev.filter(item => item.menu_item_id !== itemId));
  };

  const handleViewDetails = (item: MenuItem) => {
    setSelectedItem(item);
    setIsDetailModalOpen(true);
  };

  const handleCheckout = async () => {
    setCheckoutLoading(true);
    try {
      const payload = {
        user_id: (session as any)?.user_id || (session as any)?.user?.email || '',
        event_id: cart.length > 0 ? String(items.find(i => i.id === cart[0].menu_item_id)?.event_id || '') : '',
        items: cart.map(c => ({ menu_item_id: c.menu_item_id, quantity: c.quantity })),
        notes: ''
      };
      const res = await fetch('/api/customer/orders', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify(payload) 
      });
      
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || 'Checkout failed');
      }
      
      // Clear cart and navigate to orders page
      setCart([]);
      localStorage.removeItem('cart');
      router.push('/customer/orders');
    } catch (err: any) {
      alert('Checkout error: ' + (err.message || err));
    } finally {
      setCheckoutLoading(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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

  // Group items by category for display
  const grouped = items.reduce((acc: Record<string, MenuItem[]>, item: MenuItem) => {
    const cat = item.category || 'Uncategorized';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  }, {} as Record<string, MenuItem[]>);

  const getCartQuantity = (itemId: number) => {
    const item = cart.find(c => c.menu_item_id === itemId);
    return item ? item.quantity : 0;
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      <FloatingEmojis category="food" count={6} />
      <PageWrapper maxWidth="xl">
        <Box display="flex" gap={4} minHeight="100vh">
          {/* Main Content */}
          <Box flex={1}>
            <motion.div variants={staggerContainer} initial="hidden" animate="visible">
              {/* Header */}
              <motion.div variants={staggerItem}>
                <Box textAlign="center" mb={6} position="relative">
                  <Box position="absolute" top={16} left={16}>
                    <Button variant="outlined" size="small" onClick={() => router.back()}>
                      Back
                    </Button>
                  </Box>
                  <Box position="absolute" top={16} right={16}>
                    <Button variant="text" size="small" onClick={() => signOut({ callbackUrl: '/' })}>
                      Logout
                    </Button>
                  </Box>
                  <Avatar sx={{ width: 80, height: 80, mx: 'auto', mb: 3 }}>🍽️</Avatar>
                  <Typography variant="h3" sx={{ fontWeight: 800, mb: 2 }}>
                    Browse Menu
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1.1rem' }}>
                    Discover delicious items and add them to your cart
                  </Typography>
                </Box>
              </motion.div>

              {/* Loading State */}
              {loading && (
                <motion.div variants={staggerItem}>
                  <Box mb={6}>
                    <Typography variant="h5" sx={{ mb: 3, textAlign: 'center' }}>
                      Loading delicious items... 🍽️
                    </Typography>
                    <MenuItemSkeleton count={6} />
                  </Box>
                </motion.div>
              )}

              {/* Empty State */}
              {!loading && items.length === 0 && (
                <motion.div variants={staggerItem}>
                  <Box textAlign="center" py={8}>
                    <Typography variant="h5" color="text.secondary" sx={{ mb: 2 }}>
                      No menu items available 🤷‍♂️
                    </Typography>
                    <Typography variant="body1" color="text.disabled">
                      Please check back later for delicious options!
                    </Typography>
                  </Box>
                </motion.div>
              )}

              {/* Menu Categories */}
              {!loading && items.length > 0 && (
                <motion.div variants={staggerItem}>
                  <Box display="flex" flexDirection="column" gap={8}>
                    {Object.keys(grouped).map((category, categoryIndex) => (
                      <motion.div
                        key={category}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: categoryIndex * 0.1, duration: 0.6 }}
                      >
                        {/* Category Header */}
                        <MenuCategoryHeader
                          category={category}
                          itemCount={grouped[category].length}
                        />

                        {/* Category Items */}
                        <Box
                          display="grid"
                          gridTemplateColumns={{
                            xs: '1fr',
                            sm: 'repeat(2, 1fr)',
                            md: 'repeat(3, 1fr)',
                            lg: 'repeat(4, 1fr)'
                          }}
                          gap={3}
                        >
                          {grouped[category].map((item, itemIndex) => (
                            <motion.div
                              key={item.id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: (categoryIndex * 0.1) + (itemIndex * 0.05), duration: 0.4 }}
                            >
                              <MenuItemCard
                                item={item}
                                onAddToCart={handleAddToCart}
                                onViewDetails={handleViewDetails}
                                cartQuantity={getCartQuantity(item.id)}
                              />
                            </motion.div>
                          ))}
                        </Box>
                      </motion.div>
                    ))}
                  </Box>
                </motion.div>
              )}
            </motion.div>
          </Box>

          {/* Desktop Cart Sidebar */}
          {!isMobile && (
            <Box width={420} flexShrink={0}>
              <Box position="sticky" top={20}>
                <EnhancedCart
                  cart={cart}
                  onUpdateQuantity={handleUpdateQuantity}
                  onRemoveItem={handleRemoveItem}
                  onCheckout={handleCheckout}
                  loading={checkoutLoading}
                  isExpanded={isCartExpanded}
                  onToggleExpanded={() => setIsCartExpanded(!isCartExpanded)}
                />
              </Box>
            </Box>
          )}
        </Box>

        {/* Mobile Cart FAB */}
        {isMobile && totalItems > 0 && (
          <Fab
            color="primary"
            sx={{
              position: 'fixed',
              bottom: 80,
              right: 20,
              zIndex: 1000,
              width: 64,
              height: 64
            }}
            onClick={() => setIsCartExpanded(true)}
          >
            <Box position="relative">
              <ShoppingCart />
              <Box
                position="absolute"
                top={-8}
                right={-8}
                sx={{
                  bgcolor: 'error.main',
                  color: 'white',
                  borderRadius: '50%',
                  width: 20,
                  height: 20,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem',
                  fontWeight: 700
                }}
              >
                {totalItems}
              </Box>
            </Box>
          </Fab>
        )}

        {/* Mobile Cart Modal */}
        {isMobile && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: isCartExpanded ? 0 : '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            style={{
              position: 'fixed',
              bottom: 0,
              left: 0,
              right: 0,
              zIndex: 1200,
              maxHeight: '80vh',
              overflow: 'hidden'
            }}
          >
            <EnhancedCart
              cart={cart}
              onUpdateQuantity={handleUpdateQuantity}
              onRemoveItem={handleRemoveItem}
              onCheckout={handleCheckout}
              loading={checkoutLoading}
              isExpanded={true}
              onToggleExpanded={() => setIsCartExpanded(false)}
            />
          </motion.div>
        )}

        {/* Scroll to Top FAB */}
        {showScrollTop && (
          <Fab
            size="small"
            color="secondary"
            sx={{
              position: 'fixed',
              bottom: isMobile ? 160 : 20,
              right: 20,
              zIndex: 1000
            }}
            onClick={scrollToTop}
          >
            <KeyboardArrowUp />
          </Fab>
        )}

        {/* Item Detail Modal */}
        <ItemDetailModal
          item={selectedItem}
          open={isDetailModalOpen}
          onClose={() => {
            setIsDetailModalOpen(false);
            setSelectedItem(null);
          }}
          onAddToCart={handleAddToCart}
          cartQuantity={selectedItem ? getCartQuantity(selectedItem.id) : 0}
        />
      </PageWrapper>
    </>
  );
}
