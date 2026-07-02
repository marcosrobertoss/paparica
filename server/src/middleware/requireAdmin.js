// Must run after requireAuth (depends on req.user).
function requireAdmin(req, res, next) {
  if (!req.user || !req.user.is_admin) {
    return res.status(403).json({ error: 'admin_required' });
  }
  next();
}

module.exports = requireAdmin;
