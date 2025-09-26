import { createTheme } from '@mui/material/styles';
import { Variants } from 'framer-motion';

// Kids-friendly color palette
export const kidsTheme = createTheme({
  palette: {
    primary: {
      main: '#FF6B6B', // Warm coral red
      light: '#FF8E8E',
      dark: '#E55555',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#4ECDC4', // Turquoise
      light: '#7BDDD6',
      dark: '#3BA99E',
      contrastText: '#FFFFFF',
    },
    success: {
      main: '#45B7D1', // Sky blue
      light: '#6BC5DA',
      dark: '#3498BC',
    },
    warning: {
      main: '#FFA726', // Orange
      light: '#FFB74D',
      dark: '#F57C00',
    },
    error: {
      main: '#EF5350', // Light red
      light: '#E57373',
      dark: '#C62828',
    },
    background: {
      default: '#FFF8F3', // Cream white
      paper: '#FFFFFF',
    },
    text: {
      primary: '#2D3748', // Dark gray
      secondary: '#4A5568',
    },
  },
  typography: {
    fontFamily:
      'var(--font-comic-neue), var(--font-inter), ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      color: '#2D3748',
      fontFamily: 'var(--font-comic-neue), cursive',
      lineHeight: 1.2,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      color: '#2D3748',
      fontFamily: 'var(--font-comic-neue), cursive',
      lineHeight: 1.3,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
      color: '#2D3748',
      fontFamily: 'var(--font-comic-neue), cursive',
      lineHeight: 1.3,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 500,
      color: '#2D3748',
      lineHeight: 1.4,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 500,
      color: '#2D3748',
      lineHeight: 1.4,
    },
    h6: {
      fontSize: '1.1rem',
      fontWeight: 500,
      color: '#2D3748',
      lineHeight: 1.4,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
      color: '#2D3748',
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.6,
      color: '#4A5568',
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
      fontSize: '1rem',
      fontFamily: 'var(--font-inter), sans-serif',
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          padding: '12px 24px',
          fontSize: '1rem',
          fontWeight: 600,
          textTransform: 'none',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          transition: 'all 0.3s cubic-bezier(0.4, 0.0, 0.2, 1)',
          position: 'relative',
          overflow: 'hidden',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 6px 20px rgba(0,0,0,0.2)',
          },
          '&:active': {
            transform: 'translateY(1px)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
          },
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: '-100%',
            width: '100%',
            height: '100%',
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
            transition: 'left 0.5s',
          },
          '&:hover::before': {
            left: '100%',
          },
        },
        contained: {
          '&:hover': {
            transform: 'translateY(-2px)',
          },
        },
        outlined: {
          borderWidth: 2,
          '&:hover': {
            borderWidth: 2,
            transform: 'translateY(-2px)',
          },
        },
        sizeSmall: {
          padding: '8px 16px',
          fontSize: '0.875rem',
        },
        sizeLarge: {
          padding: '16px 32px',
          fontSize: '1.125rem',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          transition: 'all 0.3s cubic-bezier(0.4, 0.0, 0.2, 1)',
          position: 'relative',
          overflow: 'hidden',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
          },
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: 'linear-gradient(90deg, #FF6B6B, #4ECDC4, #45B7D1)',
            opacity: 0,
            transition: 'opacity 0.3s ease',
          },
          '&:hover::before': {
            opacity: 1,
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            transition: 'all 0.3s cubic-bezier(0.4, 0.0, 0.2, 1)',
            '& fieldset': {
              borderWidth: 2,
              transition: 'all 0.3s cubic-bezier(0.4, 0.0, 0.2, 1)',
            },
            '&:hover fieldset': {
              borderWidth: 2,
              transform: 'scale(1.02)',
            },
            '&.Mui-focused fieldset': {
              borderWidth: 2,
              transform: 'scale(1.02)',
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          fontWeight: 600,
          transition: 'all 0.3s cubic-bezier(0.4, 0.0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-1px)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 12px rgba(0,0,0,0.1)',
          transition: 'all 0.3s cubic-bezier(0.4, 0.0, 0.2, 1)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          transition: 'all 0.3s cubic-bezier(0.4, 0.0, 0.2, 1)',
        },
      },
    },
  },
});

