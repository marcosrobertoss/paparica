const userStore = require('../services/userStore');

// The real security boundary for the whole app: everything under /api (except
// /api/login) and the root document route in production go through this.
function requireAuth(req, res, next) {
  if (!req.session || !req.session.userId) {
    return res.status(401).json({ error: 'not_authenticated' });
  }
  const user = userStore.findById(req.session.userId);
  if (!user || !user.is_active) {
    req.session.destroy(() => {});
    return res.status(401).json({ error: 'not_authenticated' });
  }
  req.user = userStore.toPublicUser(user);
  next();
}

module.exports = requireAuth;
