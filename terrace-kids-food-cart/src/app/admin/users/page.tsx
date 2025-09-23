"use client";

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
// Avatar and other MUI components are imported in the grouped import below
import { signOut } from 'next-auth/react';

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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Switch,
  FormControlLabel,
  Stack,
  Paper,
  IconButton
} from '@mui/material';
import PageWrapper from '@/components/ui/PageWrapper';
import AnimatedButton from '@/components/ui/AnimatedButton';
import { Edit } from '@mui/icons-material';

type User = any;

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<User | null>(null);
  const [form, setForm] = useState<any>({
    first_name: '',
    last_name: '',
    street_name: '',
    street_code: '',
    house_number: '',
    greeting_word: 'Hi',
    is_active: true,
    is_admin: false
  });

  const router = useRouter();

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    setLoading(true);
    const res = await fetch('/api/admin/users');
    const data = await res.json();
    setUsers(data || []);
    setLoading(false);
  }

  function openCreate() {
    setEditing(null);
    setForm({
      first_name: '',
      last_name: '',
      street_name: '',
      street_code: '',
      house_number: '',
      greeting_word: 'Hi',
      is_active: true,
      is_admin: false
    });
    setOpen(true);
  }

  function openEdit(user: User) {
    setEditing(user);
    setForm({ ...user });
    setOpen(true);
  }

  async function submit() {
    const payload = { ...form };
    const method = editing ? 'PUT' : 'POST';
    const url = editing ? `/api/admin/users?user_id=${encodeURIComponent(editing.user_id)}` : '/api/admin/users';
    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    if (res.ok) {
      setOpen(false);
      fetchUsers();
    } else {
      const txt = await res.text();
      alert('Error: ' + txt);
    }
  }

  return (
    <>
      <FloatingEmojis category="celebration" count={4} />
      <PageWrapper>
        <motion.div variants={staggerContainer} initial="hidden" animate="visible">
          <motion.div variants={staggerItem}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
              <Box display="flex" alignItems="center" gap={2}>
                <Image src="/images/TKFC-5.jpg" alt="logo" width={64} height={64} style={{ borderRadius: 8 }} />
                <Box>
                  <Typography variant="h4">Manage Users</Typography>
                  {/* Profile header */}
                  <ProfileHeader />
                </Box>
              </Box>
              <Box display="flex" gap={1} alignItems="center">
                <AnimatedButton onClick={() => router.push('/admin/dashboard')} color="secondary">← Back</AnimatedButton>
                <AnimatedButton onClick={openCreate} color="primary">+ New User</AnimatedButton>
              </Box>
            </Box>
          </motion.div>

          <motion.div variants={staggerItem}>
            <Stack spacing={2}>
              {users.map((u, idx) => (
                <motion.div key={u.user_id} variants={staggerItem}>
                  <Paper sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography variant="h6">{u.first_name} {u.last_name} <Typography component="span" color="text.secondary">({u.user_id})</Typography></Typography>
                      <Typography variant="body2">{u.street_name} {u.street_code} {u.house_number} • {u.greeting_word}</Typography>
                    </Box>
                    <Box>
                      <FormControlLabel control={<Switch checked={Boolean(u.is_active)} />} label={u.is_active ? 'Active' : 'Inactive'} />
                      <IconButton onClick={() => openEdit(u)} aria-label="edit"><Edit /></IconButton>
                    </Box>
                  </Paper>
                </motion.div>
              ))}
            </Stack>
          </motion.div>
        </motion.div>

        <Dialog open={open} onClose={() => setOpen(false)} fullWidth>
          <DialogTitle>{editing ? 'Edit User' : 'Create User'}</DialogTitle>
          <DialogContent>
            <Stack spacing={2} mt={1}>
              <TextField label="First name" value={form.first_name} onChange={e => setForm({ ...form, first_name: e.target.value })} />
              <TextField label="Last name" value={form.last_name} onChange={e => setForm({ ...form, last_name: e.target.value })} />
              <TextField label="Street name" value={form.street_name} onChange={e => setForm({ ...form, street_name: e.target.value })} />
              <TextField label="Street code" value={form.street_code} onChange={e => setForm({ ...form, street_code: e.target.value })} />
              <TextField label="House number" value={form.house_number} onChange={e => setForm({ ...form, house_number: e.target.value })} />
              <TextField label="Greeting word" value={form.greeting_word} onChange={e => setForm({ ...form, greeting_word: e.target.value })} />
              <FormControlLabel control={<Switch checked={!!form.is_admin} onChange={e => setForm({ ...form, is_admin: e.target.checked })} />} label="Is Admin" />
              <FormControlLabel control={<Switch checked={!!form.is_active} onChange={e => setForm({ ...form, is_active: e.target.checked })} />} label="Is Active" />
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
