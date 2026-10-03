import React from 'react';
import { TicketTable } from '../components/tickets/TicketTable';
import { Badge } from '../components/ui/Badge';
import { Clock, AlertTriangle, ShieldCheck } from 'lucide-react';

export const SlaMonitoringPage = ({ tickets = [], onSelectTicket }) => {
  const atRiskTickets = tickets.filter(t => t.slaStatus === 'at_risk' || (t.priority === 'high' && t.status !== 'resolved'));
  const breachedTickets = tickets.filter(t => t.slaStatus === 'breached' || (t.priority === 'critical' && t.status === 'assigned'));

  const slaPolicies = [
    { priority: 'P1 — Critical', responseTime: '30 Minutes', resolveTime: '2 Hours', escalation: 'Immediate Page to IT Manager' },
    { priority: 'P2 — High', responseTime: '1 Hour', resolveTime: '4 Hours', escalation: 'Lead Technician Review after 2h' },
    { priority: 'P3 — Medium', responseTime: '4 Hours', resolveTime: '24 Hours', escalation: 'Normal Queue Dispatch' },
    { priority: 'P4 — Low', responseTime: '8 Hours', resolveTime: '48 Hours', escalation: 'Self-Service / Tier 1 Dispatch' }
  ];

  return (
    <div className="view-container">
      <div className="view-header">
        <div className="view-header-title">
          <h1 className="page-title">SLA Monitoring & Policies</h1>
          <span className="metadata-text">Enforced service level commitments, response thresholds, and escalations</span>
        </div>
      </div>

      {/* SLA Policies Table */}
      <div className="card" style={{ marginBottom: 20, padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 className="section-title">Active SLA Enforcements</h2>
          <span className="badge badge-sla-on_track">Standard ITIL v4</span>
        </div>

        <table className="dense-table">
          <thead>
            <tr>
              <th>Priority Level</th>
              <th>Response SLA</th>
              <th>Resolution SLA</th>
              <th>Escalation Path</th>
            </tr>
          </thead>
          <tbody>
            {slaPolicies.map((p, i) => (
              <tr key={i}>
                <td style={{ fontWeight: 600 }}>{p.priority}</td>
                <td>{p.responseTime}</td>
                <td><span style={{ fontWeight: 500, color: 'var(--primary)' }}>{p.resolveTime}</span></td>
                <td className="text-secondary">{p.escalation}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* At-Risk & Breached Queues */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {/* At Risk Tickets */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Clock size={16} color="var(--status-amber-text)" />
              <h2 className="section-title">Approaching SLA Deadline (&lt; 1 Hour)</h2>
            </div>
            <span className="metadata-text">{atRiskTickets.length} tickets at risk</span>
          </div>

          <TicketTable
            tickets={atRiskTickets}
            onSelectTicket={onSelectTicket}
            emptyMessage="No tickets are currently approaching SLA breach window."
          />
        </div>

        {/* Breached Tickets */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <AlertTriangle size={16} color="var(--status-red-text)" />
              <h2 className="section-title">Breached Incidents</h2>
            </div>
            <span className="metadata-text">{breachedTickets.length} breached</span>
          </div>

          <TicketTable
            tickets={breachedTickets}
            onSelectTicket={onSelectTicket}
            emptyMessage="Zero breached tickets. SLA performance is 100% compliant."
          />
        </div>
      </div>
    </div>
  );
};
