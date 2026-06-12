import React from 'react';

/**
 * Card — Reusable glass-morphism card component.
 * Supports hover effects, custom styling, and click handling.
 *
 * @param {React.ReactNode} children - Card content
 * @param {string} className - Additional Tailwind classes
 * @param {boolean} hover - Enable hover effects
 * @param {Function} onClick - Click handler
 * @param {object} style - Inline styles (for animation delays etc.)
 * @param {string} id - Element ID for testing
 */
function Card({ children, className = '', hover = false, onClick, style, id }) {
  return (
    <div
      id={id}
      onClick={onClick}
      style={style}
      className={`${hover ? 'glass-card-hover cursor-pointer' : 'glass-card'} p-5 ${className}`}
    >
      {children}
    </div>
  );
}

export default Card;
