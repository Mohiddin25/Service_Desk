import React, { useState } from 'react';
import { X, Plus, BookOpen } from 'lucide-react';
import { api } from '../api/client';
import { useToast } from '../context/ToastContext';

export const FAQFormModal = ({ isOpen, onClose, onFaqAdded }) => {
  const { addToast } = useToast();
  const [category, setCategory] = useState('Network');
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim() || !answer.trim()) return;

    setIsSubmitting(true);
    const id = `FAQ-${Math.floor(100 + Math.random() * 900)}`;

    try {
      await api.ai.addFaq({ id, category: category.toLowerCase(), question, answer });
      addToast("Knowledge added successfully.", "success");
      if (onFaqAdded) onFaqAdded();
      setQuestion('');
      setAnswer('');
      onClose();
    } catch (err) {
      addToast("Failed to add knowledge.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '540px' }}>
        <div className="modal-header" style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: 'var(--radius)', background: 'var(--blue-light)', color: 'var(--blue)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <BookOpen size={16} />
            </div>
            <div>
              <h2 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text)' }}>Add Knowledge</h2>
              <p style={{ fontSize: '12.5px', color: 'var(--text-3)' }}>Add a new article for the AI Assistant and team.</p>
            </div>
          </div>
          <button onClick={onClose} className="btn btn-ghost btn-sm" style={{ padding: '4px' }}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div className="form-group">
              <label className="form-label" style={{ fontSize: '12.5px', fontWeight: 600 }}>Question</label>
              <input 
                type="text" 
                className="input" 
                placeholder="How do I connect to office Wi-Fi?"
                value={question}
                onChange={e => setQuestion(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" style={{ fontSize: '12.5px', fontWeight: 600 }}>Category</label>
              <select className="select" value={category} onChange={e => setCategory(e.target.value)}>
                <option value="Network">Network</option>
                <option value="Account">Account</option>
                <option value="Software">Software</option>
                <option value="Hardware">Hardware</option>
                <option value="Security">Security</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" style={{ fontSize: '12.5px', fontWeight: 600 }}>Answer</label>
              <textarea 
                className="textarea" 
                placeholder="Open Wi-Fi settings and select the company network..."
                rows={5}
                value={answer}
                onChange={e => setAnswer(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="modal-footer" style={{ padding: '14px 20px', borderTop: '1px solid var(--border)' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              <span>{isSubmitting ? 'Adding...' : 'Add Knowledge'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
