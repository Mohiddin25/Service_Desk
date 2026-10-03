import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Textarea } from '../ui/Input';
import { Button } from '../ui/Button';
import { knowledgeApi } from '../../api/knowledgeApi';

export const ImportFaqsModal = ({ isOpen, onClose, onFaqsImported }) => {
  const sampleJson = JSON.stringify([
    {
      question: "How do I configure Outlook email on iOS?",
      answer: "Download Microsoft Outlook from App Store, sign in with your corporate email, and approve Microsoft Authenticator push notification.",
      category: "Software"
    },
    {
      question: "How do I request an external keyboard or ergonomic mouse?",
      answer: "Submit an IT request under Hardware category specifying your workstation desk number and manager approval.",
      category: "Hardware"
    }
  ], null, 2);

  const [jsonText, setJsonText] = useState(sampleJson);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleImport = async () => {
    try {
      const parsed = JSON.parse(jsonText);
      if (!Array.isArray(parsed) || parsed.length === 0) {
        setError('Please provide a valid JSON array of FAQ objects');
        return;
      }

      setLoading(true);
      setError('');
      await knowledgeApi.addBulkFaqs(parsed);
      if (onFaqsImported) onFaqsImported();
      onClose();
    } catch (err) {
      setError('Invalid JSON format: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Import FAQs"
      size="md"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleImport} loading={loading}>
            Import FAQs
          </Button>
        </>
      }
    >
      <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 12 }}>
        Paste a JSON array of FAQ objects containing <code>question</code>, <code>answer</code>, and <code>category</code>.
      </p>

      {error && (
        <div style={{ padding: '8px 12px', background: 'var(--status-red-bg)', color: 'var(--status-red-text)', borderRadius: 'var(--radius-sm)', fontSize: 13, marginBottom: 12 }}>
          {error}
        </div>
      )}

      <Textarea
        rows={10}
        value={jsonText}
        onChange={(e) => setJsonText(e.target.value)}
        style={{ fontFamily: 'monospace', fontSize: 12 }}
      />
    </Modal>
  );
};
