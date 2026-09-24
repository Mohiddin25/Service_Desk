import React, { useState, useEffect } from 'react';
import { UserPlus, Search } from 'lucide-react';
import { userApi } from '../api/userApi';
import { useToast } from '../context/ToastContext';

export const UserManagementView = ({ onOpenUserModal }) => {
  const { addToast } = useToast();
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const data = await userApi.getAll();
      setUsers(data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      await userApi.toggleStatus(id);
      addToast(`User status set to ${currentStatus === 'Active' ? 'Inactive' : 'Active'}.`, "info");
      loadUsers();
    } catch (err) {
      addToast("Failed to change user status.", "error");
    }
  };

  const handleRoleChange = async (id, newRole) => {
    try {
      await userApi.updateRole(id, newRole);
      addToast("User role updated.", "success");
      loadUsers();
    } catch (err) {
      addToast("Failed to update role.", "error");
    }
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = 
      (u.name && u.name.toLowerCase().includes(searchTerm.toLowerCase())) || 
      (u.email && u.email.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesRole = roleFilter ? u.role === roleFilter : true;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="content-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text)' }}>Users</h1>
          <p style={{ fontSize: '13px', color: 'var(--text-2)' }}>Manage staff permissions and account access.</p>
        </div>
        <button className="btn btn-primary" onClick={onOpenUserModal}>
          <UserPlus size={16} />
          <span>+ Add User</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="card" style={{ padding: '12px 14px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
          <Search size={15} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-3)' }} />
          <input 
            type="text" 
            className="input" 
            placeholder="Search users..." 
            style={{ paddingLeft: '32px', height: '34px', fontSize: '13px' }}
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>

        <select 
          className="select" 
          style={{ width: '160px', height: '34px', fontSize: '13px' }}
          value={roleFilter} 
          onChange={e => setRoleFilter(e.target.value)}
        >
          <option value="">All Roles</option>
          <option value="system_admin">System Admin</option>
          <option value="it_manager">IT Manager</option>
          <option value="technician">Technician</option>
          <option value="asset_manager">Asset Manager</option>
          <option value="employee">Employee</option>
        </select>
      </div>

      {/* Users Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-container" style={{ border: 'none' }}>
          <table className="table">
            <thead>
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Role</th>
                <th>Department</th>
                <th>Status</th>
                <th style={{ width: '130px' }}>Role Action</th>
                <th style={{ width: '90px', textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '32px', color: 'var(--text-3)' }}>
                    No users found.
                  </td>
                </tr>
              ) : (
                filteredUsers.map(u => (
                  <tr key={u.id}>
                    <td style={{ fontWeight: 600, color: 'var(--text)' }}>{u.name}</td>
                    <td style={{ color: 'var(--text-2)' }}>{u.email}</td>
                    <td>
                      <span className={`badge ${
                        u.role === 'system_admin' ? 'badge-critical' :
                        u.role === 'it_manager' ? 'badge-in_progress' :
                        u.role === 'technician' ? 'badge-assigned' : 'badge-open'
                      }`}>
                        {u.role.replace('_', ' ')}
                      </span>
                    </td>
                    <td style={{ color: 'var(--text-2)' }}>{u.department || 'IT'}</td>
                    <td>
                      <span className={`badge ${u.status === 'Active' ? 'badge-resolved' : 'badge-closed'}`}>
                        {u.status}
                      </span>
                    </td>
                    <td>
                      <select 
                        className="select" 
                        style={{ fontSize: '12px', padding: '2px 6px', height: '28px' }}
                        value={u.role}
                        onChange={e => handleRoleChange(u.id, e.target.value)}
                      >
                        <option value="system_admin">System Admin</option>
                        <option value="it_manager">IT Manager</option>
                        <option value="technician">Technician</option>
                        <option value="asset_manager">Asset Manager</option>
                        <option value="employee">Employee</option>
                      </select>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button 
                        className={`btn btn-sm ${u.status === 'Active' ? 'btn-ghost' : 'btn-secondary'}`}
                        style={{ fontSize: '11.5px', padding: '3px 8px', color: u.status === 'Active' ? 'var(--danger)' : 'var(--text)' }}
                        onClick={() => handleToggleStatus(u.id, u.status)}
                      >
                        {u.status === 'Active' ? 'Deactivate' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