// Animation variants for Framer Motion
export const pageVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.4, 0.0, 0.2, 1],
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.3,
      ease: [0.4, 0.0, 0.2, 1],
    },
  },
};

export const cardVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.9,
    y: 20,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.4, 0.0, 0.2, 1],
    },
  },
  hover: {
    scale: 1.02,
    y: -4,
    transition: {
      duration: 0.2,
      ease: [0.4, 0.0, 0.2, 1],
    },
  },
};

export const buttonVariants: Variants = {
  idle: {
    scale: 1,
    y: 0,
  },
  hover: {
    scale: 1.05,
    y: -2,
    transition: {
      duration: 0.2,
      ease: [0.4, 0.0, 0.2, 1],
    },
  },
  tap: {
    scale: 0.95,
    y: 1,
    transition: {
      duration: 0.1,
      ease: [0.4, 0.0, 0.2, 1],
    },
  },
};

export const staggerContainer: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

export const staggerItem: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.4, 0.0, 0.2, 1],
    },
  },
};

// Custom breakpoints for responsive design
export const breakpoints = {
  xs: '0px',
  sm: '600px',
  md: '960px',
  lg: '1280px',
  xl: '1920px',
};

// Kids-friendly emoji categories
export const emojiCategories = {
  food: ['🍕', '🍔', '🌭', '🥪', '🌮', '🥙', '🧆', '🥗', '🍝', '🍜'],
  beverages: ['🥤', '🧃', '☕', '🧊', '🥛', '🍵', '🧋', '🥃', '🍹', '🍸'],
  desserts: ['🍰', '🧁', '🍪', '🍩', '🍨', '🍦', '🍧', '🍭', '🍬', '🍯'],
  snacks: ['🍿', '🥨', '🥯', '🧀', '🥜', '🌰', '🍇', '🍎', '🍌', '🥕'],
  celebration: ['🎉', '🎊', '🎈', '🎁', '🌟', '✨', '🎂', '🥳', '🎪', '🎭'],
  hearts: ['❤️', '💖', '💝', '💗', '💓', '💕', '💘', '💞', '💌', '💟'],
  success: ['✅', '🎯', '🏆', '🥇', '⭐', '🌟', '👏', '💪', '🎊', '🎉'],
};

// Enhanced animation variants for better micro-interactions
export const logoVariants: Variants = {
  idle: {
    scale: 1,
    rotate: 0,
  },
  hover: {
    scale: 1.05,
    rotate: [0, 2, -2, 0],
    transition: {
      duration: 0.6,
      ease: [0.4, 0.0, 0.2, 1],
    },
  },
  animated: {
    scale: [1, 1.05, 1],
    rotate: [0, 2, -2, 0],
    transition: {
      duration: 4,
      repeat: Infinity,
      repeatDelay: 2,
      ease: [0.4, 0.0, 0.2, 1],
    },
  },
};

export const loadingVariants: Variants = {
  initial: {
    opacity: 0,
    scale: 0.8,
  },
  animate: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: [0.4, 0.0, 0.2, 1],
    },
  },
  pulse: {
    scale: [1, 1.1, 1],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: [0.4, 0.0, 0.2, 1],
    },
  },
};

export const successVariants: Variants = {
  initial: {
    scale: 0,
    opacity: 0,
  },
  animate: {
    scale: [0, 1.2, 1],
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: [0.4, 0.0, 0.2, 1],
    },
  },
  celebrate: {
    scale: [1, 1.1, 1],
    rotate: [0, 5, -5, 0],
    transition: {
      duration: 0.8,
      repeat: 3,
      ease: [0.4, 0.0, 0.2, 1],
    },
  },
};

export default kidsTheme;