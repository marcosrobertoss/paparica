const express = require('express');
const requireAuth = require('../middleware/requireAuth');
const requireAdmin = require('../middleware/requireAdmin');
const googleSheets = require('../services/googleSheets');

const router = express.Router();

router.use(requireAuth, requireAdmin);

router.get('/config', (req, res) => {
  res.json(googleSheets.getConfigStatus());
});

router.post('/config', (req, res) => {
  const { sheetIdOrUrl } = req.body || {};
  try {
    const sheetId = googleSheets.setSheetId(sheetIdOrUrl);
    res.json({ ok: true, sheetId });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.post('/sync', async (req, res) => {
  try {
    const result = await googleSheets.fetchAndSync();
    res.json({ ok: true, ...result });
  } catch (err) {
    googleSheets.setSetting('last_sync_status', `error: ${err.message}`);
    googleSheets.setSetting('last_sync_at', new Date().toISOString());
    const status = err.message === 'no_sheet_configured' ? 400 : 502;
    res.status(status).json({ error: err.message });
  }
});

module.exports = router;
