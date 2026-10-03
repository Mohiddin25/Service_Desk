import React, { useState } from 'react';
import { TicketTable } from '../components/tickets/TicketTable';
import { Select } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Search, Plus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const TicketsPage = ({ tickets = [], onSelectTicket, onNavigate, title = "Tickets", subtitle = "All registered IT service and incident tickets" }) => {
  const { role } = useAuth();
  const [search, setSearch] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  let filtered = [...tickets];

  if (search) {
    const s = search.toLowerCase();
    filtered = filtered.filter(t =>
      t.ticketNumber.toLowerCase().includes(s) ||
      t.title.toLowerCase().includes(s) ||
      (t.createdBy && t.createdBy.name && t.createdBy.name.toLowerCase().includes(s))
    );
  }

  if (priorityFilter !== 'all') {
    filtered = filtered.filter(t => t.priority === priorityFilter);
  }

  if (statusFilter !== 'all') {
    filtered = filtered.filter(t => t.status === statusFilter);
  }

  if (categoryFilter !== 'all') {
    filtered = filtered.filter(t => t.category === categoryFilter);
  }

  return (
    <div className="view-container">
      <div className="view-header">
        <div className="view-header-title">
          <h1 className="page-title">{title}</h1>
          <span className="metadata-text">{subtitle}</span>
        </div>

        {role === 'employee' && (
          <div className="view-header-actions">
            <Button
              variant="primary"
              icon={Plus}
              onClick={() => onNavigate('/create-ticket')}
            >
              Create Ticket
            </Button>
          </div>
        )}
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {/* Filters */}
        <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', flex: 1 }}>
            <div style={{ position: 'relative', width: 260 }}>
              <Search size={14} style={{ position: 'absolute', left: 9, top: 9, color: 'var(--text-muted)' }} />
              <input
                type="text"
                placeholder="Search ticket key, title, reporter..."
                className="form-control"
                style={{ paddingLeft: 30, height: 32, fontSize: 13 }}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{ width: 130, height: 32, fontSize: 12.5 }}
              options={[
                { value: 'all', label: 'All Status' },
                { value: 'open', label: 'Open' },
                { value: 'assigned', label: 'Assigned' },
                { value: 'in_progress', label: 'In Progress' },
                { value: 'resolved', label: 'Resolved' },
                { value: 'closed', label: 'Closed' }
              ]}
            />

            <Select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              style={{ width: 130, height: 32, fontSize: 12.5 }}
              options={[
                { value: 'all', label: 'All Priority' },
                { value: 'critical', label: 'Critical' },
                { value: 'high', label: 'High' },
                { value: 'medium', label: 'Medium' },
                { value: 'low', label: 'Low' }
              ]}
            />

            <Select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              style={{ width: 130, height: 32, fontSize: 12.5 }}
              options={[
                { value: 'all', label: 'All Categories' },
                { value: 'network', label: 'Network' },
                { value: 'hardware', label: 'Hardware' },
                { value: 'software', label: 'Software' },
                { value: 'account_access', label: 'Account Access' },
                { value: 'security', label: 'Security' }
              ]}
            />
          </div>

          <span className="metadata-text">
            Showing <strong>{filtered.length}</strong> tickets
          </span>
        </div>

        <TicketTable
          tickets={filtered}
          onSelectTicket={onSelectTicket}
        />
      </div>
    </div>
  );
};
