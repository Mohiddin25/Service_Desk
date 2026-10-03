import React from 'react';

export const Badge = ({
  type = 'status', // status | priority | sla | role | ai | custom
  value = '',
  label,
  className = '',
  children
}) => {
  const normalized = String(value || '').toLowerCase().replace(/\s+/g, '_');
  let variantClass = '';

  if (type === 'status') {
    variantClass = `badge-status-${normalized}`;
  } else if (type === 'priority') {
    variantClass = `badge-priority-${normalized}`;
  } else if (type === 'sla') {
    variantClass = `badge-sla-${normalized}`;
  } else if (type === 'ai') {
    variantClass = 'badge-ai';
  } else {
    variantClass = 'badge-status-assigned';
  }

  // Format readable label if not explicitly provided
  const displayLabel = label || children || formatBadgeText(normalized);

  return (
    <span className={`badge ${variantClass} ${className}`}>
      {displayLabel}
    </span>
  );
};

const formatBadgeText = (text) => {
  if (!text) return '';
  switch (text) {
    case 'in_progress': return 'In Progress';
    case 'open': return 'Open';
    case 'assigned': return 'Assigned';
    case 'resolved': return 'Resolved';
    case 'closed': return 'Closed';
    case 'reopened': return 'Reopened';
    case 'critical': return 'Critical';
    case 'high': return 'High';
    case 'medium': return 'Medium';
    case 'low': return 'Low';
    case 'on_track': return 'On Track';
    case 'at_risk': return 'At Risk';
    case 'breached': return 'SLA Breached';
    case 'in_inventory': return 'Available';
    case 'under_repair': return 'Maintenance';
    case 'retired': return 'Retired';
    default:
      return text.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }
};
