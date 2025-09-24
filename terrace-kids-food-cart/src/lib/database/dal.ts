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

  async updateEvent(event_id: string, updates: Partial<Event>): Promise<{ changes: number; success: boolean }> {
    const updateData: any = {
      ...updates,
      updated_at: new Date().toISOString()
    };
    if (typeof updates.is_active === 'boolean') {
      updateData.is_active = updates.is_active ? 1 : 0;
    }
    return this.db.updateOne('events', { event_id }, updateData);
  }

  // Menu item operations
  async getMenuItems(event_id?: string): Promise<MenuItem[]> {
    const conditions = event_id ? { event_id, is_active: 1 } : { is_active: 1 };
    const items = await this.db.findMany<any>('menu_items', conditions, { orderBy: 'category, name' });
    
    // Parse JSON strings back to arrays for TypeScript compatibility
    return items.map((item: any) => ({
      ...item,
      qty_per_unit: item.qty_per_unit,
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
      qty_per_unit: item.qty_per_unit,
      ingredients: typeof item.ingredients === 'string' ? JSON.parse(item.ingredients) : item.ingredients,
      health_benefits: typeof item.health_benefits === 'string' ? JSON.parse(item.health_benefits) : item.health_benefits,
      is_active: Boolean(item.is_active)
    };
  }

  async createMenuItem(itemData: Omit<MenuItem, 'id' | 'created_at' | 'updated_at'>): Promise<{ id: number; success: boolean }> {
    const now = new Date().toISOString();
    return this.db.insertOne('menu_items', {
      ...itemData,
      qty_per_unit: itemData.qty_per_unit,
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
    if (typeof updates.qty_per_unit === 'string') {
      updateData.qty_per_unit = updates.qty_per_unit;
    }
    if (typeof updates.calories !== 'undefined') {
      updateData.calories = updates.calories;
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

  async getOrderWithItems(order_id: string): Promise<Order | null> {
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
        mi.category as item_category,
        mi.quantity_available as item_quantity_available
      FROM orders o
      LEFT JOIN order_items oi ON o.order_id = oi.order_id
      LEFT JOIN menu_items mi ON oi.menu_item_id = mi.id
      WHERE o.order_id = ?
      ORDER BY oi.id
    `;

    const results = await this.db.executeQuery<any>(query, [order_id]);
    if (!results || results.length === 0) {
      // If no rows, check if order exists without items
      const ord = await this.getOrderById(order_id);
      if (!ord) return null;
      ord.items = [];
      return ord;
    }

    const order: any = {
      id: results[0].id,
      order_id: results[0].order_id,
      user_id: results[0].user_id,
      event_id: results[0].event_id,
      status: results[0].status,
      total_amount: results[0].total_amount,
      qr_code: results[0].qr_code,
      pickup_time: results[0].pickup_time,
      notes: results[0].notes,
      created_at: results[0].created_at,
      updated_at: results[0].updated_at,
      items: []
    };

    results.forEach(row => {
      if (row.item_id) {
        order.items.push({
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
            quantity_available: row.item_quantity_available || 0
          }
        });
      }
    });

    return order as Order;
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

  /**
   * Delete an order and its items inside a transaction. Returns { success: boolean }
   */
  async deleteOrder(order_id: string, deleted_by?: string, reason?: string): Promise<{ success: boolean }> {
    // Implement soft-delete with audit log. We will mark orders as is_deleted = 1 and insert a row into order_deletions
    // deleted_by and reason are optional but recommended; when provided, the audit row will be inserted inside the same transaction.
    return this.executeTransaction(async () => {
      // Ensure orders table has is_deleted, deleted_at, deleted_by columns (attempt lightweight migration)
      try {
        const cols = this.db.executeQuery(`PRAGMA table_info('orders')`) as any;
        const colNames = (cols as any[]).map((c: any) => c.name);
        if (!colNames.includes('is_deleted')) {
          // Add column
          // Using executeNonQuery to run ALTER; ignore failures on older DBs
          await this.db.executeNonQuery("ALTER TABLE orders ADD COLUMN is_deleted INTEGER DEFAULT 0;");
        }
        if (!colNames.includes('deleted_at')) {
          await this.db.executeNonQuery("ALTER TABLE orders ADD COLUMN deleted_at TEXT;");
        }
        if (!colNames.includes('deleted_by')) {
          await this.db.executeNonQuery("ALTER TABLE orders ADD COLUMN deleted_by TEXT;");
        }
      } catch (e) {
        // non-fatal
      }

      // Ensure audit table exists
      try {
        await this.db.executeNonQuery(`
          CREATE TABLE IF NOT EXISTS order_deletions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            order_id TEXT NOT NULL,
            deleted_by TEXT,
            reason TEXT,
            deleted_at TEXT NOT NULL
          );
        `);
      } catch (e) {
        // non-fatal
      }

      const now = new Date().toISOString();

      // Mark order as deleted
      await this.db.updateOne('orders', { order_id }, { is_deleted: 1, deleted_at: now });

      // Insert audit record when information is provided (do this inside the same transaction for atomicity)
      try {
        if (deleted_by || reason) {
          await this.db.executeNonQuery(`INSERT INTO order_deletions (order_id, deleted_by, reason, deleted_at) VALUES (?, ?, ?, ?);`, [order_id, deleted_by || null, reason || null, now]);
        }
      } catch (e) {
        // If audit insert fails, still throw to rollback the transaction — audits are considered important for deletions
        throw new Error('Failed to insert audit record for order deletion: ' + String(e));
      }

      return { success: true };
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

  /**
   * Update order items for an existing order.
   * This will run inside a transaction: validate stock, update order_items, adjust menu stock, and update order total.
   * items: [{ menu_item_id, quantity }]
   */
  async updateOrderItems(order_id: string, items: Array<{ menu_item_id: number; quantity: number }>): Promise<Order | null> {
    // Use explicit transaction via executeTransaction
    return this.executeTransaction<Order | null>(async () => {
      const existing = await this.getOrderWithItems(order_id) as any;
      if (!existing) throw new Error('Order not found');

      if (existing.status && !['pending', 'scheduled', 'draft'].includes(existing.status)) {
        throw new Error('Order cannot be edited in its current state');
      }

      // Build lines and validate stock
      let total = 0;
      const lines: any[] = [];
      for (const it of items) {
        const menu = await this.getMenuItemById(it.menu_item_id as any);
        if (!menu) throw new Error(`Menu item not found: ${it.menu_item_id}`);
        if ((menu.quantity_available || 0) < it.quantity) throw new Error(`Not enough stock for ${menu.name}`);
        const unit = Number(menu.price) || 0;
        const subtotal = unit * Number(it.quantity);
        total += subtotal;
        lines.push({ menu, quantity: Number(it.quantity), unit, subtotal });
      }

      // Restore stock from previous items (increment back) before applying new items
      if (existing.items && Array.isArray(existing.items)) {
        for (const prev of existing.items) {
          try {
            const prevMenu = await this.getMenuItemById(prev.menu_item_id);
            if (prevMenu) {
              const restored = (prevMenu.quantity_available || 0) + Number(prev.quantity || 0);
              await this.updateMenuItemStock(prev.menu_item_id, restored);
            }
          } catch (e) {
            // continue
          }
        }
      }

      // Clear existing items
      await this.clearOrderItems(order_id);

      // Add new items and decrement stock
      for (const ln of lines) {
        await this.addOrderItem({ order_id, menu_item_id: ln.menu.id, quantity: ln.quantity, unit_price: ln.unit, subtotal: ln.subtotal });
        const newQty = Math.max(0, (ln.menu.quantity_available || 0) - ln.quantity);
        await this.updateMenuItemStock(ln.menu.id, newQty);
      }

      // Update order total
      await this.updateOrder(order_id, { total_amount: total });

      return this.getOrderWithItems(order_id);
    });
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
    // Use explicit BEGIN/COMMIT/ROLLBACK so callers can use async operations inside the transaction
    await this.db.executeNonQuery('BEGIN');
    try {
      const result = await fn();
      await this.db.executeNonQuery('COMMIT');
      return result as T;
    } catch (err) {
      await this.db.executeNonQuery('ROLLBACK');
      throw err;
    }
  }
}

export default DataAccessLayer;