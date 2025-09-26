const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');

const dbPath = path.resolve(__dirname, '..', 'dev.sqlite');
const backupPath = dbPath + '.bak-' + Date.now();

function exitWith(msg, code = 0) {
  console.log(msg);
  process.exit(code);
}

if (!fs.existsSync(dbPath)) {
  exitWith(`Database not found at ${dbPath}`, 1);
}

// Backup
fs.copyFileSync(dbPath, backupPath);
console.log(`Backup created at ${backupPath}`);

const db = new Database(dbPath);
try {
  // PRAGMA foreign_keys = ON to ensure cascading behavior where applicable
  db.pragma('foreign_keys = ON');

  const tables = ['order_items', 'order_deletions', 'orders', 'menu_items'];

  console.log('Row counts before:');
  for (const t of tables) {
    try {
      const row = db.prepare(`SELECT COUNT(*) as c FROM ${t}`).get();
      console.log(`  ${t}: ${row.c}`);
    } catch (e) {
      console.log(`  ${t}: (table not found)`);
    }
  }

  const tx = db.transaction(() => {
    for (const t of tables) {
      try {
        db.prepare(`DELETE FROM ${t}`).run();
        // Reset autoincrement
        db.prepare(`DELETE FROM sqlite_sequence WHERE name = ?`).run(t);
      } catch (e) {
        // ignore missing tables
      }
    }
  });

  tx();

  console.log('Row counts after:');
  for (const t of tables) {
    try {
      const row = db.prepare(`SELECT COUNT(*) as c FROM ${t}`).get();
      console.log(`  ${t}: ${row.c}`);
    } catch (e) {
      console.log(`  ${t}: (table not found)`);
    }
  }

  console.log('Purge complete.');
} catch (err) {
  console.error('Error during purge:', err);
  process.exit(2);
} finally {
  db.close();
}
