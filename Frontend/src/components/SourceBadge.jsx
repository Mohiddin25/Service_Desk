import React from 'react';
import { Tag, Globe, Database, FileText } from 'lucide-react';

export const SourceBadge = ({ source }) => {
  const sourceId = typeof source === 'string' ? source : (source.id || 'FAQ-003');
  const category = typeof source === 'object' ? source.category : 'Knowledge Base';

  return (
    <span className="source-badge">
      <FileText size={12} color="#2563eb" />
      <span>{sourceId.toUpperCase()}</span>
      {category && (
        <span style={{ fontSize: '0.675rem', color: '#64748b', background: '#e2e8f0', padding: '1px 5px', borderRadius: '4px', textTransform: 'capitalize' }}>
          {category}
        </span>
      )}
    </span>
  );
};
