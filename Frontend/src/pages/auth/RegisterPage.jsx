import React, { useState } from 'react';
import { useToast } from '../../context/ToastContext';

export const RegisterPage = ({ onNavigate }) => {
  const { addToast } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [department, setDepartment] = useState('Product & Engineering');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      addToast("Passwords do not match.", "error");
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      addToast("Account created successfully. Please sign in.", "success");
      setIsLoading(false);
      if (onNavigate) onNavigate('login');
    }, 600);
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
      <div className="card" style={{ maxWidth: '420px', width: '100%', padding: '28px', borderRadius: 'var(--radius-lg)' }}>
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text)' }}>ServiceDesk Pro</h2>
          <p style={{ fontSize: '13px', color: 'var(--text-2)', marginTop: '4px' }}>Create an Account</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div className="form-group">
            <label className="form-label" style={{ fontSize: '12.5px', fontWeight: 600 }}>Name</label>
            <input 
              type="text" 
              className="input" 
              placeholder="e.g. Mohiddin"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" style={{ fontSize: '12.5px', fontWeight: 600 }}>Email</label>
            <input 
              type="email" 
              className="input" 
              placeholder="name@company.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" style={{ fontSize: '12.5px', fontWeight: 600 }}>Department</label>
            <select className="select" value={department} onChange={e => setDepartment(e.target.value)}>
              <option value="Product & Engineering">Product & Engineering</option>
              <option value="IT Operations">IT Operations</option>
              <option value="Human Resources">Human Resources</option>
              <option value="Finance & Operations">Finance & Operations</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label" style={{ fontSize: '12.5px', fontWeight: 600 }}>Password</label>
            <input 
              type="password" 
              className="input" 
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" style={{ fontSize: '12.5px', fontWeight: 600 }}>Confirm Password</label>
            <input 
              type="password" 
              className="input" 
              placeholder="••••••••"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', height: '38px', marginTop: '6px' }} disabled={isLoading}>
            <span>{isLoading ? 'Creating Account...' : 'Create Account'}</span>
          </button>
        </form>

        {onNavigate && (
          <div style={{ textAlign: 'center', marginTop: '16px', paddingTop: '14px', borderTop: '1px solid var(--border)', fontSize: '12.5px', color: 'var(--text-2)' }}>
            Already have an account?{' '}
            <button 
              onClick={() => onNavigate('login')}
              style={{ background: 'none', border: 'none', color: 'var(--blue)', fontWeight: 600, cursor: 'pointer' }}
            >
              Sign in
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
