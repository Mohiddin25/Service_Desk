import React from 'react';
import { useAuth } from '../context/AuthContext';

export const ProfilePage = () => {
  const { user } = useAuth();

  return (
    <div className="content-body" style={{ maxWidth: '640px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div>
        <h1 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text)' }}>User Profile</h1>
        <p style={{ fontSize: '13px', color: 'var(--text-2)' }}>Your account identity and role details.</p>
      </div>

      <div className="card" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px', borderBottom: '1px solid var(--border)', paddingBottom: '16px' }}>
          <div className="avatar avatar-lg">
            {user?.name ? user.name.slice(0, 2).toUpperCase() : 'US'}
          </div>

          <div>
            <h2 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text)' }}>{user?.name || 'Mohiddin'}</h2>
            <p style={{ fontSize: '13px', color: 'var(--text-2)' }}>{user?.email || 'mohiddin@company.com'}</p>
            <span className="badge badge-assigned" style={{ marginTop: '6px' }}>{user?.role || 'IT Support'}</span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div className="form-group">
            <label className="form-label" style={{ fontSize: '12.5px', fontWeight: 600 }}>Full Name</label>
            <input type="text" className="input" value={user?.name || ''} readOnly />
          </div>

          <div className="form-group">
            <label className="form-label" style={{ fontSize: '12.5px', fontWeight: 600 }}>Work Email</label>
            <input type="text" className="input" value={user?.email || ''} readOnly />
          </div>

          <div className="form-group">
            <label className="form-label" style={{ fontSize: '12.5px', fontWeight: 600 }}>Department</label>
            <input type="text" className="input" value={user?.department || 'IT Operations'} readOnly />
          </div>
        </div>
      </div>
    </div>
  );
};
