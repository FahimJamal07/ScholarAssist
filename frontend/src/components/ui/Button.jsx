import React from 'react';

function Button({ children, onClick, type = 'button', variant = 'primary', className = '' }) {
  const baseStyle = 'px-4 py-2 rounded-lg text-sm font-semibold transition-colors focus:outline-none';
  const variants = {
    primary: 'bg-brand-500 hover:bg-brand-600 text-white',
    secondary: 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseStyle} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}

export default Button;
