import Database from 'better-sqlite3';
import { randomUUID } from 'crypto';
import * as bcrypt from 'bcryptjs';
import { DatabaseAdapter } from './interface';
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

export class SQLiteAdapter implements DatabaseAdapter {
  private db: Database.Database;

  constructor(dbPath: string = ':memory:') {
    this.db = new Database(dbPath);
    this.db.pragma('journal_mode = WAL');
  }

  async initialize(): Promise<void> {
    // Create tables
    this.createTables();
    
    // Create default admin user
    await this.createDefaultAdmin();
  }

  private createTables(): void {
    // Users table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        firstName TEXT NOT NULL,
        lastName TEXT NOT NULL,
        streetName TEXT NOT NULL,
        streetCode TEXT NOT NULL,
        houseNumber TEXT NOT NULL,
        greetingWord TEXT NOT NULL,
        isActive BOOLEAN DEFAULT 1,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Events table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS events (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        eventDate DATETIME NOT NULL,
        cutoffDate DATETIME NOT NULL,
        isActive BOOLEAN DEFAULT 1,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Menu items table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS menu_items (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT NOT NULL,
        price REAL NOT NULL,
        imagePath TEXT,
        category TEXT NOT NULL CHECK (category IN ('snacks', 'beverages', 'desserts')),
        ingredients TEXT NOT NULL,
        calories INTEGER NOT NULL,
        healthBenefits TEXT NOT NULL,
        stockQuantity INTEGER NOT NULL DEFAULT 0,
        isActive BOOLEAN DEFAULT 1,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Orders table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS orders (
        id TEXT PRIMARY KEY,
        userId TEXT NOT NULL,
        eventId TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'picked-up')),
        totalAmount REAL NOT NULL,
        qrCode TEXT NOT NULL UNIQUE,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users (id),
        FOREIGN KEY (eventId) REFERENCES events (id)
      )
    `);

    // Order items table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS order_items (
        id TEXT PRIMARY KEY,
        orderId TEXT NOT NULL,
        menuItemId TEXT NOT NULL,
        quantity INTEGER NOT NULL,
        unitPrice REAL NOT NULL,
        totalPrice REAL NOT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (orderId) REFERENCES orders (id),
        FOREIGN KEY (menuItemId) REFERENCES menu_items (id)
      )
    `);

