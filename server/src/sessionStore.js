const session = require('express-session');

// Minimal SQLite-backed session store (better-sqlite3 is synchronous, so every
// Store method can call back immediately rather than needing real async I/O).
class SqliteSessionStore extends session.Store {
  constructor(db) {
    super();
    this.db = db;
    this.stmts = {
      get: db.prepare('SELECT sess, expires FROM sessions WHERE sid = ?'),
      set: db.prepare(
        'INSERT INTO sessions (sid, sess, expires) VALUES (@sid, @sess, @expires) ' +
        'ON CONFLICT(sid) DO UPDATE SET sess = @sess, expires = @expires'
      ),
      destroy: db.prepare('DELETE FROM sessions WHERE sid = ?'),
      touch: db.prepare('UPDATE sessions SET expires = ? WHERE sid = ?'),
      prune: db.prepare('DELETE FROM sessions WHERE expires < ?'),
    };
    // Best-effort cleanup of expired sessions every 15 minutes.
    setInterval(() => {
      try {
        this.stmts.prune.run(Date.now());
      } catch {
        // ignore
      }
    }, 15 * 60 * 1000).unref();
  }

  get(sid, cb) {
    try {
      const row = this.stmts.get.get(sid);
      if (!row) return cb(null, null);
      if (row.expires < Date.now()) {
        this.stmts.destroy.run(sid);
        return cb(null, null);
      }
      cb(null, JSON.parse(row.sess));
    } catch (err) {
      cb(err);
    }
  }

  set(sid, sessionData, cb) {
    try {
      const maxAge = sessionData.cookie && sessionData.cookie.maxAge ? sessionData.cookie.maxAge : 24 * 60 * 60 * 1000;
      this.stmts.set.run({
        sid,
        sess: JSON.stringify(sessionData),
        expires: Date.now() + maxAge,
      });
      cb(null);
    } catch (err) {
      cb(err);
    }
  }

  destroy(sid, cb) {
    try {
      this.stmts.destroy.run(sid);
      cb(null);
    } catch (err) {
      cb(err);
    }
  }

  touch(sid, sessionData, cb) {
    try {
      const maxAge = sessionData.cookie && sessionData.cookie.maxAge ? sessionData.cookie.maxAge : 24 * 60 * 60 * 1000;
      this.stmts.touch.run(Date.now() + maxAge, sid);
      cb(null);
    } catch (err) {
      cb(err);
    }
  }
}

module.exports = SqliteSessionStore;
