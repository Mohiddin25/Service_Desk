import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Input, Select } from '../ui/Input';
import { Button } from '../ui/Button';
import { userApi } from '../../api/userApi';

export const CreateUserModal = ({ isOpen, onClose, onUserCreated }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('employee');
  const [department, setDepartment] = useState('Human Resources');
  const [password, setPassword] = useState('Welcome2026!');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      setError('Please provide user name and company email.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await userApi.create({
        name: name.trim(),
        email: email.trim(),
        role,
        department,
        password
      });

      if (onUserCreated) onUserCreated();
      setName('');
      setEmail('');
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to create user account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create Staff / Employee Account"
      size="md"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit} loading={loading}>
            Create User
          </Button>
        </>
      }
    >
      {error && (
        <div style={{ padding: '8px 12px', background: 'var(--status-red-bg)', color: 'var(--status-red-text)', borderRadius: 'var(--radius-sm)', fontSize: 13, marginBottom: 14 }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <Input
          label="Full Name"
          required
          placeholder="e.g. Rachel Green"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <Input
          label="Company Email"
          required
          type="email"
          placeholder="e.g. rachel@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <div className="form-row">
          <Select
            label="Role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            options={[
              { value: 'employee', label: 'Employee' },
              { value: 'technician', label: 'Technician' },
              { value: 'it_manager', label: 'IT Manager' },
              { value: 'asset_manager', label: 'Asset Manager' },
              { value: 'system_admin', label: 'System Admin' }
            ]}
          />

          <Select
            label="Department"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            options={[
              { value: 'Human Resources', label: 'Human Resources' },
              { value: 'Product & Engineering', label: 'Product & Engineering' },
              { value: 'IT Infrastructure', label: 'IT Infrastructure' },
              { value: 'IT Operations', label: 'IT Operations' },
              { value: 'Finance', label: 'Finance' },
              { value: 'Legal & Compliance', label: 'Legal & Compliance' }
            ]}
          />
        </div>

        <Input
          label="Temporary Initial Password"
          type="text"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          helperText="User will be prompted to reset upon initial login"
        />
      </form>
    </Modal>
  );
};
