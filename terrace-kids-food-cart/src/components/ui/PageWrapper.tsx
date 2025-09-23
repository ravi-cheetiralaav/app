'use client';

import React from 'react';
import { Container, ContainerProps } from '@mui/material';
import { motion } from 'framer-motion';
import { pageVariants } from '@/lib/theme';

interface PageWrapperProps extends Omit<ContainerProps, 'component'> {
  children: React.ReactNode;
  showFloatingEmojis?: boolean;
}

const PageWrapper: React.FC<PageWrapperProps> = ({
  children,
  showFloatingEmojis = false,
  ...props
}) => {
  return (
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <Container
        {...props}
        sx={{
          minHeight: '100vh',
          paddingTop: 4,
          paddingBottom: 4,
          position: 'relative',
          ...props.sx,
        }}
      >
        {children}
      </Container>
    </motion.div>
  );
};

export default PageWrapper;