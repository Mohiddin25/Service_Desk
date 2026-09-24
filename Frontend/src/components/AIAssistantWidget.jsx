import React, { useState, useRef, useEffect } from 'react';
import { X, Sparkles, Send, BookOpen, Bot, Zap, ArrowRight } from 'lucide-react';
import { api } from '../api/client';

export const AIAssistantWidget = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: "Hello! I am your AI Helpdesk Assistant. Ask me any IT support question or select a quick topic below."
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading]);

  if (!isOpen) return null;

  const quickPrompts = [
    "How to fix corporate VPN connection timeout?",
    "How to solve 4K monitor screen flickering?",
    "Process for Figma SaaS software license request?",
    "Active Directory password reset procedure?"
  ];

  const handleSendQuery = async (userText) => {
    if (!userText.trim()) return;

    setMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setIsLoading(true);

    try {
      const res = await api.ai.query(userText);
      setMessages(prev => [
        ...prev,
        {
          sender: 'ai',
          text: res.answer,
          articles: res.sourceArticles
        }
      ]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        { sender: 'ai', text: "Sorry, I had trouble querying the Knowledge Base. Please try again." }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSendQuery(query);
    setQuery('');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '660px', height: '620px', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '34px', height: '34px', borderRadius: '8px', background: 'linear-gradient(135deg, #6366f1, #a855f7)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', boxShadow: '0 0 12px rgba(99, 102, 241, 0.4)' }}>
              <Bot size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.15rem' }}>AI Assistant</h2>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Ask any IT support question</p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {/* Quick Suggestion Chips */}
        <div style={{ padding: '10px 16px', background: 'var(--bg-input)', borderBottom: '1px solid var(--border-color)', display: 'flex', gap: '8px', overflowX: 'auto' }}>
          {quickPrompts.map((qp, idx) => (
            <button 
              key={idx}
              className="chip"
              onClick={() => handleSendQuery(qp)}
            >
              <Zap size={12} color="var(--primary)" />
              <span>{qp}</span>
            </button>
          ))}
        </div>

        {/* Chat History Container */}
        <div style={{ flex: 1, padding: '18px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px', background: 'var(--bg-dark)' }}>
          {messages.map((m, idx) => (
            <div 
              key={idx} 
              style={{
                alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '85%',
                background: m.sender === 'user' ? 'var(--primary)' : 'var(--bg-elevated)',
                color: m.sender === 'user' ? 'white' : 'var(--text-main)',
                padding: '12px 16px',
                borderRadius: m.sender === 'user' ? '16px 16px 2px 16px' : '16px 16px 16px 2px',
                border: m.sender === 'ai' ? '1px solid var(--border-color)' : 'none',
                fontSize: '0.875rem',
                lineHeight: 1.5
              }}
            >
              <div>{m.text}</div>
              {m.articles?.length > 0 && (
                <div style={{ marginTop: '10px', paddingTop: '8px', borderTop: '1px solid var(--border-color)' }}>
                  <div style={{ fontSize: '0.725rem', color: 'var(--accent-cyan)', fontWeight: 600, marginBottom: '4px' }}>
                    <BookOpen size={12} style={{ display: 'inline', marginRight: '4px' }} />
                    Sources:
                  </div>
                  {m.articles.map((art, aIdx) => (
                    <div key={aIdx} style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>{art.title}</div>
                  ))}
                </div>
              )}
            </div>
          ))}
          {isLoading && (
            <div style={{ alignSelf: 'flex-start', color: 'var(--text-muted)', fontSize: '0.825rem', fontStyle: 'italic', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Sparkles size={14} className="animate-spin" />
              <span>AI is searching vector embeddings...</span>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input */}
        <form onSubmit={handleSubmit} style={{ padding: '14px', borderTop: '1px solid var(--border-color)', display: 'flex', gap: '8px', background: 'var(--bg-card)' }}>
          <input 
            type="text" 
            className="input" 
            placeholder="Ask any technical question or problem..."
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          <button type="submit" className="btn btn-primary" disabled={isLoading || !query.trim()}>
            <Send size={15} />
          </button>
        </form>
      </div>
    </div>
  );
};
