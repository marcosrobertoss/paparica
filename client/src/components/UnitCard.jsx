import { formatCurrency } from '../lib/format';

export default function UnitCard({ u }) {
  let cardColor = 'var(--accent-red)';
  if (u.roas >= 4.5) cardColor = 'var(--accent-green)';
  else if (u.roas < 3.0) cardColor = 'var(--accent-yellow)';

  const badgeClass = u.roas >= 4.0 ? 'badge-success' : u.roas < 3.0 ? 'badge-danger' : 'badge-warning';

  return (
    <div className="unit-card" style={{ borderTop: `5px solid ${cardColor}` }}>
      <div className="unit-card-header">
        <span className="unit-card-title">{u.unit}</span>
        <span className={`badge ${badgeClass}`}>ROAS: {u.roas.toFixed(1)}x</span>
      </div>
      <div className="unit-metrics-list">
        <div className="unit-metric-item">
          <span className="unit-metric-label">Investimento</span>
          <span className="unit-metric-value">{formatCurrency(u.investment)}</span>
        </div>
        <div className="unit-metric-item">
          <span className="unit-metric-label">CAC</span>
          <span className="unit-metric-value">{formatCurrency(u.cac)}</span>
        </div>
        <div className="unit-metric-item">
          <span className="unit-metric-label">Primeiro Pedido</span>
          <span className="unit-metric-value">{u.first_orders.toLocaleString('pt-BR')}</span>
        </div>
        <div className="unit-metric-item">
          <span className="unit-metric-label">Pedidos Totais</span>
          <span className="unit-metric-value">{u.total_orders.toLocaleString('pt-BR')}</span>
        </div>
        <div className="unit-metric-item" style={{ borderTop: '1px solid var(--border-color)', paddingTop: 8 }}>
          <span className="unit-metric-label">Custo por Pedido</span>
          <span className="unit-metric-value">{formatCurrency(u.cost_per_order)}</span>
        </div>
      </div>
    </div>
  );
}
