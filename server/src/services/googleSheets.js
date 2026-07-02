const db = require('../db');

const MONTHS_NAMES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
];

const upsertStmt = db.prepare(`
  INSERT INTO data_rows (year, month, unit, investment, first_orders, total_orders, roas, source, updated_at)
  VALUES (@year, @month, @unit, @investment, @first_orders, @total_orders, @roas, 'sheets', datetime('now'))
  ON CONFLICT(year, month, unit) DO UPDATE SET
    investment = @investment,
    first_orders = @first_orders,
    total_orders = @total_orders,
    roas = @roas,
    source = 'sheets',
    updated_at = datetime('now')
`);

function getSetting(key) {
  const row = db.prepare('SELECT value FROM settings WHERE key = ?').get(key);
  return row ? row.value : null;
}

function setSetting(key, value) {
  db.prepare(
    'INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value'
  ).run(key, value);
}

function extractSheetId(idOrUrl) {
  const trimmed = String(idOrUrl || '').trim();
  const match = trimmed.match(/\/d\/([a-zA-Z0-9-_]+)/);
  if (match) return match[1];
  if (/^[a-zA-Z0-9-_]+$/.test(trimmed)) return trimmed;
  return null;
}

// The share URL may carry a specific tab (#gid=123456); keep it so the sync
// reads the tab the admin was actually looking at, not just the first one.
function extractGid(idOrUrl) {
  const match = String(idOrUrl || '').match(/[#&?]gid=(\d+)/);
  return match ? match[1] : null;
}

function getConfigStatus() {
  return {
    sheetId: getSetting('google_sheet_id'),
    sheetGid: getSetting('google_sheet_gid'),
    lastSyncAt: getSetting('last_sync_at'),
    lastSyncStatus: getSetting('last_sync_status'),
    lastSyncRowCount: getSetting('last_sync_row_count'),
  };
}

function setSheetId(idOrUrl) {
  const sheetId = extractSheetId(idOrUrl);
  if (!sheetId) {
    throw new Error('invalid_sheet_id_or_url');
  }
  setSetting('google_sheet_id', sheetId);
  setSetting('google_sheet_gid', extractGid(idOrUrl) || '');
  return sheetId;
}

// Minimal RFC-4180-style CSV parser. Needed because values from a pt-BR sheet
// routinely contain commas ("5.200,00") and Google quotes those fields.
function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (inQuotes) {
      if (ch === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += ch;
      }
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === ',') {
      row.push(field);
      field = '';
    } else if (ch === '\n' || ch === '\r') {
      if (ch === '\r' && text[i + 1] === '\n') i++;
      row.push(field);
      field = '';
      rows.push(row);
      row = [];
    } else {
      field += ch;
    }
  }
  if (field !== '' || row.length) {
    row.push(field);
    rows.push(row);
  }
  return rows;
}

const parseNum = (val) => {
  if (typeof val === 'number') return val;
  if (!val) return 0;
  const str = String(val);
  const clean = str.replace(/[R$\s%]/g, '').replace(/\./g, '').replace(',', '.');
  const num = parseFloat(clean) || 0;
  // ROAS cells like "447%" mean 4.47x, not 447
  return str.includes('%') ? num / 100 : num;
};

const MONTH_ABBREVS = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];

// Parses month labels like "mai./ 25" or "janeiro 2026" into {month, year}.
function parseMonthYear(cell) {
  const text = String(cell || '').trim().toLowerCase();
  if (!text) return null;
  const monthIdx = MONTH_ABBREVS.findIndex((a) => text.startsWith(a));
  if (monthIdx === -1) return null;
  const yearMatch = text.match(/(\d{2,4})\s*$/);
  if (!yearMatch) return null;
  let year = parseInt(yearMatch[1], 10);
  if (year < 100) year += 2000;
  return { month: monthIdx, year };
}

