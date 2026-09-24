import React, { useState, useEffect } from 'react';
import { Users, Server, Settings, Database, Plus, Check, Sparkles, BookOpen } from 'lucide-react';
import { api } from '../api/client';

export const AdminConsole = ({ activeTab }) => {
  const [faqs, setFaqs] = useState([]);
  const [users, setUsers] = useState([]);
  const [newQuestion, setNewQuestion] = useState('');
  const [newAnswer, setNewAnswer] = useState('');
  const [isSubmittingFaq, setIsSubmittingFaq] = useState(false);

  useEffect(() => {
    loadFaqs();
    loadUsers();
  }, []);

  const loadFaqs = async () => {
    const data = await api.ai.getFaqs();
    setFaqs(data);
  };

  const loadUsers = async () => {
    const data = await api.users.getAll();
    setUsers(data);
  };

  const handleAddFaq = async (e) => {
    e.preventDefault();
    if (!newQuestion || !newAnswer) return;
    setIsSubmittingFaq(true);
    try {
      await api.ai.addFaq(newQuestion, newAnswer);
      await loadFaqs();
      setNewQuestion('');
      setNewAnswer('');
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmittingFaq(false);
    }
  };

  return (
    <div className="page-body">
      <div className="card" style={{ marginBottom: '24px', background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.15) 0%, rgba(99, 102, 241, 0.1) 100%)' }}>
        <h1 style={{ marginBottom: '4px' }}>System Admin Console</h1>
        <p>Global RBAC user management, SLA target policies, and AI Vector Knowledge Base ingestion.</p>
      </div>

      {activeTab === 'users' && (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>User Name</th>
                <th>Email Address</th>
                <th>Assigned Role</th>
                <th>Department</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u._id}>
                  <td style={{ fontWeight: 600 }}>{u.name}</td>
                  <td style={{ color: 'var(--text-muted)' }}>{u.email}</td>
                  <td>
                    <span className={`badge ${
                      u.role === 'system_admin' ? 'badge-critical' :
                      u.role === 'it_manager' ? 'badge-in_progress' :
                      u.role === 'technician' ? 'badge-assigned' : 'badge-open'
                    }`}>
                      {u.role.replace('_', ' ')}
                    </span>
                  </td>
                  <td>{u.department}</td>
                  <td><span className="badge badge-resolved">ACTIVE</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'sla_policies' && (
        <div>
          <h2 style={{ marginBottom: '16px' }}>Configured SLA Policies & Targets</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '18px' }}>
            <div className="card" style={{ borderLeft: '4px solid var(--prio-critical)' }}>
              <h3 style={{ color: 'var(--prio-critical)', marginBottom: '8px' }}>P1 - Critical Outage Target</h3>
              <p>First Response Target: <strong>15 Minutes</strong></p>
              <p>Resolution Deadline: <strong>2 Hours</strong></p>
              <span className="badge badge-critical" style={{ marginTop: '12px' }}>Auto Escalation: Active</span>
            </div>

            <div className="card" style={{ borderLeft: '4px solid var(--prio-high)' }}>
              <h3 style={{ color: 'var(--prio-high)', marginBottom: '8px' }}>P2 - High Priority Target</h3>
              <p>First Response Target: <strong>1 Hour</strong></p>
              <p>Resolution Deadline: <strong>8 Hours</strong></p>
              <span className="badge badge-high" style={{ marginTop: '12px' }}>Auto Escalation: Active</span>
            </div>

            <div className="card" style={{ borderLeft: '4px solid var(--prio-medium)' }}>
              <h3 style={{ color: 'var(--prio-medium)', marginBottom: '8px' }}>P3 - Medium Priority Target</h3>
              <p>First Response Target: <strong>4 Hours</strong></p>
              <p>Resolution Deadline: <strong>24 Hours</strong></p>
              <span className="badge badge-medium" style={{ marginTop: '12px' }}>Standard SLA</span>
            </div>

            <div className="card" style={{ borderLeft: '4px solid var(--prio-low)' }}>
              <h3 style={{ color: 'var(--prio-low)', marginBottom: '8px' }}>P4 - Low Priority Target</h3>
              <p>First Response Target: <strong>8 Hours</strong></p>
              <p>Resolution Deadline: <strong>72 Hours</strong></p>
              <span className="badge badge-low" style={{ marginTop: '12px' }}>Low Priority Queue</span>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'vector_kb' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <Sparkles size={20} color="var(--primary)" />
              <h3>Ingest FAQ Solution to AI Vector Store</h3>
            </div>
            
            <form onSubmit={handleAddFaq} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div className="form-group">
                <label className="form-label">Question / Technical Issue</label>
                <input 
                  type="text" 
                  className="input" 
                  placeholder="e.g., How do I connect to Printer_Floor3?"
                  value={newQuestion}
                  onChange={e => setNewQuestion(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Tested Solution Procedure</label>
                <textarea 
                  className="textarea" 
                  placeholder="Detailed resolution steps to embed into vector search..."
                  value={newAnswer}
                  onChange={e => setNewAnswer(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary" disabled={isSubmittingFaq}>
                <Plus size={16} />
                <span>{isSubmittingFaq ? 'Ingesting...' : 'Ingest into AI Vector Store'}</span>
              </button>
            </form>
          </div>

          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <BookOpen size={20} color="var(--accent-cyan)" />
              <h3>Active Vector FAQ Embeddings</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '420px', overflowY: 'auto' }}>
              {faqs.map((faq, i) => (
                <div key={i} style={{ background: 'var(--bg-input)', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                  <div style={{ fontWeight: 700, color: 'var(--primary)', fontSize: '0.875rem', marginBottom: '4px' }}>Q: {faq.question}</div>
                  <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>A: {faq.answer}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
