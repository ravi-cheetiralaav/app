"use client";

import React, { useEffect, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Box, Typography, Avatar, Button, Divider } from '@mui/material';
import PageWrapper from '@/components/ui/PageWrapper';
import FloatingEmojis from '@/components/ui/FloatingEmojis';
import AnimatedCard from '@/components/ui/AnimatedCard';
import AnimatedButton from '@/components/ui/AnimatedButton';
import { staggerContainer, staggerItem } from '@/lib/theme';
import { motion } from 'framer-motion';

export default function CustomerMenuPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<{ menu_item_id: number; name: string; quantity: number; unit_price: number }[]>([]);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

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

  // group items by category for display
  const grouped = items.reduce((acc: Record<string, any[]>, it: any) => {
    const cat = it.category || 'Uncategorized';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(it);
    return acc;
  }, {} as Record<string, any[]>);

  const categoryImages: Record<string, string> = {
    Drinks: '/logos/TKFC-5.jpg',
    Snacks: '/logos/TKFC-5.jpg',
    Meals: '/logos/TKFC-5.jpg',
    Uncategorized: '/logos/TKFC-5.jpg',
  };

  return (
    <>
      <FloatingEmojis category="food" count={6} />
      <PageWrapper maxWidth="lg">
        <motion.div variants={staggerContainer} initial="hidden" animate="visible">
          <motion.div variants={staggerItem}>
            <Box textAlign="center" mb={4} position="relative">
              <Box position="absolute" top={16} left={16}>
                <Button variant="outlined" size="small" onClick={() => router.back()}>Back</Button>
              </Box>
              <Box position="absolute" top={16} right={16}>
                <Button variant="text" size="small" onClick={() => signOut({ callbackUrl: '/' })}>Logout</Button>
              </Box>
              <Avatar sx={{ width: 64, height: 64, mx: 'auto', mb: 2 }}>🍽️</Avatar>
              <Typography variant="h4">Browse Menu</Typography>
              <Typography variant="body2" color="text.secondary">Select items and add to your cart</Typography>
            </Box>
          </motion.div>
          <motion.div variants={staggerItem}>
            <Box mt={4} display="flex" justifyContent="center">
              <Box sx={{ width: 500, maxWidth: '90%', p: 2, borderRadius: 2, boxShadow: 3, background: 'white' }}>
                <Typography variant="h6">Cart</Typography>
                {cart.length === 0 ? (
                  <Typography variant="body2">Your cart is empty</Typography>
                ) : (
                  <Box>
                    {cart.map(c => (
                      <Box key={c.menu_item_id} display="flex" justifyContent="space-between" my={1}>
                        <Typography>{c.name} x {c.quantity}</Typography>
                        <Typography>${(c.unit_price * c.quantity).toFixed(2)}</Typography>
                      </Box>
                    ))}
                    <Divider />
                    <Box display="flex" justifyContent="space-between" mt={2}>
                      <Typography variant="subtitle1">Total</Typography>
                      <Typography variant="subtitle1">${cart.reduce((s, c) => s + c.unit_price * c.quantity, 0).toFixed(2)}</Typography>
                    </Box>
                    <Box display="flex" justifyContent="center" mt={2}>
                      <AnimatedButton variant="contained" disabled={checkoutLoading || cart.length === 0} onClick={async () => {
                        setCheckoutLoading(true);
                        try {
                          const payload = {
                            user_id: (session as any)?.user_id || (session as any)?.user?.email || '',
                            event_id: cart.length > 0 ? String(items.find(i => i.id === cart[0].menu_item_id)?.event_id || '') : '',
                            items: cart.map(c => ({ menu_item_id: c.menu_item_id, quantity: c.quantity })),
                            notes: ''
                          };
                          const res = await fetch('/api/customer/orders', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
                          if (!res.ok) {
                            const txt = await res.text();
                            throw new Error(txt || 'Checkout failed');
                          }
                          const data = await res.json();
                          // clear cart and navigate to orders page
                          setCart([]);
                          router.push('/customer/orders');
                        } catch (err: any) {
                          alert('Checkout error: ' + (err.message || err));
                        } finally {
                          setCheckoutLoading(false);
                        }
                      }}>Checkout</AnimatedButton>
                    </Box>
                  </Box>
                )}
              </Box>
            </Box>
          </motion.div>

          <motion.div variants={staggerItem}>
            {loading ? (
              <Typography>Loading menu...</Typography>
            ) : items.length === 0 ? (
              <Typography>No menu items available.</Typography>
            ) : (
              <Box display="flex" flexDirection="column" gap={6}>
                {Object.keys(grouped).map((cat) => (
                  <Box key={cat}>
                    <AnimatedCard>
                      <Box display="flex" alignItems="center" gap={2} p={2}>
                        <Avatar src={categoryImages[cat] || categoryImages['Uncategorized']} sx={{ width: 80, height: 80, borderRadius: 2 }} alt={cat} />
                        <Box>
                          <Typography variant="h5">{cat} {cat === 'Drinks' ? '🥤' : cat === 'Snacks' ? '🍪' : cat === 'Meals' ? '🍔' : '🍭'}</Typography>
                          <Typography variant="body2" color="text.secondary">{grouped[cat].length} items</Typography>
                        </Box>
                      </Box>
                    </AnimatedCard>

                    <Box mt={2} display="grid" gridTemplateColumns={{ xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }} gap={3}>
                      {grouped[cat].map((it) => (
                        <motion.div key={it.id} whileHover={{ y: -6 }} style={{ display: 'block' }}>
                          <AnimatedCard>
                            <Box p={2} textAlign="center">
                              <Typography variant="h6" gutterBottom>{it.name}</Typography>
                              <Typography variant="body2" color="text.secondary" sx={{ minHeight: 40 }}>{it.description}</Typography>
                              <Typography variant="subtitle1" sx={{ mt: 1 }}>${it.price?.toFixed ? it.price.toFixed(2) : it.price}</Typography>
                              <Box mt={2} display="flex" justifyContent="center" gap={2}>
                                <AnimatedButton size="small" onClick={() => {
                                  // add to cart
                                  setCart(prev => {
                                    const existing = prev.find(p => p.menu_item_id === it.id);
                                    if (existing) return prev.map(p => p.menu_item_id === it.id ? { ...p, quantity: p.quantity + 1 } : p);
                                    return [...prev, { menu_item_id: it.id, name: it.name, quantity: 1, unit_price: Number(it.price) || 0 }];
                                  });
                                }}>Add to cart</AnimatedButton>
                                <AnimatedButton sx={{ ml: 1 }} onClick={() => router.push('/customer/menu/' + (it.id || ''))}>View</AnimatedButton>
                              </Box>
                            </Box>
                          </AnimatedCard>
                        </motion.div>
                      ))}
                    </Box>
                  </Box>
                ))}
              </Box>
            )}
          </motion.div>
        </motion.div>
      </PageWrapper>
    </>
  );
}
