const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

module.exports = {
  port: parseInt(process.env.PORT || '3000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  isProduction: process.env.NODE_ENV === 'production',
  sessionSecret: process.env.SESSION_SECRET || 'dev-only-insecure-secret-change-me',
  dbPath: path.join(__dirname, '../../data/app.db'),
  clientDistPath: path.join(__dirname, '../../client/dist'),
  adminBootstrapUsername: process.env.ADMIN_BOOTSTRAP_USERNAME || 'admin',
  adminBootstrapPassword: process.env.ADMIN_BOOTSTRAP_PASSWORD || 'admin123',
};
