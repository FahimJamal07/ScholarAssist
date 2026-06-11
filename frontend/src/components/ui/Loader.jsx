import React from 'react';
import { Loader2 } from 'lucide-react';

function Loader({ text = 'Processing...', size = 'md' }) {
  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-10 w-10',
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3 py-8 animate-fade-in">
      <Loader2 className={`${sizes[size]} text-brand-400 animate-spin`} />
      {text && <p className="text-sm text-slate-400 font-medium">{text}</p>}
    </div>
  );
}

export default Loader;
