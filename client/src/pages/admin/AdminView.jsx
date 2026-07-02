import { useDashboardData } from '../../context/DataContext';
import { useToasts } from '../../hooks/useToasts';
import { ToastContainer } from '../../components/Toast';
import UserManagementPanel from './UserManagementPanel';
import SheetsConfigPanel from './SheetsConfigPanel';

export default function AdminView() {
  const { refetch } = useDashboardData();
  const { toasts, pushToast, dismissToast } = useToasts();

  function pushToastAndRefetch(message, type) {
    pushToast(message, type);
    if (type === 'success') refetch();
  }

  return (
    <section>
      <div className="admin-grid">
        <SheetsConfigPanel pushToast={pushToastAndRefetch} />
        <UserManagementPanel pushToast={pushToast} />
      </div>
      <ToastContainer toasts={toasts} dismissToast={dismissToast} />
    </section>
  );
}
