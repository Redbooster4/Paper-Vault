import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from '../styles/shared.module.css';

export default function ProtectedRoute({ children, requiredRole }) {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return <div className={styles.container} style={{ textAlign: 'center', marginTop: '5rem' }}>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to={user?.role === 'admin' ? '/admin' : '/student'} replace />;
  }

  return children;
}
