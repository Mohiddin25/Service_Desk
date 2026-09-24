import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Headphones, Lock, Mail, ArrowRight } from 'lucide-react';

export const LoginPage = ({ onNavigate, onLoginSuccess }) => {
  const { login } = useAuth();
  const { addToast } = useToast();
  const [email, setEmail] = useState('mohiddin@company.com');
  const [password, setPassword] = useState('password123');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;

    setIsLoading(true);
    try {
      const res = await login({ email, password });
      addToast(`Welcome back, ${res.user.name}!`, "success");
      if (onLoginSuccess) onLoginSuccess();
    } catch (err) {
      addToast("Invalid email or password. Please verify your credentials.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  // Quick fill helper for presentation demonstration
  const handleQuickFill = (testEmail) => {
    setEmail(testEmail);
    setPassword('password123');
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--bg)',
      padding: '20px'
    }}>
      <div className="card" style={{ maxWidth: '400px', width: '100%', padding: '32px', borderRadius: 'var(--radius-xl)' }}>
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'var(--blue)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 12px auto'
          }}>
            <Headphones size={22} color="#ffffff" />
          </div>
          <h1 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text)' }}>ServiceDesk Pro</h1>
          <p style={{ fontSize: '13px', color: 'var(--text-2)', marginTop: '4px' }}>IT Helpdesk Portal</p>
        </div>

        {/* Credentials Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="form-group">
            <label className="form-label" style={{ fontSize: '12.5px', fontWeight: 600 }}>Email / Username</label>
            <input 
              type="text" 
              className="input" 
              placeholder="e.g. employee@company.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label className="form-label" style={{ fontSize: '12.5px', fontWeight: 600 }}>Password</label>
              {onNavigate && (
                <button 
                  type="button" 
                  onClick={() => onNavigate('forgot_password')}
                  style={{ background: 'none', border: 'none', color: 'var(--blue)', fontSize: '12px', cursor: 'pointer', padding: 0 }}
                >
                  Forgot password?
                </button>
              )}
            </div>
            <input 
              type="password" 
              className="input" 
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ width: '100%', height: '40px', marginTop: '4px', fontSize: '13.5px' }} 
            disabled={isLoading}
          >
            <span>{isLoading ? 'Signing In...' : 'Sign In'}</span>
          </button>
        </form>

        {/* Demo Fast Account Switcher for testing all 5 roles seamlessly */}
        <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
          <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', marginBottom: '8px', textAlign: 'center' }}>
            Demo Accounts (Pre-configured Staff)
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', justifyContent: 'center' }}>
            <button 
              type="button" 
              className="chip" 
              style={{ fontSize: '11.5px', padding: '3px 8px' }}
              onClick={() => handleQuickFill('mohiddin@company.com')}
            >
              Employee
            </button>
            <button 
              type="button" 
              className="chip" 
              style={{ fontSize: '11.5px', padding: '3px 8px' }}
              onClick={() => handleQuickFill('rahul@company.com')}
            >
              Technician
            </button>
            <button 
              type="button" 
              className="chip" 
              style={{ fontSize: '11.5px', padding: '3px 8px' }}
              onClick={() => handleQuickFill('priya@company.com')}
            >
              IT Manager
            </button>
            <button 
              type="button" 
              className="chip" 
              style={{ fontSize: '11.5px', padding: '3px 8px' }}
              onClick={() => handleQuickFill('sam@company.com')}
            >
              Asset Mgr
            </button>
            <button 
              type="button" 
              className="chip" 
              style={{ fontSize: '11.5px', padding: '3px 8px' }}
              onClick={() => handleQuickFill('alex@company.com')}
            >
              Admin
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
