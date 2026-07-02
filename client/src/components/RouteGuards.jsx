import { Navigate, Outlet, useOutletContext } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const FIRST_VIEW_PATH = {
  overview: '/',
  units: '/units',
  editor: '/editor',
  importer: '/importer',
};

export function RequireAuth() {
  const { currentUser, loading } = useAuth();
  if (loading) return null;
  if (!currentUser) return <Navigate to="/login" replace />;
  return <Outlet />;
}

export function RequireView({ viewKey }) {
  const { currentUser } = useAuth();
  // Each <Outlet> has its own context scope, so it must be forwarded explicitly
  // or DashboardLayout's {currentMonth, currentYear} context is lost here.
  const outletContext = useOutletContext();
  if (!currentUser) return <Navigate to="/login" replace />;
  if (currentUser.is_admin || currentUser.views.includes(viewKey)) {
    return <Outlet context={outletContext} />;
  }
  const fallbackKey = currentUser.views[0];
  const fallbackPath = fallbackKey ? FIRST_VIEW_PATH[fallbackKey] : null;
  if (fallbackPath && fallbackPath !== FIRST_VIEW_PATH[viewKey]) {
    return <Navigate to={fallbackPath} replace />;
  }
  return (
    <div className="empty-state">
      <h3>Sem acesso</h3>
      <p>Sua conta não tem permissão para nenhuma área do dashboard. Fale com um administrador.</p>
    </div>
  );
}

export function RequireAdmin() {
  const { currentUser } = useAuth();
  if (!currentUser) return <Navigate to="/login" replace />;
  if (!currentUser.is_admin) return <Navigate to="/" replace />;
  return <Outlet />;
}
