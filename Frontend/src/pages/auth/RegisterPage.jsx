import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  AlertCircle,
  Eye,
  EyeOff,
  CheckCircle2,
  Building2,
  Briefcase,
  User,
  Mail,
  Lock,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { api } from '../../api/client';
import { useToast } from '../../context/ToastContext';

const ROLE_OPTIONS = [
  {
    value: 'employee',
    title: 'Employee',
    badge: 'Requester',
    desc: 'Self-service portal, create and track IT requests',
  },
  {
    value: 'technician',
    title: 'IT Technician',
    badge: 'Support',
    desc: 'Diagnose, troubleshoot, and resolve assigned tickets',
  },
  {
    value: 'it_manager',
    title: 'IT Manager',
    badge: 'Operations',
    desc: 'Oversee queues, SLA adherence, and team assignment',
  },
  {
    value: 'asset_manager',
    title: 'Asset Manager',
    badge: 'Inventory',
    desc: 'Track company hardware, devices, and lifecycles',
  },
  {
    value: 'system_admin',
    title: 'System Admin',
    badge: 'Administrator',
    desc: 'Full administrative control and directory settings',
  },
];

export const RegisterPage = ({ onNavigate }) => {
  const { addToast } = useToast();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('employee');
  const [department, setDepartment] = useState('');
  const [departments, setDepartments] = useState([]);
  const [loadingDepts, setLoadingDepts] = useState(true);

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch active departments from backend
  useEffect(() => {
    let isMounted = true;
    const fetchDepartments = async () => {
      try {
        setLoadingDepts(true);
        const list = await api.auth.getDepartments();
        if (isMounted && list && list.length > 0) {
          setDepartments(list);
          setDepartment(list[0]._id || list[0].name);
        }
      } catch (err) {
        console.error('Error fetching departments:', err);
      } finally {
        if (isMounted) setLoadingDepts(false);
      }
    };

    fetchDepartments();
    return () => {
      isMounted = false;
    };
  }, []);

  // Compute password score (0 to 3)
  const getPasswordStrength = () => {
    if (!password) return 0;
    let score = 0;
    if (password.length >= 6) score += 1;
    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score += 1;
    if (/[0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) score += 1;
    return score;
  };

  const passwordStrength = getPasswordStrength();
  const strengthLabels = ['Weak', 'Fair', 'Strong'];
  const strengthColors = ['var(--status-red-text)', 'var(--status-amber-text)', 'var(--status-green-text)'];
  const strengthBars = ['33%', '66%', '100%'];

  const passwordsMatch = confirmPassword.length > 0 && password === confirmPassword;
  const passwordsMismatch = confirmPassword.length > 0 && password !== confirmPassword;

  const navigateToLogin = () => {
    if (onNavigate) {
      onNavigate('/login');
    } else {
      window.location.hash = '#/login';
    }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();

    if (!name.trim()) {
      setError('Please provide your full name');
      return;
    }
    if (!email.trim()) {
      setError('Please provide a valid corporate email');
      return;
    }
    if (!password) {
      setError('Password is required');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await api.auth.register({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
        role,
        department: department || undefined,
      });

      addToast('Registration successful! Please sign in with your credentials.', 'success');
      navigateToLogin();
    } catch (err) {
      setError(err.message || 'Failed to create user account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page-wrapper">
      <div className="login-card" style={{ maxWidth: 480 }}>
        {/* Brand Header */}
        <div className="login-brand">
          <ShieldCheck size={28} color="var(--primary)" />
          <h1>ServiceDesk Pro</h1>
        </div>

        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <h2 style={{ fontSize: 17, fontWeight: 600, color: 'var(--text-primary)' }}>
            Create an Account
          </h2>
          <span className="metadata-text">
            Join the Enterprise Service Desk Workspace
          </span>
        </div>

        {error && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '10px 14px',
              background: 'var(--status-red-bg)',
              color: 'var(--status-red-text)',
              border: '1px solid var(--status-red-border)',
              borderRadius: 'var(--radius-sm)',
              fontSize: 13,
              marginBottom: 18,
            }}
          >
            <AlertCircle size={17} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Full Name */}
          <div className="form-group" style={{ marginBottom: 14 }}>
            <label className="form-label required" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <User size={14} color="var(--text-secondary)" />
              Full Name
            </label>
            <input
              type="text"
              required
              className="form-control"
              placeholder="e.g. Alex Morgan"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
          </div>

          {/* Email */}
          <div className="form-group" style={{ marginBottom: 14 }}>
            <label className="form-label required" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Mail size={14} color="var(--text-secondary)" />
              Work Email
            </label>
            <input
              type="email"
              required
              className="form-control"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Role Selection */}
          <div className="form-group" style={{ marginBottom: 14 }}>
            <label className="form-label required" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Briefcase size={14} color="var(--text-secondary)" />
              Organizational Role
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
              {ROLE_OPTIONS.slice(0, 4).map((item) => {
                const isSelected = role === item.value;
                return (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => setRole(item.value)}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                      padding: '8px 10px',
                      borderRadius: 'var(--radius-sm)',
                      border: isSelected
                        ? '1.5px solid var(--primary)'
                        : '1px solid var(--border-color)',
                      background: isSelected ? 'var(--primary-subtle)' : 'var(--bg-surface)',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center', marginBottom: 2 }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: isSelected ? 'var(--primary)' : 'var(--text-primary)' }}>
                        {item.title}
                      </span>
                      <span
                        style={{
                          fontSize: 10,
                          padding: '1px 5px',
                          borderRadius: 2,
                          background: isSelected ? 'var(--primary)' : 'var(--bg-hover)',
                          color: isSelected ? '#ffffff' : 'var(--text-muted)',
                          fontWeight: 500,
                        }}
                      >
                        {item.badge}
                      </span>
                    </div>
                    <span style={{ fontSize: 11, color: 'var(--text-secondary)', lineHeight: 1.25 }}>
                      {item.desc}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Admin option as secondary toggle */}
            <div style={{ marginTop: 8 }}>
              <button
                type="button"
                onClick={() => setRole('system_admin')}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '7px 10px',
                  borderRadius: 'var(--radius-sm)',
                  border: role === 'system_admin' ? '1.5px solid var(--primary)' : '1px dashed var(--border-color)',
                  background: role === 'system_admin' ? 'var(--primary-subtle)' : 'transparent',
                  cursor: 'pointer',
                  fontSize: 12,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <ShieldAlert size={14} color={role === 'system_admin' ? 'var(--primary)' : 'var(--text-muted)'} />
                  <span style={{ fontWeight: 600, color: role === 'system_admin' ? 'var(--primary)' : 'var(--text-primary)' }}>
                    System Administrator
                  </span>
                </div>
                <span className="metadata-text" style={{ fontSize: 11 }}>
                  Full Platform Governance
                </span>
              </button>
            </div>
          </div>

          {/* Department Selection */}
          <div className="form-group" style={{ marginBottom: 14 }}>
            <label className="form-label required" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Building2 size={14} color="var(--text-secondary)" />
              Department
            </label>
            <select
              className="form-select"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              disabled={loadingDepts}
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-color)',
                background: 'var(--bg-surface)',
                color: 'var(--text-primary)',
                fontSize: 13,
                outline: 'none',
              }}
            >
              {departments.map((dept) => (
                <option key={dept._id || dept.name} value={dept._id || dept.name}>
                  {dept.name}
                </option>
              ))}
            </select>
          </div>

          {/* Password with Visibility Toggle */}
          <div className="form-group" style={{ marginBottom: 14 }}>
            <label className="form-label required" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Lock size={14} color="var(--text-secondary)" />
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                className="form-control"
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ paddingRight: 38 }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: 8,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  padding: 4,
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {/* Password Strength Indicator */}
            {password.length > 0 && (
              <div style={{ marginTop: 6 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                    Password Strength:
                  </span>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      color: strengthColors[Math.max(0, passwordStrength - 1)],
                    }}
                  >
                    {passwordStrength === 0 ? 'Too short' : strengthLabels[passwordStrength - 1]}
                  </span>
                </div>
                <div
                  style={{
                    height: 3,
                    width: '100%',
                    background: 'var(--border-subtle)',
                    borderRadius: 2,
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      width: passwordStrength === 0 ? '15%' : strengthBars[passwordStrength - 1],
                      background: strengthColors[Math.max(0, passwordStrength - 1)],
                      transition: 'width 0.25s ease',
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Confirm Password with Match Indicator */}
          <div className="form-group" style={{ marginBottom: 18 }}>
            <label className="form-label required" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Lock size={14} color="var(--text-secondary)" />
              Confirm Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                required
                className="form-control"
                placeholder="Repeat password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                style={{
                  paddingRight: 38,
                  borderColor: passwordsMismatch
                    ? 'var(--status-red-border)'
                    : passwordsMatch
                    ? 'var(--status-green-border)'
                    : undefined,
                }}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                style={{
                  position: 'absolute',
                  right: 8,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  padding: 4,
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {passwordsMatch && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 4, color: 'var(--status-green-text)', fontSize: 11 }}>
                <CheckCircle2 size={13} />
                <span>Passwords match</span>
              </div>
            )}
            {passwordsMismatch && (
              <span style={{ display: 'block', marginTop: 4, color: 'var(--status-red-text)', fontSize: 11 }}>
                Passwords do not match
              </span>
            )}
          </div>

          {/* Submit Action */}
          <Button
            type="submit"
            variant="primary"
            loading={loading}
            style={{ width: '100%', height: 38, marginTop: 4 }}
          >
            Create Account
          </Button>

          {/* Navigation to Login */}
          <div style={{ textAlign: 'center', marginTop: 16, fontSize: 13, color: 'var(--text-muted)' }}>
            Already have an account?{' '}
            <button
              type="button"
              onClick={navigateToLogin}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--primary)',
                fontWeight: 600,
                cursor: 'pointer',
                padding: 0,
              }}
            >
              Sign in
            </button>
          </div>
        </form>

        {/* Security Footer Notice */}
        <div
          style={{
            marginTop: 20,
            paddingTop: 12,
            borderTop: '1px solid var(--border-subtle)',
            textAlign: 'center',
            fontSize: 11,
            color: 'var(--text-muted)',
          }}
        >
          Protected by Enterprise SSO & Role-Based Access Control
        </div>
      </div>
    </div>
  );
};
