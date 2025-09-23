import { z } from 'zod';

// User schemas
export const createUserSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(50),
  lastName: z.string().min(1, 'Last name is required').max(50),
  streetName: z.string().min(1, 'Street name is required').max(100),
  streetCode: z.string().min(1, 'Street code is required').max(10),
  houseNumber: z.string().min(1, 'House number is required').max(10),
  greetingWord: z.string().min(1, 'Greeting word is required').max(20),
});

export const loginSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
});

// Event schemas
export const createEventSchema = z.object({
  name: z.string().min(1, 'Event name is required').max(100),
  eventDate: z.string().refine((date) => {
    const eventDate = new Date(date);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return eventDate >= tomorrow;
  }, 'Event date must be at least tomorrow'),
});

// Menu item schemas
export const createMenuItemSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  description: z.string().min(1, 'Description is required').max(500),
  price: z.number().min(0.01, 'Price must be greater than 0'),
  category: z.enum(['snacks', 'beverages', 'desserts']),
  ingredients: z.string().min(1, 'Ingredients are required').max(500),
  calories: z.number().int().min(0, 'Calories must be 0 or greater'),
  healthBenefits: z.string().min(1, 'Health benefits are required').max(500),
  stockQuantity: z.number().int().min(0, 'Stock quantity must be 0 or greater'),
});

export const updateMenuItemSchema = createMenuItemSchema.partial();

// Order schemas
export const placeOrderSchema = z.object({
  eventId: z.string().min(1, 'Event ID is required'),
  items: z.array(z.object({
    menuItemId: z.string().min(1, 'Menu item ID is required'),
    quantity: z.number().int().min(1, 'Quantity must be at least 1'),
  })).min(1, 'At least one item is required'),
});

// Feedback schemas
export const createFeedbackSchema = z.object({
  eventId: z.string().min(1, 'Event ID is required'),
  orderId: z.string().optional(),
  message: z.string().min(1, 'Message is required').max(1000),
  suggestions: z.string().min(1, 'Suggestions are required').max(1000),
});

// Admin schemas
export const adminLoginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
});

// QR code validation
export const qrCodeSchema = z.object({
  qrCode: z.string().min(1, 'QR code is required'),
});

// Export types
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type CreateEventInput = z.infer<typeof createEventSchema>;
export type CreateMenuItemInput = z.infer<typeof createMenuItemSchema>;
export type UpdateMenuItemInput = z.infer<typeof updateMenuItemSchema>;
export type PlaceOrderInput = z.infer<typeof placeOrderSchema>;
export type CreateFeedbackInput = z.infer<typeof createFeedbackSchema>;
export type AdminLoginInput = z.infer<typeof adminLoginSchema>;
export type QRCodeInput = z.infer<typeof qrCodeSchema>;