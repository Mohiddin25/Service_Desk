import React, { useState, useEffect } from 'react';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { Input, Select, Textarea } from '../ui/Input';
import { Button } from '../ui/Button';
import { ticketApi } from '../../api/ticketApi';
import { assetApi } from '../../api/assetApi';
import { useAuth } from '../../context/AuthContext';

export const CreateTicketForm = ({ onTicketCreated, onNavigate }) => {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('network');
  const [priority, setPriority] = useState('medium');
  const [assetId, setAssetId] = useState('');
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [createdTicket, setCreatedTicket] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    loadAssets();
  }, []);

  const loadAssets = async () => {
    try {
      const data = await assetApi.getMyAssets();
      setAssets(data || []);
    } catch (e) {
      setAssets([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      setError('Please provide a ticket summary and detailed description.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await ticketApi.create({
        title: title.trim(),
        description: description.trim(),
        category,
        priority,
        assetId: assetId || undefined,
        currentUser: user
      });

      setCreatedTicket(result);
      if (onTicketCreated) onTicketCreated(result);
    } catch (err) {
      setError(err.message || 'Failed to create ticket');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setTitle('');
    setDescription('');
    setCategory('network');
    setPriority('medium');
    setAssetId('');
    setCreatedTicket(null);
    setError('');
  };

  if (createdTicket) {
    return (
      <div className="card" style={{ maxWidth: 640, margin: '0 auto', textAlign: 'center', padding: '40px 24px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 56, height: 56, borderRadius: '50%', background: 'var(--status-green-bg)', color: 'var(--status-green-text)', marginBottom: 16 }}>
          <CheckCircle2 size={32} />
        </div>
        <h2 style={{ fontSize: 20, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 6 }}>
          Ticket created successfully
        </h2>
        <div style={{ display: 'inline-block', padding: '6px 14px', background: '#fafbfc', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', fontFamily: 'monospace', fontSize: 16, fontWeight: 700, color: 'var(--primary)', margin: '12px 0 20px 0' }}>
          {createdTicket.ticketNumber}
        </div>
        <p style={{ fontSize: 14, color: 'var(--text-secondary)', maxWidth: 440, margin: '0 auto 24px auto' }}>
          "{createdTicket.title}" has been submitted to IT Service Desk. An IT technician will be assigned according to your SLA priority.
        </p>

        <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
          <Button variant="secondary" onClick={handleReset}>
            Create Another Ticket
          </Button>
          <Button
            variant="primary"
            onClick={() => onNavigate ? onNavigate('/my-tickets') : (window.location.hash = '#/my-tickets')}
          >
            View My Tickets
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="card" style={{ maxWidth: 680, margin: '0 auto' }}>
      <div className="card-header">
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 600 }}>Create Ticket</h2>
          <span className="metadata-text">Submit an IT support request to the ServiceDesk team</span>
        </div>
      </div>

      {error && (
        <div style={{ padding: '10px 14px', background: 'var(--status-red-bg)', color: 'var(--status-red-text)', border: '1px solid var(--status-red-border)', borderRadius: 'var(--radius-sm)', fontSize: 13, marginBottom: 16 }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <Input
          label="Summary"
          required
          placeholder="Brief summary of the issue (e.g. Wi-Fi connection problem on 4th floor)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <Textarea
          label="Description"
          required
          rows={5}
          placeholder="Provide detailed steps to reproduce, error codes, and symptoms..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <div className="form-row">
          <Select
            label="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            options={[
              { value: 'network', label: 'Network' },
              { value: 'hardware', label: 'Hardware' },
              { value: 'software', label: 'Software' },
              { value: 'account_access', label: 'Account / Access' },
              { value: 'security', label: 'Security' },
              { value: 'other', label: 'Other' }
            ]}
          />

          <Select
            label="Priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            options={[
              { value: 'low', label: 'Low — General question / minor request' },
              { value: 'medium', label: 'Medium — Normal business impact' },
              { value: 'high', label: 'High — Significant loss of functionality' },
              { value: 'critical', label: 'Critical — Complete outage / blocker' }
            ]}
          />
        </div>

        <Select
          label="Related Asset"
          value={assetId}
          onChange={(e) => setAssetId(e.target.value)}
          options={[
            { value: '', label: 'Select asset (Optional)' },
            ...assets.map(a => ({
              value: a._id,
              label: `${a.assetTag} — ${a.name}`
            }))
          ]}
        />

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 24, paddingTop: 16, borderTop: '1px solid var(--border-subtle)' }}>
          <Button
            type="button"
            variant="secondary"
            onClick={() => onNavigate ? onNavigate('/dashboard') : (window.location.hash = '#/dashboard')}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            loading={loading}
          >
            Create Ticket
          </Button>
        </div>
      </form>
    </div>
  );
};
