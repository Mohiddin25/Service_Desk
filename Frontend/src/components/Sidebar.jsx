import React from 'react';
import { 
  LayoutDashboard, Bot, Ticket, BookOpen, Cpu, Bell, 
  BarChart3, Settings, Headphones, PlusCircle, CheckSquare,
  ShieldAlert, Users, Wrench, Building2, ShieldCheck, FileText, UserCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Sidebar = ({ activeTab, setActiveTab, isOpen, onNewTicketClick }) => {
  const { user } = useAuth();
  const role = user?.role || 'employee';

  const getRoleMenuItems = () => {
    switch (role) {
      case 'employee':
        return [
          { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { id: 'my_tickets', label: 'My Tickets', icon: Ticket },
          { id: 'create_ticket', label: 'Create Ticket', icon: PlusCircle, isAction: true },
          { id: 'ai_assistant', label: 'AI Assistant', icon: Bot },
          { id: 'kb', label: 'Knowledge Base', icon: BookOpen },
          { id: 'my_assets', label: 'My Assets', icon: Cpu },
          { id: 'notifications', label: 'Notifications', icon: Bell },
        ];

      case 'technician':
        return [
          { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { id: 'assigned_tickets', label: 'Assigned Tickets', icon: CheckSquare },
          { id: 'tickets', label: 'All Tickets', icon: Ticket },
          { id: 'ai_assistant', label: 'AI Assistant', icon: Bot },
          { id: 'kb', label: 'Knowledge Base', icon: BookOpen },
          { id: 'assets', label: 'Assets', icon: Cpu },
          { id: 'notifications', label: 'Notifications', icon: Bell },
        ];

      case 'it_manager':
        return [
          { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { id: 'tickets', label: 'Tickets', icon: Ticket },
          { id: 'sla_monitoring', label: 'SLA Monitoring', icon: ShieldAlert },
          { id: 'kb', label: 'Knowledge Base', icon: BookOpen },
          { id: 'reports', label: 'Reports', icon: BarChart3 },
          { id: 'technicians', label: 'Technicians', icon: Users },
          { id: 'notifications', label: 'Notifications', icon: Bell },
        ];

      case 'asset_manager':
        return [
          { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { id: 'assets', label: 'Assets', icon: Cpu },
          { id: 'assignments', label: 'Assignments', icon: UserCheck },
          { id: 'maintenance', label: 'Maintenance', icon: Wrench },
          { id: 'vendors', label: 'Vendors', icon: Building2 },
          { id: 'reports', label: 'Reports', icon: BarChart3 },
          { id: 'notifications', label: 'Notifications', icon: Bell },
        ];

      case 'system_admin':
      default:
        return [
          { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { id: 'users', label: 'Users', icon: Users },
          { id: 'tickets', label: 'Tickets', icon: Ticket },
          { id: 'assets', label: 'Assets', icon: Cpu },
          { id: 'kb', label: 'Knowledge Base', icon: BookOpen },
          { id: 'sla_policies', label: 'SLA Policies', icon: ShieldCheck },
          { id: 'audit_logs', label: 'Audit Logs', icon: FileText },
          { id: 'reports', label: 'Reports', icon: BarChart3 },
          { id: 'settings', label: 'Settings', icon: Settings },
        ];
    }
  };

  const menuItems = getRoleMenuItems();

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
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      {/* Brand Header */}
      <div className="sidebar-brand">
        <div className="sidebar-brand-icon">
          <Headphones size={17} color="#ffffff" />
        </div>
        <span className="sidebar-brand-name">ServiceDesk Pro</span>
      </div>

      {/* Role-Specific Navigation */}
      <nav className="sidebar-nav">
        {menuItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              className={`nav-item ${isActive ? 'active' : ''}`}
              onClick={() => {
                if (item.isAction && onNewTicketClick) {
                  onNewTicketClick();
                } else {
                  setActiveTab(item.id);
                }
              }}
            >
              <Icon size={16} />
              <span>{item.label}</span>
            </button>
          );
        })}

        {role !== 'system_admin' && (
          <>
            <div className="nav-divider" />
            <button
              className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
              onClick={() => setActiveTab('settings')}
            >
              <Settings size={16} />
              <span>Settings</span>
            </button>
          </>
        )}
      </nav>

      {/* User Info Footer */}
      <div className="sidebar-footer">
        <div 
          className="sidebar-user" 
          onClick={() => setActiveTab('profile')}
          title="View profile"
        >
          <div className="avatar">
            {user?.name ? user.name.slice(0, 2).toUpperCase() : 'US'}
          </div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {user?.name || 'User'}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-3)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {formatRole(user?.role)}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
