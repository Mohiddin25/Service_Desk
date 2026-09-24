import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, Send, Trash2, Copy, RefreshCw, Sparkles, BookOpen, 
  Check, AlertCircle
} from 'lucide-react';
import { api } from '../api/client';
import { useToast } from '../context/ToastContext';

export const AIAssistantView = () => {
  const { addToast } = useToast();
  const [query, setQuery] = useState('');
  const [copiedIdx, setCopiedIdx] = useState(null);
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: 'Hello! I am your IT Assistant. Ask any question about office Wi-Fi, hardware, software, VPN, or account access.',
      sources: [],
      time: 'Just now'
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorState, setErrorState] = useState(null);
  const [lastQuery, setLastQuery] = useState('');
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading]);

  const handleSendQuery = async (promptText) => {
    if (!promptText.trim()) return;

    setErrorState(null);
    setLastQuery(promptText);
    const userMsg = {
      sender: 'user',
      text: promptText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const res = await api.ai.query(promptText);
      const sourcesList = res.sources || (res.sourceArticles ? res.sourceArticles.map(a => ({ id: a.title, category: 'knowledge' })) : []);
      const aiMsg = {
        sender: 'ai',
        text: res.answer || "I found relevant guidance in our knowledge base.",
        sources: sourcesList,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      setErrorState("AI assistant is currently unreachable. Please verify your connection or try again.");
      addToast("Failed to reach AI service.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSendQuery(query);
    setQuery('');
  };

  const handleClearChat = () => {
    setMessages([]);
    setErrorState(null);
    addToast("Chat cleared.", "info");
  };

  const handleCopy = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    addToast("Copied to clipboard.", "success");
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  const handleRegenerate = () => {
    if (lastQuery) {
      handleSendQuery(lastQuery);
    }
  };

  const suggestions = [
    "Reset my password",
    "Wi-Fi isn't working",
    "Account is locked",
    "Install software"
  ];

  return (
    <div className="content-body" style={{ maxWidth: '820px', display: 'flex', flexDirection: 'column', height: 'calc(100vh - var(--nav-h) - 48px)' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <div>
          <h1 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text)' }}>AI Assistant</h1>
          <p style={{ fontSize: '13px', color: 'var(--text-2)' }}>Ask questions about your IT problems.</p>
        </div>

        {messages.length > 0 && (
          <button 
            className="btn btn-ghost btn-sm" 
            onClick={handleClearChat}
            style={{ color: 'var(--text-3)' }}
            title="Clear conversation"
          >
            <Trash2 size={15} />
            <span>Clear</span>
          </button>
        )}
      </div>

      {/* Main Chat Container */}
      <div className="card" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: 0 }}>
        {/* Messages Stream */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px', background: 'var(--surface)' }}>
          {messages.length === 0 ? (
            <div style={{ margin: 'auto', textAlign: 'center', color: 'var(--text-3)', padding: '40px 20px' }}>
              <Bot size={36} color="var(--blue)" style={{ margin: '0 auto 10px auto' }} />
              <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text)', marginBottom: '4px' }}>How can I help you today?</div>
              <p style={{ fontSize: '13px' }}>Ask an IT question or pick a prompt below.</p>
            </div>
          ) : (
            messages.map((m, idx) => (
              <div 
                key={idx} 
                style={{
                  alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '82%',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px'
                }}
              >
                <div style={{
                  background: m.sender === 'user' ? 'var(--blue)' : 'var(--bg)',
                  color: m.sender === 'user' ? '#ffffff' : 'var(--text)',
                  padding: '12px 16px',
                  borderRadius: m.sender === 'user' ? '14px 14px 2px 14px' : '14px 14px 14px 2px',
                  border: m.sender === 'ai' ? '1px solid var(--border)' : 'none',
                  fontSize: '13.5px',
                  lineHeight: 1.6,
                  whiteSpace: 'pre-wrap'
                }}>
                  {m.text}

                  {/* Sources Section */}
                  {m.sources && m.sources.length > 0 && (
                    <div style={{ marginTop: '10px', paddingTop: '8px', borderTop: '1px solid var(--border)' }}>
                      <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-3)', textTransform: 'uppercase', marginBottom: '4px' }}>
                        Sources
                      </div>
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                        {m.sources.map((s, sIdx) => {
                          const label = typeof s === 'string' ? s : `${s.id || s.title || 'FAQ'} ${s.category ? `· ${s.category}` : ''}`;
                          return (
                            <span 
                              key={sIdx}
                              style={{ 
                                fontSize: '11.5px', 
                                background: 'var(--surface)', 
                                border: '1px solid var(--border)', 
                                padding: '2px 8px', 
                                borderRadius: 'var(--radius-sm)', 
                                color: 'var(--text-2)' 
                              }}
                            >
                              {label}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* Subtext info & action */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', color: 'var(--text-3)', alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start', padding: '0 4px' }}>
                  <span>{m.time}</span>
                  {m.sender === 'ai' && (
                    <div style={{ display: 'flex', gap: '6px', marginLeft: '4px' }}>
                      <button 
                        onClick={() => handleCopy(m.text, idx)}
                        style={{ background: 'none', border: 'none', color: 'var(--text-3)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '3px', padding: 0 }}
                        title="Copy text"
                      >
                        {copiedIdx === idx ? <Check size={11} color="var(--success)" /> : <Copy size={11} />}
                        <span>{copiedIdx === idx ? 'Copied' : 'Copy'}</span>
                      </button>

                      {idx === messages.length - 1 && (
                        <button 
                          onClick={handleRegenerate}
                          style={{ background: 'none', border: 'none', color: 'var(--text-3)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '3px', padding: 0 }}
                          title="Regenerate"
                        >
                          <RefreshCw size={11} />
                          <span>Retry</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}

          {isLoading && (
            <div style={{ alignSelf: 'flex-start', background: 'var(--bg)', padding: '10px 14px', borderRadius: '12px 12px 12px 2px', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-2)', fontSize: '13px' }}>
              <Sparkles size={14} color="var(--purple)" className="animate-spin" />
              <span>AI is thinking...</span>
            </div>
          )}

          {errorState && (
            <div style={{ background: 'var(--danger-bg)', border: '1px solid var(--danger)', padding: '10px 14px', borderRadius: 'var(--radius)', color: 'var(--danger)', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertCircle size={16} />
              <span>{errorState}</span>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Input Bar & Suggestion Chips */}
        <div style={{ padding: '12px 16px', background: 'var(--surface)', borderTop: '1px solid var(--border)' }}>
          {/* Suggestion Chips */}
          <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', marginBottom: '10px', paddingBottom: '2px' }}>
            {suggestions.map((s, idx) => (
              <button 
                key={idx}
                className="chip"
                onClick={() => handleSendQuery(s)}
                style={{ fontSize: '12px', padding: '4px 10px', whiteSpace: 'nowrap' }}
              >
                {s}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '8px' }}>
            <input 
              type="text" 
              className="input" 
              placeholder="Ask an IT question..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              style={{ flex: 1, height: '38px', fontSize: '13.5px' }}
            />
            <button 
              type="submit" 
              className="btn btn-primary" 
              disabled={isLoading || !query.trim()}
              style={{ width: '38px', height: '38px', padding: 0 }}
            >
              <Send size={15} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
