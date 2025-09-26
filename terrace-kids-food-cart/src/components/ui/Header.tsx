"use client";

import React from 'react';
import Link from 'next/link';
import { AppBar, Toolbar, Box, useTheme, useMediaQuery } from '@mui/material';
import { useSession } from 'next-auth/react';
import AnimatedButton from '@/components/ui/AnimatedButton';
import Logo from '@/components/ui/Logo';

export default function Header() {
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));
  const { data: session } = useSession();

  const isAdmin = !!(session as any)?.is_admin;

  return (
    <AppBar position="sticky" color="transparent" elevation={0} sx={{ backdropFilter: 'blur(6px)', backgroundColor: 'rgba(255,255,255,0.6)' }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
        <Box display="flex" alignItems="center">
          <Link href="/" aria-label="Home">
            <Logo 
              size="small" 
              hoverable={true}
              style={{ 
                width: isSmall ? 56 : 64,
                height: isSmall ? 56 : 64,
              }}
            />
          </Link>
        </Box>

        <Box display="flex" alignItems="center" gap={2}>
          {/* Only render admin link for authenticated admins */}
          {isAdmin && (
            <AnimatedButton
              component={Link}
              href="/admin"
              variant="outlined"
              size="small"
              sx={{ textTransform: 'none' }}
            >
              Admin
            </AnimatedButton>
          )}

          {/* right side placeholder - keep header height consistent */}
          <Box sx={{ width: isSmall ? 24 : 48 }} />
        </Box>
      </Toolbar>
    </AppBar>
  );
}
