// MoveSmart — Protected Route Component
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ user, children }) {
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
}
