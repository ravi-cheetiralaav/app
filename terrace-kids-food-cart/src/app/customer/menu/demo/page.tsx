"use client";

import React, { useEffect, useState } from 'react';
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

// Mock menu data for demo
const mockMenuItems: MenuItem[] = [
  {
    id: 1,
    name: "Chicken Burger Deluxe",
    description: "Juicy grilled chicken breast with fresh lettuce, tomatoes, and our special sauce on a toasted bun.",
    price: 12.99,
    category: "Meals",
    quantity_available: 15,
    is_active: true,
    event_id: 1
  },
  {
    id: 2,
    name: "Veggie Pizza Slice",
    description: "Fresh vegetable pizza with bell peppers, mushrooms, olives, and melted mozzarella cheese.",
    price: 8.50,
    category: "Meals",
    quantity_available: 20,
    is_active: true,
    event_id: 1
  },
  {
    id: 3,
    name: "Fish & Chips",
    description: "Crispy battered fish served with golden fries and tartar sauce.",
    price: 14.75,
    category: "Meals",
    quantity_available: 10,
    is_active: true,
    event_id: 1
  },
  {
    id: 4,
    name: "Fresh Orange Juice",
    description: "Freshly squeezed orange juice packed with vitamin C and natural goodness.",
    price: 4.99,
    category: "Drinks",
    quantity_available: 25,
    is_active: true,
    event_id: 1
  },
  {
    id: 5,
    name: "Chocolate Milkshake",
    description: "Creamy chocolate milkshake topped with whipped cream and chocolate chips.",
    price: 6.25,
    category: "Drinks",
    quantity_available: 18,
    is_active: true,
    event_id: 1
  },
  {
    id: 6,
    name: "Sparkling Water",
    description: "Refreshing sparkling water with a hint of lemon - perfect for staying hydrated.",
    price: 2.99,
    category: "Drinks",
    quantity_available: 30,
    is_active: true,
    event_id: 1
  },
  {
    id: 7,
    name: "Chocolate Chip Cookies",
    description: "Warm, freshly baked chocolate chip cookies made with premium chocolate chips.",
    price: 3.99,
    category: "Snacks",
    quantity_available: 24,
    is_active: true,
    event_id: 1
  },
  {
    id: 8,
    name: "Mixed Fruit Bowl",
    description: "A healthy mix of seasonal fresh fruits including strawberries, grapes, and melon.",
    price: 5.50,
    category: "Snacks",
    quantity_available: 12,
    is_active: true,
    event_id: 1
  },
  {
    id: 9,
    name: "Cheese & Crackers",
    description: "Artisan cheese selection served with crispy crackers and grape jelly.",
    price: 7.25,
    category: "Snacks",
    quantity_available: 16,
    is_active: true,
    event_id: 1
  },
  {
    id: 10,
    name: "Chocolate Brownie",
    description: "Rich, fudgy chocolate brownie topped with vanilla ice cream and chocolate sauce.",
    price: 6.99,
    category: "Desserts",
    quantity_available: 8,
    is_active: true,
    event_id: 1
  },
  {
    id: 11,
    name: "Strawberry Cheesecake",
    description: "Creamy New York style cheesecake topped with fresh strawberries and berry sauce.",
    price: 8.25,
    category: "Desserts",
    quantity_available: 6,
    is_active: true,
    event_id: 1
  },
  {
    id: 12,
    name: "Apple Pie Slice",
    description: "Traditional homemade apple pie with cinnamon spice, served warm with a scoop of vanilla ice cream.",
    price: 7.50,
    category: "Desserts",
    quantity_available: 10,
    is_active: true,
    event_id: 1
  }
];

export default function CustomerMenuDemoPage() {
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

  // Simulate loading menu items
  useEffect(() => {
    setTimeout(() => {
      setItems(mockMenuItems);
      setLoading(false);
    }, 1500);
  }, []);

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
    const savedCart = localStorage.getItem('demo-cart');
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
      localStorage.setItem('demo-cart', JSON.stringify(cart));
    }
  }, [cart]);

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
    // Simulate checkout process
    setTimeout(() => {
      alert('Demo checkout completed! 🎉\nTotal items: ' + cart.reduce((sum, item) => sum + item.quantity, 0));
      setCart([]);
      localStorage.removeItem('demo-cart');
      setCheckoutLoading(false);
    }, 2000);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
                    <Button variant="text" size="small" onClick={() => router.push('/')}>
                      Home
                    </Button>
                  </Box>
                  <Avatar sx={{ width: 80, height: 80, mx: 'auto', mb: 3 }}>🍽️</Avatar>
                  <Typography variant="h3" sx={{ fontWeight: 800, mb: 2 }}>
                    Browse Menu (Demo)
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