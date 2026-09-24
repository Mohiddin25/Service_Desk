import React from 'react';
import { User, Globe, Cpu, Database, Brain, MessageSquare, ArrowDown, Sparkles } from 'lucide-react';

export const RagWorkflowDiagram = ({ activeQuery, isLive }) => {
  const queryText = activeQuery || "How do I reset my Windows password?";

  const steps = [
    {
      num: 1,
      title: "1. User Input (Frontend)",
      desc: "User types a question in the chat interface",
      snippet: `"${queryText}"`,
      icon: User,
      color: "#2563eb",
      bg: "#eff6ff"
    },
    {
      num: 2,
      title: "2. API Request (Frontend → Render)",
      desc: "Frontend sends a POST request to your FastAPI API on Render",
      snippet: `POST /rag/query\n{\n  "query": "${queryText}"\n}`,
      icon: Globe,
      color: "#059669",
      bg: "#ecfdf5"
    },
    {
      num: 3,
      title: "3. Create Embedding",
      desc: "The API converts the user question into a vector embedding using sentence-transformers",
      snippet: `[0.023, -0.015, 0.078, ...]\n(768 dimensions)`,
      icon: Cpu,
      color: "#7c3aed",
      bg: "#f5f3ff"
    },
    {
      num: 4,
      title: "4. Search Pinecone",
      desc: "The embedding is sent to Pinecone to find the most relevant FAQ documents",
      snippet: `• Pinecone Vector Search\n• Find top 3-5 similar FAQs\n• Return relevant context with metadata`,
      icon: Database,
      color: "#ea580c",
      bg: "#fff7ed"
    },
    {
      num: 5,
      title: "5. Generate Answer (LLM)",
      desc: "The relevant FAQs and user question are sent to a cloud LLM (e.g., Hugging Face or OpenAI)",
      snippet: `Prompt to LLM:\n"Using knowledge base info...\nQuestion: ${queryText}\nContext: [relevant FAQs from Pinecone]"`,
      icon: Brain,
      color: "#dc2626",
      bg: "#fef2f2"
    },
    {
      num: 6,
      title: "6. Return Response",
      desc: "The API returns the generated answer to the frontend",
      snippet: `JSON Response:\n{\n  "answer": "To reset your password...",\n  "sources": [{ "id": "faq_002" }]\n}`,
      icon: MessageSquare,
      color: "#7c3aed",
      bg: "#f5f3ff"
    },
    {
      num: 7,
      title: "7. Display in Frontend",
      desc: "The frontend shows the AI response and sources in the chat interface",
      snippet: `RAG Complete • ${isLive ? 'Live FastAPI Endpoint' : 'Simulated Pipeline Test'}`,
      icon: Sparkles,
      color: "#059669",
      bg: "#ecfdf5"
    }
  ];

  return (
    <div className="card" style={{ padding: '20px', background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: 'var(--shadow-md)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', borderBottom: '1px solid #f1f5f9', paddingBottom: '12px' }}>
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>Complete RAG Workflow</h3>
          <p style={{ fontSize: '0.775rem', color: '#64748b' }}>From User Prompt to AI Response with Vector Search</p>
        </div>
        <span className="badge badge-resolved" style={{ fontSize: '0.675rem' }}>
          {isLive ? '⚡ Live FastAPI' : '🤖 RAG Pipeline'}
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {steps.map((step, idx) => {
          const StepIcon = step.icon;
          return (
            <React.Fragment key={step.num}>
              <div style={{
                background: step.bg,
                border: `1px solid ${step.color}25`,
                borderRadius: '12px',
                padding: '12px 16px',
                display: 'flex',
                gap: '12px',
                alignItems: 'flex-start'
              }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: step.color,
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <StepIcon size={18} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                    <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0f172a' }}>{step.title}</h4>
                  </div>
                  <p style={{ fontSize: '0.775rem', color: '#475569', marginBottom: '6px', lineHeight: 1.4 }}>{step.desc}</p>
                  <pre style={{
                    background: '#ffffff',
                    padding: '6px 10px',
                    borderRadius: '6px',
                    border: '1px solid #e2e8f0',
                    fontSize: '0.725rem',
                    fontFamily: 'monospace',
                    color: '#334155',
                    whiteSpace: 'pre-wrap',
                    lineHeight: 1.3
                  }}>
                    {step.snippet}
                  </pre>
                </div>
              </div>
              {idx < steps.length - 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', margin: '-6px 0' }}>
                  <ArrowDown size={14} color="#94a3b8" />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
