// TypeScript interfaces and types for the application
// Designed to be MongoDB-compatible for future migration

export interface User {
  id?: number;
  user_id: string; // Format: FirstName_StreetCode_HouseNo
  first_name: string;
  last_name: string;
  street_name: string;
  street_code: string;
  house_number: string;
  greeting_word: string;
  is_active: boolean;
  is_admin: boolean;
  password_hash?: string; // Only for admin users
  created_at?: string;
  updated_at?: string;
}

export interface Event {
  id?: number;
  event_id: string;
  name: string;
  description?: string;
  event_date: string; // ISO date string
  cutoff_date: string; // ISO date string
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface MenuItem {
  id?: number;
  name: string;
  description?: string;
  price: number;
  category: 'food' | 'beverage' | 'dessert' | 'snack';
  image_url?: string;
  qty_per_unit?: string; // e.g. "200g", "1 piece"
  ingredients: string[]; // Will be stored as JSON string in SQLite
  calories?: number;
  health_benefits: string[]; // Will be stored as JSON string in SQLite
  quantity_available: number;
  is_active: boolean;
  event_id: string;
  created_at?: string;
  updated_at?: string;
}

export interface Order {
  id?: number;
  order_id: string;
  user_id: string;
  event_id: string;
  status: 'pending' | 'confirmed' | 'picked_up' | 'cancelled';
  total_amount: number;
  qr_code?: string;
  pickup_time?: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
  items?: OrderItem[]; // Populated from joins
}

export interface OrderItem {
  id?: number;
  order_id: string;
  menu_item_id: number;
  quantity: number;
  unit_price: number;
  subtotal: number;
  created_at?: string;
  menu_item?: MenuItem; // Populated from joins
}

export interface Feedback {
  id?: number;
  user_id: string;
  order_id?: string;
  event_id: string;
  feedback_text: string;
  rating?: number; // 1-5 stars
  created_at?: string;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Authentication types
export interface LoginCredentials {
  user_id?: string; // For customers
  username?: string; // For admin
  password?: string; // For admin
}

export interface AuthSession {
  user: User;
  isAdmin: boolean;
  expires: string;
}

// Form types for creation/updates
export interface CreateUserForm {
  first_name: string;
  last_name: string;
  street_name: string;
  street_code: string;
  house_number: string;
  greeting_word: string;
  is_active: boolean;
}

export interface CreateMenuItemForm {
  name: string;
  description?: string;
  price: number;
  category: MenuItem['category'];
  image_url?: string;
  qty_per_unit?: string;
  ingredients: string[];
  calories?: number;
  health_benefits: string[];
  quantity_available: number;
  event_id: string;
}

export interface CreateOrderForm {
  event_id: string;
  items: {
    menu_item_id: number;
    quantity: number;
  }[];
  notes?: string;
}

// Database utility types for MongoDB compatibility
export type DatabaseConditions = Record<string, any>;
export type DatabaseUpdates = Record<string, any>;
export type DatabaseOptions = {
  limit?: number;
  offset?: number;
  orderBy?: string;
  populate?: string[]; // For future MongoDB population
};

// QR Code data structure
export interface QRCodeData {
  order_id: string;
  user_id: string;
  event_id: string;
  timestamp: string;
}

// Animation and UI types
export interface AnimationVariants {
  hidden: any;
  visible: any;
  exit?: any;
}

// Kids-friendly UI configuration
export interface UIConfig {
  primaryColors: {
    main: string;
    light: string;
    dark: string;
  };
  secondaryColors: {
    main: string;
    light: string;
    dark: string;
  };
  animations: {
    duration: number;
    easing: string;
  };
  fontSizes: {
    small: string;
    medium: string;
    large: string;
    xlarge: string;
  };
}