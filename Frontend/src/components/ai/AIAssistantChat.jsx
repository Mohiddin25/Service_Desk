import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, Sparkles, User, CornerDownLeft } from 'lucide-react';
import { Button } from '../ui/Button';
import { aiApi } from '../../api/aiApi';
import { useAuth } from '../../context/AuthContext';

export const AIAssistantChat = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([
    {
      id: 'm-1',
      sender: 'ai',
      text: 'Hello. I can assist with corporate Wi-Fi, VPN connectivity, software licenses, password resets, and hardware troubleshooting. What IT problem are you experiencing?',
      sources: []
    }
  ]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (textToSend) => {
    const text = (textToSend || query).trim();
    if (!text || loading) return;

    const userMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text
    };

    setMessages(prev => [...prev, userMessage]);
    setQuery('');
    setLoading(true);

    try {
      const res = await aiApi.query(text);
      const aiMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: res.answer,
        sources: res.sources || []
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (e) {
      setMessages(prev => [
        ...prev,
        {
          id: `ai-err-${Date.now()}`,
          sender: 'ai',
          text: 'Unable to reach the IT assistant service. Please check your network or raise a standard support ticket.',
          sources: []
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const suggestedQuestions = [
    'How do I connect to office Wi-Fi?',
    'How do I reset my Windows password?',
    'My MacBook display flickers on dock',
    'How do I troubleshoot VPN connection timeouts?'
  ];

  return (
    <div className="view-container" style={{ maxWidth: 900 }}>
      <div className="view-header">
        <div className="view-header-title">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <h1 className="page-title">AI Assistant</h1>
            <span className="badge badge-ai">IT Helpdesk AI</span>
          </div>
          <span className="metadata-text">Ask about an IT problem or common troubleshooting steps</span>
        </div>
      </div>

      <div className="card" style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 200px)', minHeight: 480, padding: 0, overflow: 'hidden' }}>
        {/* Messages Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          {messages.map((m) => {
            const isAi = m.sender === 'ai';
            return (
              <div
                key={m.id}
                style={{
                  display: 'flex',
                  gap: 12,
                  maxWidth: isAi ? '85%' : '75%',
                  alignSelf: isAi ? 'flex-start' : 'flex-end',
                  flexDirection: isAi ? 'row' : 'row-reverse'
                }}
              >
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 'var(--radius-sm)',
                    background: isAi ? 'var(--ai-purple-subtle)' : 'var(--primary-subtle)',
                    color: isAi ? 'var(--ai-purple)' : 'var(--primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  {isAi ? <Bot size={18} /> : <User size={18} />}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <div
                    style={{
                      background: isAi ? '#fafbfc' : 'var(--primary)',
                      color: isAi ? 'var(--text-primary)' : '#fff',
                      border: isAi ? '1px solid var(--border-color)' : 'none',
                      borderRadius: 'var(--radius-md)',
                      padding: '12px 16px',
                      fontSize: 14,
                      lineHeight: 1.55,
                      whiteSpace: 'pre-wrap'
                    }}
                  >
                    {m.text}
                  </div>

                  {/* Sources section if AI */}
                  {isAi && m.sources && m.sources.length > 0 && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', paddingLeft: 4 }}>
                      <span style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--text-secondary)' }}>Sources:</span>
                      {m.sources.map((src, idx) => (
                        <span
                          key={idx}
                          style={{
                            fontSize: 11,
                            padding: '1px 6px',
                            background: '#fff',
                            border: '1px solid var(--border-subtle)',
                            borderRadius: 'var(--radius-sm)',
                            color: 'var(--text-secondary)',
                            fontFamily: 'monospace'
                          }}
                        >
                          {src.id || src} · {src.category || 'General'}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {loading && (
            <div style={{ display: 'flex', gap: 12, maxWidth: '80%', alignSelf: 'flex-start' }}>
              <div style={{ width: 32, height: 32, borderRadius: 'var(--radius-sm)', background: 'var(--ai-purple-subtle)', color: 'var(--ai-purple)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Bot size={18} />
              </div>
              <div style={{ background: '#fafbfc', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-secondary)', fontSize: 13.5 }}>
                <span style={{ width: 12, height: 12, border: '2px solid var(--ai-purple)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.6s linear infinite' }} />
                <span>Searching knowledge base and formulating solution...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Quick Prompts */}
        <div style={{ padding: '8px 20px', background: '#fafbfc', borderTop: '1px solid var(--border-subtle)', display: 'flex', gap: 6, overflowX: 'auto', alignItems: 'center' }}>
          <span style={{ fontSize: 11.5, color: 'var(--text-muted)', whiteSpace: 'nowrap', fontWeight: 600 }}>Suggested:</span>
          {suggestedQuestions.map((sq, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleSend(sq)}
              style={{
                fontSize: 12,
                padding: '4px 10px',
                background: '#fff',
                border: '1px solid var(--border-color)',
                borderRadius: 14,
                color: 'var(--text-secondary)',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.1s ease'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.color = 'var(--primary)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-color)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
            >
              {sq}
            </button>
          ))}
        </div>

        {/* Input Footer */}
        <div style={{ padding: '14px 20px', borderTop: '1px solid var(--border-color)', background: '#fff', display: 'flex', gap: 10, alignItems: 'center' }}>
          <input
            type="text"
            className="form-control"
            placeholder="Ask about an IT problem..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
            style={{ height: 38 }}
          />
          <Button
            variant="primary"
            onClick={() => handleSend()}
            disabled={!query.trim() || loading}
            style={{ height: 38, padding: '0 16px' }}
          >
            Send
          </Button>
        </div>
      </div>
    </div>
  );
};