// Parser for the "wide" HOPP-style layout: one row per month, with a global
// Ads/Investido column and a 4-column block per unit (Ped, 1ºs, Valor 1ºs,
// Valor). Unit names come from the group-header row directly above the row of
// repeated "Ped" sub-headers. Since the sheet has no per-unit investment, the
// month's total is apportioned by each unit's revenue share — this keeps the
// dashboard's aggregate KPIs (Investimento, CAC geral, ROAS) exactly equal to
// the sheet's own totals; per-unit CAC/investment are estimates.
function tryParseWideFormat(rows2D) {
  let subIdx = -1;
  for (let i = 1; i < Math.min(rows2D.length, 10); i++) {
    const pedCount = (rows2D[i] || []).filter((c) => String(c || '').trim().toLowerCase() === 'ped').length;
    if (pedCount >= 2) {
      subIdx = i;
      break;
    }
  }
  if (subIdx === -1) return null;

  const sub = rows2D[subIdx].map((c) => String(c || '').trim().toLowerCase());
  const group = rows2D[subIdx - 1].map((c) => String(c || '').trim());

  const investIdx = sub.findIndex((h) => h.includes('investido') || h.includes('investimento'));
  const NON_UNITS = ['total', 'ads', 'cac geral', 'roas'];

  const unitBlocks = [];
  sub.forEach((h, i) => {
    if (h !== 'ped') return;
    const name = group[i];
    if (name && !NON_UNITS.includes(name.toLowerCase())) {
      unitBlocks.push({ name, ped: i, firsts: i + 1, valor: i + 3 });
    }
  });
  if (!unitBlocks.length) return null;

  const parsedRows = [];

  for (let r = subIdx + 1; r < rows2D.length; r++) {
    const row = rows2D[r];
    if (!row || !row.length) continue;

    let monthCell = '';
    for (let c = 0; c < 3; c++) {
      const v = String(row[c] || '').trim();
      if (v) {
        monthCell = v;
        break;
      }
    }
    const my = parseMonthYear(monthCell);
    if (!my) continue;

    const investment = investIdx !== -1 ? parseNum(row[investIdx]) : 0;

    const units = unitBlocks
      .map((b) => ({
        unit: b.name,
        total_orders: Math.round(parseNum(row[b.ped])),
        first_orders: Math.round(parseNum(row[b.firsts])),
        revenue: parseNum(row[b.valor]),
      }))
      .filter((u) => u.total_orders > 0 || u.revenue > 0);
    if (!units.length) continue; // empty/future month

    const revenueSum = units.reduce((s, u) => s + u.revenue, 0);
    const monthRoas = investment > 0 ? revenueSum / investment : 0;

    for (const u of units) {
      const unitInvestment =
        revenueSum > 0 ? investment * (u.revenue / revenueSum) : investment / units.length;
      parsedRows.push({
        year: my.year,
        month: my.month,
        unit: u.unit,
        investment: Math.round(unitInvestment * 100) / 100,
        first_orders: u.first_orders,
        total_orders: u.total_orders,
        roas: Math.round(monthRoas * 100) / 100,
      });
    }
  }

  if (!parsedRows.length) throw new Error('empty_sheet');
  return { parsedRows, errorCount: 0 };
}

