import React from 'react';

const Card = ({ children, className = '', isExpired = false, onClick }) => {
  const cardStyle = {
    background: isExpired ? '#fff8f8' : 'var(--bg-card)',
    borderRadius: '8px',
    border: isExpired 
      ? '1px solid #fca5a5' 
      : '1px solid var(--border-color)',
    padding: '20px',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px 0 rgba(0, 0, 0, 0.03)',
    cursor: onClick ? 'pointer' : 'default',
    position: 'relative'
  };

  const getClassName = () => {
    return `custom-card ${className}`;
  };

  return (
    <div 
      className={getClassName()} 
      style={cardStyle} 
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default Card;
