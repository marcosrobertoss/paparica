// Pure data-shaping functions ported from the original app.js (no DOM, no
// module-level globals — year/month/rows are always explicit parameters).

export function getFilteredData(rows, year, month) {
  const yearNum = parseInt(year, 10);
  let filtered = rows.filter((d) => d.year === yearNum);
  if (month !== 'all') {
    const monthNum = parseInt(month, 10);
    filtered = filtered.filter((d) => d.month === monthNum);
  }
  return filtered;
}

export function computeTotals(rows) {
  let investment = 0;
  let first_orders = 0;
  let total_orders = 0;
  let total_roas_weighted_sum = 0;

  rows.forEach((row) => {
    investment += row.investment || 0;
    first_orders += row.first_orders || 0;
    total_orders += row.total_orders || 0;
    total_roas_weighted_sum += (row.roas || 0) * (row.investment || 0);
  });

  const avg_cac = first_orders > 0 ? investment / first_orders : 0;
  const avg_cost_per_order = total_orders > 0 ? investment / total_orders : 0;
  const avg_roas = investment > 0 ? total_roas_weighted_sum / investment : 0;

  return { investment, first_orders, total_orders, avg_cac, avg_cost_per_order, avg_roas };
}

// Deduplicates the unit-aggregation block that was copy-pasted twice in the
// original app.js (once for the overview table, once for the units grid).
export function aggregateByUnit(filteredRows, unitsList, isAllMonths) {
  if (!isAllMonths) {
    return filteredRows.map((row) => {
      const cac = row.first_orders > 0 ? row.investment / row.first_orders : 0;
      const cost_per_order = row.total_orders > 0 ? row.investment / row.total_orders : 0;
      return {
        unit: row.unit,
        investment: row.investment,
        first_orders: row.first_orders,
        total_orders: row.total_orders,
        cac,
        cost_per_order,
        roas: row.roas,
      };
    });
  }

  const unitsData = {};
  unitsList.forEach((u) => {
    unitsData[u] = { investment: 0, first_orders: 0, total_orders: 0, weighted_roas: 0 };
  });

  filteredRows.forEach((row) => {
    if (!unitsData[row.unit]) {
      unitsData[row.unit] = { investment: 0, first_orders: 0, total_orders: 0, weighted_roas: 0 };
    }
    unitsData[row.unit].investment += row.investment || 0;
    unitsData[row.unit].first_orders += row.first_orders || 0;
    unitsData[row.unit].total_orders += row.total_orders || 0;
    unitsData[row.unit].weighted_roas += (row.roas || 0) * (row.investment || 0);
  });

  const result = [];
  Object.keys(unitsData).forEach((unit) => {
    const data = unitsData[unit];
    if (data.investment > 0 || data.total_orders > 0) {
      const cac = data.first_orders > 0 ? data.investment / data.first_orders : 0;
      const cost_per_order = data.total_orders > 0 ? data.investment / data.total_orders : 0;
      const roas = data.investment > 0 ? data.weighted_roas / data.investment : 0;
      result.push({ unit, ...data, cac, cost_per_order, roas });
    }
  });
  return result;
}

export function getUnitsList(rows) {
  const set = new Set(rows.map((r) => r.unit));
  return Array.from(set).sort((a, b) => a.localeCompare(b, 'pt-BR'));
}

export function getUnitHistory(rows, unitName, year) {
  const yearNum = parseInt(year, 10);
  return rows
    .filter((d) => d.unit === unitName && d.year === yearNum)
    .slice()
    .sort((a, b) => a.month - b.month);
}
