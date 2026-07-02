import { useMemo, useRef } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useDashboardData } from '../context/DataContext';
import { useTheme } from '../context/ThemeContext';
import { getFilteredData, computeTotals, aggregateByUnit, getUnitsList } from '../lib/metrics';
import { formatCurrency } from '../lib/format';
import { MONTHS_NAMES } from '../lib/constants';
import { exportToExcel } from '../lib/spreadsheet';
import KpiCard from '../components/KpiCard';
import TrendChart from '../components/charts/TrendChart';
import ShareChart from '../components/charts/ShareChart';
import { usePrefersReducedMotion, gsapDuration } from '../hooks/usePrefersReducedMotion';

export default function OverviewView() {
  const { currentMonth, currentYear } = useOutletContext();
  const { rows } = useDashboardData();
  const { theme } = useTheme();
  const tableCardRef = useRef(null);
  const reducedMotion = usePrefersReducedMotion();

  const unitsList = useMemo(() => getUnitsList(rows), [rows]);
  const filtered = useMemo(() => getFilteredData(rows, currentYear, currentMonth), [rows, currentYear, currentMonth]);
  const totals = useMemo(() => computeTotals(filtered), [filtered]);
  const isAllMonths = currentMonth === 'all';
  const tableRows = useMemo(
    () => aggregateByUnit(filtered, unitsList, isAllMonths).sort((a, b) => b.investment - a.investment),
    [filtered, unitsList, isAllMonths]
  );

  const firstPercentage = totals.total_orders > 0 ? Math.round((totals.first_orders / totals.total_orders) * 100) : 0;
  const investMeta = isAllMonths
    ? `Total gasto em ${currentYear}`
    : `Gasto em ${MONTHS_NAMES[parseInt(currentMonth, 10)]} ${currentYear}`;

  useGSAP(
    () => {
      gsap.fromTo(
        '.kpi-card',
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, stagger: gsapDuration(0.08, reducedMotion), duration: gsapDuration(0.4, reducedMotion) }
      );
    },
    { dependencies: [currentMonth, currentYear, reducedMotion] }
  );

  useGSAP(() => {
    gsap.fromTo(tableCardRef.current, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: gsapDuration(0.4, reducedMotion), delay: 0.2 });
  }, [currentMonth, currentYear, reducedMotion]);

  function handleExport() {
    if (filtered.length === 0) {
      alert('Nenhum dado disponível para exportar.');
      return;
    }
    const dateLabel = isAllMonths ? currentYear : `${MONTHS_NAMES[parseInt(currentMonth, 10)]}_${currentYear}`;
    exportToExcel(filtered, dateLabel);
  }

  return (
    <section>
      <div className="kpi-grid">
        <KpiCard
          accentClass="kpi-invest"
          title="Investimento"
          value={totals.investment}
          formatValue={formatCurrency}
          meta={investMeta}
          icon={
            <svg viewBox="0 0 24 24">
              <line x1="12" y1="1" x2="12" y2="23"></line>
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
            </svg>
          }
        />
        <KpiCard
          accentClass="kpi-cac"
          title="CAC Médio"
          value={totals.avg_cac}
          formatValue={formatCurrency}
          meta="Custo por novo cliente"
          icon={
            <svg viewBox="0 0 24 24">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
          }
        />
        <KpiCard
          accentClass="kpi-orders"
          title="Pedidos Totais"
          value={totals.total_orders}
          formatValue={(v) => Math.round(v).toLocaleString('pt-BR')}
          meta={`${totals.first_orders.toLocaleString('pt-BR')} prim. pedidos (${firstPercentage}%)`}
          icon={
            <svg viewBox="0 0 24 24">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
          }
        />
        <KpiCard
          accentClass="kpi-roas"
          title="ROAS Médio"
          value={totals.avg_roas}
          formatValue={(v) => v.toFixed(1) + 'x'}
          meta="Retorno do investimento"
          icon={
            <svg viewBox="0 0 24 24">
              <line x1="18" y1="20" x2="18" y2="10"></line>
              <line x1="12" y1="20" x2="12" y2="4"></line>
              <line x1="6" y1="20" x2="6" y2="14"></line>
            </svg>
          }
        />
      </div>

      <div className="charts-grid">
        <TrendChart rows={rows} year={currentYear} theme={theme} />
        <ShareChart filteredRows={filtered} theme={theme} />
      </div>

      <div className="table-card" ref={tableCardRef}>
        <div className="table-header-row">
          <h3>Performance por Unidade de Negócio</h3>
          <button className="btn btn-secondary" onClick={handleExport}>
            <svg viewBox="0 0 24 24">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            Exportar Excel
          </button>
        </div>
        <div className="table-wrapper">
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>Unidade</th>
                <th>Investimento</th>
                <th>Primeiro Pedido</th>
                <th>Pedidos Totais</th>
                <th>CAC</th>
                <th>Custo por Pedido</th>
                <th>ROAS</th>
                <th>Eficiência</th>
              </tr>
            </thead>
            <tbody>
              {tableRows.length === 0 && (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 30 }}>
                    Sem dados disponíveis para o período selecionado. Inicie inserindo dados na aba "Editor de Dados".
                  </td>
                </tr>
              )}
              {tableRows.map((row) => {
                let efficiencyClass = 'badge-warning';
                let efficiencyLabel = 'Média';
                if (row.roas >= 4.0) {
                  efficiencyClass = 'badge-success';
                  efficiencyLabel = 'Excelente';
                } else if (row.roas < 3.0) {
                  efficiencyClass = 'badge-danger';
                  efficiencyLabel = 'Alerta';
                }
                return (
                  <tr key={row.unit}>
                    <td className="unit-name">{row.unit}</td>
                    <td>{formatCurrency(row.investment)}</td>
                    <td>{row.first_orders.toLocaleString('pt-BR')}</td>
                    <td>{row.total_orders.toLocaleString('pt-BR')}</td>
                    <td>{formatCurrency(row.cac)}</td>
                    <td>{formatCurrency(row.cost_per_order)}</td>
                    <td style={{ fontWeight: 700 }}>{row.roas.toFixed(1)}x</td>
                    <td>
                      <span className={`badge ${efficiencyClass}`}>{efficiencyLabel}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
