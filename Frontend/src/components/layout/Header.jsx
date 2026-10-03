import React, { useState, useRef, useEffect } from 'react';
import { Search, Bell, LogOut, ShieldCheck, User, Menu } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Badge } from '../ui/Badge';

export const Header = ({ onToggleSidebar, onOpenNotifications, unreadCount = 2, searchQuery = '', onSearchChange }) => {
  const { user, role, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.split(' ');
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  const roleLabels = {
    employee: 'Employee',
    technician: 'Technician',
    it_manager: 'IT Manager',
    asset_manager: 'Asset Manager',
    system_admin: 'System Admin'
  };

  return (
    <header className="app-header">
      <div className="header-left">
        <button
          type="button"
          className="icon-btn"
          onClick={onToggleSidebar}
          aria-label="Toggle Navigation"
          style={{ display: 'inline-flex' }}
        >
          <Menu size={18} />
        </button>

        <div className="brand-link" onClick={() => window.location.hash = '#/dashboard'}>
          <ShieldCheck size={22} color="var(--primary)" />
          <span>ServiceDesk Pro</span>
          <span className="brand-badge">Enterprise</span>
        </div>
      </div>

      <div className="header-search">
        <Search size={15} className="search-icon" />
        <input
          type="text"
          placeholder="Search tickets, assets, knowledge..."
          value={searchQuery}
          onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
        />
      </div>

      <div className="header-right">
        <button
          type="button"
          className="icon-btn"
          onClick={onOpenNotifications}
          title="Notifications"
        >
          <Bell size={17} />
          {unreadCount > 0 && <span className="notif-badge-dot" />}
        </button>

        <div style={{ position: 'relative' }} ref={dropdownRef}>
          <button
            type="button"
            className="user-menu-trigger"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <div className="avatar">
              {getInitials(user?.name)}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', textAlign: 'left' }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.2 }}>
                {user?.name || 'User'}
              </span>
              <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                {roleLabels[role] || role}
              </span>
            </div>
          </button>

          {isDropdownOpen && (
            <div
              style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                marginTop: 6,
                width: 240,
                background: '#fff',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow-md)',
                zIndex: 100,
                overflow: 'hidden'
              }}
            >
              <div style={{ padding: '12px 14px', borderBottom: '1px solid var(--border-subtle)', background: '#fafbfc' }}>
                <div style={{ fontWeight: 600, fontSize: 13.5, color: 'var(--text-primary)' }}>
                  {user?.name}
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 6 }}>
                  {user?.email}
                </div>
                <Badge type="status" value="open" label={roleLabels[role] || role} />
              </div>

              <div style={{ padding: 4 }}>
                <button
                  type="button"
                  onClick={() => {
                    setIsDropdownOpen(false);
                    logout();
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    width: '100%',
                    padding: '8px 10px',
                    fontSize: 13,
                    color: 'var(--status-red-text)',
                    background: 'transparent',
                    border: 'none',
                    borderRadius: 'var(--radius-sm)',
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                >
                  <LogOut size={15} />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
