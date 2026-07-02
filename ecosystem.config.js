// PM2 process definition for the VPS: pm2 start ecosystem.config.js
module.exports = {
  apps: [
    {
      name: 'dashboard-paparica',
      script: 'server/src/index.js',
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
