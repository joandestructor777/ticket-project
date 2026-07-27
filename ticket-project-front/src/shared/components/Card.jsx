import React from 'react';

const Card = ({ children, className = '', isExpired = false, onClick }) => {
  const cardStyle = {
    background: isExpired ? '#fff8f8' : 'var(--bg-card)',
    borderRadius: '10px',
    border: isExpired
      ? '1px solid #fca5a5'
      : '1px solid var(--border-color)',
    padding: '20px',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
    cursor: onClick ? 'pointer' : 'default',
    position: 'relative',
    transition: 'transform 0.15s ease, box-shadow 0.15s ease'
  };

  return (
    <div
      className={`custom-card ${className}`}
      style={cardStyle}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default Card;
