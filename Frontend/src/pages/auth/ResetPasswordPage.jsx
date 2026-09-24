import React, { useState } from 'react';
import { Lock, CheckCircle2, ArrowRight } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const ResetPasswordPage = ({ onNavigate }) => {
  const { addToast } = useToast();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      addToast("Passwords do not match.", "error");
      return;
    }

    addToast("Password reset successfully. You can now login.", "success");
    onNavigate('login');
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #f8fafc 0%, #eff6ff 100%)',
      padding: '20px'
    }}>
      <div className="card" style={{ maxWidth: '420px', width: '100%', padding: '32px', borderRadius: '20px', boxShadow: 'var(--shadow-lg)' }}>
        <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a', marginBottom: '6px' }}>Set New Password</h2>
        <p style={{ fontSize: '0.825rem', color: '#64748b', marginBottom: '20px' }}>
          Choose a strong password with at least 8 characters.
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="form-group">
            <label className="form-label">New Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input 
                type="password" 
                className="input" 
                style={{ paddingLeft: '36px' }}
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Confirm New Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input 
                type="password" 
                className="input" 
                style={{ paddingLeft: '36px' }}
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', height: '42px' }}>
            <span>Update Password</span>
            <ArrowRight size={16} />
          </button>
        </form>
      </div>
    </div>
  );
};
