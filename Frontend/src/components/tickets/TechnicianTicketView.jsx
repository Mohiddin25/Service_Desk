import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Bot,
  Send,
  Lock,
  MessageSquare,
  CheckCircle2,
  Clock,
  Sparkles,
  User,
  AlertCircle
} from 'lucide-react';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Textarea, Select } from '../ui/Input';
import { ticketApi } from '../../api/ticketApi';
import { aiApi } from '../../api/aiApi';
import { useAuth } from '../../context/AuthContext';

export const TechnicianTicketView = ({ ticketId, onBack, onUpdate }) => {
  const { user, role } = useAuth();
  const [ticket, setTicket] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('comments'); // comments | work_log | activity

  // AI Assistance state
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSolution, setAiSolution] = useState(null);

  // New Comment / Work Log input
  const [newComment, setNewComment] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);

  // Status Change State
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('');

  useEffect(() => {
    loadTicketData();
  }, [ticketId]);

  const loadTicketData = async () => {
    setLoading(true);
    try {
      const t = await ticketApi.getById(ticketId);
      setTicket(t);
      if (t) {
        setSelectedStatus(t.status);
        const c = await ticketApi.getComments(t._id);
        setComments(c || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestSolution = async () => {
    if (!ticket) return;
    setAiLoading(true);
    try {
      const promptText = `${ticket.title}. Details: ${ticket.description}`;
      const res = await aiApi.query(promptText);
      setAiSolution(res);
    } catch (err) {
      console.error('AI Suggestion error:', err);
    } finally {
      setAiLoading(false);
    }
  };

  const handleAddComment = async (isInternal = false) => {
    if (!newComment.trim() || !ticket) return;
    setSubmittingComment(true);
    try {
      await ticketApi.addComment(ticket._id, {
        message: newComment.trim(),
        isInternal,
        currentUser: user
      });
      setNewComment('');
      const updated = await ticketApi.getComments(ticket._id);
      setComments(updated || []);
      if (onUpdate) onUpdate();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleUpdateStatus = async (newStatus) => {
    if (!ticket) return;
    setStatusUpdating(true);
    try {
      await ticketApi.updateStatus(ticket._id, newStatus);
      setSelectedStatus(newStatus);
      setTicket(prev => ({ ...prev, status: newStatus }));
      if (onUpdate) onUpdate();
    } catch (err) {
      console.error(err);
    } finally {
      setStatusUpdating(false);
    }
  };

  const handleResolveTicket = () => {
    handleUpdateStatus('resolved');
  };

  if (loading) {
    return (
      <div className="card" style={{ padding: 40, textAlign: 'center' }}>
        <div style={{ display: 'inline-block', width: 24, height: 24, border: '2px solid var(--border-color)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 0.6s linear infinite' }} />
        <p style={{ marginTop: 12, color: 'var(--text-secondary)' }}>Loading ticket details...</p>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="card" style={{ padding: 40, textAlign: 'center' }}>
        <h3>Ticket not found</h3>
        <Button variant="secondary" onClick={onBack} style={{ marginTop: 16 }}>
          Back to Tickets
        </Button>
      </div>
    );
  }

  const publicComments = comments.filter(c => !c.isInternal);
  const internalLogs = comments.filter(c => c.isInternal);

  const slaValue = ticket.slaStatus || (ticket.priority === 'critical' ? 'breached' : ticket.priority === 'high' ? 'at_risk' : 'on_track');

  return (
    <div className="view-container">
      <div style={{ marginBottom: 16 }}>
        <button
          type="button"
          onClick={onBack}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            background: 'transparent',
            border: 'none',
            color: 'var(--text-secondary)',
            fontSize: 13.5,
            fontWeight: 500,
            cursor: 'pointer',
            padding: 0
          }}
        >
          <ArrowLeft size={16} />
          Back to Tickets
        </button>
      </div>

      <div className="ticket-detail-view">
        {/* Top Header */}
        <div className="ticket-header-top">
          <div>
            <span className="table-key" style={{ fontSize: 15 }}>{ticket.ticketNumber}</span>
            <h1 style={{ fontSize: 22, fontWeight: 600, marginTop: 4 }}>
              {ticket.title}
            </h1>
          </div>

          {/* Quick Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <Select
              value={selectedStatus}
              onChange={(e) => handleUpdateStatus(e.target.value)}
              disabled={statusUpdating}
              style={{ width: 140, height: 32 }}
              options={[
                { value: 'open', label: 'Open' },
                { value: 'assigned', label: 'Assigned' },
                { value: 'in_progress', label: 'In Progress' },
                { value: 'resolved', label: 'Resolved' },
                { value: 'closed', label: 'Closed' }
              ]}
            />
            {ticket.status !== 'resolved' && (
              <Button
                variant="primary"
                size="sm"
                icon={CheckCircle2}
                onClick={handleResolveTicket}
                loading={statusUpdating}
              >
                Resolve
              </Button>
            )}
          </div>
        </div>

        {/* Metadata Badges */}
        <div className="ticket-meta-badges">
          <Badge type="priority" value={ticket.priority} />
          <Badge type="status" value={ticket.status} />
          <Badge type="sla" value={slaValue} />
          {ticket.category && (
            <span style={{ fontSize: 12, padding: '2px 8px', background: '#f4f5f7', color: 'var(--text-secondary)', borderRadius: 'var(--radius-sm)', textTransform: 'capitalize' }}>
              Category: {ticket.category.replace('_', ' ')}
            </span>
          )}
          {ticket.createdBy && (
            <span className="metadata-text">
              Reported by <strong>{ticket.createdBy.name}</strong> ({ticket.createdBy.department || 'Staff'})
            </span>
          )}
          {ticket.assignedTo && (
            <span className="metadata-text">
              · Assignee: <strong>{ticket.assignedTo.name}</strong>
            </span>
          )}
        </div>

        <div className="ticket-section-divider" />

        {/* Description */}
        <div>
          <h2 className="section-title" style={{ marginBottom: 8 }}>Description</h2>
          <div className="ticket-description-box">
            {ticket.description}
          </div>
        </div>

        <div className="ticket-section-divider" />

        {/* AI Assistance Section */}
        <div className="ticket-ai-box">
          <div className="ai-box-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Bot size={18} color="var(--ai-purple)" />
              <span style={{ fontWeight: 600, fontSize: 14, color: 'var(--ai-purple)' }}>
                AI Assistance
              </span>
              <span className="badge badge-ai" style={{ fontSize: 11 }}>Solution Advisor</span>
            </div>

            <Button
              variant="ai"
              size="sm"
              icon={Sparkles}
              onClick={handleSuggestSolution}
              loading={aiLoading}
            >
              Suggest Solution
            </Button>
          </div>

          {aiSolution ? (
            <div>
              <div className="ai-solution-content">
                {aiSolution.answer}
              </div>

              {aiSolution.sources && aiSolution.sources.length > 0 && (
                <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 11.5, color: 'var(--text-secondary)', fontWeight: 600 }}>Sources:</span>
                  {aiSolution.sources.map((src, i) => (
                    <span
                      key={i}
                      style={{
                        fontSize: 11.5,
                        padding: '2px 6px',
                        background: '#fff',
                        border: '1px solid var(--border-color)',
                        borderRadius: 'var(--radius-sm)',
                        color: 'var(--text-secondary)',
                        fontFamily: 'monospace'
                      }}
                    >
                      {src.id} · {src.category}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
              Click <strong>Suggest Solution</strong> to analyze this ticket and retrieve resolution steps from the verified knowledge base.
            </p>
          )}
        </div>

        <div className="ticket-section-divider" />

        {/* Tabs: Comments, Work Log, Activity */}
        <div className="tab-list">
          <button
            type="button"
            className={`tab-btn ${activeTab === 'comments' ? 'active' : ''}`}
            onClick={() => setActiveTab('comments')}
          >
            Comments ({publicComments.length})
          </button>
          {role !== 'employee' && (
            <button
              type="button"
              className={`tab-btn ${activeTab === 'work_log' ? 'active' : ''}`}
              onClick={() => setActiveTab('work_log')}
            >
              Work Log ({internalLogs.length})
            </button>
          )}
          <button
            type="button"
            className={`tab-btn ${activeTab === 'activity' ? 'active' : ''}`}
            onClick={() => setActiveTab('activity')}
          >
            Activity
          </button>
        </div>

        {/* Tab Content: Public Comments */}
        {activeTab === 'comments' && (
          <div>
            {publicComments.length === 0 ? (
              <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 16 }}>
                No public comments posted yet.
              </p>
            ) : (
              <div style={{ marginBottom: 16 }}>
                {publicComments.map((c) => (
                  <div key={c._id} className="comment-item">
                    <div className="comment-meta">
                      <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                        {c.user?.name || 'User'}
                        {c.user?.role === 'technician' && ' (Technician)'}
                      </span>
                      <span>{new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <div style={{ fontSize: 13.5, color: 'var(--text-primary)' }}>
                      {c.message}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <Textarea
                placeholder="Add a reply to customer..."
                rows={3}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  variant="primary"
                  size="sm"
                  icon={Send}
                  onClick={() => handleAddComment(false)}
                  loading={submittingComment}
                >
                  Send Reply
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Tab Content: Internal Work Log */}
        {activeTab === 'work_log' && (
          <div>
            <div style={{ padding: '8px 12px', background: '#fffbe6', border: '1px solid #ffe58f', borderRadius: 'var(--radius-sm)', fontSize: 12.5, color: '#874d00', marginBottom: 14 }}>
              Internal Work Logs are only visible to technicians and IT managers. Customers cannot view these notes.
            </div>

            {internalLogs.length === 0 ? (
              <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 16 }}>
                No internal work logs recorded yet.
              </p>
            ) : (
              <div style={{ marginBottom: 16 }}>
                {internalLogs.map((c) => (
                  <div key={c._id} className="comment-item internal">
                    <div className="comment-meta">
                      <span style={{ fontWeight: 600, color: '#874d00', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Lock size={12} />
                        {c.user?.name || 'Technician'} (Internal Note)
                      </span>
                      <span>{new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <div style={{ fontSize: 13.5, color: 'var(--text-primary)' }}>
                      {c.message}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <Textarea
                placeholder="Log internal diagnostics, test steps, or parts replaced..."
                rows={3}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  variant="secondary"
                  size="sm"
                  icon={Lock}
                  onClick={() => handleAddComment(true)}
                  loading={submittingComment}
                >
                  Add Work Log
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Tab Content: Activity Timeline */}
        {activeTab === 'activity' && (
          <div style={{ padding: '8px 0' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'flex', gap: 10, fontSize: 13 }}>
                <Clock size={16} color="var(--text-muted)" style={{ marginTop: 2 }} />
                <div>
                  <span style={{ fontWeight: 600 }}>Ticket Created</span> by {ticket.createdBy?.name || 'Staff'}
                  <div className="metadata-text">{new Date(ticket.createdAt).toLocaleString()}</div>
                </div>
              </div>

              {ticket.firstRespondedAt && (
                <div style={{ display: 'flex', gap: 10, fontSize: 13 }}>
                  <MessageSquare size={16} color="var(--primary)" style={{ marginTop: 2 }} />
                  <div>
                    <span style={{ fontWeight: 600 }}>First Technician Response</span>
                    <div className="metadata-text">{new Date(ticket.firstRespondedAt).toLocaleString()}</div>
                  </div>
                </div>
              )}

              {ticket.status === 'resolved' && (
                <div style={{ display: 'flex', gap: 10, fontSize: 13 }}>
                  <CheckCircle2 size={16} color="var(--status-green-text)" style={{ marginTop: 2 }} />
                  <div>
                    <span style={{ fontWeight: 600 }}>Marked Resolved</span>
                    <div className="metadata-text">{new Date(ticket.resolvedAt || ticket.updatedAt).toLocaleString()}</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
