import React, { useState, useEffect } from 'react';
import { Search, Plus, UploadCloud, Trash2, X } from 'lucide-react';
import { api } from '../api/client';
import { useToast } from '../context/ToastContext';

export const KnowledgeBaseView = ({ onOpenAddFaqModal, onOpenBulkModal }) => {
  const { addToast } = useToast();
  const [faqs, setFaqs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedFaq, setSelectedFaq] = useState(null);

  useEffect(() => {
    loadFaqs();
  }, []);

  const loadFaqs = async () => {
    try {
      const data = await api.ai.getFaqs();
      setFaqs(data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.ai.deleteFaq(id);
      addToast("FAQ removed from Knowledge Base.", "info");
      loadFaqs();
      if (selectedFaq?.id === id) setSelectedFaq(null);
    } catch (err) {
      addToast("Failed to delete FAQ.", "error");
    }
  };

  const categories = ['all', 'hardware', 'software', 'network', 'account', 'security'];

  const filteredFaqs = faqs.filter(f => {
    const qText = (f.question || '').toLowerCase();
    const aText = (f.answer || '').toLowerCase();
    const idText = (f.id || '').toLowerCase();
    const search = searchTerm.toLowerCase();

    const matchesSearch = qText.includes(search) || aText.includes(search) || idText.includes(search);
    const matchesCategory = selectedCategory === 'all' || (f.category || '').toLowerCase() === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="content-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text)' }}>Knowledge Base</h1>
          <p style={{ fontSize: '13px', color: 'var(--text-2)' }}>
            Browse and manage the information used by the AI Assistant.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="btn btn-primary" onClick={onOpenAddFaqModal}>
            <Plus size={16} />
            <span>+ Add FAQ</span>
          </button>
          <button className="btn btn-secondary" onClick={onOpenBulkModal}>
            <UploadCloud size={16} />
            <span>Import FAQs</span>
          </button>
        </div>
      </div>

      {/* Search and Category Filters */}
      <div className="card" style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ position: 'relative', width: '100%' }}>
          <Search size={15} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-3)' }} />
          <input 
            type="text" 
            className="input" 
            placeholder="Search knowledge..." 
            style={{ paddingLeft: '32px', height: '36px', fontSize: '13px' }}
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Category Filter Pills */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {categories.map(cat => (
            <button 
              key={cat}
              className={`chip ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
              style={{ 
                textTransform: 'capitalize',
                fontSize: '12.5px',
                padding: '4px 12px',
                background: selectedCategory === cat ? 'var(--blue)' : 'var(--bg)',
                color: selectedCategory === cat ? '#ffffff' : 'var(--text-2)',
                borderColor: selectedCategory === cat ? 'var(--blue)' : 'var(--border)'
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main FAQ List & Detail View */}
      <div style={{ display: 'grid', gridTemplateColumns: selectedFaq ? '1.4fr 1fr' : '1fr', gap: '16px' }} className="kb-grid">
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div className="table-container" style={{ border: 'none' }}>
            <table className="table">
              <thead>
                <tr>
                  <th style={{ width: '110px' }}>ID</th>
                  <th style={{ width: '120px' }}>Category</th>
                  <th>Question</th>
                  <th style={{ width: '90px', textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredFaqs.length === 0 ? (
                  <tr>
                    <td colSpan="4" style={{ textAlign: 'center', padding: '32px', color: 'var(--text-3)' }}>
                      No knowledge articles found.
                    </td>
                  </tr>
                ) : (
                  filteredFaqs.map(faq => (
                    <tr 
                      key={faq.id} 
                      style={{ 
                        background: selectedFaq?.id === faq.id ? 'var(--blue-light)' : 'transparent', 
                        cursor: 'pointer' 
                      }} 
                      onClick={() => setSelectedFaq(faq)}
                    >
                      <td style={{ fontWeight: 600, fontFamily: 'monospace', color: 'var(--blue)' }}>
                        {faq.id}
                      </td>
                      <td>
                        <span className="badge badge-open" style={{ textTransform: 'capitalize' }}>
                          {faq.category}
                        </span>
                      </td>
                      <td style={{ fontWeight: 500, color: 'var(--text)' }}>
                        {faq.question}
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <button 
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '3px 8px', fontSize: '11.5px' }}
                          onClick={(e) => { e.stopPropagation(); setSelectedFaq(faq); }}
                        >
                          View →
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Selected FAQ Detail Card */}
        {selectedFaq && (
          <div className="card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--border)', paddingBottom: '10px' }}>
              <div>
                <span style={{ fontSize: '11px', fontFamily: 'monospace', color: 'var(--blue)', fontWeight: 700 }}>
                  {selectedFaq.id}
                </span>
                <h3 style={{ fontSize: '14.5px', fontWeight: 600, color: 'var(--text)', marginTop: '2px' }}>
                  {selectedFaq.question}
                </h3>
              </div>
              <button className="btn btn-ghost btn-sm" style={{ padding: '2px' }} onClick={() => setSelectedFaq(null)}>
                <X size={16} />
              </button>
            </div>

            <div>
              <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', marginBottom: '4px' }}>
                Category
              </div>
              <span className="badge badge-assigned" style={{ textTransform: 'capitalize' }}>
                {selectedFaq.category}
              </span>
            </div>

            <div>
              <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', marginBottom: '4px' }}>
                Answer
              </div>
              <div style={{ background: 'var(--bg)', padding: '12px', borderRadius: 'var(--radius)', border: '1px solid var(--border)', fontSize: '13px', color: 'var(--text)', lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>
                {selectedFaq.answer}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'auto', paddingTop: '10px' }}>
              <button 
                className="btn btn-danger btn-sm" 
                onClick={() => handleDelete(selectedFaq.id)}
                style={{ fontSize: '12px' }}
              >
                <Trash2 size={13} />
                <span>Delete</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
