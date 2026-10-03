import React, { useState, useEffect } from 'react';
import { UserTable } from '../components/users/UserTable';
import { CreateUserModal } from '../components/users/CreateUserModal';
import { Button } from '../components/ui/Button';
import { userApi } from '../api/userApi';
import { Plus, Users, Ticket, Laptop, AlertTriangle, ShieldCheck, Activity } from 'lucide-react';

export const AdminDashboard = ({ tickets = [], assets = [] }) => {
  const [users, setUsers] = useState([]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await userApi.getAll();
      setUsers(data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (id) => {
    await userApi.toggleStatus(id);
    loadUsers();
  };

  const slaIssuesCount = tickets.filter(t => t.slaStatus === 'breached' || t.slaStatus === 'at_risk').length;

  return (
    <div className="view-container">
      {/* Title */}
      <div className="view-header">
        <div className="view-header-title">
          <h1 className="page-title">System Overview</h1>
          <span className="metadata-text">Enterprise system administration, role directory, and operational integrity</span>
        </div>
        <div className="view-header-actions">
          <Button
            variant="primary"
            icon={Plus}
            onClick={() => setIsCreateOpen(true)}
          >
            Create User Account
          </Button>
        </div>
      </div>

      {/* Metrics: Users, Tickets, Assets, SLA Issues */}
      <div className="metrics-row">
        <div className="metric-card">
          <span className="metric-card-label">Active Users</span>
          <span className="metric-card-value" style={{ color: 'var(--primary)' }}>{users.length}</span>
          <span className="metric-card-sub">Staff & employees</span>
        </div>

        <div className="metric-card">
          <span className="metric-card-label">Tickets</span>
          <span className="metric-card-value" style={{ color: 'var(--text-primary)' }}>{tickets.length}</span>
          <span className="metric-card-sub">Total recorded</span>
        </div>

        <div className="metric-card">
          <span className="metric-card-label">Hardware Assets</span>
          <span className="metric-card-value" style={{ color: 'var(--text-primary)' }}>{assets.length}</span>
          <span className="metric-card-sub">In inventory / deployed</span>
        </div>

        <div className="metric-card">
          <span className="metric-card-label">SLA Issues</span>
          <span className="metric-card-value" style={{ color: 'var(--status-red-text)' }}>{slaIssuesCount}</span>
          <span className="metric-card-sub">At risk or breached</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(280px, 1fr)', gap: 20 }}>
        {/* User Management Table */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h2 className="section-title">Directory & User Accounts</h2>
            <span className="metadata-text">Internal company accounts only</span>
          </div>

          <UserTable
            users={users}
            onToggleStatus={handleToggleStatus}
          />
        </div>

        {/* Recent Activity */}
        <div className="card">
          <div className="card-header">
            <h2 className="section-title">Recent Activity</h2>
            <Activity size={16} color="var(--text-muted)" />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, fontSize: 13 }}>
            <div style={{ padding: '8px 10px', background: '#fafbfc', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)' }}>
              <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>User Created</div>
              <div style={{ color: 'var(--text-secondary)' }}>Sarah Jenkins account provisioned for Human Resources</div>
              <div className="metadata-text" style={{ marginTop: 2 }}>1 hour ago</div>
            </div>

            <div style={{ padding: '8px 10px', background: '#fafbfc', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)' }}>
              <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Role Updated</div>
              <div style={{ color: 'var(--text-secondary)' }}>Dave Tech granted technician access permissions</div>
              <div className="metadata-text" style={{ marginTop: 2 }}>3 hours ago</div>
            </div>

            <div style={{ padding: '8px 10px', background: '#fafbfc', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)' }}>
              <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>SLA Policy Verified</div>
              <div style={{ color: 'var(--text-secondary)' }}>P1 critical SLA target verified across 4 incidents</div>
              <div className="metadata-text" style={{ marginTop: 2 }}>Yesterday</div>
            </div>

            <div style={{ padding: '8px 10px', background: '#fafbfc', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)' }}>
              <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Asset Reassigned</div>
              <div style={{ color: 'var(--text-secondary)' }}>AST-001 assigned to Mohiddin</div>
              <div className="metadata-text" style={{ marginTop: 2 }}>2 days ago</div>
            </div>
          </div>
        </div>
      </div>

      <CreateUserModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onUserCreated={loadUsers}
      />
    </div>
  );
};
