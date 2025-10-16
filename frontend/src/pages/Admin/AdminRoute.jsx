import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/useAuth';

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div>Loading...</div>
      </div>
    );
  }

  // Check if user is admin, event_manager, or super_admin
  const isAdmin = user && ['admin', 'event_manager', 'super_admin'].includes(user.role);

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoute;
