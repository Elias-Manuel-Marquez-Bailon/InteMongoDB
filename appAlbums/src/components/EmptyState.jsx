import React from 'react';
import './EmptyState.css';

const EmptyState = () => {
  return (
    <div className="empty-state">
      <div className="empty-icon">🎵</div>
      <h3>No albums found</h3>
      <p>Start by adding your first album!</p>
    </div>
  );
};

export default EmptyState;