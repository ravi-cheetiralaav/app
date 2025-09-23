'use client';

import React, { useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Typography,
  Avatar,
  Chip,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Stack,
  Divider,
} from '@mui/material';
import { motion } from 'framer-motion';
import FloatingEmojis from '@/components/ui/FloatingEmojis';
import PageWrapper from '@/components/ui/PageWrapper';
import { staggerContainer, staggerItem } from '@/lib/theme';
import { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Switch, FormControlLabel } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import AnimatedButton from '@/components/ui/AnimatedButton';

export default function AdminDashboard() {
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
    router.push('/login?tab=admin');
    return null;
  }

  const extendedSession = session as any;

  // Check if user is admin
  if (!extendedSession?.is_admin) {
    router.push('/customer/dashboard');
    return null;
  }

  const [eventsOpen, setEventsOpen] = useState(false);
  // store dates as ISO strings (YYYY-MM-DD) for server compatibility
  const [events, setEvents] = useState<any[]>([]);
  const [eventForm, setEventForm] = useState<any>({ event_id: '', name: '', event_date: '', cutoff_date: '', is_active: true });

  async function fetchEvents() {
    try {
      const res = await fetch('/api/admin/events');
      if (!res.ok) return;
      const data = await res.json();
      setEvents(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch events', err);
    }
  }

  async function saveEvent() {
    try {
      const method = eventForm.event_id ? 'PUT' : 'POST';
      const url = eventForm.event_id ? `/api/admin/events?event_id=${encodeURIComponent(eventForm.event_id)}` : '/api/admin/events';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventForm),
      });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || 'Failed to save event');
      }
      setEventsOpen(false);
      await fetchEvents();
      router.refresh();
    } catch (err: any) {
      alert('Error saving event: ' + (err.message || err));
    }
  }

  useEffect(() => {
    if (eventsOpen) {
      // reset form and load events each time dialog opens
      setEventForm({ event_id: '', name: '', event_date: '', cutoff_date: '', is_active: true });
      fetchEvents();
    }
  }, [eventsOpen]);

  return (
    <>
      <FloatingEmojis category="celebration" count={6} />
      <PageWrapper maxWidth="lg">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          {/* Welcome Header */}
          <motion.div variants={staggerItem}>
            <Box textAlign="center" mb={6}>
              <Box position="absolute" top={16} left={16}>
                <Button variant="outlined" size="small" onClick={() => router.back()}>Back</Button>
              </Box>
              <Box position="absolute" top={16} right={16}>
                <Button variant="text" size="small" onClick={() => signOut({ callbackUrl: '/login' })}>Logout</Button>
              </Box>
              <Avatar
                sx={{
                  width: 80,
                  height: 80,
                  mx: 'auto',
                  mb: 2,
                  bgcolor: 'secondary.main',
                  fontSize: '2rem',
                }}
              >
                ⚙️
              </Avatar>
              <Typography variant="h3" gutterBottom>
                Admin Dashboard
              </Typography>
              <Typography variant="h6" color="text.secondary" paragraph>
                Welcome to the admin panel! 🎉
              </Typography>
              <Chip
                label={`Admin: ${session?.user?.name}`}
                variant="outlined"
                color="secondary"
                sx={{ mt: 1 }}
              />
            </Box>
          </motion.div>

          {/* Coming Soon Message */}
          <motion.div variants={staggerItem}>
            <Box 
              textAlign="center" 
              py={8}
              sx={{
                background: 'linear-gradient(135deg, #4ECDC420, #45B7D120)',
                borderRadius: 4,
                border: '2px dashed #4ECDC4',
              }}
            >
              <Typography variant="h4" gutterBottom>
                🚧 Coming Soon! 🚧
              </Typography>
              <Typography variant="h6" color="text.secondary" paragraph>
                Admin features are being built with love by our development team.
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Soon you&apos;ll be able to:
              </Typography>
              <Box mt={2}>
                <Typography variant="body2" paragraph>
                  👥 Manage Users • 🍕 Update Menu • 📊 View Orders • 📈 Generate Reports
                </Typography>
              </Box>
            </Box>
          </motion.div>
          
          {/* Admin Links */}
          <motion.div variants={staggerItem}>
            <Box mt={4} display="flex" justifyContent="center" gap={2}>
              <AnimatedButton variant="contained" color="primary" onClick={() => router.push('/admin/users')}>Manage Users</AnimatedButton>
              <AnimatedButton variant="outlined" color="primary" onClick={() => router.push('/admin/menu')}>Update Menu</AnimatedButton>
              <AnimatedButton variant="outlined" color="secondary" onClick={() => setEventsOpen(true)}>Manage Events</AnimatedButton>
            </Box>
          </motion.div>

          <Dialog open={eventsOpen} onClose={() => setEventsOpen(false)} fullWidth maxWidth="sm">
            <DialogTitle>Manage Events</DialogTitle>
            <DialogContent>
              <Stack spacing={2} sx={{ mb: 2 }}>
                <Typography variant="subtitle1">Existing Events</Typography>
                <Divider />
                <List dense>
                  {events.length === 0 && <Typography variant="body2" color="text.secondary">No events yet</Typography>}
                  {events.map((ev: any) => (
                    <ListItem key={ev.event_id} secondaryAction={
                      <IconButton edge="end" aria-label="edit" onClick={() => setEventForm({ event_id: ev.event_id, name: ev.name, event_date: ev.event_date, cutoff_date: ev.cutoff_date, is_active: !!ev.is_active })}>
                        <EditIcon />
                      </IconButton>
                    }>
                      <ListItemText primary={`${ev.name} (${ev.event_date})`} secondary={`Cutoff: ${ev.cutoff_date} ${ev.is_active ? ' • Active' : ''}`} />
                    </ListItem>
                  ))}
                </List>
              </Stack>

              <Divider sx={{ my: 2 }} />

              <TextField fullWidth label="Event ID" value={eventForm.event_id} onChange={e => setEventForm({ ...eventForm, event_id: e.target.value })} sx={{ mt: 1 }} />
              <TextField fullWidth label="Name" value={eventForm.name} onChange={e => setEventForm({ ...eventForm, name: e.target.value })} sx={{ mt: 1 }} />
              <TextField
                fullWidth
                label="Event Date"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={eventForm.event_date || ''}
                onChange={e => setEventForm({ ...eventForm, event_date: e.target.value })}
                sx={{ mt: 1 }}
              />
              <TextField
                fullWidth
                label="Cutoff Date"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={eventForm.cutoff_date || ''}
                onChange={e => setEventForm({ ...eventForm, cutoff_date: e.target.value })}
                sx={{ mt: 1 }}
              />
              <FormControlLabel control={<Switch checked={!!eventForm.is_active} onChange={e => setEventForm({ ...eventForm, is_active: e.target.checked })} />} label="Activate this event" />
            </DialogContent>
            <DialogActions>
              <AnimatedButton onClick={() => setEventsOpen(false)}>Cancel</AnimatedButton>
              <AnimatedButton onClick={saveEvent} variant="contained">Save</AnimatedButton>
            </DialogActions>
          </Dialog>
        </motion.div>
      </PageWrapper>
    </>
  );
}