// Same case-insensitive header-matching heuristic as the original client-side
// processSpreadsheetData in app.js (mirrored in client/src/lib/spreadsheet.js).
function parseRows(rows2D) {
  if (!rows2D || rows2D.length <= 1) {
    throw new Error('empty_sheet');
  }
  const wide = tryParseWideFormat(rows2D);
  if (wide) return wide;

  const headers = rows2D[0].map((h) => String(h ?? '').trim().toLowerCase());

  const firstOrdersIdx = headers.findIndex(
    (h) => h.includes('primeiro') || h.includes('novos') || h.includes('first')
  );
  const mappings = {
    year: headers.findIndex((h) => h.includes('ano') || h.includes('year')),
    month: headers.findIndex((h) => h.includes('mês') || h.includes('mes') || h.includes('month')),
    unit: headers.findIndex((h) => h.includes('unidade') || h.includes('loja') || h.includes('unit')),
    investment: headers.findIndex(
      (h) => h.includes('investimento') || h.includes('gasto') || h.includes('spent') || h.includes('valor')
    ),
    first_orders: firstOrdersIdx,
    // "Primeiro Pedido" also contains "pedido", so the first-orders column must
    // be excluded or it shadows the real "Pedidos" column that comes after it.
    total_orders: headers.findIndex(
      (h, i) => i !== firstOrdersIdx && (h.includes('pedido') || h.includes('total') || h.includes('orders'))
    ),
    roas: headers.findIndex((h) => h.includes('roas')),
  };

  if (mappings.unit === -1 || mappings.investment === -1) {
    throw new Error('missing_required_columns');
  }

  const currentYear = new Date().getFullYear();
  const parsedRows = [];
  let errorCount = 0;

  for (let i = 1; i < rows2D.length; i++) {
    const row = rows2D[i];
    if (!row || !row.length || !row[mappings.unit]) continue;

    try {
      let monthIndex = 6;
      if (mappings.month !== -1 && row[mappings.month]) {
        const monthStr = String(row[mappings.month]).trim().toLowerCase();
        const matched = MONTHS_NAMES.findIndex((m) => monthStr.includes(m.toLowerCase()));
        if (matched !== -1) {
          monthIndex = matched;
        } else {
          const monthInt = parseInt(monthStr, 10);
          if (!Number.isNaN(monthInt) && monthInt >= 1 && monthInt <= 12) monthIndex = monthInt - 1;
        }
      }

      let year = currentYear;
      if (mappings.year !== -1 && row[mappings.year]) {
        const yearInt = parseInt(row[mappings.year], 10);
        if (!Number.isNaN(yearInt)) year = yearInt;
      }

      const unit = String(row[mappings.unit]).trim();
      const investment = parseNum(row[mappings.investment]);
      const first_orders = mappings.first_orders !== -1 ? Math.round(parseNum(row[mappings.first_orders])) : 0;
      const total_orders = mappings.total_orders !== -1 ? Math.round(parseNum(row[mappings.total_orders])) : 0;
      const roas = mappings.roas !== -1 ? parseNum(row[mappings.roas]) : 0;

      parsedRows.push({ year, month: monthIndex, unit, investment, first_orders, total_orders, roas });
    } catch {
      errorCount++;
    }
  }

  return { parsedRows, errorCount };
}

// Downloads the sheet's CSV export, which requires no credentials as long as
// the sheet is shared as "anyone with the link can view".
async function fetchAndSync() {
  const sheetId = getSetting('google_sheet_id');
  if (!sheetId) throw new Error('no_sheet_configured');

  const gid = getSetting('google_sheet_gid');
  let url = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv`;
  if (gid) url += `&gid=${gid}`;

  let response;
  try {
    response = await fetch(url, { redirect: 'follow' });
  } catch {
    throw new Error('network_error');
  }

  // A private sheet doesn't 403 — Google redirects to an HTML login page, so
  // the content type is the reliable signal that access was denied.
  const contentType = response.headers.get('content-type') || '';
  if (!response.ok || contentType.includes('text/html')) {
    throw new Error('sheet_not_public');
  }

  const csvText = await response.text();
  const { parsedRows, errorCount } = parseRows(parseCsv(csvText));

  const tx = db.transaction((rowsToInsert) => {
    for (const row of rowsToInsert) upsertStmt.run(row);
  });
  tx(parsedRows);

  setSetting('last_sync_at', new Date().toISOString());
  setSetting('last_sync_status', 'ok');
  setSetting('last_sync_row_count', String(parsedRows.length));

  return { rowCount: parsedRows.length, errorCount, preview: parsedRows.slice(0, 10) };
}

module.exports = {
  getConfigStatus,
  setSheetId,
  fetchAndSync,
  setSetting,
};
