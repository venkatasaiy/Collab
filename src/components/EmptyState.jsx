import React from 'react';
import { BookOpen } from 'lucide-react';

const EmptyState = ({
  icon: Icon = BookOpen,
  title = "No records found",
  description = "There are no entries matching your criteria.",
  actionButton = null,
}) => {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">
        <Icon size={48} strokeWidth={1.5} />
      </div>
      <h3>{title}</h3>
      <p style={{ maxWidth: '400px', margin: '0 auto 1.25rem auto', fontSize: '0.875rem' }}>
        {description}
      </p>
      {actionButton}
    </div>
  );
};

export default EmptyState;
