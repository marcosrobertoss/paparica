const express = require('express');
const userStore = require('../services/userStore');
const requireAuth = require('../middleware/requireAuth');
const requireAdmin = require('../middleware/requireAdmin');

const router = express.Router();

router.use(requireAuth, requireAdmin);

router.get('/views', (req, res) => {
  res.json({ views: userStore.ALL_VIEW_KEYS });
});

router.get('/users', (req, res) => {
  res.json({ users: userStore.listUsers() });
});

router.post('/users', (req, res) => {
  const { username, password, is_admin, views } = req.body || {};
  if (!username || !password) {
    return res.status(400).json({ error: 'missing_fields' });
  }
  if (userStore.findByUsername(username)) {
    return res.status(409).json({ error: 'username_taken' });
  }
  try {
    const user = userStore.createUser({
      username,
      password,
      is_admin: !!is_admin,
      views: Array.isArray(views) ? views : [],
    });
    res.status(201).json({ user });
  } catch (err) {
    res.status(500).json({ error: 'create_failed', message: err.message });
  }
});

router.patch('/users/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (!userStore.findById(id)) {
    return res.status(404).json({ error: 'not_found' });
  }
  // Prevent an admin from locking themselves out by demoting/deactivating their own account.
  if (id === req.user.id && (req.body.is_admin === false || req.body.is_active === false)) {
    return res.status(400).json({ error: 'cannot_modify_own_admin_status' });
  }
  const user = userStore.updateUser(id, req.body || {});
  res.json({ user });
});

router.delete('/users/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (id === req.user.id) {
    return res.status(400).json({ error: 'cannot_delete_self' });
  }
  if (!userStore.findById(id)) {
    return res.status(404).json({ error: 'not_found' });
  }
  userStore.deleteUser(id);
  res.status(204).end();
});

module.exports = router;
