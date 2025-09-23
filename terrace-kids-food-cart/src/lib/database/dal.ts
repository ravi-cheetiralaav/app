import DatabaseManager from './index';
import { User, Event, MenuItem, Order, OrderItem, Feedback } from '../types';

class DataAccessLayer {
  private db: DatabaseManager;

  constructor() {
    this.db = DatabaseManager.getInstance();
  }

  // User operations
  async getUsers(conditions: Record<string, any> = {}): Promise<User[]> {
    return this.db.findMany<User>('users', conditions, { orderBy: 'first_name' });
  }

  async getUserById(user_id: string): Promise<User | null> {
    return this.db.findOne<User>('users', { user_id });
  }

  async getUserByCredentials(user_id: string, isAdmin: boolean = false): Promise<User | null> {
    return this.db.findOne<User>('users', { user_id, is_admin: isAdmin ? 1 : 0, is_active: 1 });
  }

  async createUser(userData: Omit<User, 'id' | 'created_at' | 'updated_at'>): Promise<{ id: number; success: boolean }> {
    const now = new Date().toISOString();
    return this.db.insertOne('users', {
      ...userData,
      is_active: userData.is_active ? 1 : 0,
      is_admin: userData.is_admin ? 1 : 0,
      created_at: now,
      updated_at: now
    });
  }

  async updateUser(user_id: string, updates: Partial<User>): Promise<{ changes: number; success: boolean }> {
    const updateData: any = {
      ...updates,
      updated_at: new Date().toISOString()
    };
    // Convert boolean values for SQLite
    if (typeof updates.is_active === 'boolean') {
      updateData.is_active = updates.is_active ? 1 : 0;
    }
    if (typeof updates.is_admin === 'boolean') {
      updateData.is_admin = updates.is_admin ? 1 : 0;
    }
    
    return this.db.updateOne('users', { user_id }, updateData);
  }

  // Event operations
  async getEvents(conditions: Record<string, any> = {}): Promise<Event[]> {
    return this.db.findMany<Event>('events', conditions, { orderBy: 'event_date DESC' });
  }

  async getActiveEvent(): Promise<Event | null> {
    return this.db.findOne<Event>('events', { is_active: 1 });
  }

  async createEvent(eventData: Omit<Event, 'id' | 'created_at' | 'updated_at'>): Promise<{ id: number; success: boolean }> {
    const now = new Date().toISOString();
    return this.db.insertOne('events', {
      ...eventData,
      is_active: eventData.is_active ? 1 : 0,
      created_at: now,
      updated_at: now
    });
  }

  // Menu item operations
  async getMenuItems(event_id?: string): Promise<MenuItem[]> {
    const conditions = event_id ? { event_id, is_active: 1 } : { is_active: 1 };
    const items = await this.db.findMany<any>('menu_items', conditions, { orderBy: 'category, name' });
    
    // Parse JSON strings back to arrays for TypeScript compatibility
    return items.map((item: any) => ({
      ...item,
      ingredients: typeof item.ingredients === 'string' ? JSON.parse(item.ingredients) : item.ingredients,
      health_benefits: typeof item.health_benefits === 'string' ? JSON.parse(item.health_benefits) : item.health_benefits,
      is_active: Boolean(item.is_active)
    }));
  }

  async getMenuItemById(id: number): Promise<MenuItem | null> {
    const item = await this.db.findOne<any>('menu_items', { id });
    if (!item) return null;
    
    return {
      ...item,
      ingredients: typeof item.ingredients === 'string' ? JSON.parse(item.ingredients) : item.ingredients,
      health_benefits: typeof item.health_benefits === 'string' ? JSON.parse(item.health_benefits) : item.health_benefits,
      is_active: Boolean(item.is_active)
    };
  }

  async createMenuItem(itemData: Omit<MenuItem, 'id' | 'created_at' | 'updated_at'>): Promise<{ id: number; success: boolean }> {
    const now = new Date().toISOString();
    return this.db.insertOne('menu_items', {
      ...itemData,
      ingredients: JSON.stringify(itemData.ingredients),
      health_benefits: JSON.stringify(itemData.health_benefits),
      is_active: itemData.is_active ? 1 : 0,
      created_at: now,
      updated_at: now
    });
  }

  async updateMenuItem(id: number, updates: Partial<MenuItem>): Promise<{ changes: number; success: boolean }> {
    const updateData: any = {
      ...updates,
      updated_at: new Date().toISOString()
    };
    
    // Convert arrays to JSON strings for SQLite
    if (updates.ingredients) {
      updateData.ingredients = JSON.stringify(updates.ingredients);
    }
    if (updates.health_benefits) {
      updateData.health_benefits = JSON.stringify(updates.health_benefits);
    }
    if (typeof updates.is_active === 'boolean') {
      updateData.is_active = updates.is_active ? 1 : 0;
    }
    
    return this.db.updateOne('menu_items', { id }, updateData);
  }

