import React from 'react';

function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center animate-fade-in">
      {Icon && (
        <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/40 mb-5">
          <Icon className="h-10 w-10 text-slate-500" />
        </div>
      )}
      <h3 className="text-lg font-semibold text-slate-300 font-display">{title}</h3>
      {description && (
        <p className="mt-2 text-sm text-slate-500 max-w-sm">{description}</p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export default EmptyState;
