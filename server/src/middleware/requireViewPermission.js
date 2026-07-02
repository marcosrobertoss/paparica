// Must run after requireAuth. Admins implicitly have every view.
function requireViewPermission(viewKey) {
  return function (req, res, next) {
    if (!req.user) {
      return res.status(401).json({ error: 'not_authenticated' });
    }
    if (req.user.is_admin || req.user.views.includes(viewKey)) {
      return next();
    }
    return res.status(403).json({ error: 'view_permission_required', view: viewKey });
  };
}

module.exports = requireViewPermission;
