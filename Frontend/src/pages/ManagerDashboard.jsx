import React from 'react';
import { TicketTable } from '../components/tickets/TicketTable';
import { Badge } from '../components/ui/Badge';
import { Table } from '../components/ui/Table';
import { AlertCircle, CheckCircle2, Clock, Users } from 'lucide-react';

export const ManagerDashboard = ({ tickets = [], onSelectTicket, onNavigate }) => {
  const openCount = tickets.filter(t => t.status === 'open' || t.status === 'assigned').length;
  const criticalCount = tickets.filter(t => t.priority === 'critical' && t.status !== 'resolved').length;
  const slaAtRisk = tickets.filter(t => t.slaStatus === 'at_risk' || (t.priority === 'high' && t.status !== 'resolved')).length;
  const slaBreached = tickets.filter(t => t.slaStatus === 'breached' || (t.priority === 'critical' && t.status === 'assigned')).length;
  const resolvedToday = tickets.filter(t => t.status === 'resolved').length;

  const escalations = tickets.filter(t => t.priority === 'critical' || t.slaStatus === 'breached').slice(0, 4);

  // Technician workload summary
  const techWorkload = [
    { name: 'Dave Tech', assigned: 3, resolved: 8, slaScore: '94%' },
    { name: 'Rahul Sharma', assigned: 2, resolved: 6, slaScore: '96%' },
    { name: 'Alex Tier-2', assigned: 1, resolved: 5, slaScore: '100%' }
  ];

  return (
    <div className="view-container">
      {/* Title */}
      <div className="view-header">
        <div className="view-header-title">
          <h1 className="page-title">IT Operations</h1>
          <span className="metadata-text">Enterprise Service Level Agreements & Operational Health</span>
        </div>
      </div>

      {/* Metrics: Open Tickets, Critical Tickets, SLA At Risk, SLA Breached, Resolved Today */}
      <div className="metrics-row">
        <div className="metric-card">
          <span className="metric-card-label">Open Tickets</span>
          <span className="metric-card-value" style={{ color: 'var(--primary)' }}>{openCount}</span>
          <span className="metric-card-sub">Active backlog</span>
        </div>

        <div className="metric-card">
          <span className="metric-card-label">Critical Tickets</span>
          <span className="metric-card-value" style={{ color: 'var(--status-red-text)' }}>{criticalCount}</span>
          <span className="metric-card-sub">Urgent P1 priority</span>
        </div>

        <div className="metric-card">
          <span className="metric-card-label">SLA At Risk</span>
          <span className="metric-card-value" style={{ color: 'var(--status-amber-text)' }}>{slaAtRisk}</span>
          <span className="metric-card-sub">&lt; 1 hr to breach</span>
        </div>

        <div className="metric-card">
          <span className="metric-card-label">SLA Breached</span>
          <span className="metric-card-value" style={{ color: 'var(--status-red-text)' }}>{slaBreached}</span>
          <span className="metric-card-sub">Exceeded target window</span>
        </div>

        <div className="metric-card">
          <span className="metric-card-label">Resolved Today</span>
          <span className="metric-card-value" style={{ color: 'var(--status-green-text)' }}>{resolvedToday}</span>
          <span className="metric-card-sub">Completed incidents</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
        {/* SLA Overview */}
        <div className="card">
          <div className="card-header">
            <h2 className="section-title">SLA Overview</h2>
            <Badge type="sla" value="on_track" label="95.2% Compliance" />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 6 }}>
                <span>P1 Critical Response (Target: 30m)</span>
                <span style={{ fontWeight: 600, color: 'var(--status-amber-text)' }}>88% Met</span>
              </div>
              <div style={{ height: 6, background: '#ebecf0', borderRadius: 3, overflow: 'hidden' }}>
                <div style={{ width: '88%', height: '100%', background: 'var(--status-amber-text)' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 6 }}>
                <span>P2 High Resolution (Target: 4h)</span>
                <span style={{ fontWeight: 600, color: 'var(--status-green-text)' }}>94% Met</span>
              </div>
              <div style={{ height: 6, background: '#ebecf0', borderRadius: 3, overflow: 'hidden' }}>
                <div style={{ width: '94%', height: '100%', background: 'var(--status-green-text)' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 6 }}>
                <span>P3 Normal Resolution (Target: 24h)</span>
                <span style={{ fontWeight: 600, color: 'var(--status-green-text)' }}>98% Met</span>
              </div>
              <div style={{ height: 6, background: '#ebecf0', borderRadius: 3, overflow: 'hidden' }}>
                <div style={{ width: '98%', height: '100%', background: 'var(--status-green-text)' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Technician Workload */}
        <div className="card">
          <div className="card-header">
            <h2 className="section-title">Technician Workload</h2>
            <span className="metadata-text">Active team capacity</span>
          </div>

          <table className="dense-table">
            <thead>
              <tr>
                <th>Technician</th>
                <th>Active</th>
                <th>Resolved</th>
                <th>SLA Score</th>
              </tr>
            </thead>
            <tbody>
              {techWorkload.map((t, idx) => (
                <tr key={idx}>
                  <td style={{ fontWeight: 500 }}>{t.name}</td>
                  <td><span style={{ fontWeight: 600, color: 'var(--primary)' }}>{t.assigned}</span></td>
                  <td>{t.resolved}</td>
                  <td><span style={{ color: 'var(--status-green-text)', fontWeight: 600 }}>{t.slaScore}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Escalations */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <AlertCircle size={16} color="var(--status-red-text)" />
            <h2 className="section-title">Recent Escalations</h2>
          </div>
          <span className="metadata-text">Critical and SLA-breached tickets requiring manager attention</span>
        </div>

        <TicketTable
          tickets={escalations}
          onSelectTicket={onSelectTicket}
          emptyMessage="No escalated tickets at this time."
        />
      </div>
    </div>
  );
};
