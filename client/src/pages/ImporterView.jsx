import { useMemo, useState } from 'react';
import { api } from '../api/client';
import { useDashboardData } from '../context/DataContext';
import { getUnitsList } from '../lib/metrics';
import { UNITS_LIST_FALLBACK } from '../lib/constants';
import { parseSpreadsheetFile, mapSpreadsheetRows, downloadExcelTemplate } from '../lib/spreadsheet';
import { useToasts } from '../hooks/useToasts';
import { ToastContainer } from '../components/Toast';

export default function ImporterView() {
  const { rows, refetch } = useDashboardData();
  const { toasts, pushToast, dismissToast } = useToasts();
  const [status, setStatus] = useState(null); // { type: 'idle'|'loading'|'success'|'error', message }
  const [dragOver, setDragOver] = useState(false);

  const unitsList = useMemo(() => {
    const fromData = getUnitsList(rows);
    return fromData.length ? fromData : UNITS_LIST_FALLBACK;
  }, [rows]);

  async function processFile(file) {
    setStatus({ type: 'loading', message: 'Lendo arquivo, aguarde...' });
    try {
      const rows2D = await parseSpreadsheetFile(file);
      const { rows: parsedRows, errorCount } = mapSpreadsheetRows(rows2D, unitsList, new Date().getFullYear());
      const result = await api.post('/data/bulk', { rows: parsedRows });
      await refetch();
      setStatus({
        type: 'success',
        message: `Importação concluída! ${result.parsedCount} registros importados/atualizados.${
          result.errorCount || errorCount ? ` ${result.errorCount + errorCount} falhas.` : ''
        }`,
      });
    } catch (err) {
      setStatus({ type: 'error', message: 'Erro ao importar: ' + err.message });
    }
  }

  function handleFileInputChange(e) {
    if (e.target.files.length) processFile(e.target.files[0]);
  }

  function handleDrop(e) {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length) processFile(files[0]);
  }

  async function handleResetAll() {
    if (!confirm('ATENÇÃO: Isso limpará permanentemente todos os dados inseridos. Deseja prosseguir?')) return;
    try {
      await api.delete('/data');
      await refetch();
      pushToast('Todos os dados foram limpos.', 'success');
    } catch (err) {
      pushToast('Erro ao limpar dados: ' + err.message, 'error');
    }
  }

  return (
    <section>
      <div className="chart-card" style={{ marginBottom: 30 }}>
        <h3>Importador de Planilhas</h3>
        <p style={{ marginBottom: 20, color: 'var(--text-muted)' }}>
          Arraste seu arquivo Excel (.xlsx, .xls) ou CSV ou clique para selecionar. O sistema processará as
          linhas de forma inteligente.
        </p>

        <label
          className="upload-area"
          style={dragOver ? { borderColor: 'var(--accent-red)', background: 'rgba(var(--brand-red-rgb), 0.05)' } : undefined}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
        >
          <div className="upload-icon">
            <svg viewBox="0 0 24 24">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="12" y1="18" x2="12" y2="12"></line>
              <polyline points="9 15 12 12 15 15"></polyline>
            </svg>
          </div>
          <h4 style={{ fontSize: 16 }}>Arraste a planilha aqui ou clique para buscar</h4>
          <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>Tamanho máximo recomendado: 10MB (.xlsx ou .csv)</span>
          <input type="file" accept=".xlsx, .xls, .csv" style={{ display: 'none' }} onChange={handleFileInputChange} />
        </label>
      </div>

      <div className="editor-grid">
        <div className="chart-card">
          <h3>Modelo Estrutural Sugerido</h3>
          <p style={{ marginBottom: 15 }}>Para que sua planilha seja lida perfeitamente, estruture suas colunas da seguinte forma:</p>
          <div className="table-wrapper">
            <table className="dashboard-table" style={{ fontSize: 13 }}>
              <thead>
                <tr>
                  <th>Ano</th>
                  <th>Mês</th>
                  <th>Unidade</th>
                  <th>Investimento</th>
                  <th>Primeiro Pedido</th>
                  <th>Pedidos</th>
                  <th>ROAS</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>2026</td>
                  <td>Julho</td>
                  <td>Belo Horizonte</td>
                  <td>5200.00</td>
                  <td>140</td>
                  <td>350</td>
                  <td>4.2</td>
                </tr>
                <tr>
                  <td>2026</td>
                  <td>Julho</td>
                  <td>Campinas</td>
                  <td>4800.00</td>
                  <td>110</td>
                  <td>290</td>
                  <td>3.8</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p style={{ marginTop: 15, fontSize: 12, color: 'var(--text-muted)' }}>
            * Dica: Se o nome dos meses ou das colunas forem um pouco diferentes, nosso importador inteligente
            tentará mapear de forma automática! A coluna "Ano" é opcional (usa o ano atual se ausente).
          </p>
        </div>

        <div className="chart-card">
          <h3>Ações e Status</h3>
          <div
            style={{
              marginBottom: 20,
              minHeight: 120,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)',
              padding: 20,
              textAlign: 'center',
            }}
          >
            {!status && <span style={{ color: 'var(--text-muted)' }}>Nenhum arquivo processado ainda.</span>}
            {status && (
              <span
                style={{
                  color:
                    status.type === 'error'
                      ? 'var(--accent-red)'
                      : status.type === 'success'
                      ? 'var(--accent-green)'
                      : 'var(--accent-blue)',
                  fontWeight: status.type === 'success' ? 700 : 400,
                }}
              >
                {status.message}
              </span>
            )}
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn btn-secondary" style={{ flex: 1, justifyContent: 'center' }} onClick={downloadExcelTemplate}>
              <svg viewBox="0 0 24 24">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
              Baixar Modelo Excel
            </button>
            <button
              className="btn btn-primary"
              style={{ background: 'var(--accent-red)', flex: 1, justifyContent: 'center' }}
              onClick={handleResetAll}
            >
              Limpar Todos os Dados
            </button>
          </div>
        </div>
      </div>
      <ToastContainer toasts={toasts} dismissToast={dismissToast} />
    </section>
  );
}
