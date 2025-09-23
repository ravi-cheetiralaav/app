'use client';

import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { SessionProvider } from 'next-auth/react';
import kidsTheme from '@/lib/theme';

interface ProvidersProps {
  children: React.ReactNode;
  session?: any;
}

const Providers: React.FC<ProvidersProps> = ({ children, session }) => {
  return (
    <SessionProvider session={session}>
      <ThemeProvider theme={kidsTheme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </SessionProvider>
  );
};

export default Providers;