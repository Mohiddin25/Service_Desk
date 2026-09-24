import React, { useState } from 'react';
import { X, Cpu } from 'lucide-react';
import { api } from '../api/client';
import { useToast } from '../context/ToastContext';

export const AssetModal = ({ isOpen, onClose, onAssetCreated }) => {
  const { addToast } = useToast();
  const [name, setName] = useState('');
  const [type, setType] = useState('Laptop');
  const [serialNumber, setSerialNumber] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [status, setStatus] = useState('Available');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !serialNumber.trim()) return;
    setIsSubmitting(true);
    try {
      const created = await api.assets.create({
        name,
        type,
        serialNumber,
        assignedTo: assignedTo.trim() || 'Unassigned',
        status,
        vendor: 'Corporate IT',
        purchaseDate: new Date().toISOString().slice(0, 10),
        warranty: '3 Years'
      });
      addToast("Asset registered successfully.", "success");
      if (onAssetCreated) onAssetCreated(created);
      onClose();
      setName('');
      setSerialNumber('');
      setAssignedTo('');
    } catch (e) {
      addToast("Failed to register asset.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '540px' }}>
        <div className="modal-header" style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: 'var(--radius)', background: 'var(--blue-light)', color: 'var(--blue)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Cpu size={16} />
            </div>
            <div>
              <h2 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text)' }}>Add Asset</h2>
              <p style={{ fontSize: '12.5px', color: 'var(--text-3)' }}>Register hardware or software license.</p>
            </div>
          </div>
          <button onClick={onClose} className="btn btn-ghost btn-sm" style={{ padding: '4px' }}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div className="form-group">
              <label className="form-label" style={{ fontSize: '12.5px', fontWeight: 600 }}>Asset Name</label>
              <input 
                type="text" 
                className="input" 
                placeholder="e.g. ThinkPad T14 or Dell 27' Monitor"
                value={name}
                onChange={e => setName(e.target.value)}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="form-group">
                <label className="form-label" style={{ fontSize: '12.5px', fontWeight: 600 }}>Asset Type</label>
                <select className="select" value={type} onChange={e => setType(e.target.value)}>
                  <option value="Laptop">Laptop</option>
                  <option value="Desktop">Desktop</option>
                  <option value="Monitor">Monitor</option>
                  <option value="Printer">Printer</option>
                  <option value="Network Device">Network Device</option>
                  <option value="Software License">Software License</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" style={{ fontSize: '12.5px', fontWeight: 600 }}>Status</label>
                <select className="select" value={status} onChange={e => setStatus(e.target.value)}>
                  <option value="Available">Available</option>
                  <option value="Assigned">Assigned</option>
                  <option value="Maintenance">Maintenance</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="form-group">
                <label className="form-label" style={{ fontSize: '12.5px', fontWeight: 600 }}>Serial Number</label>
                <input 
                  type="text" 
                  className="input" 
                  placeholder="e.g. SN-8921-X"
                  value={serialNumber}
                  onChange={e => setSerialNumber(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" style={{ fontSize: '12.5px', fontWeight: 600 }}>Assigned To</label>
                <input 
                  type="text" 
                  className="input" 
                  placeholder="Employee name or Dept"
                  value={assignedTo}
                  onChange={e => setAssignedTo(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="modal-footer" style={{ padding: '14px 20px', borderTop: '1px solid var(--border)' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              <span>{isSubmitting ? 'Saving...' : 'Add Asset'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