  async updateMenuItemStock(id: number, quantity_available: number): Promise<{ changes: number; success: boolean }> {
    return this.db.updateOne('menu_items', { id }, { 
      quantity_available, 
      updated_at: new Date().toISOString() 
    });
  }

  // Order operations
  async getOrders(conditions: Record<string, any> = {}): Promise<Order[]> {
    return this.db.findMany<Order>('orders', conditions, { orderBy: 'created_at DESC' });
  }

  async getOrderById(order_id: string): Promise<Order | null> {
    return this.db.findOne<Order>('orders', { order_id });
  }

  async getOrdersWithItems(user_id?: string, event_id?: string): Promise<Order[]> {
    let whereClause = '';
    const params: any[] = [];
    
    if (user_id || event_id) {
      const conditions: string[] = [];
      if (user_id) {
        conditions.push('o.user_id = ?');
        params.push(user_id);
      }
      if (event_id) {
        conditions.push('o.event_id = ?');
        params.push(event_id);
      }
      whereClause = 'WHERE ' + conditions.join(' AND ');
    }
    
    const query = `
      SELECT 
        o.*,
        oi.id as item_id,
        oi.menu_item_id,
        oi.quantity,
        oi.unit_price,
        oi.subtotal,
        mi.name as item_name,
        mi.description as item_description,
        mi.category as item_category
      FROM orders o
      LEFT JOIN order_items oi ON o.order_id = oi.order_id
      LEFT JOIN menu_items mi ON oi.menu_item_id = mi.id
      ${whereClause}
      ORDER BY o.created_at DESC, oi.id
    `;
    
    const results = await this.db.executeQuery<any>(query, params);
    
    // Group by order_id and organize items
    const ordersMap = new Map<string, Order>();
    
    results.forEach(row => {
      if (!ordersMap.has(row.order_id)) {
        ordersMap.set(row.order_id, {
          id: row.id,
          order_id: row.order_id,
          user_id: row.user_id,
          event_id: row.event_id,
          status: row.status,
          total_amount: row.total_amount,
          qr_code: row.qr_code,
          pickup_time: row.pickup_time,
          notes: row.notes,
          created_at: row.created_at,
          updated_at: row.updated_at,
          items: []
        });
      }
      
      const order = ordersMap.get(row.order_id)!;
      if (row.item_id) {
        order.items!.push({
          id: row.item_id,
          order_id: row.order_id,
          menu_item_id: row.menu_item_id,
          quantity: row.quantity,
          unit_price: row.unit_price,
          subtotal: row.subtotal,
          menu_item: {
            id: row.menu_item_id,
            name: row.item_name,
            description: row.item_description,
            category: row.item_category,
            price: row.unit_price,
            ingredients: [],
            health_benefits: [],
            quantity_available: 0,
            is_active: true,
            event_id: row.event_id
          }
        });
      }
    });
    
    return Array.from(ordersMap.values());
  }

  async createOrder(orderData: Omit<Order, 'id' | 'created_at' | 'updated_at'>): Promise<{ id: number; success: boolean }> {
    const now = new Date().toISOString();
    return this.db.insertOne('orders', {
      ...orderData,
      created_at: now,
      updated_at: now
    });
  }

  async updateOrder(order_id: string, updates: Partial<Order>): Promise<{ changes: number; success: boolean }> {
    return this.db.updateOne('orders', { order_id }, {
      ...updates,
      updated_at: new Date().toISOString()
    });
  }

  async addOrderItem(orderItem: Omit<OrderItem, 'id' | 'created_at'>): Promise<{ id: number; success: boolean }> {
    return this.db.insertOne('order_items', {
      ...orderItem,
      created_at: new Date().toISOString()
    });
  }

  async clearOrderItems(order_id: string): Promise<{ changes: number; success: boolean }> {
    return this.db.deleteOne('order_items', { order_id });
  }

  // Feedback operations
  async getFeedback(event_id?: string): Promise<Feedback[]> {
    const conditions = event_id ? { event_id } : {};
    return this.db.findMany<Feedback>('feedback', conditions, { orderBy: 'created_at DESC' });
  }

  async createFeedback(feedbackData: Omit<Feedback, 'id' | 'created_at'>): Promise<{ id: number; success: boolean }> {
    return this.db.insertOne('feedback', {
      ...feedbackData,
      created_at: new Date().toISOString()
    });
  }

  // Utility operations for business logic
  async canPlaceOrder(event_id: string): Promise<boolean> {
    const event = await this.db.findOne<Event>('events', { event_id, is_active: 1 });
    if (!event) return false;
    
    const today = new Date().toISOString().split('T')[0];
    return today <= event.cutoff_date;
  }

  async isEventActive(event_id: string): Promise<boolean> {
    const event = await this.db.findOne<Event>('events', { event_id, is_active: 1 });
    return !!event;
  }

  // Transaction wrapper for complex operations
  async executeTransaction<T>(fn: () => Promise<T> | T): Promise<T> {
    return this.db.transaction(() => fn());
  }
}

export default DataAccessLayer;