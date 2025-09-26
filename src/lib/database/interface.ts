import { 
  User, 
  Event, 
  MenuItem, 
  Order, 
  OrderItem, 
  Feedback, 
  Admin,
  CreateUserForm,
  CreateEventForm,
  CreateMenuItemForm,
  PlaceOrderForm,
  FeedbackForm
} from '@/types';

// Database abstraction interface for future migration support
export interface DatabaseAdapter {
  // User operations
  createUser(data: CreateUserForm): Promise<User>;
  getUserById(id: string): Promise<User | null>;
  getAllUsers(): Promise<User[]>;
  updateUser(id: string, data: Partial<User>): Promise<User>;
  deleteUser(id: string): Promise<boolean>;
  
  // Event operations
  createEvent(data: CreateEventForm): Promise<Event>;
  getEventById(id: string): Promise<Event | null>;
  getActiveEvent(): Promise<Event | null>;
  getAllEvents(): Promise<Event[]>;
  updateEvent(id: string, data: Partial<Event>): Promise<Event>;
  
  // MenuItem operations
  createMenuItem(data: CreateMenuItemForm): Promise<MenuItem>;
  getMenuItemById(id: string): Promise<MenuItem | null>;
  getAllMenuItems(): Promise<MenuItem[]>;
  getActiveMenuItems(): Promise<MenuItem[]>;
  updateMenuItem(id: string, data: Partial<MenuItem>): Promise<MenuItem>;
  updateMenuItemStock(id: string, quantity: number): Promise<MenuItem>;
  
  // Order operations
  createOrder(userId: string, data: PlaceOrderForm): Promise<Order>;
  getOrderById(id: string): Promise<Order | null>;
  getOrdersByUser(userId: string): Promise<Order[]>;
  getOrdersByEvent(eventId: string): Promise<Order[]>;
  updateOrderStatus(id: string, status: Order['status']): Promise<Order>;
  getOrderWithItems(id: string): Promise<(Order & { items: (OrderItem & { menuItem: MenuItem })[] }) | null>;
  
  // OrderItem operations
  createOrderItem(data: Omit<OrderItem, 'id' | 'createdAt'>): Promise<OrderItem>;
  getOrderItemsByOrder(orderId: string): Promise<(OrderItem & { menuItem: MenuItem })[]>;
  
  // Feedback operations
  createFeedback(userId: string, data: FeedbackForm): Promise<Feedback>;
  getFeedbackByEvent(eventId: string): Promise<Feedback[]>;
  getAllFeedback(): Promise<Feedback[]>;
  
  // Admin operations
  createAdmin(username: string, password: string): Promise<Admin>;
  getAdminByUsername(username: string): Promise<Admin | null>;
  
  // QR Code operations
  validateQRCode(qrCode: string): Promise<Order | null>;
  
  // Utility operations
  initialize(): Promise<void>;
  close(): Promise<void>;
}