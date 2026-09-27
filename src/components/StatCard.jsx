import React from 'react';

const StatCard = ({ title, value, icon: Icon, color = 'var(--primary)', bgColor = 'var(--primary-light)' }) => {
  return (
    <div className="card stat-card card-hover">
      <div className="stat-info">
        <span className="stat-title">{title}</span>
        <span className="stat-value">{value}</span>
      </div>
      {Icon && (
        <div 
          className="stat-icon-wrapper" 
          style={{ backgroundColor: bgColor, color: color }}
        >
          <Icon size={24} />
        </div>
      )}
    </div>
  );
};

export default StatCard;
