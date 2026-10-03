import React from 'react';
import { PlusCircle, Bot, BookOpen, ArrowRight, Clock, CheckCircle2 } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { TicketTable } from '../components/tickets/TicketTable';

export const EmployeeDashboard = ({ tickets = [], onNavigate, onSelectTicket }) => {
  // Employee only sees tickets created by them
  const openCount = tickets.filter(t => t.status === 'open' || t.status === 'assigned').length;
  const inProgressCount = tickets.filter(t => t.status === 'in_progress').length;
  const resolvedCount = tickets.filter(t => t.status === 'resolved' || t.status === 'closed').length;

  const recentTickets = tickets.slice(0, 5);

  return (
    <div className="view-container">
      {/* Page Title */}
      <div className="view-header">
        <div className="view-header-title">
          <h1 className="page-title">My Support</h1>
          <span className="metadata-text">Track your active IT requests and incident tickets</span>
        </div>
        <div className="view-header-actions">
          <Button
            variant="primary"
            icon={PlusCircle}
            onClick={() => onNavigate('/create-ticket')}
          >
            Create Ticket
          </Button>
        </div>
      </div>

      {/* Metrics Row: Open 2, In Progress 1, Resolved 8 */}
      <div className="metrics-row">
        <div className="metric-card">
          <span className="metric-card-label">Open</span>
          <span className="metric-card-value" style={{ color: 'var(--primary)' }}>{openCount}</span>
          <span className="metric-card-sub">Awaiting technician work</span>
        </div>

        <div className="metric-card">
          <span className="metric-card-label">In Progress</span>
          <span className="metric-card-value" style={{ color: 'var(--status-amber-text)' }}>{inProgressCount}</span>
          <span className="metric-card-sub">Under active investigation</span>
        </div>

        <div className="metric-card">
          <span className="metric-card-label">Resolved</span>
          <span className="metric-card-value" style={{ color: 'var(--status-green-text)' }}>{resolvedCount}</span>
          <span className="metric-card-sub">Closed successfully</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(280px, 1fr)', gap: 20 }}>
        {/* Main Section: My Recent Tickets */}
        <div>
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h2 className="section-title">My Recent Tickets</h2>
              <button
                type="button"
                onClick={() => onNavigate('/my-tickets')}
                style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: 13, fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}
              >
                View All ({tickets.length}) <ArrowRight size={14} />
              </button>
            </div>

            <TicketTable
              tickets={recentTickets}
              onSelectTicket={onSelectTicket}
              emptyMessage="You have not submitted any IT support tickets yet."
            />
          </div>
        </div>

        {/* Sidebar: Quick Actions */}
        <div>
          <div className="card">
            <h2 className="section-title" style={{ marginBottom: 14 }}>Quick Actions</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <button
                type="button"
                onClick={() => onNavigate('/create-ticket')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '12px 14px',
                  background: '#fff',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-sm)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.1s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--primary)'}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border-color)'}
              >
                <div style={{ width: 34, height: 34, borderRadius: 'var(--radius-sm)', background: 'var(--primary-subtle)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <PlusCircle size={18} />
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 13.5, color: 'var(--text-primary)' }}>Create Ticket</div>
                  <div className="metadata-text">Report hardware, software, or network issues</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => onNavigate('/ai-assistant')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '12px 14px',
                  background: '#fff',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-sm)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.1s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--ai-purple)'}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border-color)'}
              >
                <div style={{ width: 34, height: 34, borderRadius: 'var(--radius-sm)', background: 'var(--ai-purple-subtle)', color: 'var(--ai-purple)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Bot size={18} />
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 13.5, color: 'var(--text-primary)' }}>Ask AI</div>
                  <div className="metadata-text">Get instant answers for common IT issues</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => onNavigate('/knowledge')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '12px 14px',
                  background: '#fff',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-sm)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.1s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--primary)'}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border-color)'}
              >
                <div style={{ width: 34, height: 34, borderRadius: 'var(--radius-sm)', background: '#ebecf0', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <BookOpen size={18} />
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 13.5, color: 'var(--text-primary)' }}>Knowledge Base</div>
                  <div className="metadata-text">Step-by-step IT guides and FAQs</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
