import React from 'react';
import { Badge } from '../ui/Badge';
import { Table } from '../ui/Table';
import { Button } from '../ui/Button';

export const UserTable = ({ users = [], onToggleStatus, onUpdateRole, emptyMessage = 'No users found' }) => {
  const roleLabels = {
    employee: 'Employee',
    technician: 'Technician',
    it_manager: 'IT Manager',
    asset_manager: 'Asset Manager',
    system_admin: 'System Admin'
  };

  const columns = [
    {
      header: 'Name',
      key: 'name',
      render: (u) => (
        <div>
          <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{u.name}</span>
        </div>
      )
    },
    {
      header: 'Email',
      key: 'email',
      render: (u) => <span className="metadata-text">{u.email}</span>
    },
    {
      header: 'Role',
      key: 'role',
      width: '140px',
      render: (u) => (
        <span style={{ fontSize: 12.5, fontWeight: 500, padding: '2px 8px', background: '#fafbfc', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)' }}>
          {roleLabels[u.role] || u.role}
        </span>
      )
    },
    {
      header: 'Department',
      key: 'department',
      render: (u) => (
        <span style={{ color: 'var(--text-secondary)' }}>
          {u.department?.name || u.department || 'General'}
        </span>
      )
    },
    {
      header: 'Status',
      key: 'status',
      width: '110px',
      render: (u) => {
        const isActive = u.status === 'active' || u.isActive !== false;
        return (
          <Badge
            type="status"
            value={isActive ? 'resolved' : 'closed'}
            label={isActive ? 'Active' : 'Deactivated'}
          />
        );
      }
    },
    {
      header: 'Actions',
      key: 'actions',
      width: '130px',
      align: 'right',
      render: (u) => {
        const isActive = u.status === 'active' || u.isActive !== false;
        return (
          <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
            <Button
              variant={isActive ? 'subtle' : 'secondary'}
              size="sm"
              onClick={() => onToggleStatus && onToggleStatus(u._id)}
            >
              {isActive ? 'Deactivate' : 'Activate'}
            </Button>
          </div>
        );
      }
    }
  ];

  return (
    <Table
      columns={columns}
      data={users}
      emptyMessage={emptyMessage}
    />
  );
};