    // Feedback table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS feedback (
        id TEXT PRIMARY KEY,
        userId TEXT NOT NULL,
        orderId TEXT,
        eventId TEXT NOT NULL,
        message TEXT NOT NULL,
        suggestions TEXT NOT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users (id),
        FOREIGN KEY (orderId) REFERENCES orders (id),
        FOREIGN KEY (eventId) REFERENCES events (id)
      )
    `);

    // Admins table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS admins (
        id TEXT PRIMARY KEY,
        username TEXT UNIQUE NOT NULL,
        passwordHash TEXT NOT NULL,
        isActive BOOLEAN DEFAULT 1,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
  }

  private async createDefaultAdmin(): Promise<void> {
    const existingAdmin = await this.getAdminByUsername('admin');
    if (!existingAdmin) {
      await this.createAdmin('admin', 'admin123');
    }
  }

  // User operations
  async createUser(data: CreateUserForm): Promise<User> {
    const id = `${data.firstName}_${data.streetCode}_${data.houseNumber}`;
    const now = new Date();
    
    const stmt = this.db.prepare(`
      INSERT INTO users (id, firstName, lastName, streetName, streetCode, houseNumber, greetingWord, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    stmt.run(id, data.firstName, data.lastName, data.streetName, data.streetCode, data.houseNumber, data.greetingWord, now.toISOString(), now.toISOString());
    
    return {
      id,
      ...data,
      isActive: true,
      createdAt: now,
      updatedAt: now
    };
  }

  async getUserById(id: string): Promise<User | null> {
    const stmt = this.db.prepare('SELECT * FROM users WHERE id = ?');
    const row = stmt.get(id) as any;
    
    if (!row) return null;
    
    return {
      ...row,
      isActive: Boolean(row.isActive),
      createdAt: new Date(row.createdAt),
      updatedAt: new Date(row.updatedAt)
    };
  }

  async getAllUsers(): Promise<User[]> {
    const stmt = this.db.prepare('SELECT * FROM users ORDER BY createdAt DESC');
    const rows = stmt.all() as any[];
    
    return rows.map(row => ({
      ...row,
      isActive: Boolean(row.isActive),
      createdAt: new Date(row.createdAt),
      updatedAt: new Date(row.updatedAt)
    }));
  }

  async updateUser(id: string, data: Partial<User>): Promise<User> {
    const updates = Object.keys(data).filter(key => key !== 'id' && key !== 'createdAt');
    const setClause = updates.map(key => `${key} = ?`).join(', ');
    const values = updates.map(key => data[key as keyof User]);
    
    const stmt = this.db.prepare(`UPDATE users SET ${setClause}, updatedAt = ? WHERE id = ?`);
    stmt.run(...values, new Date().toISOString(), id);
    
    const updatedUser = await this.getUserById(id);
    if (!updatedUser) throw new Error('User not found');
    return updatedUser;
  }

  async deleteUser(id: string): Promise<boolean> {
    const stmt = this.db.prepare('DELETE FROM users WHERE id = ?');
    const result = stmt.run(id);
    return result.changes > 0;
  }

  // Event operations
  async createEvent(data: CreateEventForm): Promise<Event> {
    const id = randomUUID();
    const eventDate = new Date(data.eventDate);
    const cutoffDate = new Date(eventDate);
    cutoffDate.setDate(cutoffDate.getDate() - 1); // Cutoff is 1 day before event
    const now = new Date();
    
    const stmt = this.db.prepare(`
      INSERT INTO events (id, name, eventDate, cutoffDate, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    
    stmt.run(id, data.name, eventDate.toISOString(), cutoffDate.toISOString(), now.toISOString(), now.toISOString());
    
    return {
      id,
      name: data.name,
      eventDate,
      cutoffDate,
      isActive: true,
      createdAt: now,
      updatedAt: now
    };
  }

  async getEventById(id: string): Promise<Event | null> {
    const stmt = this.db.prepare('SELECT * FROM events WHERE id = ?');
    const row = stmt.get(id) as any;
    
    if (!row) return null;
    
    return {
      ...row,
      eventDate: new Date(row.eventDate),
      cutoffDate: new Date(row.cutoffDate),
      isActive: Boolean(row.isActive),
      createdAt: new Date(row.createdAt),
      updatedAt: new Date(row.updatedAt)
    };
  }

  async getActiveEvent(): Promise<Event | null> {
    const stmt = this.db.prepare('SELECT * FROM events WHERE isActive = 1 ORDER BY eventDate DESC LIMIT 1');
    const row = stmt.get() as any;
    
    if (!row) return null;
    
    return {
      ...row,
      eventDate: new Date(row.eventDate),
      cutoffDate: new Date(row.cutoffDate),
      isActive: Boolean(row.isActive),
      createdAt: new Date(row.createdAt),
      updatedAt: new Date(row.updatedAt)
    };
  }

  async getAllEvents(): Promise<Event[]> {
    const stmt = this.db.prepare('SELECT * FROM events ORDER BY eventDate DESC');
    const rows = stmt.all() as any[];
    
    return rows.map(row => ({
      ...row,
      eventDate: new Date(row.eventDate),
      cutoffDate: new Date(row.cutoffDate),
      isActive: Boolean(row.isActive),
      createdAt: new Date(row.createdAt),
      updatedAt: new Date(row.updatedAt)
    }));
  }

  async updateEvent(id: string, data: Partial<Event>): Promise<Event> {
    const updates = Object.keys(data).filter(key => key !== 'id' && key !== 'createdAt');
    const setClause = updates.map(key => `${key} = ?`).join(', ');
    const values = updates.map(key => {
      const value = data[key as keyof Event];
      return value instanceof Date ? value.toISOString() : value;
    });
    
    const stmt = this.db.prepare(`UPDATE events SET ${setClause}, updatedAt = ? WHERE id = ?`);
    stmt.run(...values, new Date().toISOString(), id);
    
    const updatedEvent = await this.getEventById(id);
    if (!updatedEvent) throw new Error('Event not found');
    return updatedEvent;
  }

  // MenuItem operations
  async createMenuItem(data: CreateMenuItemForm): Promise<MenuItem> {
    const id = randomUUID();
    const now = new Date();
    
    const stmt = this.db.prepare(`
      INSERT INTO menu_items (id, name, description, price, category, ingredients, calories, healthBenefits, stockQuantity, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    stmt.run(id, data.name, data.description, data.price, data.category, data.ingredients, data.calories, data.healthBenefits, data.stockQuantity, now.toISOString(), now.toISOString());
    
    return {
      id,
      ...data,
      imagePath: undefined,
      isActive: true,
      createdAt: now,
      updatedAt: now
    };
  }

  async getMenuItemById(id: string): Promise<MenuItem | null> {
    const stmt = this.db.prepare('SELECT * FROM menu_items WHERE id = ?');
    const row = stmt.get(id) as any;
    
    if (!row) return null;
    
    return {
      ...row,
      isActive: Boolean(row.isActive),
      createdAt: new Date(row.createdAt),
      updatedAt: new Date(row.updatedAt)
    };
  }

  async getAllMenuItems(): Promise<MenuItem[]> {
    const stmt = this.db.prepare('SELECT * FROM menu_items ORDER BY category, name');
    const rows = stmt.all() as any[];
    
    return rows.map(row => ({
      ...row,
      isActive: Boolean(row.isActive),
      createdAt: new Date(row.createdAt),
      updatedAt: new Date(row.updatedAt)
    }));
  }

  async getActiveMenuItems(): Promise<MenuItem[]> {
    const stmt = this.db.prepare('SELECT * FROM menu_items WHERE isActive = 1 ORDER BY category, name');
    const rows = stmt.all() as any[];
    
    return rows.map(row => ({
      ...row,
      isActive: Boolean(row.isActive),
      createdAt: new Date(row.createdAt),
      updatedAt: new Date(row.updatedAt)
    }));
  }

  async updateMenuItem(id: string, data: Partial<MenuItem>): Promise<MenuItem> {
    const updates = Object.keys(data).filter(key => key !== 'id' && key !== 'createdAt');
    const setClause = updates.map(key => `${key} = ?`).join(', ');
    const values = updates.map(key => data[key as keyof MenuItem]);
    
    const stmt = this.db.prepare(`UPDATE menu_items SET ${setClause}, updatedAt = ? WHERE id = ?`);
    stmt.run(...values, new Date().toISOString(), id);
    
    const updatedItem = await this.getMenuItemById(id);
    if (!updatedItem) throw new Error('Menu item not found');
    return updatedItem;
  }

  async updateMenuItemStock(id: string, quantity: number): Promise<MenuItem> {
    const stmt = this.db.prepare('UPDATE menu_items SET stockQuantity = ?, updatedAt = ? WHERE id = ?');
    stmt.run(quantity, new Date().toISOString(), id);
    
    const updatedItem = await this.getMenuItemById(id);
    if (!updatedItem) throw new Error('Menu item not found');
    return updatedItem;
  }

  // Order operations
  async createOrder(userId: string, data: PlaceOrderForm): Promise<Order> {
    const id = randomUUID();
    const qrCode = `${id}_${userId}_${data.eventId}`;
    const now = new Date();
    
    // Calculate total amount and create order items
    let totalAmount = 0;
    const orderItems: OrderItem[] = [];
    
    for (const item of data.items) {
      const menuItem = await this.getMenuItemById(item.menuItemId);
      if (!menuItem) throw new Error(`Menu item ${item.menuItemId} not found`);
      if (menuItem.stockQuantity < item.quantity) {
        throw new Error(`Insufficient stock for ${menuItem.name}`);
      }
      
      const totalPrice = menuItem.price * item.quantity;
      totalAmount += totalPrice;
      
      const orderItem: OrderItem = {
        id: randomUUID(),
        orderId: id,
        menuItemId: item.menuItemId,
        quantity: item.quantity,
        unitPrice: menuItem.price,
        totalPrice,
        createdAt: now
      };
      orderItems.push(orderItem);
    }
    
    // Start transaction
    const transaction = this.db.transaction(() => {
      // Create order
      const orderStmt = this.db.prepare(`
        INSERT INTO orders (id, userId, eventId, totalAmount, qrCode, createdAt, updatedAt)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `);
      orderStmt.run(id, userId, data.eventId, totalAmount, qrCode, now.toISOString(), now.toISOString());
      
      // Create order items and update stock
      const orderItemStmt = this.db.prepare(`
        INSERT INTO order_items (id, orderId, menuItemId, quantity, unitPrice, totalPrice, createdAt)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `);
      
      const stockStmt = this.db.prepare('UPDATE menu_items SET stockQuantity = stockQuantity - ? WHERE id = ?');
      
      for (const orderItem of orderItems) {
        orderItemStmt.run(orderItem.id, orderItem.orderId, orderItem.menuItemId, orderItem.quantity, orderItem.unitPrice, orderItem.totalPrice, orderItem.createdAt.toISOString());
        stockStmt.run(orderItem.quantity, orderItem.menuItemId);
      }
    });
    
    transaction();
    
    return {
      id,
      userId,
      eventId: data.eventId,
      status: 'pending',
      totalAmount,
      qrCode,
      createdAt: now,
      updatedAt: now
    };
  }

  async getOrderById(id: string): Promise<Order | null> {
    const stmt = this.db.prepare('SELECT * FROM orders WHERE id = ?');
    const row = stmt.get(id) as any;
    
    if (!row) return null;
    
    return {
      ...row,
      createdAt: new Date(row.createdAt),
      updatedAt: new Date(row.updatedAt)
    };
  }

  async getOrdersByUser(userId: string): Promise<Order[]> {
    const stmt = this.db.prepare('SELECT * FROM orders WHERE userId = ? ORDER BY createdAt DESC');
    const rows = stmt.all(userId) as any[];
    
    return rows.map(row => ({
      ...row,
      createdAt: new Date(row.createdAt),
      updatedAt: new Date(row.updatedAt)
    }));
  }

  async getOrdersByEvent(eventId: string): Promise<Order[]> {
    const stmt = this.db.prepare('SELECT * FROM orders WHERE eventId = ? ORDER BY createdAt DESC');
    const rows = stmt.all(eventId) as any[];
    
    return rows.map(row => ({
      ...row,
      createdAt: new Date(row.createdAt),
      updatedAt: new Date(row.updatedAt)
    }));
  }

  async updateOrderStatus(id: string, status: Order['status']): Promise<Order> {
    const stmt = this.db.prepare('UPDATE orders SET status = ?, updatedAt = ? WHERE id = ?');
    stmt.run(status, new Date().toISOString(), id);
    
    const updatedOrder = await this.getOrderById(id);
    if (!updatedOrder) throw new Error('Order not found');
    return updatedOrder;
  }

  async getOrderWithItems(id: string): Promise<(Order & { items: (OrderItem & { menuItem: MenuItem })[] }) | null> {
    const order = await this.getOrderById(id);
    if (!order) return null;
    
    const items = await this.getOrderItemsByOrder(id);
    
    return {
      ...order,
      items
    };
  }

  // OrderItem operations
  async createOrderItem(data: Omit<OrderItem, 'id' | 'createdAt'>): Promise<OrderItem> {
    const id = randomUUID();
    const now = new Date();
    
    const stmt = this.db.prepare(`
      INSERT INTO order_items (id, orderId, menuItemId, quantity, unitPrice, totalPrice, createdAt)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    
    stmt.run(id, data.orderId, data.menuItemId, data.quantity, data.unitPrice, data.totalPrice, now.toISOString());
    
    return {
      id,
      ...data,
      createdAt: now
    };
  }

  async getOrderItemsByOrder(orderId: string): Promise<(OrderItem & { menuItem: MenuItem })[]> {
    const stmt = this.db.prepare(`
      SELECT oi.*, mi.* as menuItem
      FROM order_items oi
      JOIN menu_items mi ON oi.menuItemId = mi.id
      WHERE oi.orderId = ?
      ORDER BY oi.createdAt
    `);
    
    const rows = stmt.all(orderId) as any[];
    
    return rows.map(row => ({
      id: row.id,
      orderId: row.orderId,
      menuItemId: row.menuItemId,
      quantity: row.quantity,
      unitPrice: row.unitPrice,
      totalPrice: row.totalPrice,
      createdAt: new Date(row.createdAt),
      menuItem: {
        id: row.menuItemId,
        name: row.name,
        description: row.description,
        price: row.price,
        imagePath: row.imagePath,
        category: row.category,
        ingredients: row.ingredients,
        calories: row.calories,
        healthBenefits: row.healthBenefits,
        stockQuantity: row.stockQuantity,
        isActive: Boolean(row.isActive),
        createdAt: new Date(row.createdAt),
        updatedAt: new Date(row.updatedAt)
      }
    }));
  }

  // Feedback operations
  async createFeedback(userId: string, data: FeedbackForm): Promise<Feedback> {
    const id = randomUUID();
    const now = new Date();
    
    const stmt = this.db.prepare(`
      INSERT INTO feedback (id, userId, orderId, eventId, message, suggestions, createdAt)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    
    stmt.run(id, userId, data.orderId || null, data.eventId, data.message, data.suggestions, now.toISOString());
    
    return {
      id,
      userId,
      orderId: data.orderId,
      eventId: data.eventId,
      message: data.message,
      suggestions: data.suggestions,
      createdAt: now
    };
  }

  async getFeedbackByEvent(eventId: string): Promise<Feedback[]> {
    const stmt = this.db.prepare('SELECT * FROM feedback WHERE eventId = ? ORDER BY createdAt DESC');
    const rows = stmt.all(eventId) as any[];
    
    return rows.map(row => ({
      ...row,
      createdAt: new Date(row.createdAt)
    }));
  }

  async getAllFeedback(): Promise<Feedback[]> {
    const stmt = this.db.prepare('SELECT * FROM feedback ORDER BY createdAt DESC');
    const rows = stmt.all() as any[];
    
    return rows.map(row => ({
      ...row,
      createdAt: new Date(row.createdAt)
    }));
  }

  // Admin operations
  async createAdmin(username: string, password: string): Promise<Admin> {
    const id = randomUUID();
    const passwordHash = await bcrypt.hash(password, 10);
    const now = new Date();
    
    const stmt = this.db.prepare(`
      INSERT INTO admins (id, username, passwordHash, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?)
    `);
    
    stmt.run(id, username, passwordHash, now.toISOString(), now.toISOString());
    
    return {
      id,
      username,
      passwordHash,
      isActive: true,
      createdAt: now,
      updatedAt: now
    };
  }

  async getAdminByUsername(username: string): Promise<Admin | null> {
    const stmt = this.db.prepare('SELECT * FROM admins WHERE username = ?');
    const row = stmt.get(username) as any;
    
    if (!row) return null;
    
    return {
      ...row,
      isActive: Boolean(row.isActive),
      createdAt: new Date(row.createdAt),
      updatedAt: new Date(row.updatedAt)
    };
  }

  // QR Code operations
  async validateQRCode(qrCode: string): Promise<Order | null> {
    const stmt = this.db.prepare('SELECT * FROM orders WHERE qrCode = ?');
    const row = stmt.get(qrCode) as any;
    
    if (!row) return null;
    
    return {
      ...row,
      createdAt: new Date(row.createdAt),
      updatedAt: new Date(row.updatedAt)
    };
  }

  async close(): Promise<void> {
    this.db.close();
  }
}