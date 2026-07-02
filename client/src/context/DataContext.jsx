import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { api } from '../api/client';
import { useAuth } from './AuthContext';

const DataContext = createContext(null);

export function DataProvider({ children }) {
  const { currentUser } = useAuth();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    try {
      const { rows: fetchedRows } = await api.get('/data');
      setRows(fetchedRows);
      setError(null);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // DataProvider mounts before login resolves, so the initial fetch 401s and
  // must be retried once currentUser actually becomes available; on logout,
  // clear rows so the next user never sees a stale previous session's data.
  useEffect(() => {
    if (currentUser) {
      refetch();
    } else {
      setRows([]);
      setLoading(false);
    }
  }, [currentUser, refetch]);

  return (
    <DataContext.Provider value={{ rows, loading, error, refetch }}>{children}</DataContext.Provider>
  );
}

export function useDashboardData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useDashboardData must be used within DataProvider');
  return ctx;
}
