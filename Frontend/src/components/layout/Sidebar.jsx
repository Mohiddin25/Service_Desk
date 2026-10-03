import React from 'react';
import {
  LayoutDashboard,
  Ticket,
  PlusCircle,
  Bot,
  BookOpen,
  Laptop,
  Bell,
  Clock,
  BarChart3,
  Users,
  Settings,
  ShieldAlert,
  Wrench,
  Building2,
  FileCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Sidebar = ({ currentPath, onNavigate, isOpen, onClose }) => {
  const { role } = useAuth();

  // Role-specific navigation menus
  const navConfigs = {
    employee: [
      { id: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { id: '/my-tickets', label: 'My Tickets', icon: Ticket },
      { id: '/create-ticket', label: 'Create Ticket', icon: PlusCircle },
      { id: '/ai-assistant', label: 'AI Assistant', icon: Bot, isAi: true },
      { id: '/knowledge', label: 'Knowledge Base', icon: BookOpen },
      { id: '/my-assets', label: 'My Assets', icon: Laptop },
      { id: '/notifications', label: 'Notifications', icon: Bell }
    ],

    technician: [
      { id: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { id: '/assigned-tickets', label: 'Assigned Tickets', icon: Ticket },
      { id: '/tickets', label: 'All Tickets', icon: Ticket },
      { id: '/ai-assistant', label: 'AI Assistant', icon: Bot, isAi: true },
      { id: '/knowledge', label: 'Knowledge Base', icon: BookOpen },
      { id: '/assets', label: 'Assets', icon: Laptop },
      { id: '/notifications', label: 'Notifications', icon: Bell }
    ],

    it_manager: [
      { id: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { id: '/tickets', label: 'Tickets', icon: Ticket },
      { id: '/sla', label: 'SLA Monitoring', icon: Clock },
      { id: '/knowledge', label: 'Knowledge Base', icon: BookOpen },
      { id: '/reports', label: 'Reports', icon: BarChart3 },
      { id: '/technicians', label: 'Technicians', icon: Users },
      { id: '/notifications', label: 'Notifications', icon: Bell }
    ],

    asset_manager: [
      { id: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { id: '/assets', label: 'Assets', icon: Laptop },
      { id: '/assignments', label: 'Assignments', icon: Users },
      { id: '/maintenance', label: 'Maintenance', icon: Wrench },
      { id: '/vendors', label: 'Vendors', icon: Building2 },
      { id: '/reports', label: 'Reports', icon: BarChart3 },
      { id: '/notifications', label: 'Notifications', icon: Bell }
    ],

    system_admin: [
      { id: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { id: '/users', label: 'Users', icon: Users },
      { id: '/tickets', label: 'Tickets', icon: Ticket },
      { id: '/assets', label: 'Assets', icon: Laptop },
      { id: '/knowledge', label: 'Knowledge Base', icon: BookOpen },
      { id: '/sla', label: 'SLA Policies', icon: Clock },
      { id: '/audit-logs', label: 'Audit Logs', icon: FileCheck },
      { id: '/reports', label: 'Reports', icon: BarChart3 },
      { id: '/settings', label: 'Settings', icon: Settings }
    ]
  };

  const navItems = navConfigs[role] || navConfigs.employee;

  return (
    <>
      {isOpen && <div className="sidebar-overlay" onClick={onClose} />}
      <aside className={`app-sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-role-indicator">
            <span className="role-pill">Workspace</span>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>
              {role === 'employee' && 'Employee Self-Service'}
              {role === 'technician' && 'Technician Workbench'}
              {role === 'it_manager' && 'IT Operations Center'}
              {role === 'asset_manager' && 'Asset Management'}
              {role === 'system_admin' && 'System Administration'}
            </span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <div className="sidebar-nav-group-title">Navigation</div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPath === item.id;
            return (
              <a
                key={item.id}
                className={`nav-item ${isActive ? 'active' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate(item.id);
                  if (onClose) onClose();
                }}
                href={`#${item.id}`}
              >
                <Icon size={17} style={item.isAi ? { color: 'var(--ai-purple)' } : undefined} />
                <span>{item.label}</span>
              </a>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11.5, color: 'var(--text-muted)' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--status-green-text)' }} />
            <span>ServiceDesk Online</span>
          </div>
        </div>
      </aside>
    </>
  );
};
