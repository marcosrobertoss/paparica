import { useEffect, useState } from 'react';
import { api } from '../../api/client';
import { VIEW_LABELS } from '../../lib/constants';

const ALL_VIEWS = ['overview', 'units', 'editor', 'importer'];

function NewUserForm({ onCreated, pushToast }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [views, setViews] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  function toggleView(key) {
    setViews((prev) => (prev.includes(key) ? prev.filter((v) => v !== key) : [...prev, key]));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/admin/users', { username, password, is_admin: isAdmin, views });
      setUsername('');
      setPassword('');
      setIsAdmin(false);
      setViews([]);
      pushToast(`Usuário "${username}" criado com sucesso.`, 'success');
      onCreated();
    } catch (err) {
      pushToast('Erro ao criar usuário: ' + (err.body?.error || err.message), 'error');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: 24 }}>
      <div className="form-row">
        <div className="form-group">
          <label>Usuário</label>
          <input className="form-control" value={username} onChange={(e) => setUsername(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Senha</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />
        </div>
      </div>

      <div className="form-group">
        <label>
          <input type="checkbox" checked={isAdmin} onChange={(e) => setIsAdmin(e.target.checked)} /> Administrador
          (acesso total, incluindo esta página)
        </label>
      </div>

      {!isAdmin && (
        <div className="form-group">
          <label>Views permitidas</label>
          <div className="permission-checkboxes">
            {ALL_VIEWS.map((key) => (
              <label key={key}>
                <input type="checkbox" checked={views.includes(key)} onChange={() => toggleView(key)} />
                {VIEW_LABELS[key]}
              </label>
            ))}
          </div>
        </div>
      )}

      <button type="submit" className="btn btn-primary" disabled={submitting}>
        {submitting ? 'Criando...' : 'Criar Usuário'}
      </button>
    </form>
  );
}

function UserRow({ user, onChanged, pushToast }) {
  const [views, setViews] = useState(user.views);
  const [isActive, setIsActive] = useState(user.is_active);

  async function toggleView(key) {
    const next = views.includes(key) ? views.filter((v) => v !== key) : [...views, key];
    setViews(next);
    try {
      await api.patch(`/admin/users/${user.id}`, { views: next });
      onChanged();
    } catch (err) {
      pushToast('Erro ao atualizar permissões: ' + (err.body?.error || err.message), 'error');
    }
  }

  async function toggleActive() {
    const next = !isActive;
    setIsActive(next);
    try {
      await api.patch(`/admin/users/${user.id}`, { is_active: next });
      onChanged();
    } catch (err) {
      pushToast('Erro ao atualizar status: ' + (err.body?.error || err.message), 'error');
    }
  }

  async function handleDelete() {
    if (!confirm(`Excluir o usuário "${user.username}"?`)) return;
    try {
      await api.delete(`/admin/users/${user.id}`);
      pushToast(`Usuário "${user.username}" excluído.`, 'success');
      onChanged();
    } catch (err) {
      pushToast('Erro ao excluir: ' + (err.body?.error || err.message), 'error');
    }
  }

  return (
    <div className="user-row">
      <div>
        <strong>{user.username}</strong>{' '}
        {user.is_admin && <span className="badge badge-success">Admin</span>}
        {!isActive && <span className="badge badge-danger">Inativo</span>}
      </div>
      {!user.is_admin && (
        <div className="permission-checkboxes" style={{ margin: 0 }}>
          {ALL_VIEWS.map((key) => (
            <label key={key}>
              <input type="checkbox" checked={views.includes(key)} onChange={() => toggleView(key)} />
              {VIEW_LABELS[key]}
            </label>
          ))}
        </div>
      )}
      <div style={{ display: 'flex', gap: 8 }}>
        <button type="button" className="btn btn-secondary" onClick={toggleActive}>
          {isActive ? 'Desativar' : 'Ativar'}
        </button>
        <button type="button" className="btn btn-secondary" onClick={handleDelete}>
          Excluir
        </button>
      </div>
    </div>
  );
}

export default function UserManagementPanel({ pushToast }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadUsers() {
    setLoading(true);
    try {
      const { users: fetched } = await api.get('/admin/users');
      setUsers(fetched);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  return (
    <div className="chart-card">
      <h3 className="admin-section-title">Gerenciar Usuários</h3>
      <p style={{ color: 'var(--text-muted)', marginBottom: 20 }}>
        Crie contas e defina quais views cada usuário pode acessar.
      </p>

      <NewUserForm onCreated={loadUsers} pushToast={pushToast} />

      {loading && <p style={{ color: 'var(--text-muted)' }}>Carregando usuários...</p>}
      {!loading &&
        users.map((u) => <UserRow key={u.id} user={u} onChanged={loadUsers} pushToast={pushToast} />)}
    </div>
  );
}
