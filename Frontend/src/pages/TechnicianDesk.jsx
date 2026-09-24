import React, { useState, useEffect } from 'react';
import { TicketCard } from '../components/TicketCard';
import { api } from '../api/client';
import { Clock, AlertTriangle, CheckCircle2, Ticket, Sparkles, UserCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const TechnicianDesk = ({ activeTab, onSelectTicket }) => {
  const { user } = useAuth();
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    loadTickets();
  }, [activeTab]);

  const loadTickets = async () => {
    const data = await api.tickets.getAll();
    setTickets(data);
  };

  const assignedTickets = tickets.filter(t => t.assignedTo?.name.includes('Dave') || t.status === 'assigned');
  const unassignedTickets = tickets.filter(t => !t.assignedTo && t.status === 'open');
  const breachedTickets = tickets.filter(t => t.isSlaBreached);

  return (
    <div className="page-body">
      {/* Technician KPI Stats Cards */}
      <div className="stats-grid">
        <div className="card stat-card">
          <div className="stat-icon" style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#6366f1' }}>
            <Ticket size={22} />
          </div>
          <div>
            <div className="stat-value">{assignedTickets.length}</div>
            <div className="stat-label">Assigned Queue</div>
          </div>
        </div>

        <div className="card stat-card">
          <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b' }}>
            <Clock size={22} />
          </div>
          <div>
            <div className="stat-value">{unassignedTickets.length}</div>
            <div className="stat-label">Unassigned Pool</div>
          </div>
        </div>

        <div className="card stat-card">
          <div className="stat-icon" style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444' }}>
            <AlertTriangle size={22} />
          </div>
          <div>
            <div className="stat-value">{breachedTickets.length}</div>
            <div className="stat-label">SLA Breaches</div>
          </div>
        </div>

        <div className="card stat-card">
          <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>
            <CheckCircle2 size={22} />
          </div>
          <div>
            <div className="stat-value">12</div>
            <div className="stat-label">Resolved (This Week)</div>
          </div>
        </div>
      </div>

      {activeTab === 'queue' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2>My Assigned Tickets</h2>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{assignedTickets.length} tickets in active work queue</span>
          </div>
          {assignedTickets.length === 0 ? (
            <div className="card" style={{ padding: '30px', textAlign: 'center' }}>
              <p>Your queue is clear! Check unassigned pool for tickets to pick up.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '18px' }}>
              {assignedTickets.map(ticket => (
                <TicketCard key={ticket._id} ticket={ticket} onClick={() => onSelectTicket(ticket)} />
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'unassigned' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2>Unassigned Department Ticket Pool</h2>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{unassignedTickets.length} open tickets awaiting assignment</span>
          </div>
          {unassignedTickets.length === 0 ? (
            <div className="card" style={{ padding: '30px', textAlign: 'center' }}>
              <p>No unassigned tickets pending in pool.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '18px' }}>
              {unassignedTickets.map(ticket => (
                <TicketCard key={ticket._id} ticket={ticket} onClick={() => onSelectTicket(ticket)} />
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'sla' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ color: 'var(--prio-critical)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertTriangle size={20} />
              <span>SLA Breach Escalation Alerts</span>
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '18px' }}>
            {breachedTickets.map(ticket => (
              <TicketCard key={ticket._id} ticket={ticket} onClick={() => onSelectTicket(ticket)} />
            ))}
          </div>
        </div>
      )}

      {activeTab === 'kb' && (
        <div className="card" style={{ padding: '36px', textAlign: 'center', maxWidth: '640px', margin: '0 auto' }}>
          <Sparkles size={44} color="var(--primary)" style={{ marginBottom: '12px' }} />
          <h2>AI Vector RAG Troubleshooting Engine</h2>
          <p style={{ margin: '8px auto 20px auto', lineHeight: 1.6 }}>
            Technicians can instantly query embedded knowledge base vectors to retrieve tested diagnostic steps and exact resolution procedures.
          </p>
          <button className="btn btn-primary" onClick={() => window.alert('Click the "Ask AI Assistant" button in the top navigation header to query AI knowledge vectors.')}>
            Open AI Assistant Window
          </button>
        </div>
      )}
    </div>
  );
};
