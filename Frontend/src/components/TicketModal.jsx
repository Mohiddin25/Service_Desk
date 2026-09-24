import React, { useState } from 'react';
import { X, Plus, Ticket } from 'lucide-react';
import { api } from '../api/client';
import { useToast } from '../context/ToastContext';

export const TicketModal = ({ isOpen, onClose, onTicketCreated }) => {
  const { addToast } = useToast();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('software');
  const [priority, setPriority] = useState('medium');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;
    setIsSubmitting(true);
    try {
      const created = await api.tickets.create({
        title,
        description,
        category,
        priority
      });
      addToast("Ticket successfully created.", "success");
      if (onTicketCreated) onTicketCreated(created);
      onClose();
      setTitle('');
      setDescription('');
    } catch (e) {
      addToast("Failed to create ticket.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '560px' }}>
        <div className="modal-header" style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: 'var(--radius)', background: 'var(--blue-light)', color: 'var(--blue)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Ticket size={16} />
            </div>
            <div>
              <h2 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text)' }}>Create Ticket</h2>
              <p style={{ fontSize: '12.5px', color: 'var(--text-3)' }}>Submit a new support request.</p>
            </div>
          </div>
          <button onClick={onClose} className="btn btn-ghost btn-sm" style={{ padding: '4px' }}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div className="form-group">
              <label className="form-label" style={{ fontSize: '12.5px', fontWeight: 600 }}>Subject</label>
              <input 
                type="text" 
                className="input" 
                placeholder="Brief summary of the issue..."
                value={title}
                onChange={e => setTitle(e.target.value)}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="form-group">
                <label className="form-label" style={{ fontSize: '12.5px', fontWeight: 600 }}>Category</label>
                <select className="select" value={category} onChange={e => setCategory(e.target.value)}>
                  <option value="network">Network & Wi-Fi</option>
                  <option value="software">Software & Apps</option>
                  <option value="hardware">Hardware & Displays</option>
                  <option value="account">Account & Access</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" style={{ fontSize: '12.5px', fontWeight: 600 }}>Priority</label>
                <select className="select" value={priority} onChange={e => setPriority(e.target.value)}>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" style={{ fontSize: '12.5px', fontWeight: 600 }}>Description</label>
              <textarea 
                className="textarea" 
                placeholder="Details of the issue or steps to reproduce..."
                rows={4}
                value={description}
                onChange={e => setDescription(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="modal-footer" style={{ padding: '14px 20px', borderTop: '1px solid var(--border)' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              <span>{isSubmitting ? 'Submitting...' : 'Create Ticket'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
