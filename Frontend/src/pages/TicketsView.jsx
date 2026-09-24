import React, { useState } from 'react';
import { Search, Plus } from 'lucide-react';

export const TicketsView = ({ tickets = [], onOpenTicketModal, onSelectTicket }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredTickets = tickets.filter(t => {
    const matchesSearch = 
      t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (t.description && t.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (t.ticketNumber && t.ticketNumber.toLowerCase().includes(searchTerm.toLowerCase()));
    
    let matchesStatus = true;
    if (statusFilter === 'open') {
      matchesStatus = t.status === 'open';
    } else if (statusFilter === 'in_progress') {
      matchesStatus = t.status === 'assigned' || t.status === 'in_progress';
    } else if (statusFilter === 'resolved') {
      matchesStatus = t.status === 'resolved' || t.status === 'closed';
    }

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="content-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text)' }}>Tickets</h1>
          <p style={{ fontSize: '13px', color: 'var(--text-2)' }}>Manage, prioritize, and track IT support tickets.</p>
        </div>

        <button className="btn btn-primary" onClick={onOpenTicketModal}>
          <Plus size={16} />
          <span>Create Ticket</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="card" style={{ padding: '12px 14px', display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
          <Search size={15} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-3)' }} />
          <input 
            type="text" 
            className="input" 
            placeholder="Search tickets..." 
            style={{ paddingLeft: '32px', height: '34px', fontSize: '13px' }}
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Status Filter Buttons */}
        <div style={{ display: 'flex', gap: '4px' }}>
          {[
            { id: 'all', label: 'All' },
            { id: 'open', label: 'Open' },
            { id: 'in_progress', label: 'In Progress' },
            { id: 'resolved', label: 'Resolved' },
          ].map(tab => (
            <button
              key={tab.id}
              className={`chip ${statusFilter === tab.id ? 'active' : ''}`}
              onClick={() => setStatusFilter(tab.id)}
              style={{
                fontSize: '12.5px',
                padding: '5px 12px',
                background: statusFilter === tab.id ? 'var(--blue)' : 'var(--bg)',
                color: statusFilter === tab.id ? '#ffffff' : 'var(--text-2)',
                borderColor: statusFilter === tab.id ? 'var(--blue)' : 'var(--border)'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tickets Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-container" style={{ border: 'none' }}>
          <table className="table">
            <thead>
              <tr>
                <th style={{ width: '100px' }}>Ticket</th>
                <th>Subject</th>
                <th style={{ width: '100px' }}>Priority</th>
                <th style={{ width: '120px' }}>Status</th>
                <th style={{ width: '140px' }}>Assigned</th>
                <th style={{ width: '80px', textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredTickets.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '32px', color: 'var(--text-3)' }}>
                    No tickets found.
                  </td>
                </tr>
              ) : (
                filteredTickets.map(t => (
                  <tr key={t._id} onClick={() => onSelectTicket(t)} style={{ cursor: 'pointer' }}>
                    <td style={{ fontFamily: 'monospace', fontWeight: 600, color: 'var(--blue)' }}>
                      {t.ticketNumber}
                    </td>
                    <td style={{ fontWeight: 500, color: 'var(--text)' }}>
                      {t.title}
                    </td>
                    <td>
                      <span className={`badge badge-${t.priority}`}>{t.priority}</span>
                    </td>
                    <td>
                      <span className={`badge badge-${t.status}`}>
                        {t.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td style={{ fontSize: '13px', color: 'var(--text-2)' }}>
                      {t.assignedTo?.name || 'Unassigned'}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button 
                        className="btn btn-secondary btn-sm" 
                        style={{ padding: '3px 8px', fontSize: '11.5px' }}
                        onClick={(e) => { e.stopPropagation(); onSelectTicket(t); }}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
