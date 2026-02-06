import { Navigate } from 'react-router-dom';
import { authService } from '../../services/auth';

export default function ProtectedRoute({ children }) {
  // Development: Authentication disabled - uncomment to enable
  // if (!authService.isAuthenticated()) {
  //   return <Navigate to="/login" replace />;
  // }
  return children;
}
