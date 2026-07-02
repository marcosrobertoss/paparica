import { Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { DataProvider } from './context/DataContext';
import { RequireAuth, RequireView, RequireAdmin } from './components/RouteGuards';
import LoginPage from './pages/LoginPage';
import DashboardLayout from './layouts/DashboardLayout';
import OverviewView from './pages/OverviewView';
import UnitsView from './pages/UnitsView';
import EditorView from './pages/EditorView';
import ImporterView from './pages/ImporterView';
import AdminView from './pages/admin/AdminView';

function Bootstrapping() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <span style={{ color: 'var(--text-muted)' }}>Carregando...</span>
    </div>
  );
}

function AppRoutes() {
  const { loading } = useAuth();
  if (loading) return <Bootstrapping />;

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route element={<RequireAuth />}>
        <Route element={<DashboardLayout />}>
          <Route element={<RequireView viewKey="overview" />}>
            <Route path="/" element={<OverviewView />} />
          </Route>
          <Route element={<RequireView viewKey="units" />}>
            <Route path="/units" element={<UnitsView />} />
          </Route>
          <Route element={<RequireView viewKey="editor" />}>
            <Route path="/editor" element={<EditorView />} />
          </Route>
          <Route element={<RequireView viewKey="importer" />}>
            <Route path="/importer" element={<ImporterView />} />
          </Route>
          <Route element={<RequireAdmin />}>
            <Route path="/admin" element={<AdminView />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <DataProvider>
          <AppRoutes />
        </DataProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}
