import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { AccessDenied } from './AccessDenied';

export const RoleGuard = ({ allowedRoles = [], children, onBackToDashboard }) => {
  const { role } = useAuth();

  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    return <AccessDenied onBackToDashboard={onBackToDashboard} />;
  }

  return <>{children}</>;
};
