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
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
} from '@mui/material';
import { motion } from 'framer-motion';
import FloatingEmojis from '@/components/ui/FloatingEmojis';
import PageWrapper from '@/components/ui/PageWrapper';
import { staggerContainer, staggerItem } from '@/lib/theme';
import { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Switch, FormControlLabel } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import AnimatedButton from '@/components/ui/AnimatedButton';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

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
    // Redirect unauthenticated admins to the new dedicated admin login page
    router.push('/admin');
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
  const [orders, setOrders] = useState<any[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteReason, setDeleteReason] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteResults, setDeleteResults] = useState<any[] | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'info' | 'warning' | 'error'>('info');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [searchText, setSearchText] = useState<string>('');

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

  async function fetchOrders() {
    setOrdersLoading(true);
    try {
      const res = await fetch('/api/admin/orders');
      if (!res.ok) {
        console.error('Failed to load orders', await res.text());
        setOrders([]);
        return;
      }
      const data = await res.json();
      // API returns { results } sometimes; normalize if needed
      const list = Array.isArray(data) ? data : (Array.isArray(data?.results) ? data.results : data.orders || []);
      // apply client-side filters if provided
      let filtered = list;
      if (statusFilter) filtered = filtered.filter((o: any) => o.status === statusFilter);
      if (searchText && searchText.trim()) {
        const q = searchText.trim().toLowerCase();
        filtered = filtered.filter((o: any) => (o.order_id || '').toLowerCase().includes(q) || (o.user_id || '').toLowerCase().includes(q));
      }
  setOrders(filtered);
    } catch (err) {
      console.error('Failed to fetch orders', err);
      setOrders([]);
    } finally {
      setOrdersLoading(false);
    }
  }

  async function bulkAction(action: 'approve' | 'reject') {
    if (selected.size === 0) return;
    try {
      const order_ids = Array.from(selected);
      const res = await fetch('/api/admin/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order_ids, action })
      });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || 'Action failed');
      }
      const data = await res.json();
      // handle per-order results if needed
      setSelected(new Set());
      await fetchOrders();
    } catch (err: any) {
      alert('Bulk action failed: ' + (err?.message || String(err)));
    }
  }

  async function singleAction(order_id: string, action: 'approve' | 'reject') {
    try {
      const res = await fetch('/api/admin/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order_id, action })
      });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || 'Action failed');
      }
      await fetchOrders();
    } catch (err: any) {
      alert('Action failed: ' + (err?.message || String(err)));
    }
  }

  function downloadCSV(filename: string, rows: string[][]) {
    const csv = rows.map(r => r.map(c => '"' + String(c ?? '').replace(/"/g, '""') + '"').join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  function generateReport() {
    if (!orders || orders.length === 0) {
      alert('No orders to generate report');
      return;
    }
    const rows: string[][] = [];
    rows.push(['order_id', 'user_id', 'status', 'total_amount', 'pickup_time', 'created_at', 'items']);
    for (const o of orders) {
      rows.push([
        o.order_id,
        o.user_id,
        o.status,
        String(o.total_amount ?? ''),
        o.pickup_time ?? '',
        o.created_at ?? '',
        JSON.stringify((o.items || []).map((it: any) => ({ menu_item_id: it.menu_item_id, quantity: it.quantity })))
      ]);
    }
    const filename = `orders-report-${new Date().toISOString().slice(0,19).replace(/[:T]/g,'-')}.csv`;
    downloadCSV(filename, rows);
  }

  // toggle selection of an order
  function toggleSelect(orderId: string) {
    setSelected(prev => {
      const copy = new Set(prev);
      if (copy.has(orderId)) copy.delete(orderId); else copy.add(orderId);
      return copy;
    });
  }

  function selectAllToggle() {
    if (selected.size === orders.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(orders.map(o => o.order_id)));
    }
  }

  // auto-load orders when admin dashboard mounts
  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function confirmDeleteSelected() {
    if (selected.size === 0) return;
    if (!deleteReason || deleteReason.trim().length === 0) {
      alert('Please provide a reason for deletion');
      return;
    }
    setDeleteLoading(true);
    try {
      const order_ids = Array.from(selected);
      // Optimistic update: remove selected orders from UI immediately
      const prevOrders = orders;
      const remaining = orders.filter(o => !order_ids.includes(o.order_id));
      setOrders(remaining);
      setSelected(new Set());

      const res = await fetch('/api/admin/orders', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order_ids, confirm: true, reason: deleteReason })
      });
      if (!res.ok) {
        const txt = await res.text();
        // rollback optimistic update
        setOrders(prevOrders);
        throw new Error(txt || 'Delete failed');
      }
      const data = await res.json();
      setDeleteResults(data?.results || null);
      setDeleteOpen(false);
      // show success snackbar
      setSnackbarMsg(`Deleted ${Array.isArray(data?.results) ? data.results.filter((r:any)=>r.success).length : order_ids.length} order(s)`);
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      // if any failed, restore those orders by refetching
      const failed = (data?.results || []).filter((r:any)=>!r.success).map((r:any)=>r.order_id);
      if (failed.length > 0) {
        await fetchOrders();
        setSnackbarMsg(`Failed to delete ${failed.length} order(s)`);
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      }
    } catch (err: any) {
      alert('Delete failed: ' + (err?.message || String(err)));
    } finally {
      setDeleteLoading(false);
      setDeleteReason('');
    }
  }

  function handleSnackbarClose() {
    setSnackbarOpen(false);
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

          {/* Orders list (shown by default for admins) */}
          <motion.div variants={staggerItem}>
            <Box mt={2} mb={2} display="flex" justifyContent="space-between" alignItems="center">
              <Box>
                <Typography variant="h5">Recent Orders</Typography>
                <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                  <TextField size="small" placeholder="Search order id or user" value={searchText} onChange={e => setSearchText(e.target.value)} />
                  <TextField select size="small" value={statusFilter} onChange={e => setStatusFilter(e.target.value)} SelectProps={{ native: true }}>
                    <option value="">All statuses</option>
                    <option value="pending">pending</option>
                    <option value="approved">approved</option>
                    <option value="rejected">rejected</option>
                    <option value="scheduled">scheduled</option>
                    <option value="draft">draft</option>
                  </TextField>
                  <AnimatedButton variant="text" onClick={() => fetchOrders()}>Apply</AnimatedButton>
                </Stack>
              </Box>
              <Stack direction="row" spacing={1}>
                <AnimatedButton variant="outlined" color="primary" onClick={() => fetchOrders()}>Refresh</AnimatedButton>
                <AnimatedButton variant="contained" color="primary" onClick={generateReport}>Generate Reports</AnimatedButton>
                <AnimatedButton variant="outlined" color="error" onClick={() => setDeleteOpen(true)} disabled={selected.size === 0}>Delete Selected</AnimatedButton>
                <AnimatedButton variant="contained" color="success" onClick={async () => await bulkAction('approve')} disabled={selected.size===0}>Approve Selected</AnimatedButton>
                <AnimatedButton variant="contained" color="inherit" onClick={async () => await bulkAction('reject')} disabled={selected.size===0}>Reject Selected</AnimatedButton>
              </Stack>
            </Box>

            {ordersLoading ? (
              <Box display="flex" justifyContent="center" py={6}><CircularProgress /></Box>
            ) : (
              <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
                <Table stickyHeader size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell padding="checkbox"><Checkbox indeterminate={selected.size>0 && selected.size<orders.length} checked={orders.length>0 && selected.size===orders.length} onChange={selectAllToggle} /></TableCell>
                      <TableCell>Order ID</TableCell>
                      <TableCell>User</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell align="right">Total</TableCell>
                      <TableCell>Items</TableCell>
                      <TableCell>Created</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {orders.map((o: any) => (
                      <TableRow key={o.order_id} hover>
                        <TableCell padding="checkbox">
                          <Checkbox checked={selected.has(o.order_id)} onChange={() => toggleSelect(o.order_id)} />
                        </TableCell>
                        <TableCell>{o.order_id}</TableCell>
                        <TableCell>{o.user_id}</TableCell>
                        <TableCell>
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Typography variant="body2">{o.status}</Typography>
                            <IconButton size="small" onClick={async () => await singleAction(o.order_id, 'approve')} title="Approve"><CheckIcon fontSize="small" /></IconButton>
                            <IconButton size="small" onClick={async () => await singleAction(o.order_id, 'reject')} title="Reject"><CloseIcon fontSize="small" /></IconButton>
                          </Stack>
                        </TableCell>
                        <TableCell align="right">{o.total_amount}</TableCell>
                        <TableCell>{(o.items || []).length}</TableCell>
                        <TableCell>{o.created_at ? new Date(o.created_at).toLocaleString() : ''}</TableCell>
                      </TableRow>
                    ))}
                    {orders.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} align="center">No orders found</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
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
                      <Stack direction="row" spacing={1}>
                        <IconButton edge="end" aria-label="edit" onClick={() => setEventForm({ event_id: ev.event_id, name: ev.name, event_date: ev.event_date, cutoff_date: ev.cutoff_date, is_active: !!ev.is_active })}>
                          <EditIcon />
                        </IconButton>
                        <IconButton edge="end" aria-label="delete" onClick={async () => {
                          if (!confirm(`Delete event ${ev.name}? This will remove related menu items and orders.`)) return;
                          try {
                            const res = await fetch(`/api/admin/events?event_id=${encodeURIComponent(ev.event_id)}`, { method: 'DELETE' });
                            if (!res.ok) throw new Error(await res.text());
                            await fetchEvents();
                          } catch (err) {
                            alert('Failed to delete event: ' + (err as any).message || err);
                          }
                        }}>
                          🗑️
                        </IconButton>
                      </Stack>
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
          <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)} fullWidth maxWidth="sm">
            <DialogTitle>Confirm Delete Selected Orders</DialogTitle>
            <DialogContent>
              <Typography variant="body2" color="text.secondary" paragraph>You're about to delete {selected.size} order(s). This action will be recorded in the audit log.</Typography>
              <TextField fullWidth label="Reason for deletion" value={deleteReason} onChange={e => setDeleteReason(e.target.value)} multiline rows={3} />
              {deleteResults && (
                <Box mt={2}>
                  <Typography variant="subtitle2">Last delete results</Typography>
                  <List dense>
                    {deleteResults.map((r: any) => (
                      <ListItem key={r.order_id}>
                        <ListItemText primary={r.order_id} secondary={r.success ? 'Deleted' : `Failed: ${r.message}`} />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              )}
            </DialogContent>
            <DialogActions>
              <AnimatedButton onClick={() => setDeleteOpen(false)}>Cancel</AnimatedButton>
              <AnimatedButton onClick={confirmDeleteSelected} variant="contained" color="error" disabled={deleteLoading}>{deleteLoading ? 'Deleting...' : 'Confirm Delete'}</AnimatedButton>
            </DialogActions>
          </Dialog>
        </motion.div>
      </PageWrapper>
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMsg}
        </Alert>
      </Snackbar>
    </>
  );
}

// Add Snackbar outside the component? No - component already returns; we'll add it inside the return by editing above. 