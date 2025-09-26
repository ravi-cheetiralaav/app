import { SQLiteAdapter } from './sqlite';
import { DatabaseAdapter } from './interface';

let dbInstance: DatabaseAdapter | null = null;

export async function getDatabase(): Promise<DatabaseAdapter> {
  if (!dbInstance) {
    dbInstance = new SQLiteAdapter(':memory:'); // Use in-memory database for now
    await dbInstance.initialize();
  }
  return dbInstance;
}

// For future migration to other databases
export async function setDatabaseAdapter(adapter: DatabaseAdapter): Promise<void> {
  if (dbInstance) {
    await dbInstance.close();
  }
  dbInstance = adapter;
  await dbInstance.initialize();
}

export async function closeDatabaseConnection(): Promise<void> {
  if (dbInstance) {
    await dbInstance.close();
    dbInstance = null;
  }
}