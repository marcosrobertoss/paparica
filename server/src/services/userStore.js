const bcrypt = require('bcrypt');
const db = require('../db');

const ALL_VIEW_KEYS = ['overview', 'units', 'editor', 'importer'];

function getViewsForUser(userId) {
  const rows = db
    .prepare('SELECT view_key FROM user_view_permissions WHERE user_id = ?')
    .all(userId);
  return rows.map((r) => r.view_key);
}

function toPublicUser(userRow) {
  return {
    id: userRow.id,
    username: userRow.username,
    is_admin: !!userRow.is_admin,
    is_active: !!userRow.is_active,
    views: userRow.is_admin ? ALL_VIEW_KEYS : getViewsForUser(userRow.id),
  };
}

function findByUsername(username) {
  return db.prepare('SELECT * FROM users WHERE username = ?').get(username);
}

function findById(id) {
  return db.prepare('SELECT * FROM users WHERE id = ?').get(id);
}

function verifyPassword(userRow, password) {
  return bcrypt.compareSync(password, userRow.password_hash);
}

function listUsers() {
  const rows = db.prepare('SELECT * FROM users ORDER BY username').all();
  return rows.map(toPublicUser);
}

function createUser({ username, password, is_admin = false, views = [] }) {
  const passwordHash = bcrypt.hashSync(password, 12);
  const info = db
    .prepare('INSERT INTO users (username, password_hash, is_admin) VALUES (?, ?, ?)')
    .run(username, passwordHash, is_admin ? 1 : 0);
  setUserViews(info.lastInsertRowid, views);
  return toPublicUser(findById(info.lastInsertRowid));
}

function setUserViews(userId, viewKeys) {
  const validKeys = viewKeys.filter((k) => ALL_VIEW_KEYS.includes(k));
  const tx = db.transaction(() => {
    db.prepare('DELETE FROM user_view_permissions WHERE user_id = ?').run(userId);
    const insert = db.prepare(
      'INSERT OR IGNORE INTO user_view_permissions (user_id, view_key) VALUES (?, ?)'
    );
    for (const key of validKeys) insert.run(userId, key);
  });
  tx();
}

function updateUser(id, { password, is_admin, is_active, views }) {
  if (password) {
    const passwordHash = bcrypt.hashSync(password, 12);
    db.prepare('UPDATE users SET password_hash = ? WHERE id = ?').run(passwordHash, id);
  }
  if (typeof is_admin === 'boolean') {
    db.prepare('UPDATE users SET is_admin = ? WHERE id = ?').run(is_admin ? 1 : 0, id);
  }
  if (typeof is_active === 'boolean') {
    db.prepare('UPDATE users SET is_active = ? WHERE id = ?').run(is_active ? 1 : 0, id);
  }
  if (Array.isArray(views)) {
    setUserViews(id, views);
  }
  return toPublicUser(findById(id));
}

function deleteUser(id) {
  db.prepare('DELETE FROM users WHERE id = ?').run(id);
}

module.exports = {
  ALL_VIEW_KEYS,
  toPublicUser,
  findByUsername,
  findById,
  verifyPassword,
  listUsers,
  createUser,
  updateUser,
  deleteUser,
  setUserViews,
};
