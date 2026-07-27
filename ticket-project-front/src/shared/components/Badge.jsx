import React from 'react';

const Badge = ({ text, bgVar, textVar, icon }) => {
  const badgeStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    padding: '4px 10px',
    borderRadius: '20px',
    fontSize: '0.75rem',
    fontWeight: '600',
    backgroundColor: bgVar ? `var(${bgVar})` : '#f1f5f9',
    color: textVar ? `var(${textVar})` : '#475569',
    border: '1px solid transparent',
    letterSpacing: '0.01em'
  };

  return (
    <span style={badgeStyle}>
      {icon && <span style={{ fontSize: '0.8rem' }}>{icon}</span>}
      {text}
    </span>
  );
};

export default Badge;
