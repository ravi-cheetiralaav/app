"use client";

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Box, Typography, Avatar, Button } from '@mui/material';
import PageWrapper from '@/components/ui/PageWrapper';
import AnimatedButton from '@/components/ui/AnimatedButton';
import AnimatedCard from '@/components/ui/AnimatedCard';

export default function MenuItemPage() {
  const router = useRouter();
  const params = useParams() as { id?: string };
  const id = params?.id || '';
  const [item, setItem] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/admin/menu/' + id);
        if (!res.ok) {
          console.error('Failed to fetch menu item', await res.text());
          setItem(null);
          return;
        }
        const data = await res.json();
        setItem(data || null);
      } catch (err) {
        console.error('Error loading menu item', err);
        setItem(null);
      } finally {
        setLoading(false);
      }
    }
    if (id) load();
  }, [id]);

  if (!id) {
    return (
      <PageWrapper>
        <Box textAlign="center" mt={8}>
          <Typography variant="h6">Invalid item</Typography>
          <Button onClick={() => router.back()}>Back</Button>
        </Box>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper maxWidth="md">
      <Box mt={4}>
        <Button variant="outlined" size="small" onClick={() => router.back()}>Back</Button>
      </Box>

      {loading ? (
        <Box textAlign="center" mt={8}><Typography>Loading item...</Typography></Box>
      ) : !item ? (
        <Box textAlign="center" mt={8}><Typography>Item not found</Typography></Box>
      ) : (
        <Box mt={4} display="flex" justifyContent="center">
          <AnimatedCard>
            <Box p={4} textAlign="center" sx={{ minWidth: 320 }}>
              <Avatar src={item.image || '/images/TKFC-5.jpg'} sx={{ width: 120, height: 120, mx: 'auto', mb: 2 }} alt={item.name} />
              <Typography variant="h4" gutterBottom>{item.name}</Typography>
              <Typography variant="body1" color="text.secondary" gutterBottom>{item.description}</Typography>
              <Typography variant="h6" sx={{ mt: 2 }}>${item.price?.toFixed ? item.price.toFixed(2) : item.price}</Typography>
              <Box mt={3} display="flex" justifyContent="center" gap={2}>
                <AnimatedButton onClick={() => {
                  // Add single item to cart stored in sessionStorage for now
                  try {
                    const key = 'tkfc_cart';
                    const raw = sessionStorage.getItem(key);
                    let arr = raw ? JSON.parse(raw) : [];
                    const existing = arr.find((x: any) => x.menu_item_id === item.id);
                    if (existing) existing.quantity = existing.quantity + 1;
                    else arr.push({ menu_item_id: item.id, name: item.name, quantity: 1, unit_price: Number(item.price) || 0 });
                    sessionStorage.setItem(key, JSON.stringify(arr));
                    alert('Added to cart');
                  } catch (e) {
                    console.error(e);
                  }
                }}>Add to cart</AnimatedButton>
                <AnimatedButton onClick={() => router.push('/customer/menu')}>Back to menu</AnimatedButton>
              </Box>
            </Box>
          </AnimatedCard>
        </Box>
      )}
    </PageWrapper>
  );
}
