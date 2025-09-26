// Database schema types

export interface User {
  id: string; // Format: FirstName_StreetCode_HouseNo
  firstName: string;
  lastName: string;
  streetName: string;
  streetCode: string;
  houseNumber: string;
  greetingWord: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Event {
  id: string;
  name: string;
  eventDate: Date;
  cutoffDate: Date; // eventDate - 1 day
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  imagePath?: string;
  category: 'snacks' | 'beverages' | 'desserts';
  ingredients: string;
  calories: number;
  healthBenefits: string;
  stockQuantity: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Order {
  id: string;
  userId: string;
  eventId: string;
  status: 'pending' | 'confirmed' | 'picked-up';
  totalAmount: number;
  qrCode: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  id: string;
  orderId: string;
  menuItemId: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  createdAt: Date;
}

export interface Feedback {
  id: string;
  userId: string;
  orderId?: string;
  eventId: string;
  message: string;
  suggestions: string;
  createdAt: Date;
}

export interface Admin {
  id: string;
  username: string;
  passwordHash: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// API response types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Form types
export interface CreateUserForm {
  firstName: string;
  lastName: string;
  streetName: string;
  streetCode: string;
  houseNumber: string;
  greetingWord: string;
}

export interface CreateEventForm {
  name: string;
  eventDate: string;
}

export interface CreateMenuItemForm {
  name: string;
  description: string;
  price: number;
  category: MenuItem['category'];
  ingredients: string;
  calories: number;
  healthBenefits: string;
  stockQuantity: number;
}

export interface PlaceOrderForm {
  eventId: string;
  items: Array<{
    menuItemId: string;
    quantity: number;
  }>;
}

export interface FeedbackForm {
  eventId: string;
  orderId?: string;
  message: string;
  suggestions: string;
}