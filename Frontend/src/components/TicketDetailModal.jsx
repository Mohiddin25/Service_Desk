import React, { useState } from 'react';
import { X, Send, User, Clock, CheckCircle2, MessageSquare, Briefcase } from 'lucide-react';
import { api } from '../api/client';
import { useToast } from '../context/ToastContext';

export const TicketDetailModal = ({ ticket, isOpen, onClose, onUpdate }) => {
  const { addToast } = useToast();
  const [commentText, setCommentText] = useState('');
  const [workLogText, setWorkLogText] = useState('');
  const [activeSubTab, setActiveSubTab] = useState('comments'); // 'comments' | 'worklog'
  const [comments, setComments] = useState([
    { name: 'Rahul Support', text: 'Diagnostic logs verified. Running network configuration check.', time: '1 hour ago' }
  ]);
  const [workLogs, setWorkLogs] = useState([
    { name: 'Mohiddin', timeSpent: '30m', activity: 'Initial triage and ticket categorization', time: '2 hours ago' }
  ]);

  if (!isOpen || !ticket) return null;

  const handleStatusChange = async (newStatus) => {
    try {
      await api.tickets.updateStatus(ticket._id, newStatus);
      addToast(`Status updated to ${newStatus.replace('_', ' ')}.`, "success");
      if (onUpdate) onUpdate();
    } catch (err) {
      addToast("Failed to update status.", "error");
    }
  };

  const handleAssignSelf = async () => {
    try {
      await api.tickets.assign(ticket._id, 'Rahul Support');
      addToast("Ticket assigned successfully.", "success");
      if (onUpdate) onUpdate();
    } catch (err) {
      addToast("Failed to assign ticket.", "error");
    }
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    setComments([...comments, {
      name: 'Mohiddin',
      text: commentText,
      time: 'Just now'
    }]);
    setCommentText('');
    addToast("Comment added.", "info");
  };

  const handleAddWorkLog = (e) => {
    e.preventDefault();
    if (!workLogText.trim()) return;
    setWorkLogs([...workLogs, {
      name: 'Mohiddin',
      timeSpent: '15m',
      activity: workLogText,
      time: 'Just now'
    }]);
    setWorkLogText('');
    addToast("Work log entry added.", "info");
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '780px', width: '92%' }}>
        {/* Header */}
        <div className="modal-header" style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '13px', fontFamily: 'monospace', color: 'var(--blue)', fontWeight: 700 }}>
                {ticket.ticketNumber}
              </span>
              <span className={`badge badge-${ticket.priority}`}>{ticket.priority}</span>
              <span className={`badge badge-${ticket.status}`}>{ticket.status.replace('_', ' ')}</span>
            </div>
            <h2 style={{ fontSize: '17px', fontWeight: 600, color: 'var(--text)' }}>{ticket.title}</h2>
          </div>
          <button onClick={onClose} className="btn btn-ghost btn-sm" style={{ padding: '4px' }}>
            <X size={18} />
          </button>
        </div>

        {/* 2-Column Body */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr', gap: '20px', padding: '20px' }} className="modal-2col">
          {/* Left Column: Details, Comments & Work Log */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Description */}
            <div>
              <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', marginBottom: '6px' }}>
                Description
              </div>
              <div style={{ background: 'var(--bg)', padding: '12px 14px', borderRadius: 'var(--radius)', border: '1px solid var(--border)', fontSize: '13.5px', color: 'var(--text)', whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>
                {ticket.description || 'No description provided.'}
              </div>
            </div>

            {/* Sub-tabs: Comments vs Work Log */}
            <div>
              <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--border)', paddingBottom: '8px', marginBottom: '12px' }}>
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={() => setActiveSubTab('comments')}
                  style={{
                    fontSize: '12.5px',
                    fontWeight: activeSubTab === 'comments' ? 600 : 500,
                    color: activeSubTab === 'comments' ? 'var(--blue)' : 'var(--text-2)',
                    padding: '4px 8px'
                  }}
                >
                  <MessageSquare size={14} />
                  <span>Comments ({comments.length})</span>
                </button>

                <button
                  className="btn btn-ghost btn-sm"
                  onClick={() => setActiveSubTab('worklog')}
                  style={{
                    fontSize: '12.5px',
                    fontWeight: activeSubTab === 'worklog' ? 600 : 500,
                    color: activeSubTab === 'worklog' ? 'var(--blue)' : 'var(--text-2)',
                    padding: '4px 8px'
                  }}
                >
                  <Briefcase size={14} />
                  <span>Work Log ({workLogs.length})</span>
                </button>
              </div>

              {/* Comments Tab View */}
              {activeSubTab === 'comments' && (
                <div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '180px', overflowY: 'auto', marginBottom: '10px' }}>
                    {comments.map((c, i) => (
                      <div key={i} style={{ background: 'var(--bg)', padding: '8px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', fontSize: '13px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-3)', marginBottom: '3px' }}>
                          <strong style={{ color: 'var(--text-2)' }}>{c.name}</strong>
                          <span>{c.time}</span>
                        </div>
                        <p style={{ color: 'var(--text)' }}>{c.text}</p>
                      </div>
                    ))}
                  </div>

                  <form onSubmit={handleAddComment} style={{ display: 'flex', gap: '8px' }}>
                    <input 
                      type="text" 
                      className="input" 
                      placeholder="Add a comment..."
                      value={commentText}
                      onChange={e => setCommentText(e.target.value)}
                      style={{ height: '34px', fontSize: '13px' }}
                    />
                    <button type="submit" className="btn btn-primary btn-sm" disabled={!commentText.trim()}>
                      <Send size={13} />
                    </button>
                  </form>
                </div>
              )}

              {/* Work Log Tab View */}
              {activeSubTab === 'worklog' && (
                <div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '180px', overflowY: 'auto', marginBottom: '10px' }}>
                    {workLogs.map((wl, i) => (
                      <div key={i} style={{ background: 'var(--bg)', padding: '8px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', fontSize: '13px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-3)', marginBottom: '3px' }}>
                          <strong style={{ color: 'var(--text-2)' }}>{wl.name} ({wl.timeSpent})</strong>
                          <span>{wl.time}</span>
                        </div>
                        <p style={{ color: 'var(--text)' }}>{wl.activity}</p>
                      </div>
                    ))}
                  </div>

                  <form onSubmit={handleAddWorkLog} style={{ display: 'flex', gap: '8px' }}>
                    <input 
                      type="text" 
                      className="input" 
                      placeholder="Log work activity..."
                      value={workLogText}
                      onChange={e => setWorkLogText(e.target.value)}
                      style={{ height: '34px', fontSize: '13px' }}
                    />
                    <button type="submit" className="btn btn-primary btn-sm" disabled={!workLogText.trim()}>
                      <span>Add Log</span>
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Metadata & Actions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', borderLeft: '1px solid var(--border)', paddingLeft: '16px' }}>
            {/* Status Change */}
            <div>
              <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', marginBottom: '6px' }}>
                Change Status
              </div>
              <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                {['open', 'assigned', 'in_progress', 'resolved', 'closed'].map(st => (
                  <button 
                    key={st}
                    className={`btn btn-sm ${ticket.status === st ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ fontSize: '11px', padding: '3px 8px', textTransform: 'capitalize' }}
                    onClick={() => handleStatusChange(st)}
                  >
                    {st.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>

            {/* Requester */}
            <div>
              <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', marginBottom: '3px' }}>
                Requester
              </div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)' }}>
                {ticket.createdBy?.name || 'Mohiddin'}
              </div>
              <div style={{ fontSize: '11.5px', color: 'var(--text-3)' }}>
                {ticket.createdBy?.email || 'user@company.com'}
              </div>
            </div>

            {/* Assigned To */}
            <div>
              <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', marginBottom: '3px' }}>
                Assigned To
              </div>
              {ticket.assignedTo ? (
                <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--blue)' }}>
                  {ticket.assignedTo.name || ticket.assignedTo}
                </div>
              ) : (
                <div>
                  <span style={{ fontSize: '12.5px', color: 'var(--text-3)', display: 'block', marginBottom: '4px' }}>Unassigned</span>
                  <button className="btn btn-secondary btn-sm" style={{ width: '100%', fontSize: '11.5px' }} onClick={handleAssignSelf}>
                    Assign to Rahul
                  </button>
                </div>
              )}
            </div>

            {/* Created At */}
            <div>
              <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', marginBottom: '3px' }}>
                Created
              </div>
              <div style={{ fontSize: '12.5px', color: 'var(--text-2)' }}>
                {ticket.createdAt ? new Date(ticket.createdAt).toLocaleDateString() : 'Sep 24, 2026'}
              </div>
            </div>

            {/* Related Asset */}
            <div>
              <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', marginBottom: '3px' }}>
                Related Asset
              </div>
              <div style={{ fontSize: '12.5px', color: 'var(--text-2)' }}>
                {ticket.relatedAsset?.name || 'Corporate Laptop (AST-001)'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
