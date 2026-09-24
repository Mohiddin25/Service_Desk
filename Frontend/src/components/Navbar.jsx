import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Bell, Menu, User, Settings, LogOut, ChevronDown } from 'lucide-react';

export const Navbar = ({ onToggleSidebar, activeTab, setActiveTab, unreadNotificationsCount = 2 }) => {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatRole = (r) => {
    switch (r) {
      case 'system_admin': return 'System Admin';
      case 'it_manager': return 'IT Manager';
      case 'technician': return 'Technician';
      case 'asset_manager': return 'Asset Manager';
      case 'employee': return 'Employee';
      default: return r ? r.replace('_', ' ') : 'Employee';
    }
  };

  return (
    <header className="navbar">
      {/* Left: Mobile hamburger & Brand */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button 
          onClick={onToggleSidebar}
          className="mobile-toggle"
          aria-label="Toggle Navigation"
          style={{ 
            background: 'transparent', 
            border: 'none', 
            color: 'var(--text-2)', 
            cursor: 'pointer', 
            padding: '4px',
            display: 'flex', 
            alignItems: 'center',
            borderRadius: 'var(--radius-sm)'
          }}
        >
          <Menu size={20} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text)', letterSpacing: '-0.3px' }}>
            ServiceDesk Pro
          </span>
        </div>
      </div>

      {/* Right: Notifications & User Profile Menu */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* Notification Bell */}
        <button 
          onClick={() => setActiveTab('notifications')}
          style={{ 
            position: 'relative', 
            background: 'transparent', 
            border: 'none', 
            color: 'var(--text-2)', 
            padding: '6px', 
            borderRadius: 'var(--radius)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            cursor: 'pointer' 
          }}
          title="Notifications"
        >
          <Bell size={18} />
          {unreadNotificationsCount > 0 && (
            <span style={{
              position: 'absolute',
              top: '4px',
              right: '4px',
              width: '8px',
              height: '8px',
              borderRadius: '99px',
              background: 'var(--danger)',
              border: '2px solid var(--surface)'
            }} />
          )}
        </button>

        {/* User Profile Dropdown Pill */}
        <div style={{ position: 'relative' }} ref={menuRef}>
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px', 
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '4px 6px',
              borderRadius: 'var(--radius)'
            }}
          >
            <div className="avatar" style={{ width: '28px', height: '28px', fontSize: '11px' }}>
              {user?.name ? user.name.slice(0, 2).toUpperCase() : 'US'}
            </div>
            <div style={{ textAlign: 'left', lineHeight: 1.2 }}>
              <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)' }}>
                {user?.name || 'User'}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-3)' }}>
                {formatRole(user?.role)}
              </div>
            </div>
            <ChevronDown size={14} color="var(--text-3)" />
          </button>

          {/* Profile Menu Dropdown */}
          {isMenuOpen && (
            <div 
              style={{
                position: 'absolute',
                top: 'calc(100% + 6px)',
                right: 0,
                width: '180px',
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius)',
                boxShadow: 'var(--shadow-md)',
                padding: '4px',
                zIndex: 100,
                display: 'flex',
                flexDirection: 'column',
                gap: '2px'
              }}
            >
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => { setActiveTab('profile'); setIsMenuOpen(false); }}
                style={{ width: '100%', justifyContent: 'flex-start', fontSize: '12.5px', padding: '7px 10px' }}
              >
                <User size={14} />
                <span>Profile</span>
              </button>

              <button
                className="btn btn-ghost btn-sm"
                onClick={() => { setActiveTab('settings'); setIsMenuOpen(false); }}
                style={{ width: '100%', justifyContent: 'flex-start', fontSize: '12.5px', padding: '7px 10px' }}
              >
                <Settings size={14} />
                <span>Settings</span>
              </button>

              <div style={{ height: '1px', background: 'var(--border)', margin: '4px 0' }} />

              <button
                className="btn btn-ghost btn-sm"
                onClick={() => { logout(); setIsMenuOpen(false); }}
                style={{ width: '100%', justifyContent: 'flex-start', fontSize: '12.5px', padding: '7px 10px', color: 'var(--danger)' }}
              >
                <LogOut size={14} />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
