import React from 'react';
import { Inbox } from 'lucide-react';

export const EmptyState = ({
  icon: Icon = Inbox,
  title = 'No items found',
  description = 'There are no items to display right now.',
  action
}) => {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">
        <Icon size={22} />
      </div>
      <div className="empty-state-title">{title}</div>
      <div className="empty-state-sub">{description}</div>
      {action && <div>{action}</div>}
    </div>
  );
};
