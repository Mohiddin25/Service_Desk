import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Input, Select, Textarea } from '../ui/Input';
import { Button } from '../ui/Button';
import { knowledgeApi } from '../../api/knowledgeApi';

export const AddKnowledgeModal = ({ isOpen, onClose, onFaqAdded }) => {
  const [question, setQuestion] = useState('');
  const [category, setCategory] = useState('Network');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim() || !answer.trim()) {
      setError('Please provide both question and answer');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await knowledgeApi.addFaq({
        question: question.trim(),
        category,
        answer: answer.trim()
      });

      if (onFaqAdded) onFaqAdded();
      setQuestion('');
      setAnswer('');
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to add knowledge article');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Knowledge"
      size="md"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit} loading={loading}>
            Add Knowledge
          </Button>
        </>
      }
    >
      {error && (
        <div style={{ padding: '8px 12px', background: 'var(--status-red-bg)', color: 'var(--status-red-text)', borderRadius: 'var(--radius-sm)', fontSize: 13, marginBottom: 14 }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <Input
          label="Question"
          required
          placeholder="e.g. How do I configure corporate VPN on macOS?"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />

        <Select
          label="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          options={[
            { value: 'Network', label: 'Network' },
            { value: 'Hardware', label: 'Hardware' },
            { value: 'Software', label: 'Software' },
            { value: 'Account', label: 'Account' },
            { value: 'Security', label: 'Security' },
            { value: 'General', label: 'General' }
          ]}
        />

        <Textarea
          label="Answer"
          required
          rows={6}
          placeholder="Provide step-by-step resolution instructions..."
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
        />
      </form>
    </Modal>
  );
};
