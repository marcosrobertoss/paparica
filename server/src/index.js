const path = require('path');
const express = require('express');
const session = require('express-session');
const config = require('./config');
const db = require('./db');
const SqliteSessionStore = require('./sessionStore');

const authRoutes = require('./routes/auth');
const dataRoutes = require('./routes/data');
const adminRoutes = require('./routes/admin');
const sheetsRoutes = require('./routes/sheets');

const app = express();

if (config.isProduction) {
  // Required so req.secure reflects the real client protocol when behind the
  // VPS's nginx/Caddy TLS-terminating reverse proxy (which must forward
  // X-Forwarded-Proto) — without this, secure:true session cookies never get
  // set and login silently breaks in production, since Express otherwise sees
  // every request as plain HTTP.
  app.set('trust proxy', 1);
}

app.use(express.json());

app.use(
  session({
    store: new SqliteSessionStore(db),
    name: 'connect.sid',
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: 'lax',
      secure: config.isProduction, // requires HTTPS via reverse proxy in production
      maxAge: 24 * 60 * 60 * 1000, // 24h
    },
  })
);

app.use('/api', authRoutes);
app.use('/api/data', dataRoutes);
app.use('/api/admin/sheets', sheetsRoutes);
app.use('/api/admin', adminRoutes);

// Any /api/* path not matched above is a real 404, not a SPA route — must be
// declared before the catch-all below or it would serve the HTML shell instead.
app.use('/api', (req, res) => {
  res.status(404).json({ error: 'not_found' });
});

if (config.isProduction) {
  app.use(express.static(config.clientDistPath));
  // Catch-all AFTER all /api routes, so React Router's client-side routes
  // (e.g. a hard refresh on /units) still resolve to the SPA shell.
  app.get('*', (req, res) => {
    res.sendFile(path.join(config.clientDistPath, 'index.html'));
  });
}

app.listen(config.port, () => {
  // eslint-disable-next-line no-console
  console.log(`[server] listening on http://localhost:${config.port} (${config.nodeEnv})`);
});
