
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireAdmin = false 
}) => {
  const { currentUser, isAdmin, loading } = useAuth();

  if (loading) {
    // You could render a loading spinner here
    return <div>Loading...</div>;
  }

  if (!currentUser) {
    return <Navigate to="/auth" />;
  }

  if (requireAdmin && !isAdmin) {
    // User is not an admin but the route requires admin privileges
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
