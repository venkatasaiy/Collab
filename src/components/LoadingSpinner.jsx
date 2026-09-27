import React from 'react';

const LoadingSpinner = ({ message = "Loading data..." }) => {
  return (
    <div className="loading-spinner-wrapper">
      <div className="spinner"></div>
      <p style={{ fontSize: '0.9rem', fontWeight: 500 }}>{message}</p>
    </div>
  );
};

export default LoadingSpinner;
