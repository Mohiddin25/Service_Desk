import React from 'react';
import { useAuth } from '../context/AuthContext';
import { AlertCircle } from 'lucide-react';

export const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <AlertCircle size={40} color="#ef4444" style={{ margin: '0 auto 10px auto' }} />
        <h2>Authentication Required</h2>
        <p>Please log in to access this page.</p>
      </div>
    );
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return (
      <div className="content-body">
        <div className="card" style={{ padding: '40px', textAlign: 'center', background: '#fef2f2', border: '1px solid #fca5a5' }}>
          <AlertCircle size={44} color="#dc2626" style={{ margin: '0 auto 12px auto' }} />
          <h2 style={{ color: '#dc2626' }}>Access Restricted (403 Forbidden)</h2>
          <p style={{ color: '#991b1b', maxWidth: '480px', margin: '8px auto' }}>
            Your account role (<strong>{user.role}</strong>) does not have authorization to access this administrative view.
          </p>
        </div>
      </div>
    );
  }

  return children;
};
