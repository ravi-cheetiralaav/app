"use client";

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Box, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions, IconButton, TextField } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PageWrapper from '@/components/ui/PageWrapper';
import AnimatedCard from '@/components/ui/AnimatedCard';

export default function CustomerOrdersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [editingItems, setEditingItems] = useState<Array<any>>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const user_id = (session as any)?.user_id || (session as any)?.user?.email || '';
        if (!user_id) { setOrders([]); setLoading(false); return; }
        const res = await fetch(`/api/customer/orders?user_id=${encodeURIComponent(user_id)}`);
        if (!res.ok) { setOrders([]); setLoading(false); return; }
        const data = await res.json();
        setOrders(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to fetch orders', err);
        setOrders([]);
      } finally { setLoading(false); }
    }
    load();
  }, [session]);

  if (status === 'loading') return <PageWrapper><Typography>Loading...</Typography></PageWrapper>;

  return (
    <PageWrapper>
      <Box textAlign="center" mb={4}>
        <Typography variant="h4">My Orders</Typography>
        <Typography variant="body2" color="text.secondary">Recent orders and their status</Typography>
      </Box>

      {loading ? <Typography>Loading orders...</Typography> : (
        orders.length === 0 ? <Typography>No orders found</Typography> : (
          <Box display="grid" gridTemplateColumns={{ xs: '1fr', md: 'repeat(2, 1fr)' }} gap={2}>
            {orders.map(o => (
              <AnimatedCard key={o.order_id}>
                <Box p={2}>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Box>
                      <Typography variant="h6">Order {o.order_id}</Typography>
                      <Typography>Status: {o.status}</Typography>
                      <Typography>Total: ${o.total_amount}</Typography>
                    </Box>
                    <Box>
                      <Button variant="outlined" size="small" onClick={async () => {
                        // open detail modal - fetch full order
                        try {
                          const res = await fetch(`/api/customer/orders/${encodeURIComponent(o.order_id)}`);
                          if (!res.ok) throw new Error('Failed to load order');
                          const full = await res.json();
                          setSelectedOrder(full);
                          setEditingItems((full.items || []).map((it: any) => ({ ...it })));
                        } catch (e) {
                          console.error(e);
                        }
                      }}>View / Edit</Button>
                    </Box>
                  </Box>

                  <Box mt={1}>
                    {o.items && o.items.map((it: any) => (
                      <Box key={it.id} display="flex" justifyContent="space-between">
                        <Typography>{it.menu_item?.name || it.menu_item_id} x {it.quantity}</Typography>
                        <Typography>${it.subtotal}</Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>
              </AnimatedCard>
            ))}
          </Box>
        )
      )}

      <Box textAlign="center" mt={4}>
        <Button variant="contained" onClick={() => router.push('/customer/menu')}>Back to Menu</Button>
      </Box>

      <Dialog open={!!selectedOrder} fullWidth maxWidth="sm" onClose={() => { if (!saving) setSelectedOrder(null); }}>
        <DialogTitle>
          {selectedOrder ? `Order ${selectedOrder.order_id}` : 'Order'}
          <IconButton
            aria-label="close"
            onClick={() => { if (!saving) setSelectedOrder(null); }}
            sx={{ position: 'absolute', right: 8, top: 8 }}
            size="large">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {selectedOrder ? (
            <Box>
              <Typography>Status: {selectedOrder.status}</Typography>
              <Box mt={2}>
                {(editingItems || []).map((it: any, idx: number) => (
                  <Box key={it.id || idx} display="flex" alignItems="center" justifyContent="space-between" mb={1}>
                    <Box>
                      <Typography>{it.menu_item?.name || it.menu_item_id}</Typography>
                      <Typography variant="caption" color="text.secondary">Available: {it.menu_item?.quantity_available ?? '-'}</Typography>
                    </Box>
                    <Box display="flex" alignItems="center">
                      <TextField type="number" size="small" value={String(it.quantity)} inputProps={{ min: 0 }} onChange={(e) => {
                        const v = Math.max(0, Number(e.target.value || 0));
                        setEditingItems(prev => { const copy = [...prev]; copy[idx] = { ...copy[idx], quantity: v }; return copy; });
                      }} sx={{ width: 100, mr: 2 }} />
                      <Typography>${(it.unit_price || 0) * (it.quantity || 0)}</Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>
          ) : <Typography>Loading...</Typography>}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedOrder(null)} disabled={saving}>Cancel</Button>
          <Button variant="contained" onClick={async () => {
            if (!selectedOrder) return;
            setSaving(true);
            try {
              const payload = { user_id: selectedOrder.user_id, items: editingItems.map(it => ({ menu_item_id: it.menu_item_id, quantity: Number(it.quantity) })) };
              const res = await fetch(`/api/customer/orders/${encodeURIComponent(selectedOrder.order_id)}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
              if (!res.ok) throw new Error('Failed to update order');
              const updated = await res.json();
              // Refresh list
              const user_id = (session as any)?.user_id || (session as any)?.user?.email || '';
              const r2 = await fetch(`/api/customer/orders?user_id=${encodeURIComponent(user_id)}`);
              if (r2.ok) { const data = await r2.json(); setOrders(Array.isArray(data) ? data : []); }
              setSelectedOrder(null);
            } catch (e) {
              console.error(e);
              alert((e as any)?.message || 'Failed to update order');
            } finally { setSaving(false); }
          }} disabled={saving}>Save</Button>
        </DialogActions>
      </Dialog>
    </PageWrapper>
  );
}
