import React, { useState, useEffect } from 'react';
import { api } from '../api/client';
import { BarChart3, AlertTriangle, Users, Ticket, ArrowUpRight, ShieldAlert, Check } from 'lucide-react';
import { TicketCard } from '../components/TicketCard';

export const ManagerDashboard = ({ activeTab, onSelectTicket }) => {
  const [tickets, setTickets] = useState([]);
  const [techUsers, setTechUsers] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const data = await api.tickets.getAll();
    setTickets(data);
    const users = await api.users.getAll();
    setTechUsers(users.filter(u => ['technician', 'it_manager'].includes(u.role)));
  };

  const handleReassign = async (ticketId, techId) => {
    await api.tickets.assign(ticketId, techId);
    loadData();
  };

  const breachedTickets = tickets.filter(t => t.isSlaBreached);

  return (
    <div className="page-body">
      {/* Manager KPI Metrics Grid */}
      <div className="stats-grid">
        <div className="card stat-card">
          <div className="stat-icon" style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#6366f1' }}>
            <Ticket size={22} />
          </div>
          <div>
            <div className="stat-value">{tickets.length + 140}</div>
            <div className="stat-label">Total Volume (30d)</div>
          </div>
        </div>

        <div className="card stat-card">
          <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>
            <BarChart3 size={22} />
          </div>
          <div>
            <div className="stat-value">94.8%</div>
            <div className="stat-label">SLA Compliance</div>
          </div>
        </div>

        <div className="card stat-card">
          <div className="stat-icon" style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444' }}>
            <AlertTriangle size={22} />
          </div>
          <div>
            <div className="stat-value">{breachedTickets.length}</div>
            <div className="stat-label">Active SLA Breaches</div>
          </div>
        </div>

        <div className="card stat-card">
          <div className="stat-icon" style={{ background: 'rgba(168, 85, 247, 0.15)', color: '#a855f7' }}>
            <Users size={22} />
          </div>
          <div>
            <div className="stat-value">1.2 hrs</div>
            <div className="stat-label">Avg Resolution Time</div>
          </div>
        </div>
      </div>

      {activeTab === 'overview' && (
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
          {/* Active Tickets Overview & Quick Reassign */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3>Department Ticket Dispatch Overview</h3>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{tickets.length} tickets monitored</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {tickets.map(ticket => (
                <div 
                  key={ticket._id} 
                  style={{ 
                    background: 'var(--bg-input)', 
                    padding: '14px', 
                    borderRadius: 'var(--radius-md)', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between', 
                    border: '1px solid var(--border-color)',
                    gap: '12px',
                    flexWrap: 'wrap'
                  }}
                >
                  <div style={{ flex: 1, minWidth: '220px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: 'var(--accent-cyan)', fontWeight: 700 }}>{ticket.ticketNumber}</span>
                      <span className={`badge badge-${ticket.priority}`}>{ticket.priority}</span>
                      <span className={`badge badge-${ticket.status}`}>{ticket.status.replace('_', ' ')}</span>
                    </div>
                    <h4 style={{ fontSize: '0.925rem', margin: '4px 0 2px 0' }}>{ticket.title}</h4>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {/* Technician Selector */}
                    <select 
                      className="select" 
                      style={{ fontSize: '0.775rem', padding: '4px 8px', width: '150px' }}
                      value={ticket.assignedTo?._id || ''}
                      onChange={e => handleReassign(ticket._id, e.target.value)}
                    >
                      <option value="">Unassigned</option>
                      {techUsers.map(u => (
                        <option key={u._id} value={u._id}>{u.name}</option>
                      ))}
                    </select>

                    <button className="btn btn-secondary btn-sm" onClick={() => onSelectTicket(ticket)}>
                      Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Technician Capacity Bar Chart */}
          <div className="card">
            <h3 style={{ marginBottom: '16px' }}>Technician Capacity & Workload</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.825rem', marginBottom: '6px' }}>
                  <span style={{ fontWeight: 600 }}>Dave Tech (Level 2)</span>
                  <span style={{ fontWeight: 700, color: 'var(--primary)' }}>3 Active Tickets</span>
                </div>
                <div style={{ height: '8px', background: 'var(--bg-input)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: '75%', height: '100%', background: 'linear-gradient(90deg, #6366f1, #a855f7)', borderRadius: '4px' }} />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.825rem', marginBottom: '6px' }}>
                  <span style={{ fontWeight: 600 }}>Sarah Jenkins (Manager)</span>
                  <span style={{ fontWeight: 700, color: 'var(--accent-cyan)' }}>1 Active Ticket</span>
                </div>
                <div style={{ height: '8px', background: 'var(--bg-input)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: '25%', height: '100%', background: 'var(--accent-cyan)', borderRadius: '4px' }} />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.825rem', marginBottom: '6px' }}>
                  <span style={{ fontWeight: 600 }}>Alex Admin (System)</span>
                  <span style={{ fontWeight: 700, color: 'var(--accent-emerald)' }}>0 Active Tickets</span>
                </div>
                <div style={{ height: '8px', background: 'var(--bg-input)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: '5%', height: '100%', background: 'var(--accent-emerald)', borderRadius: '4px' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'escalations' && (
        <div>
          <h2 style={{ marginBottom: '16px', color: 'var(--prio-critical)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertTriangle size={20} />
            <span>SLA Breach Escalation Monitor</span>
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '18px' }}>
            {breachedTickets.map(ticket => (
              <TicketCard key={ticket._id} ticket={ticket} onClick={() => onSelectTicket(ticket)} />
            ))}
          </div>
        </div>
      )}

      {activeTab === 'tickets' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '18px' }}>
          {tickets.map(ticket => (
            <TicketCard key={ticket._id} ticket={ticket} onClick={() => onSelectTicket(ticket)} />
          ))}
        </div>
      )}
    </div>
  );
};
