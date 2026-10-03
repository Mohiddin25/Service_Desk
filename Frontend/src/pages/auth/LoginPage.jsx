import React, { useState } from 'react';
import { ShieldCheck, Lock, Mail, AlertCircle, ArrowRight } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useAuth } from '../../context/AuthContext';

export const LoginPage = ({ onLoginSuccess, onNavigate }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('mohiddin@company.com');
  const [password, setPassword] = useState('Password123!');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!email.trim() || !password) {
      setError('Please enter your email and password');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await login({ email: email.trim(), password });
      if (onLoginSuccess) onLoginSuccess();
    } catch (err) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFill = (testEmail, testPass = 'Password123!') => {
    setEmail(testEmail);
    setPassword(testPass);
    setError('');
  };

  const handleGoToRegister = () => {
    if (onNavigate) {
      onNavigate('/register');
    } else {
      window.location.hash = '#/register';
    }
  };

  return (
    <div className="login-page-wrapper">
      <div className="login-card">
        {/* Brand */}
        <div className="login-brand">
          <ShieldCheck size={28} color="var(--primary)" />
          <h1>ServiceDesk Pro</h1>
        </div>

        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <h2 style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)' }}>
            Sign in to your company account
          </h2>
          <span className="metadata-text">
            Enterprise Single Sign-On & Incident Management
          </span>
        </div>

        {error && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px', background: 'var(--status-red-bg)', color: 'var(--status-red-text)', border: '1px solid var(--status-red-border)', borderRadius: 'var(--radius-sm)', fontSize: 13, marginBottom: 16 }}>
            <AlertCircle size={16} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <Input
            label="Email / Username"
            type="email"
            required
            placeholder="name@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Input
            label="Password"
            type="password"
            required
            placeholder="••••••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button
            type="submit"
            variant="primary"
            loading={loading}
            style={{ width: '100%', height: 38, marginTop: 8 }}
          >
            Sign In
          </Button>
          
          <div style={{ textAlign: 'center', marginTop: '16px', fontSize: '13px', color: 'var(--text-muted)' }}>
            Don't have an account?{' '}
            <button
              type="button"
              onClick={handleGoToRegister}
              style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 600, cursor: 'pointer', padding: 0 }}
            >
              Create one
            </button>
          </div>
        </form>

        {/* Enterprise Demo Account Quick-Fill */}
        <div className="quick-accounts-section">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-muted)' }}>
              Corporate Test Accounts
            </span>
            <span className="metadata-text" style={{ fontSize: 11 }}>Click to pre-fill</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <button
              type="button"
              className="quick-account-btn"
              onClick={() => handleQuickFill('mohiddin@company.com')}
            >
              <div>
                <strong>Employee</strong>
                <span className="metadata-text" style={{ display: 'block' }}>mohiddin@company.com</span>
              </div>
              <ArrowRight size={13} color="var(--text-muted)" />
            </button>

            <button
              type="button"
              className="quick-account-btn"
              onClick={() => handleQuickFill('dave@company.com')}
            >
              <div>
                <strong>Technician</strong>
                <span className="metadata-text" style={{ display: 'block' }}>dave@company.com</span>
              </div>
              <ArrowRight size={13} color="var(--text-muted)" />
            </button>

            <button
              type="button"
              className="quick-account-btn"
              onClick={() => handleQuickFill('priya@company.com')}
            >
              <div>
                <strong>IT Manager</strong>
                <span className="metadata-text" style={{ display: 'block' }}>priya@company.com</span>
              </div>
              <ArrowRight size={13} color="var(--text-muted)" />
            </button>

            <button
              type="button"
              className="quick-account-btn"
              onClick={() => handleQuickFill('marcus@company.com')}
            >
              <div>
                <strong>Asset Manager</strong>
                <span className="metadata-text" style={{ display: 'block' }}>marcus@company.com</span>
              </div>
              <ArrowRight size={13} color="var(--text-muted)" />
            </button>

            <button
              type="button"
              className="quick-account-btn"
              onClick={() => handleQuickFill('admin@company.com')}
            >
              <div>
                <strong>System Admin</strong>
                <span className="metadata-text" style={{ display: 'block' }}>admin@company.com</span>
              </div>
              <ArrowRight size={13} color="var(--text-muted)" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
