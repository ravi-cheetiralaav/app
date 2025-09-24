"use client";

import React, { useEffect, useState, useMemo } from 'react';
import PageWrapper from '@/components/ui/PageWrapper';
import { Box, Typography, Paper, Checkbox, Button, Divider, List, ListItem, ListItemText, ListItemSecondaryAction } from '@mui/material';
import AnimatedButton from '@/components/ui/AnimatedButton';
import { TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { motion } from 'framer-motion';
import { staggerContainer, staggerItem } from '@/lib/theme';

type OrderItem = any;
type Order = any;

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filters, setFilters] = useState({
    orderId: '',
    userId: '',
    status: '',
    minCost: '',
    maxCost: '',
    startDate: '',
    endDate: '',
  });
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    setLoading(true);
    try {
      // Rely on next-auth session cookie; server will validate admin session.
      const res = await fetch('/api/admin/orders');
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
      const sel: Record<string, boolean> = {};
      (data || []).forEach((o: any) => sel[o.order_id] = false);
      setSelected(sel);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  const filteredOrders = useMemo(() => {
    return orders.filter((o: any) => {
      // Order ID filter
      if (filters.orderId && !o.order_id?.toLowerCase().includes(filters.orderId.toLowerCase())) return false;
      // User ID filter
      if (filters.userId && !o.user_id?.toLowerCase().includes(filters.userId.toLowerCase())) return false;
      // Status filter
      if (filters.status && String(o.status).toLowerCase() !== String(filters.status).toLowerCase()) return false;
      // Cost range
      const total = Number(o.total_amount || 0);
      if (filters.minCost && !isNaN(Number(filters.minCost)) && total < Number(filters.minCost)) return false;
      if (filters.maxCost && !isNaN(Number(filters.maxCost)) && total > Number(filters.maxCost)) return false;
      // Date range (created_at expected ISO string)
      if ((filters.startDate || filters.endDate) && o.created_at) {
        const created = new Date(o.created_at).getTime();
        if (filters.startDate) {
          const s = new Date(filters.startDate).getTime();
          if (isFinite(s) && created < s) return false;
        }
        if (filters.endDate) {
          // treat endDate as inclusive end of day
          const eDate = new Date(filters.endDate);
          eDate.setHours(23, 59, 59, 999);
          const e = eDate.getTime();
          if (isFinite(e) && created > e) return false;
        }
      }

      return true;
    });
  }, [orders, filters]);

  function toggle(id: string) {
    setSelected(prev => ({ ...prev, [id]: !prev[id] }));
  }

  async function bulkAction(action: 'approve' | 'reject') {
    const order_ids = Object.keys(selected).filter(k => selected[k]);
    if (order_ids.length === 0) return alert('Select orders first');
    setProcessing(true);
    try {
      const res = await fetch('/api/admin/orders', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ order_ids, action }) });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      alert('Action result: ' + JSON.stringify(data.results));
      fetchOrders();
    } catch (e: any) {
      alert('Error: ' + (e.message || e));
    } finally {
      setProcessing(false);
    }
  }

  return (
    <PageWrapper>
      <motion.div variants={staggerContainer} initial="hidden" animate="visible">
        <motion.div variants={staggerItem}>
          <Box mb={3} display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h4">View Orders</Typography>
            <Box>
              <AnimatedButton onClick={() => fetchOrders()}>Refresh</AnimatedButton>
              <AnimatedButton sx={{ ml: 1 }} color="primary" onClick={() => bulkAction('approve')} disabled={processing}>Approve Selected</AnimatedButton>
              <AnimatedButton sx={{ ml: 1 }} color="secondary" onClick={() => bulkAction('reject')} disabled={processing}>Reject Selected</AnimatedButton>
            </Box>
          </Box>
        </motion.div>

        <motion.div variants={staggerItem}>
          <Paper sx={{ p: 2, mb: 3 }}>
            <Box display="flex" gap={2} flexWrap="wrap" alignItems="center">
              <TextField label="Order ID" size="small" value={filters.orderId} onChange={(e) => setFilters(f => ({ ...f, orderId: e.target.value }))} />
              <TextField label="User ID" size="small" value={filters.userId} onChange={(e) => setFilters(f => ({ ...f, userId: e.target.value }))} />
              <TextField
                label="Min Cost"
                size="small"
                type="number"
                inputProps={{ min: 0, step: 0.01 }}
                value={filters.minCost}
                onChange={(e) => {
                  const v = e.target.value;
                  const n = Number(v);
                  if (!isNaN(n) && n < 0) {
                    // clamp negative to 0
                    setFilters(f => ({ ...f, minCost: '0' }));
                  } else {
                    setFilters(f => ({ ...f, minCost: v }));
                  }
                }}
              />
              <TextField
                label="Max Cost"
                size="small"
                type="number"
                inputProps={{ min: 0, step: 0.01 }}
                value={filters.maxCost}
                onChange={(e) => {
                  const v = e.target.value;
                  const n = Number(v);
                  if (!isNaN(n) && n < 0) {
                    // clamp negative to 0
                    setFilters(f => ({ ...f, maxCost: '0' }));
                  } else {
                    setFilters(f => ({ ...f, maxCost: v }));
                  }
                }}
              />
              <TextField label="Start Date" size="small" type="date" InputLabelProps={{ shrink: true }} value={filters.startDate} onChange={(e) => setFilters(f => ({ ...f, startDate: e.target.value }))} />
              <TextField label="End Date" size="small" type="date" InputLabelProps={{ shrink: true }} value={filters.endDate} onChange={(e) => setFilters(f => ({ ...f, endDate: e.target.value }))} />
              <FormControl size="small" sx={{ minWidth: 140 }}>
                <InputLabel>Status</InputLabel>
                <Select label="Status" value={filters.status} onChange={(e) => setFilters(f => ({ ...f, status: e.target.value }))}>
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="approved">Approved</MenuItem>
                  <MenuItem value="rejected">Rejected</MenuItem>
                  <MenuItem value="scheduled">Scheduled</MenuItem>
                </Select>
              </FormControl>
              <Box>
                <Button size="small" onClick={() => setFilters({ orderId: '', userId: '', status: '', minCost: '', maxCost: '', startDate: '', endDate: '' })}>Clear</Button>
              </Box>
            </Box>
          </Paper>
        </motion.div>

        <motion.div variants={staggerItem}>
          {loading ? <Typography>Loading...</Typography> : (
            <List>
              {orders.map((o: Order) => (
                <Paper key={o.order_id} sx={{ mb: 2, p: 2 }}>
                  <Box display="flex" alignItems="center" gap={2}>
                    <Checkbox checked={!!selected[o.order_id]} onChange={() => toggle(o.order_id)} />
                    <Box flex={1}>
                      <Typography variant="h6">Order {o.order_id} • {o.user_id} • ${Number(o.total_amount || 0).toFixed(2)} • {o.status || 'pending'}</Typography>
                      <Typography variant="caption">Created: {o.created_at}</Typography>
                      <Divider sx={{ my: 1 }} />
                      <List disablePadding>
                        {(o.items || []).map((it: OrderItem) => (
                          <ListItem key={it.id} divider>
                            <ListItemText primary={`${it.menu_item?.name || it.menu_item_id} x ${it.quantity}`} secondary={`$${(it.unit_price || 0).toFixed(2)} each • subtotal $${(it.subtotal || 0).toFixed(2)}`} />
                            <ListItemSecondaryAction>
                              <Typography variant="body2">Qty: {it.quantity}</Typography>
                            </ListItemSecondaryAction>
                          </ListItem>
                        ))}
                      </List>
                    </Box>
                  </Box>
                </Paper>
              ))}
            </List>
          )}
        </motion.div>
      </motion.div>
    </PageWrapper>
  );
}
