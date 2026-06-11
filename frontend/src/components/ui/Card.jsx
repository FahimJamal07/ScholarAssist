import React from 'react';

function Card({ children, className = '', hover = false, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`${hover ? 'glass-card-hover cursor-pointer' : 'glass-card'} p-5 ${className}`}
    >
      {children}
    </div>
  );
}

export default Card;
