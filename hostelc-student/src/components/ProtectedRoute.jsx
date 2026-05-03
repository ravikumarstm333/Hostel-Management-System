import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * ProtectedRoute — wraps routes that require authentication + specific roles.
 * 
 * Usage: <ProtectedRoute roles={['STUDENT']}><Dashboard /></ProtectedRoute>
 * 
 * If not logged in → redirect to /
 * If logged in but wrong role → redirect to their own dashboard
 */
const ProtectedRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  // Not logged in
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // Logged in but wrong role
  if (roles && !roles.includes(user.role)) {
    const dashboards = {
      STUDENT: '/dashboard',
      WARDEN: '/warden/dashboard',
      TECHNICIAN: '/technician/dashboard',
    };
    return <Navigate to={dashboards[user.role] || '/'} replace />;
  }

  return children;
};

export default ProtectedRoute;
