import React, { useState } from 'react';
import { X, UploadCloud, FileJson, CheckCircle2, AlertCircle } from 'lucide-react';
import { api } from '../api/client';
import { useToast } from '../context/ToastContext';

export const BulkUploadModal = ({ isOpen, onClose, onFaqsUploaded }) => {
  const { addToast } = useToast();
  const [faqs, setFaqs] = useState([]);
  const [fileName, setFileName] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  if (!isOpen) return null;

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const parseJsonFile = (file) => {
    setErrorMsg(null);
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const valid = parsed.every(item => item.question && item.answer);
          if (valid) {
            setFaqs(parsed);
          } else {
            setErrorMsg("Each item in JSON must have 'question' and 'answer' fields.");
          }
        } else {
          setErrorMsg("JSON file must contain an array of FAQs.");
        }
      } catch (err) {
        setErrorMsg("Invalid JSON file format. Please upload valid JSON.");
      }
    };
    reader.readAsText(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      parseJsonFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      parseJsonFile(e.target.files[0]);
    }
  };

  const handleLoadSample = () => {
    const sample25 = Array.from({ length: 25 }, (_, i) => ({
      id: `FAQ-${100 + i}`,
      category: i % 3 === 0 ? 'Network' : i % 3 === 1 ? 'Software' : 'Security',
      question: `Knowledge Base Question #${i + 1}`,
      answer: `Standard resolution procedure for knowledge item #${i + 1}.`
    }));
    setFileName('faqs_sample.json');
    setFaqs(sample25);
    setErrorMsg(null);
  };

  const handleUpload = async () => {
    if (faqs.length === 0) return;

    setIsUploading(true);
    try {
      await api.ai.addBulkFaqs(faqs);
      addToast(`${faqs.length} FAQs added successfully.`, "success");
      if (onFaqsUploaded) onFaqsUploaded();
      onClose();
      setFaqs([]);
      setFileName('');
    } catch (err) {
      addToast("Failed to import FAQs.", "error");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '580px' }}>
        <div className="modal-header" style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: 'var(--radius)', background: 'var(--blue-light)', color: 'var(--blue)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <UploadCloud size={16} />
            </div>
            <div>
              <h2 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text)' }}>Import Knowledge</h2>
              <p style={{ fontSize: '12.5px', color: 'var(--text-3)' }}>Upload a JSON file containing FAQs.</p>
            </div>
          </div>
          <button onClick={onClose} className="btn btn-ghost btn-sm" style={{ padding: '4px' }}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Dropzone */}
          <div 
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            style={{
              border: `2px dashed ${dragActive ? 'var(--blue)' : 'var(--border)'}`,
              borderRadius: 'var(--radius)',
              padding: '28px 20px',
              textAlign: 'center',
              background: dragActive ? 'var(--blue-light)' : 'var(--bg)',
              transition: 'background .15s, border-color .15s'
            }}
          >
            <FileJson size={32} color="var(--blue)" style={{ margin: '0 auto 8px auto' }} />
            <h4 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text)', marginBottom: '4px' }}>
              Drop JSON file here
            </h4>
            <p style={{ fontSize: '12px', color: 'var(--text-3)', marginBottom: '14px' }}>
              Supports .json files containing array of FAQs
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
              <label className="btn btn-secondary btn-sm" style={{ cursor: 'pointer' }}>
                Browse files
                <input type="file" accept=".json" onChange={handleFileInput} style={{ display: 'none' }} />
              </label>

              <button type="button" className="btn btn-ghost btn-sm" onClick={handleLoadSample} style={{ fontSize: '12px' }}>
                Load 25 Sample FAQs
              </button>
            </div>
          </div>

          {/* Error notice */}
          {errorMsg && (
            <div style={{ background: 'var(--danger-bg)', border: '1px solid var(--danger)', padding: '10px 14px', borderRadius: 'var(--radius)', color: 'var(--danger)', fontSize: '12.5px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertCircle size={15} />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Detected FAQs Info */}
          {faqs.length > 0 && (
            <div style={{ background: 'var(--bg)', padding: '12px 16px', borderRadius: 'var(--radius)', border: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--text)' }}>
                  {fileName || 'faqs.json'}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-2)' }}>
                  {faqs.length} FAQs detected
                </div>
              </div>
              <CheckCircle2 size={18} color="var(--success)" />
            </div>
          )}
        </div>

        <div className="modal-footer" style={{ padding: '14px 20px', borderTop: '1px solid var(--border)' }}>
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button 
            type="button" 
            className="btn btn-primary" 
            onClick={handleUpload} 
            disabled={faqs.length === 0 || isUploading}
          >
            <span>{isUploading ? 'Importing...' : 'Import FAQs'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
