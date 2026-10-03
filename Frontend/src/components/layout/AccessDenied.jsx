import React from 'react';
import { ShieldX } from 'lucide-react';
import { Button } from '../ui/Button';

export const AccessDenied = ({ onBackToDashboard }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', textAlign: 'center', padding: 24 }}>
      <div style={{ width: 56, height: 56, borderRadius: '50%', backgroundColor: 'var(--status-red-bg)', color: 'var(--status-red-text)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
        <ShieldX size={32} />
      </div>
      <h1 style={{ fontSize: 24, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>
        Access Denied
      </h1>
      <p style={{ fontSize: 14, color: 'var(--text-secondary)', maxWidth: 400, marginBottom: 24 }}>
        You don't have permission to access this page.
      </p>
      <Button
        variant="primary"
        onClick={onBackToDashboard || (() => window.location.hash = '#/dashboard')}
      >
        Back to Dashboard
      </Button>
    </div>
  );
};
