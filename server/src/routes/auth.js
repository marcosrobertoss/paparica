const express = require('express');
const userStore = require('../services/userStore');
const requireAuth = require('../middleware/requireAuth');

const router = express.Router();

// Simple in-memory rate limit: 5 failed attempts / 15min per username, fine for
// a single-process VPS app; not a substitute for a WAF.
const failedAttempts = new Map(); // username -> { count, firstAttemptAt }
const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 5;

function isRateLimited(username) {
  const entry = failedAttempts.get(username);
  if (!entry) return false;
  if (Date.now() - entry.firstAttemptAt > WINDOW_MS) {
    failedAttempts.delete(username);
    return false;
  }
  return entry.count >= MAX_ATTEMPTS;
}

function recordFailure(username) {
  const entry = failedAttempts.get(username);
  if (!entry || Date.now() - entry.firstAttemptAt > WINDOW_MS) {
    failedAttempts.set(username, { count: 1, firstAttemptAt: Date.now() });
  } else {
    entry.count += 1;
  }
}

function clearFailures(username) {
  failedAttempts.delete(username);
}

router.post('/login', (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) {
    return res.status(400).json({ error: 'missing_credentials' });
  }

  if (isRateLimited(username)) {
    return res.status(429).json({ error: 'too_many_attempts' });
  }

  const userRow = userStore.findByUsername(username);
  if (!userRow || !userRow.is_active || !userStore.verifyPassword(userRow, password)) {
    recordFailure(username);
    return res.status(401).json({ error: 'invalid_credentials' });
  }

  clearFailures(username);

  // Regenerate the session on login to prevent session fixation.
  req.session.regenerate((err) => {
    if (err) return res.status(500).json({ error: 'session_error' });
    req.session.userId = userRow.id;
    res.json({ user: userStore.toPublicUser(userRow) });
  });
});

router.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.clearCookie('connect.sid');
    res.status(204).end();
  });
});

router.get('/me', requireAuth, (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;
