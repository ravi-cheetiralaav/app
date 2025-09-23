import Database from 'better-sqlite3';
import { readFileSync } from 'fs';
import { join } from 'path';

class DatabaseManager {
  private static instance: DatabaseManager;
  private db: Database.Database;

  private constructor() {
    // Initialize SQLite database
    const dbPath = process.env.NODE_ENV === 'production' 
      ? join(process.cwd(), 'database.sqlite')
      : join(process.cwd(), 'dev.sqlite');
    
    this.db = new Database(dbPath);
    this.db.pragma('journal_mode = WAL'); // Better performance for concurrent reads
    this.initializeDatabase();
  }

  public static getInstance(): DatabaseManager {
    if (!DatabaseManager.instance) {
      DatabaseManager.instance = new DatabaseManager();
    }
    return DatabaseManager.instance;
  }

  private initializeDatabase(): void {
    try {
      // Read and execute schema SQL
      const schemaPath = join(process.cwd(), 'src', 'lib', 'database', 'schema.sql');
      const schema = readFileSync(schemaPath, 'utf8');
      
      // Execute schema statements
      const statements = schema.split(';').filter(stmt => stmt.trim().length > 0);
      statements.forEach(statement => {
        this.db.exec(statement);
      });

      console.log('Database initialized successfully');
      this.seedInitialData();
    } catch (error) {
      console.error('Failed to initialize database:', error);
      throw error;
    }
  }

  private seedInitialData(): void {
    // Check if we already have data
    const userCount = this.db.prepare('SELECT COUNT(*) as count FROM users').get() as { count: number };
    
    if (userCount.count === 0) {
      // Create default admin user
      const insertAdmin = this.db.prepare(`
        INSERT INTO users (user_id, first_name, last_name, street_name, street_code, house_number, greeting_word, is_active, is_admin, password_hash)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      
      // Default admin password will be hashed in the auth layer
      insertAdmin.run('Admin_SYS_001', 'Admin', 'User', 'System', 'SYS', '001', 'Hello', 1, 1, null);

      // Create a default active event
      const insertEvent = this.db.prepare(`
        INSERT INTO events (event_id, name, description, event_date, cutoff_date, is_active)
        VALUES (?, ?, ?, ?, ?, ?)
      `);
      
      const eventDate = new Date();
      eventDate.setDate(eventDate.getDate() + 7); // Event in 7 days
      const cutoffDate = new Date(eventDate);
      cutoffDate.setDate(cutoffDate.getDate() - 1); // Cutoff 1 day before event

      insertEvent.run(
        'HOLIDAY_2025_001',
        'Holiday Food & Beverage Cart 2025',
        'Kids holiday project for neighbors and friends',
        eventDate.toISOString().split('T')[0],
        cutoffDate.toISOString().split('T')[0],
        1
      );

      console.log('Initial data seeded successfully');
    }
  }

  // Generic query methods that can be easily adapted for MongoDB
  public async findOne<T = any>(table: string, conditions: Record<string, any>): Promise<T | null> {
    try {
      const whereClause = Object.keys(conditions).map(key => `${key} = ?`).join(' AND ');
      const values = Object.values(conditions);
      const stmt = this.db.prepare(`SELECT * FROM ${table} WHERE ${whereClause}`);
      return stmt.get(...values) as T || null;
    } catch (error) {
      console.error(`Error finding record in ${table}:`, error);
      return null;
    }
  }

  public async findMany<T = any>(
    table: string, 
    conditions: Record<string, any> = {}, 
    options: { limit?: number; offset?: number; orderBy?: string } = {}
  ): Promise<T[]> {
    try {
      let query = `SELECT * FROM ${table}`;
      const values: any[] = [];

      if (Object.keys(conditions).length > 0) {
        const whereClause = Object.keys(conditions).map(key => `${key} = ?`).join(' AND ');
        query += ` WHERE ${whereClause}`;
        values.push(...Object.values(conditions));
      }

      if (options.orderBy) {
        query += ` ORDER BY ${options.orderBy}`;
      }

      if (options.limit) {
        query += ` LIMIT ${options.limit}`;
      }

      if (options.offset) {
        query += ` OFFSET ${options.offset}`;
      }

      const stmt = this.db.prepare(query);
      return stmt.all(...values) as T[];
    } catch (error) {
      console.error(`Error finding records in ${table}:`, error);
      return [];
    }
  }

  public async insertOne(table: string, data: Record<string, any>): Promise<{ id: number; success: boolean }> {
    try {
      const columns = Object.keys(data);
      const values = Object.values(data);
      const placeholders = columns.map(() => '?').join(', ');
      
      const stmt = this.db.prepare(`INSERT INTO ${table} (${columns.join(', ')}) VALUES (${placeholders})`);
      const result = stmt.run(...values);
      
      return { id: result.lastInsertRowid as number, success: true };
    } catch (error) {
      console.error(`Error inserting record into ${table}:`, error);
      return { id: 0, success: false };
    }
  }

  public async updateOne(
    table: string, 
    conditions: Record<string, any>, 
    updates: Record<string, any>
  ): Promise<{ changes: number; success: boolean }> {
    try {
      const setClause = Object.keys(updates).map(key => `${key} = ?`).join(', ');
      const whereClause = Object.keys(conditions).map(key => `${key} = ?`).join(' AND ');
      
      const values = [...Object.values(updates), ...Object.values(conditions)];
      
      const stmt = this.db.prepare(`UPDATE ${table} SET ${setClause} WHERE ${whereClause}`);
      const result = stmt.run(...values);
      
      return { changes: result.changes, success: true };
    } catch (error) {
      console.error(`Error updating record in ${table}:`, error);
      return { changes: 0, success: false };
    }
  }

  public async deleteOne(table: string, conditions: Record<string, any>): Promise<{ changes: number; success: boolean }> {
    try {
      const whereClause = Object.keys(conditions).map(key => `${key} = ?`).join(' AND ');
      const values = Object.values(conditions);
      
      const stmt = this.db.prepare(`DELETE FROM ${table} WHERE ${whereClause}`);
      const result = stmt.run(...values);
      
      return { changes: result.changes, success: true };
    } catch (error) {
      console.error(`Error deleting record from ${table}:`, error);
      return { changes: 0, success: false };
    }
  }

  // Custom query method for complex operations
  public async executeQuery<T = any>(query: string, params: any[] = []): Promise<T[]> {
    try {
      const stmt = this.db.prepare(query);
      return stmt.all(...params) as T[];
    } catch (error) {
      console.error('Error executing query:', error);
      return [];
    }
  }

  public async executeNonQuery(query: string, params: any[] = []): Promise<{ changes: number; success: boolean }> {
    try {
      const stmt = this.db.prepare(query);
      const result = stmt.run(...params);
      return { changes: result.changes, success: true };
    } catch (error) {
      console.error('Error executing non-query:', error);
      return { changes: 0, success: false };
    }
  }

  // Transaction support
  public transaction<T>(fn: (db: Database.Database) => T): T {
    return this.db.transaction(fn)();
  }

  public close(): void {
    this.db.close();
  }
}

export default DatabaseManager;