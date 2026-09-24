import React, { useState } from 'react';
import { Mail, ArrowLeft, Send } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const ForgotPasswordPage = ({ onNavigate }) => {
  const { addToast } = useToast();
  const [email, setEmail] = useState('');
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;

    setIsSent(true);
    addToast("Password reset link sent to your email address.", "success");
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
        <button 
          onClick={() => onNavigate('login')}
          style={{ background: 'transparent', border: 'none', color: '#64748b', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '16px' }}
        >
          <ArrowLeft size={16} />
          <span>Back to Login</span>
        </button>

        <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a', marginBottom: '6px' }}>Reset Your Password</h2>
        <p style={{ fontSize: '0.825rem', color: '#64748b', marginBottom: '20px' }}>
          Enter your corporate email address and we will send you a password reset verification link.
        </p>

        {isSent ? (
          <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', padding: '16px', borderRadius: '12px', color: '#059669', fontSize: '0.85rem' }}>
            <strong>Reset Link Sent!</strong> Please check your inbox for instructions to reset your password.
            <div style={{ marginTop: '12px' }}>
              <button className="btn btn-primary btn-sm" onClick={() => onNavigate('reset_password')}>
                Simulate Reset Token Link
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input 
                  type="email" 
                  className="input" 
                  placeholder="name@company.com"
                  style={{ paddingLeft: '36px' }}
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', height: '42px' }}>
              <Send size={16} />
              <span>Send Reset Instructions</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
