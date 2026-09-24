import React from 'react';
import { Clock, AlertTriangle, ShieldCheck } from 'lucide-react';

export const SlaBar = ({ responsePercent = 85, resolutionPercent = 60, isBreached = false }) => {
  let statusTag = 'On Track';
  let statusColor = '#059669';
  let badgeClass = 'badge-resolved';

  if (isBreached) {
    statusTag = 'Breached';
    statusColor = '#dc2626';
    badgeClass = 'badge-breach';
  } else if (resolutionPercent < 40 || responsePercent < 40) {
    statusTag = 'At Risk';
    statusColor = '#d97706';
    badgeClass = 'badge-in_progress';
  }

  return (
    <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: 700, color: '#0f172a' }}>
          <Clock size={15} color={statusColor} />
          <span>SLA Performance Metrics</span>
        </div>
        <span className={`badge ${badgeClass}`}>{statusTag}</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {/* Response SLA */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '4px', color: '#475569' }}>
            <span>First Response SLA</span>
            <span style={{ fontWeight: 700 }}>{responsePercent}%</span>
          </div>
          <div style={{ height: '7px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{ 
              width: `${responsePercent}%`, 
              height: '100%', 
              background: responsePercent < 50 ? '#ef4444' : '#2563eb', 
              borderRadius: '4px' 
            }} />
          </div>
        </div>

        {/* Resolution SLA */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '4px', color: '#475569' }}>
            <span>Target Resolution SLA</span>
            <span style={{ fontWeight: 700 }}>{resolutionPercent}%</span>
          </div>
          <div style={{ height: '7px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{ 
              width: `${resolutionPercent}%`, 
              height: '100%', 
              background: resolutionPercent < 50 ? '#f59e0b' : '#10b981', 
              borderRadius: '4px' 
            }} />
          </div>
        </div>
      </div>
    </div>
  );
};
