import React from 'react';

export const Loading = ({ text = 'Loading...' }) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', gap: 10, color: 'var(--text-secondary)' }}>
      <div style={{ width: 18, height: 18, border: '2px solid var(--border-color)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
      <span style={{ fontSize: 13.5 }}>{text}</span>
    </div>
  );
};
