import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function ProtectedAdminRoute({ children }) {
  const { admin, loading } = useAuth();

  if (loading) {
    return <div className="loader"><div className="spinner"></div></div>;
  }

  if (!admin) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}

export function ProtectedCustomerRoute({ children }) {
  const { customer, loading } = useAuth();

  if (loading) {
    return <div className="loader"><div className="spinner"></div></div>;
  }

  if (!customer) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
