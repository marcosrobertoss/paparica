import { useMemo, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { api } from '../api/client';
import { useDashboardData } from '../context/DataContext';
import { getUnitsList, getUnitHistory } from '../lib/metrics';
import { UNITS_LIST_FALLBACK, MONTHS_NAMES } from '../lib/constants';
import { formatCurrency } from '../lib/format';
import { useToasts } from '../hooks/useToasts';
import { ToastContainer } from '../components/Toast';

export default function EditorView() {
  const { currentMonth, currentYear } = useOutletContext();
  const { rows, refetch } = useDashboardData();
  const { toasts, pushToast, dismissToast } = useToasts();

  const unitsList = useMemo(() => {
    const fromData = getUnitsList(rows);
    return fromData.length ? fromData : UNITS_LIST_FALLBACK;
  }, [rows]);

  const [selectedUnit, setSelectedUnit] = useState('');
  const [form, setForm] = useState({ investment: '', roas: '', first_orders: '', total_orders: '' });
  const [submitting, setSubmitting] = useState(false);

  const unitHistory = useMemo(
    () => (selectedUnit ? getUnitHistory(rows, selectedUnit, currentYear) : []),
    [rows, selectedUnit, currentYear]
  );

  function handleFieldChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!selectedUnit) return;

    const first_orders = parseInt(form.first_orders, 10);
    const total_orders = parseInt(form.total_orders, 10);
    if (first_orders > total_orders) {
      pushToast('O número de primeiros pedidos não pode ser maior que o total.', 'error');
      return;
    }

    const monthIndex = parseInt(currentMonth === 'all' ? '6' : currentMonth, 10);
    setSubmitting(true);
    try {
      await api.post('/data', {
        year: parseInt(currentYear, 10),
        month: monthIndex,
        unit: selectedUnit,
        investment: parseFloat(form.investment),
        roas: parseFloat(form.roas),
        first_orders,
        total_orders,
      });
      await refetch();
      setForm({ investment: '', roas: '', first_orders: '', total_orders: '' });
      pushToast(`Dados salvos para ${selectedUnit} em ${MONTHS_NAMES[monthIndex]} de ${currentYear}!`, 'success');
    } catch (err) {
      pushToast('Erro ao salvar dados: ' + err.message, 'error');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section>
      <div className="editor-grid">
        <div className="chart-card">
          <h3>Inserir / Atualizar Dados Mensais</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="form-unit">Unidade de Negócio</label>
              <select
                className="form-control"
                id="form-unit"
                required
                value={selectedUnit}
                onChange={(e) => setSelectedUnit(e.target.value)}
              >
                <option value="" disabled>
                  Selecione a unidade
                </option>
                {unitsList.map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="form-invest">Investimento (R$)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  className="form-control"
                  id="form-invest"
                  name="investment"
                  required
                  placeholder="Ex: 5000.00"
                  value={form.investment}
                  onChange={handleFieldChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="form-roas">ROAS (x)</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  className="form-control"
                  id="form-roas"
                  name="roas"
                  required
                  placeholder="Ex: 3.5"
                  value={form.roas}
                  onChange={handleFieldChange}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="form-first-orders">Primeiro Pedido (Novos)</label>
                <input
                  type="number"
                  min="0"
                  className="form-control"
                  id="form-first-orders"
                  name="first_orders"
                  required
                  placeholder="Ex: 120"
                  value={form.first_orders}
                  onChange={handleFieldChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="form-total-orders">Pedidos Totais</label>
                <input
                  type="number"
                  min="0"
                  className="form-control"
                  id="form-total-orders"
                  name="total_orders"
                  required
                  placeholder="Ex: 300"
                  value={form.total_orders}
                  onChange={handleFieldChange}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
              <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={submitting}>
                {submitting ? 'Salvando...' : 'Salvar Dados'}
              </button>
            </div>
          </form>
        </div>

        <div className="chart-card">
          <h3>{selectedUnit ? `Histórico de Performance - ${selectedUnit}` : 'Histórico da Unidade'}</h3>
          <div className="table-wrapper" style={{ maxHeight: 400, overflowY: 'auto' }}>
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>Mês</th>
                  <th>Investimento</th>
                  <th>CAC</th>
                  <th>Pedidos</th>
                  <th>ROAS</th>
                </tr>
              </thead>
              <tbody>
                {!selectedUnit && (
                  <tr>
                    <td colSpan={5} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                      Selecione uma unidade para ver seu histórico.
                    </td>
                  </tr>
                )}
                {selectedUnit && unitHistory.length === 0 && (
                  <tr>
                    <td colSpan={5} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 20 }}>
                      Nenhum dado cadastrado para esta unidade em {currentYear}.
                    </td>
                  </tr>
                )}
                {unitHistory.map((h) => {
                  const cac = h.first_orders > 0 ? h.investment / h.first_orders : 0;
                  return (
                    <tr key={h.id}>
                      <td style={{ fontWeight: 700 }}>{MONTHS_NAMES[h.month]}</td>
                      <td>{formatCurrency(h.investment)}</td>
                      <td>{formatCurrency(cac)}</td>
                      <td>{h.total_orders.toLocaleString('pt-BR')}</td>
                      <td style={{ fontWeight: 700, color: 'var(--accent-green)' }}>{h.roas.toFixed(1)}x</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <ToastContainer toasts={toasts} dismissToast={dismissToast} />
    </section>
  );
}
