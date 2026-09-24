import React from 'react';
import { Clock, AlertTriangle, User, ArrowRight, Laptop, Wifi, ShieldAlert, Cpu } from 'lucide-react';

export const TicketCard = ({ ticket, onClick }) => {
  const getPriorityBadgeClass = (prio) => {
    switch (prio) {
      case 'critical': return 'badge-critical';
      case 'high': return 'badge-high';
      case 'medium': return 'badge-medium';
      case 'low': return 'badge-low';
      default: return 'badge-low';
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'open': return 'badge-open';
      case 'assigned': return 'badge-assigned';
      case 'in_progress': return 'badge-in_progress';
      case 'resolved': return 'badge-resolved';
      case 'closed': return 'badge-closed';
      default: return 'badge-open';
    }
  };

  const getCategoryIcon = (cat) => {
    switch (cat) {
      case 'hardware': return Laptop;
      case 'network': return Wifi;
      case 'software': return Cpu;
      default: return ShieldAlert;
    }
  };

  const CategoryIcon = getCategoryIcon(ticket.category);

  return (
    <div className="card card-interactive" onClick={onClick} style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '14px', background: 'var(--bg-card)' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.775rem', fontFamily: 'monospace', fontWeight: 700, color: 'var(--accent-cyan)' }}>
            {ticket.ticketNumber}
          </span>
          <span className={`badge ${getPriorityBadgeClass(ticket.priority)}`}>
            {ticket.priority}
          </span>
          <span className={`badge ${getStatusBadgeClass(ticket.status)}`}>
            {ticket.status.replace('_', ' ')}
          </span>
        </div>

        {ticket.isSlaBreached && (
          <span className="badge badge-breach">
            <AlertTriangle size={12} />
            BREACHED
          </span>
        )}
      </div>

      {/* Ticket Details */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <div style={{ width: '24px', height: '24px', borderRadius: '6px', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
            <CategoryIcon size={14} />
          </div>
          <h3 style={{ fontSize: '1rem', color: 'var(--text-main)', fontWeight: 600, lineHeight: 1.3 }}>
            {ticket.title}
          </h3>
        </div>
        <p style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          {ticket.description}
        </p>
      </div>

      {/* Footer Info */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '12px', borderTop: '1px solid var(--border-color)', fontSize: '0.775rem', color: 'var(--text-muted)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <User size={13} />
          <span>{ticket.createdBy?.name || 'Requester'}</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Clock size={13} />
            <span>{new Date(ticket.createdAt).toLocaleDateString()}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--primary)', fontWeight: 600 }}>
            <span>View</span>
            <ArrowRight size={13} />
          </div>
        </div>
      </div>
    </div>
  );
};
