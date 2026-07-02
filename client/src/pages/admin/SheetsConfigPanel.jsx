import { useEffect, useState } from 'react';
import { api } from '../../api/client';

const SYNC_ERROR_MESSAGES = {
  sheet_not_public:
    'A planilha não está acessível. No Google Sheets, clique em "Compartilhar" e mude para "Qualquer pessoa com o link" como Leitor.',
  no_sheet_configured: 'Salve o link da planilha antes de sincronizar.',
  missing_required_columns:
    'Colunas essenciais não encontradas na planilha (precisa ter pelo menos "Unidade" e "Investimento" no cabeçalho).',
  empty_sheet: 'A planilha parece estar vazia ou sem linha de cabeçalho.',
  network_error: 'Falha de rede ao acessar o Google Sheets. Tente novamente.',
};

export default function SheetsConfigPanel({ pushToast }) {
  const [config, setConfig] = useState(null);
  const [sheetInput, setSheetInput] = useState('');
  const [syncing, setSyncing] = useState(false);
  const [loading, setLoading] = useState(true);

  async function loadConfig() {
    setLoading(true);
    try {
      const data = await api.get('/admin/sheets/config');
      setConfig(data);
      setSheetInput(data.sheetId || '');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadConfig();
  }, []);

  async function handleSaveSheetId(e) {
    e.preventDefault();
    try {
      await api.post('/admin/sheets/config', { sheetIdOrUrl: sheetInput });
      pushToast('Link da planilha salvo.', 'success');
      loadConfig();
    } catch (err) {
      pushToast('Link/ID de planilha inválido.', 'error');
    }
  }

  async function handleSync() {
    setSyncing(true);
    try {
      const result = await api.post('/admin/sheets/sync', {});
      pushToast(`Sincronização concluída: ${result.rowCount} linhas importadas.`, 'success');
      loadConfig();
    } catch (err) {
      const code = err.body?.error || err.message;
      pushToast(SYNC_ERROR_MESSAGES[code] || 'Erro na sincronização: ' + code, 'error');
      loadConfig();
    } finally {
      setSyncing(false);
    }
  }

  if (loading) return <div className="chart-card">Carregando configuração...</div>;

  return (
    <div className="chart-card">
      <h3 className="admin-section-title">Conexão com Google Sheets</h3>
      <p style={{ color: 'var(--text-muted)', marginBottom: 16 }}>
        No Google Sheets, clique em <strong>Compartilhar</strong> e deixe como{' '}
        <strong>"Qualquer pessoa com o link" — Leitor</strong>. Depois cole o link da planilha abaixo e
        sincronize. Nenhuma credencial do Google é necessária.
      </p>

      <form onSubmit={handleSaveSheetId}>
        <div className="form-group">
          <label>Link (ou ID) da Planilha</label>
          <input
            className="form-control"
            value={sheetInput}
            onChange={(e) => setSheetInput(e.target.value)}
            placeholder="https://docs.google.com/spreadsheets/d/..."
          />
        </div>
        <button type="submit" className="btn btn-secondary">
          Salvar Link da Planilha
        </button>
      </form>

      <div style={{ marginTop: 20, paddingTop: 20, borderTop: '1px solid var(--border-color)' }}>
        <p style={{ marginBottom: 10 }}>
          <strong>Último sync:</strong> {config.lastSyncAt ? new Date(config.lastSyncAt).toLocaleString('pt-BR') : 'nunca'}
          {config.lastSyncStatus && ` — ${config.lastSyncStatus === 'ok' ? 'sucesso' : config.lastSyncStatus}`}
          {config.lastSyncRowCount && config.lastSyncStatus === 'ok' && ` (${config.lastSyncRowCount} linhas)`}
        </p>
        <button className="btn btn-primary" onClick={handleSync} disabled={syncing || !config.sheetId}>
          {syncing ? 'Sincronizando...' : 'Sincronizar Agora'}
        </button>
      </div>
    </div>
  );
}
