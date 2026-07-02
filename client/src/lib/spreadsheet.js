import * as XLSX from 'xlsx';
import { MONTHS_NAMES } from './constants';

// Ported from the original app.js handleFileUpload — reads a local file the
// browser selected/dropped (not a live Google Sheets connection, that lives
// server-side in the admin Sheets sync).
export function parseSpreadsheetFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        if (jsonData.length <= 1) {
          throw new Error('A planilha parece estar vazia ou não possui cabeçalho.');
        }
        resolve(jsonData);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(new Error('Erro ao ler arquivo.'));
    reader.readAsArrayBuffer(file);
  });
}

// Same case-insensitive header-matching heuristic as the original
// processSpreadsheetData (also mirrored server-side for the Google Sheets sync
// route — see server/src/services/googleSheets.js).
export function mapSpreadsheetRows(rows2D, knownUnits, defaultYear) {
  const headers = rows2D[0].map((h) => String(h).trim().toLowerCase());

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
    throw new Error("Colunas essenciais ('Unidade' e 'Investimento') não foram encontradas.");
  }

  const parseNum = (val) => {
    if (typeof val === 'number') return val;
    if (!val) return 0;
    const clean = String(val).replace(/[R$\s]/g, '').replace(/\./g, '').replace(',', '.');
    return parseFloat(clean) || 0;
  };

  const rows = [];
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

      let year = defaultYear;
      if (mappings.year !== -1 && row[mappings.year]) {
        const yearInt = parseInt(row[mappings.year], 10);
        if (!Number.isNaN(yearInt)) year = yearInt;
      }

      const rawUnit = String(row[mappings.unit]).trim();
      const matchedUnit = knownUnits.find((u) => u.toLowerCase() === rawUnit.toLowerCase()) || rawUnit;

      const investment = parseNum(row[mappings.investment]);
      const first_orders = mappings.first_orders !== -1 ? Math.round(parseNum(row[mappings.first_orders])) : 0;
      const total_orders = mappings.total_orders !== -1 ? Math.round(parseNum(row[mappings.total_orders])) : 0;
      const roas = mappings.roas !== -1 ? parseNum(row[mappings.roas]) : 0;

      rows.push({ year, month: monthIndex, unit: matchedUnit, investment, first_orders, total_orders, roas });
    } catch {
      errorCount++;
    }
  }

  return { rows, errorCount };
}

export function downloadExcelTemplate() {
  const headers = [['Ano', 'Mês', 'Unidade', 'Investimento', 'Primeiro Pedido', 'Pedidos', 'ROAS']];
  const demoDataRows = [
    [2026, 'Julho', 'Campinas', 5800.0, 135, 320, 4.4],
    [2026, 'Julho', 'Belo Horizonte', 6800.0, 155, 375, 4.7],
    [2026, 'Julho', 'Goiânia', 4800.0, 105, 250, 4.1],
    [2026, 'Julho', 'Guarulhos', 5300.0, 118, 265, 4.5],
  ];

  const ws = XLSX.utils.aoa_to_sheet(headers.concat(demoDataRows));
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Modelo Papa Rica');
  XLSX.writeFile(wb, 'modelo_dashboard_paparica.xlsx');
}

export function exportToExcel(filteredRows, dateLabel) {
  const tableRows = filteredRows.map((row) => {
    const cac = row.first_orders > 0 ? row.investment / row.first_orders : 0;
    const cost_per_order = row.total_orders > 0 ? row.investment / row.total_orders : 0;
    return {
      Mês: MONTHS_NAMES[row.month],
      Ano: row.year,
      Unidade: row.unit,
      'Investimento (R$)': row.investment,
      'Primeiro Pedido': row.first_orders,
      'Pedidos Totais': row.total_orders,
      'CAC (R$)': parseFloat(cac.toFixed(2)),
      'Custo por Pedido (R$)': parseFloat(cost_per_order.toFixed(2)),
      ROAS: row.roas,
    };
  });

  const ws = XLSX.utils.json_to_sheet(tableRows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Relatório Unidades');
  XLSX.writeFile(wb, `relatorio_paparica_${dateLabel}.xlsx`);
}
