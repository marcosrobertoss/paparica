const express = require('express');
const db = require('../db');
const requireAuth = require('../middleware/requireAuth');
const requireViewPermission = require('../middleware/requireViewPermission');

const router = express.Router();

router.use(requireAuth);

const upsertStmt = db.prepare(`
  INSERT INTO data_rows (year, month, unit, investment, first_orders, total_orders, roas, source, updated_at)
  VALUES (@year, @month, @unit, @investment, @first_orders, @total_orders, @roas, @source, datetime('now'))
  ON CONFLICT(year, month, unit) DO UPDATE SET
    investment = @investment,
    first_orders = @first_orders,
    total_orders = @total_orders,
    roas = @roas,
    source = @source,
    updated_at = datetime('now')
`);

function validateRow(row) {
  const year = parseInt(row.year, 10);
  const month = parseInt(row.month, 10);
  const unit = String(row.unit || '').trim();
  const investment = parseFloat(row.investment);
  const first_orders = parseInt(row.first_orders, 10) || 0;
  const total_orders = parseInt(row.total_orders, 10) || 0;
  const roas = parseFloat(row.roas) || 0;

  if (!unit || Number.isNaN(year) || Number.isNaN(month) || month < 0 || month > 11 || Number.isNaN(investment)) {
    return null;
  }
  if (first_orders > total_orders) {
    return null;
  }
  return { year, month, unit, investment, first_orders, total_orders, roas };
}

// Any authenticated user can read all rows (per-view-only permission model —
// no per-unit data scoping).
router.get('/', (req, res) => {
  const rows = db.prepare('SELECT * FROM data_rows ORDER BY year, month, unit').all();
  res.json({ rows });
});

// Manual single-row upsert, used by the Editor view's form.
router.post('/', requireViewPermission('editor'), (req, res) => {
  const row = validateRow(req.body || {});
  if (!row) {
    return res.status(400).json({ error: 'invalid_row' });
  }
  upsertStmt.run({ ...row, source: 'manual' });
  res.status(200).json({ ok: true });
});

// Bulk upsert used by the spreadsheet Importer view.
router.post('/bulk', requireViewPermission('importer'), (req, res) => {
  const rows = Array.isArray(req.body && req.body.rows) ? req.body.rows : [];
  let parsedCount = 0;
  let errorCount = 0;

  const tx = db.transaction((validRows) => {
    for (const row of validRows) upsertStmt.run(row);
  });

  const validRows = [];
  for (const raw of rows) {
    const row = validateRow(raw);
    if (row) {
      validRows.push({ ...row, source: 'import' });
      parsedCount++;
    } else {
      errorCount++;
    }
  }
  tx(validRows);

  res.json({ ok: true, parsedCount, errorCount });
});

// Full wipe — lives in the Importer view in the UI, gated the same way.
router.delete('/', requireViewPermission('importer'), (req, res) => {
  db.prepare('DELETE FROM data_rows').run();
  res.status(204).end();
});

module.exports = router;
