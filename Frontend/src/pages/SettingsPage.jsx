import React, { useState } from 'react';
import { Button } from '../components/ui/Button';
import { Input, Select } from '../components/ui/Input';
import { ShieldCheck, Mail, Database, Bell } from 'lucide-react';

export const SettingsPage = () => {
  const [companyName, setCompanyName] = useState('Acme Corporation');
  const [supportEmail, setSupportEmail] = useState('servicedesk@company.com');
  const [defaultSla, setDefaultSla] = useState('24h');
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="view-container" style={{ maxWidth: 800 }}>
      <div className="view-header">
        <div className="view-header-title">
          <h1 className="page-title">ServiceDesk Settings</h1>
          <span className="metadata-text">System environment configurations, notification triggers, and IT policies</span>
        </div>
      </div>

      {saved && (
        <div style={{ padding: '10px 14px', background: 'var(--status-green-bg)', color: 'var(--status-green-text)', border: '1px solid var(--status-green-border)', borderRadius: 'var(--radius-sm)', fontSize: 13, marginBottom: 16 }}>
          Settings updated successfully.
        </div>
      )}

      <form onSubmit={handleSave}>
        <div className="card" style={{ marginBottom: 20 }}>
          <h2 className="section-title" style={{ marginBottom: 14 }}>Organization Profile</h2>
          <div className="form-row">
            <Input
              label="Organization Name"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
            />
            <Input
              label="IT Support Email"
              type="email"
              value={supportEmail}
              onChange={(e) => setSupportEmail(e.target.value)}
            />
          </div>
        </div>

        <div className="card" style={{ marginBottom: 20 }}>
          <h2 className="section-title" style={{ marginBottom: 14 }}>Default SLA & Dispatch Rules</h2>
          <div className="form-row">
            <Select
              label="Default Incident SLA Window"
              value={defaultSla}
              onChange={(e) => setDefaultSla(e.target.value)}
              options={[
                { value: '4h', label: '4 Hours (Aggressive)' },
                { value: '12h', label: '12 Hours (Fast)' },
                { value: '24h', label: '24 Hours (Standard ITIL)' },
                { value: '48h', label: '48 Hours (Relaxed)' }
              ]}
            />
            <Select
              label="Auto-Assign Open Tickets"
              options={[
                { value: 'round_robin', label: 'Round-Robin by Technician Load' },
                { value: 'category', label: 'Category Specialist Routing' },
                { value: 'manual', label: 'Manual Dispatch (Manager / Tech Pick)' }
              ]}
            />
          </div>
        </div>

        <div className="card" style={{ marginBottom: 24 }}>
          <h2 className="section-title" style={{ marginBottom: 14 }}>Notification Preferences</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: 13.5 }}>
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={(e) => setEmailAlerts(e.target.checked)}
              />
              <span>Send automated email dispatch when ticket is assigned to a technician</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: 13.5 }}>
              <input type="checkbox" defaultChecked />
              <span>Broadcast high-priority alerts when a P1 ticket breaches 50% of SLA time</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: 13.5 }}>
              <input type="checkbox" defaultChecked />
              <span>Notify employees when their ticket status changes to Resolved</span>
            </label>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
          <Button type="submit" variant="primary">
            Save Preferences
          </Button>
        </div>
      </form>
    </div>
  );
};
