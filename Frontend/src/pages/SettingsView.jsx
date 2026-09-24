import React, { useState } from 'react';
import { User, Bell, Moon, Lock, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const SettingsView = () => {
  const { user } = useAuth();
  const { addToast } = useToast();
  
  const [activeTab, setActiveTab] = useState('profile');
  
  // Profile settings
  const [name, setName] = useState(user?.name || 'Mohiddin');
  const [email, setEmail] = useState(user?.email || 'mohiddin@company.com');
  const [department, setDepartment] = useState('IT Operations');

  // Notifications settings
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [ticketUpdates, setTicketUpdates] = useState(true);
  const [digest, setDigest] = useState(false);

  // Appearance settings
  const [theme, setTheme] = useState('light');
  const [compactMode, setCompactMode] = useState(true);

  // Password settings
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSave = (e) => {
    e.preventDefault();
    addToast("Preferences saved successfully.", "success");
  };

  return (
    <div className="content-body" style={{ maxWidth: '820px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div>
        <h1 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text)' }}>Settings</h1>
        <p style={{ fontSize: '13px', color: 'var(--text-2)' }}>Manage your account preferences and application settings.</p>
      </div>

      {/* Settings Navigation Tabs */}
      <div style={{ display: 'flex', gap: '6px', borderBottom: '1px solid var(--border)', paddingBottom: '2px' }}>
        {[
          { id: 'profile', label: 'Profile', icon: User },
          { id: 'notifications', label: 'Notifications', icon: Bell },
          { id: 'appearance', label: 'Appearance', icon: Moon },
          { id: 'password', label: 'Password', icon: Lock },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              className={`chip ${isActive ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
              style={{
                fontSize: '13px',
                padding: '6px 14px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: isActive ? 'var(--blue)' : 'var(--bg)',
                color: isActive ? '#ffffff' : 'var(--text-2)',
                borderColor: isActive ? 'var(--blue)' : 'var(--border)'
              }}
            >
              <Icon size={14} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Settings Card */}
      <div className="card" style={{ padding: '20px' }}>
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <h2 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text)' }}>Profile Information</h2>

              <div className="form-group">
                <label className="form-label" style={{ fontSize: '12.5px', fontWeight: 600 }}>Full Name</label>
                <input 
                  type="text" 
                  className="input" 
                  value={name} 
                  onChange={e => setName(e.target.value)} 
                  required 
                />
              </div>

              <div className="form-group">
                <label className="form-label" style={{ fontSize: '12.5px', fontWeight: 600 }}>Work Email</label>
                <input 
                  type="email" 
                  className="input" 
                  value={email} 
                  onChange={e => setEmail(e.target.value)} 
                  required 
                />
              </div>

              <div className="form-group">
                <label className="form-label" style={{ fontSize: '12.5px', fontWeight: 600 }}>Department</label>
                <input 
                  type="text" 
                  className="input" 
                  value={department} 
                  onChange={e => setDepartment(e.target.value)} 
                />
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <h2 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text)' }}>Notification Preferences</h2>

              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13.5px', cursor: 'pointer' }}>
                <input 
                  type="checkbox" 
                  checked={emailAlerts} 
                  onChange={e => setEmailAlerts(e.target.checked)} 
                />
                <span>Email alerts for critical ticket updates</span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13.5px', cursor: 'pointer' }}>
                <input 
                  type="checkbox" 
                  checked={ticketUpdates} 
                  onChange={e => setTicketUpdates(e.target.checked)} 
                />
                <span>Browser notifications on new ticket assignments</span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13.5px', cursor: 'pointer' }}>
                <input 
                  type="checkbox" 
                  checked={digest} 
                  onChange={e => setDigest(e.target.checked)} 
                />
                <span>Weekly support summary digest</span>
              </label>
            </div>
          )}

          {/* Appearance Tab */}
          {activeTab === 'appearance' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <h2 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text)' }}>Appearance</h2>

              <div className="form-group">
                <label className="form-label" style={{ fontSize: '12.5px', fontWeight: 600 }}>Interface Theme</label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    type="button"
                    className={`btn ${theme === 'light' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                    onClick={() => setTheme('light')}
                  >
                    Clean Light
                  </button>
                  <button
                    type="button"
                    className={`btn ${theme === 'system' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                    onClick={() => setTheme('system')}
                  >
                    System Default
                  </button>
                </div>
              </div>

              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13.5px', cursor: 'pointer' }}>
                <input 
                  type="checkbox" 
                  checked={compactMode} 
                  onChange={e => setCompactMode(e.target.checked)} 
                />
                <span>Compact table layout (Linear / Jira style)</span>
              </label>
            </div>
          )}

          {/* Password Tab */}
          {activeTab === 'password' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <h2 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text)' }}>Change Password</h2>

              <div className="form-group">
                <label className="form-label" style={{ fontSize: '12.5px', fontWeight: 600 }}>Current Password</label>
                <input 
                  type="password" 
                  className="input" 
                  value={currentPassword} 
                  onChange={e => setCurrentPassword(e.target.value)} 
                  placeholder="••••••••" 
                />
              </div>

              <div className="form-group">
                <label className="form-label" style={{ fontSize: '12.5px', fontWeight: 600 }}>New Password</label>
                <input 
                  type="password" 
                  className="input" 
                  value={newPassword} 
                  onChange={e => setNewPassword(e.target.value)} 
                  placeholder="••••••••" 
                />
              </div>

              <div className="form-group">
                <label className="form-label" style={{ fontSize: '12.5px', fontWeight: 600 }}>Confirm New Password</label>
                <input 
                  type="password" 
                  className="input" 
                  value={confirmPassword} 
                  onChange={e => setConfirmPassword(e.target.value)} 
                  placeholder="••••••••" 
                />
              </div>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '10px', borderTop: '1px solid var(--border)' }}>
            <button type="submit" className="btn btn-primary">
              <Check size={15} />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
