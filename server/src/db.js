const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');
const bcrypt = require('bcrypt');
const config = require('./config');

fs.mkdirSync(path.dirname(config.dbPath), { recursive: true });

const db = new Database(config.dbPath);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

const migrationsDir = path.join(__dirname, 'migrations');
const migrationFiles = fs.readdirSync(migrationsDir).filter(f => f.endsWith('.sql')).sort();
for (const file of migrationFiles) {
  const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
  db.exec(sql);
}

function seedIfEmpty() {
  const userCount = db.prepare('SELECT COUNT(*) AS c FROM users').get().c;
  if (userCount === 0) {
    const passwordHash = bcrypt.hashSync(config.adminBootstrapPassword, 12);
    const info = db
      .prepare('INSERT INTO users (username, password_hash, is_admin) VALUES (?, ?, 1)')
      .run(config.adminBootstrapUsername, passwordHash);
    const insertPerm = db.prepare(
      'INSERT OR IGNORE INTO user_view_permissions (user_id, view_key) VALUES (?, ?)'
    );
    for (const viewKey of ['overview', 'units', 'editor', 'importer']) {
      insertPerm.run(info.lastInsertRowid, viewKey);
    }
    // eslint-disable-next-line no-console
    console.log(
      `[db] Bootstrap admin created: username="${config.adminBootstrapUsername}" (set ADMIN_BOOTSTRAP_USERNAME/PASSWORD env vars to change).`
    );
  }

}

seedIfEmpty();

module.exports = db;
