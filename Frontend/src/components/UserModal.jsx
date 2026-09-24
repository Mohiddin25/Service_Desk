import React, { useState } from 'react';
import { X, UserPlus } from 'lucide-react';
import { userApi } from '../api/userApi';
import { useToast } from '../context/ToastContext';

export const UserModal = ({ isOpen, onClose, onUserCreated }) => {
  const { addToast } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('employee');
  const [department, setDepartment] = useState('IT Operations');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    setIsSubmitting(true);
    try {
      const created = await userApi.create({ name, email, role, department });
      addToast("User successfully created.", "success");
      if (onUserCreated) onUserCreated(created);
      onClose();
      setName('');
      setEmail('');
    } catch (err) {
      addToast("Failed to create user.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '520px' }}>
        <div className="modal-header" style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: 'var(--radius)', background: 'var(--blue-light)', color: 'var(--blue)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <UserPlus size={16} />
            </div>
            <div>
              <h2 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text)' }}>Add User</h2>
              <p style={{ fontSize: '12.5px', color: 'var(--text-3)' }}>Create user account and assign role.</p>
            </div>
          </div>
          <button onClick={onClose} className="btn btn-ghost btn-sm" style={{ padding: '4px' }}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div className="form-group">
              <label className="form-label" style={{ fontSize: '12.5px', fontWeight: 600 }}>Full Name</label>
              <input 
                type="text" 
                className="input" 
                placeholder="e.g. Alex Miller"
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
                placeholder="name@company.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="form-group">
                <label className="form-label" style={{ fontSize: '12.5px', fontWeight: 600 }}>Role</label>
                <select className="select" value={role} onChange={e => setRole(e.target.value)}>
                  <option value="system_admin">System Admin</option>
                  <option value="it_manager">IT Manager</option>
                  <option value="technician">Technician</option>
                  <option value="asset_manager">Asset Manager</option>
                  <option value="employee">Employee</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" style={{ fontSize: '12.5px', fontWeight: 600 }}>Department</label>
                <select className="select" value={department} onChange={e => setDepartment(e.target.value)}>
                  <option value="IT Operations">IT Operations</option>
                  <option value="Product & Engineering">Product & Engineering</option>
                  <option value="Human Resources">Human Resources</option>
                  <option value="Finance & Operations">Finance & Operations</option>
                </select>
              </div>
            </div>
          </div>

          <div className="modal-footer" style={{ padding: '14px 20px', borderTop: '1px solid var(--border)' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              <span>{isSubmitting ? 'Creating...' : 'Add User'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
