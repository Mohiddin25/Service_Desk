import React from 'react';
import { Badge } from '../ui/Badge';
import { Table } from '../ui/Table';

export const TicketTable = ({ tickets = [], onSelectTicket, emptyMessage = 'No tickets found' }) => {
  const formatTimeAgo = (dateStr) => {
    if (!dateStr) return '—';
    const date = new Date(dateStr);
    const diff = Math.floor((Date.now() - date.getTime()) / 1000);
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  const columns = [
    {
      header: 'Ticket',
      key: 'ticketNumber',
      width: '120px',
      render: (t) => <span className="table-key">{t.ticketNumber}</span>
    },
    {
      header: 'Summary',
      key: 'title',
      render: (t) => (
        <div>
          <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{t.title}</span>
          {t.createdBy && (
            <span className="metadata-text" style={{ display: 'block', marginTop: 2 }}>
              Reported by {t.createdBy.name || 'User'}
            </span>
          )}
        </div>
      )
    },
    {
      header: 'Priority',
      key: 'priority',
      width: '100px',
      render: (t) => <Badge type="priority" value={t.priority} />
    },
    {
      header: 'Status',
      key: 'status',
      width: '120px',
      render: (t) => <Badge type="status" value={t.status} />
    },
    {
      header: 'SLA',
      key: 'slaStatus',
      width: '120px',
      render: (t) => {
        const sla = t.slaStatus || (t.priority === 'critical' ? 'breached' : t.priority === 'high' ? 'at_risk' : 'on_track');
        return <Badge type="sla" value={sla} />;
      }
    },
    {
      header: 'Updated',
      key: 'updatedAt',
      width: '110px',
      render: (t) => (
        <span className="metadata-text">
          {formatTimeAgo(t.updatedAt || t.createdAt)}
        </span>
      )
    }
  ];

  return (
    <Table
      columns={columns}
      data={tickets}
      onRowClick={onSelectTicket}
      emptyMessage={emptyMessage}
    />
  );
};
