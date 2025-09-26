"use client";

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
// Avatar and other MUI components are imported in the grouped import below
import { signOut } from 'next-auth/react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import FloatingEmojis from '@/components/ui/FloatingEmojis';
import { staggerContainer, staggerItem } from '@/lib/theme';
import {
  Avatar,
  Box,
  Typography,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  Paper,
  IconButton,
  FormControlLabel,
  Switch
} from '@mui/material';
import PageWrapper from '@/components/ui/PageWrapper';
import AnimatedButton from '@/components/ui/AnimatedButton';
import { Edit } from '@mui/icons-material';
import { Delete } from '@mui/icons-material';

type MenuItem = any;

export default function AdminMenuPage() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<MenuItem | null>(null);
  const [form, setForm] = useState<any>({ name: '', description: '', price: 0, quantity_available: 0, category: 'Food', is_active: true });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => { fetchItems(); }, []);

  const [activeEvent, setActiveEvent] = useState<any | null>(null);

  useEffect(() => {
    async function fetchActive() {
      try {
        const res = await fetch('/api/admin/events');
        const events = await res.json();
        const active = events.find((e: any) => e.is_active === 1 || e.is_active === true);
        setActiveEvent(active || null);
        setEvents(events || []);
      } catch (err) {
        console.error('Failed to fetch events', err);
      }
    }
    fetchActive();
  }, []);

  async function fetchEvents() {
    try {
      const res = await fetch('/api/admin/events');
      const ev = await res.json();
      setEvents(ev || []);
    } catch (err) { console.error('Failed to fetch events', err); }
  }
  async function fetchItems() {
    const res = await fetch('/api/admin/menu');
    const data = await res.json();
    // Normalize categories to canonical values
    const normalized = (data || []).map((it: any) => ({
      ...it,
      category: !it.category ? 'Food' : (String(it.category).toLowerCase().startsWith('bev') ? 'Beverage' : 'Food')
    }));
    // Ensure numeric fields exist
    const withNums = normalized.map((it: any) => ({ ...it, quantity_available: Number(it.quantity_available || 0), quantity_sold: Number(it.quantity_sold || 0) }));
    setItems(withNums);
  }

  function openCreate() { setEditing(null); setForm({ name: '', description: '', price: 0, quantity_available: 0, category: '', is_active: true, ingredients: '', health_benefits: '', qty_per_unit: '', calories: '', event_id: activeEvent?.event_id || '' }); setErrors({}); setOpen(true); }
  function openEdit(item: MenuItem) { setEditing(item); setForm({ ...item, ingredients: Array.isArray(item.ingredients) ? item.ingredients.join(', ') : (item.ingredients || ''), health_benefits: Array.isArray(item.health_benefits) ? item.health_benefits.join(', ') : (item.health_benefits || ''), qty_per_unit: item.qty_per_unit || '', calories: item.calories || '', event_id: item.event_id || '' }); setErrors({}); setOpen(true); }

  async function submit() {
    // client-side validation
    const newErrors: Record<string, string> = {};
    if (!form.name || String(form.name).trim().length === 0) newErrors.name = 'Name is required';
    if (isNaN(Number(form.price)) || Number(form.price) < 0) newErrors.price = 'Price must be a non-negative number';
    if (isNaN(Number(form.quantity_available)) || Number(form.quantity_available) < 0) newErrors.quantity_available = 'Quantity must be 0 or greater';
    if (!form.event_id) newErrors.event_id = 'Please select an event';
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    const payload = {
      ...form,
      ingredients: typeof form.ingredients === 'string' ? form.ingredients.split(',').map((s: string) => s.trim()).filter(Boolean) : form.ingredients,
      health_benefits: typeof form.health_benefits === 'string' ? form.health_benefits.split(',').map((s: string) => s.trim()).filter(Boolean) : form.health_benefits
    };

    const url = editing ? `/api/admin/menu?id=${editing.id}` : '/api/admin/menu';
    const method = editing ? 'PUT' : 'POST';
    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    if (res.ok) { setOpen(false); fetchItems(); } else { const txt = await res.text(); alert('Error: ' + txt); }
  }

  async function deleteItem(item: MenuItem) {
    if (!confirm(`Delete ${item.name}? This cannot be undone.`)) return;
    try {
      const res = await fetch(`/api/admin/menu?id=${item.id}`, { method: 'DELETE' });
      if (!res.ok) {
        const text = await res.text();
        alert('Delete failed: ' + text);
        return;
      }
      fetchItems();
    } catch (e) {
      alert('Delete failed: ' + String(e));
    }
  }

  function ProfileHeader() {
    const { data: session } = useSession();
    const user: any = session?.user || {};

    return (
      <Box display="flex" alignItems="center" gap={1} mt={0.5}>
        <Avatar sx={{ width: 36, height: 36 }}>{(user.name || 'U')[0]}</Avatar>
        <Box>
          <Typography variant="body1">{user.name || 'Unknown'}</Typography>
          <Typography variant="caption" color="text.secondary">{user?.user_id || ''}</Typography>
        </Box>
        <IconButton size="small" onClick={() => signOut({ callbackUrl: '/login' })} aria-label="logout">🔒</IconButton>
      </Box>
    );
  }

  return (
    <>
      <FloatingEmojis category="food" count={5} />
      <PageWrapper>
        <motion.div variants={staggerContainer} initial="hidden" animate="visible">
          <motion.div variants={staggerItem}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
              <Box display="flex" alignItems="center" gap={2}>
                <Image src="/images/TKFC-5.jpg" alt="logo" width={64} height={64} style={{ borderRadius: 8 }} />
                <Box>
                  <Typography variant="h4">Update Menu</Typography>
                  <ProfileHeader />
                </Box>
              </Box>
              <Box display="flex" gap={1} alignItems="center">
                <AnimatedButton onClick={() => router.push('/admin/dashboard')} color="secondary">← Back</AnimatedButton>
                <AnimatedButton onClick={openCreate} color="primary" disabled={!activeEvent}>+ New Item</AnimatedButton>
                {!activeEvent && <Typography variant="caption" color="error">No active event — create one in Admin → Dashboard</Typography>}
                {activeEvent && <Typography variant="caption" color="text.secondary">Active: {activeEvent.name} ({activeEvent.event_date})</Typography>}
              </Box>
            </Box>
          </motion.div>

          <motion.div variants={staggerItem}>
            <Stack spacing={2}>
              {items.map(it => (
                <motion.div key={it.id} variants={staggerItem}>
                  <Paper sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography variant="h6">{it.name} <Typography component="span" color="text.secondary">${it.price}</Typography></Typography>
                      <Typography variant="body2">{it.description}</Typography>
                        <Box mt={1} display="flex" gap={2}>
                          <Typography variant="caption" color="text.secondary">Actual: {Number(it.quantity_available || 0) + Number(it.quantity_sold || 0)}</Typography>
                          <Typography variant="caption" color="text.secondary">Sold: {it.quantity_sold ?? 0}</Typography>
                          <Typography variant="caption" color="text.secondary">Available: {it.quantity_available ?? 0}</Typography>
                        </Box>
                    </Box>
                    <Box>
                      <FormControlLabel control={<Switch checked={Boolean(it.is_active)} />} label={it.is_active ? 'Active' : 'Inactive'} />
                      <IconButton onClick={() => openEdit(it)} aria-label="edit"><Edit /></IconButton>
                      <IconButton onClick={() => deleteItem(it)} aria-label="delete"><Delete /></IconButton>
                    </Box>
                  </Paper>
                </motion.div>
              ))}
            </Stack>
          </motion.div>
        </motion.div>

        <Dialog open={open} onClose={() => setOpen(false)} fullWidth>
          <DialogTitle>{editing ? 'Edit Item' : 'Create Item'}</DialogTitle>
          <DialogContent>
            <Stack spacing={2} mt={1}>
              <TextField label="Name" value={form.name} error={!!errors.name} helperText={errors.name || ''} onChange={e => setForm({ ...form, name: e.target.value })} />
              <TextField label="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
              <FormControl fullWidth>
                <InputLabel id="category-label">Category</InputLabel>
                <Select
                  labelId="category-label"
                  label="Category"
                  value={form.category}
                  onChange={(e: any) => setForm({ ...form, category: e.target.value })}
                >
                  <MenuItem value="Food">Food</MenuItem>
                  <MenuItem value="Beverage">Beverage</MenuItem>
                </Select>
              </FormControl>
              <TextField label="Price" type="number" value={form.price} error={!!errors.price} helperText={errors.price || ''} onChange={e => setForm({ ...form, price: Number(e.target.value) })} />
              <TextField label="Qty per unit (e.g. 200g, 1 piece)" value={form.qty_per_unit || ''} onChange={e => setForm({ ...form, qty_per_unit: e.target.value })} />
              <TextField label="Calories" type="number" value={form.calories || ''} onChange={e => setForm({ ...form, calories: Number(e.target.value) })} />
              <TextField label="Quantity Available" type="number" value={form.quantity_available} error={!!errors.quantity_available} helperText={errors.quantity_available || ''} onChange={e => setForm({ ...form, quantity_available: Number(e.target.value) })} />
              <FormControlLabel control={<Switch checked={!!form.is_active} onChange={e => setForm({ ...form, is_active: e.target.checked })} />} label="Is Active" />
              <TextField label="Ingredients (comma separated)" value={form.ingredients || ''} onChange={e => setForm({ ...form, ingredients: e.target.value })} />
              <TextField label="Health Benefits (comma separated)" value={form.health_benefits || ''} onChange={e => setForm({ ...form, health_benefits: e.target.value })} />
              <FormControl fullWidth>
                <InputLabel id="event-label">Event</InputLabel>
                <Select labelId="event-label" label="Event" value={form.event_id || ''} onChange={(e: any) => setForm({ ...form, event_id: e.target.value })}>
                  {events.map(ev => <MenuItem key={ev.event_id} value={ev.event_id}>{ev.name} ({ev.event_date})</MenuItem>)}
                </Select>
              </FormControl>
              {errors.event_id && <Typography color="error" variant="caption">{errors.event_id}</Typography>}
            </Stack>
          </DialogContent>
          <DialogActions>
            <AnimatedButton onClick={() => setOpen(false)}>Cancel</AnimatedButton>
            <AnimatedButton onClick={submit} color="primary">Save</AnimatedButton>
          </DialogActions>
        </Dialog>
      </PageWrapper>
    </>
  );
}
