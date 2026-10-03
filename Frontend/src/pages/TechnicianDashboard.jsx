import React, { useState } from 'react';
import { TicketTable } from '../components/tickets/TicketTable';
import { Input, Select } from '../components/ui/Input';
import { Search } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const TechnicianDashboard = ({ tickets = [], onSelectTicket }) => {
  const { user } = useAuth();
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [search, setSearch] = useState('');

  // Tickets assigned to this technician (or all tech tickets)
  const assignedToMe = tickets.filter(t => t.assignedTo && (t.assignedTo._id === user?._id || t.assignedTo.name === user?.name || user?.role === 'technician'));
  const inProgress = assignedToMe.filter(t => t.status === 'in_progress');
  const critical = assignedToMe.filter(t => t.priority === 'critical');
  const slaAtRisk = assignedToMe.filter(t => t.slaStatus === 'at_risk' || (t.priority === 'high' && t.status !== 'resolved'));

  let filtered = [...assignedToMe];
  if (filterPriority !== 'all') {
    filtered = filtered.filter(t => t.priority === filterPriority);
  }
  if (filterStatus !== 'all') {
    filtered = filtered.filter(t => t.status === filterStatus);
  }
  if (search) {
    const s = search.toLowerCase();
    filtered = filtered.filter(t =>
      t.ticketNumber.toLowerCase().includes(s) ||
      t.title.toLowerCase().includes(s)
    );
  }

  return (
    <div className="view-container">
      {/* Title */}
      <div className="view-header">
        <div className="view-header-title">
          <h1 className="page-title">Technician Workbench</h1>
          <span className="metadata-text">Active queue and incident tickets requiring resolution</span>
        </div>
      </div>

      {/* Metrics: Assigned to Me, In Progress, Critical, SLA At Risk */}
      <div className="metrics-row">
        <div className="metric-card">
          <span className="metric-card-label">Assigned to Me</span>
          <span className="metric-card-value" style={{ color: 'var(--primary)' }}>
            {assignedToMe.length}
          </span>
          <span className="metric-card-sub">Total queue workload</span>
        </div>

        <div className="metric-card">
          <span className="metric-card-label">In Progress</span>
          <span className="metric-card-value" style={{ color: 'var(--status-amber-text)' }}>
            {inProgress.length}
          </span>
          <span className="metric-card-sub">Under active diagnostic</span>
        </div>

        <div className="metric-card">
          <span className="metric-card-label">Critical</span>
          <span className="metric-card-value" style={{ color: 'var(--status-red-text)' }}>
            {critical.length}
          </span>
          <span className="metric-card-sub">Priority 1 blockers</span>
        </div>

        <div className="metric-card">
          <span className="metric-card-label">SLA At Risk</span>
          <span className="metric-card-value" style={{ color: 'var(--status-amber-text)' }}>
            {slaAtRisk.length}
          </span>
          <span className="metric-card-sub">&lt; 1 hour deadline</span>
        </div>
      </div>

      {/* Main Section: My Assigned Tickets */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <h2 className="section-title">My Assigned Tickets</h2>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', width: 220 }}>
              <Search size={14} style={{ position: 'absolute', left: 8, top: 9, color: 'var(--text-muted)' }} />
              <input
                type="text"
                placeholder="Filter queue..."
                className="form-control"
                style={{ paddingLeft: 28, height: 30, fontSize: 13 }}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <Select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              style={{ width: 110, height: 30, fontSize: 12.5 }}
              options={[
                { value: 'all', label: 'All Priority' },
                { value: 'critical', label: 'Critical' },
                { value: 'high', label: 'High' },
                { value: 'medium', label: 'Medium' },
                { value: 'low', label: 'Low' }
              ]}
            />

            <Select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              style={{ width: 110, height: 30, fontSize: 12.5 }}
              options={[
                { value: 'all', label: 'All Status' },
                { value: 'open', label: 'Open' },
                { value: 'assigned', label: 'Assigned' },
                { value: 'in_progress', label: 'In Progress' },
                { value: 'resolved', label: 'Resolved' }
              ]}
            />
          </div>
        </div>

        <TicketTable
          tickets={filtered}
          onSelectTicket={onSelectTicket}
          emptyMessage="No assigned tickets in your workbench."
        />
      </div>
    </div>
  );
};
