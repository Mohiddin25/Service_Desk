import React, { useState, useEffect } from 'react';
import { Search, Plus, Upload, ChevronDown, ChevronUp, BookOpen } from 'lucide-react';
import { Button } from '../ui/Button';
import { knowledgeApi } from '../../api/knowledgeApi';
import { AddKnowledgeModal } from './AddKnowledgeModal';
import { ImportFaqsModal } from './ImportFaqsModal';
import { useAuth } from '../../context/AuthContext';

export const KnowledgeList = () => {
  const { role } = useAuth();
  const [faqs, setFaqs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [expandedFaqId, setExpandedFaqId] = useState('FAQ-001');

  // Modals
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);

  useEffect(() => {
    loadFaqs();
  }, []);

  const loadFaqs = async () => {
    try {
      const data = await knowledgeApi.getAll();
      setFaqs(data || []);
    } catch (e) {
      console.error(e);
    }
  };

  const categories = ['All', 'Hardware', 'Software', 'Network', 'Account', 'Security'];

  const filteredFaqs = faqs.filter(faq => {
    const matchesCategory = selectedCategory === 'All' || faq.category.toLowerCase() === selectedCategory.toLowerCase();
    const s = searchTerm.toLowerCase();
    const matchesSearch = !searchTerm ||
      faq.question.toLowerCase().includes(s) ||
      faq.answer.toLowerCase().includes(s) ||
      faq.id.toLowerCase().includes(s);
    return matchesCategory && matchesSearch;
  });

  const canEdit = ['technician', 'it_manager', 'system_admin'].includes(role);

  return (
    <div className="view-container">
      {/* Top Header */}
      <div className="view-header">
        <div className="view-header-title">
          <h1 className="page-title">Knowledge Base</h1>
          <span className="metadata-text">Standard IT operational procedures and verified solutions</span>
        </div>

        {canEdit && (
          <div className="view-header-actions">
            <Button
              variant="secondary"
              icon={Upload}
              size="sm"
              onClick={() => setIsImportOpen(true)}
            >
              Import FAQs
            </Button>
            <Button
              variant="primary"
              icon={Plus}
              size="sm"
              onClick={() => setIsAddOpen(true)}
            >
              Add Knowledge
            </Button>
          </div>
        )}
      </div>

      {/* Filter / Search Bar */}
      <div className="card" style={{ marginBottom: 16, padding: '14px 16px' }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: 260 }}>
            <Search size={16} style={{ position: 'absolute', left: 10, top: 9, color: 'var(--text-muted)' }} />
            <input
              type="text"
              className="form-control"
              placeholder="Search knowledge base articles, error codes, topics..."
              style={{ paddingLeft: 34 }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: '5px 12px',
                  fontSize: 13,
                  fontWeight: selectedCategory === cat ? 600 : 500,
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid',
                  borderColor: selectedCategory === cat ? 'var(--primary)' : 'var(--border-subtle)',
                  background: selectedCategory === cat ? 'var(--primary-subtle)' : '#fafbfc',
                  color: selectedCategory === cat ? 'var(--primary)' : 'var(--text-secondary)',
                  cursor: 'pointer'
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ Article List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {filteredFaqs.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-secondary)' }}>
            No knowledge base solutions match your search.
          </div>
        ) : (
          filteredFaqs.map((faq) => {
            const isExpanded = expandedFaqId === faq.id;
            return (
              <div
                key={faq.id}
                className="card"
                style={{
                  padding: 0,
                  overflow: 'hidden',
                  borderColor: isExpanded ? 'var(--border-focus)' : 'var(--border-color)',
                  transition: 'border-color 0.15s ease'
                }}
              >
                <div
                  onClick={() => setExpandedFaqId(isExpanded ? null : faq.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '14px 18px',
                    cursor: 'pointer',
                    background: isExpanded ? '#fafbfc' : '#fff'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span className="table-key" style={{ fontSize: 13 }}>
                      {faq.id}
                    </span>
                    <span style={{ fontSize: 14.5, fontWeight: 600, color: 'var(--text-primary)' }}>
                      {faq.question}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ fontSize: 11.5, padding: '2px 8px', background: '#ebecf0', color: 'var(--text-secondary)', borderRadius: 'var(--radius-sm)', fontWeight: 500 }}>
                      {faq.category}
                    </span>
                    <span className="metadata-text" style={{ minWidth: 80, textAlign: 'right' }}>
                      {faq.updatedAt || 'Updated recently'}
                    </span>
                    {isExpanded ? <ChevronUp size={16} color="var(--text-muted)" /> : <ChevronDown size={16} color="var(--text-muted)" />}
                  </div>
                </div>

                {isExpanded && (
                  <div style={{ padding: '16px 20px', borderTop: '1px solid var(--border-subtle)', background: '#fff', fontSize: 14, lineHeight: 1.6, color: 'var(--text-primary)', whiteSpace: 'pre-wrap' }}>
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      <AddKnowledgeModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onFaqAdded={loadFaqs}
      />

      <ImportFaqsModal
        isOpen={isImportOpen}
        onClose={() => setIsImportOpen(false)}
        onFaqsImported={loadFaqs}
      />
    </div>
  );
};
