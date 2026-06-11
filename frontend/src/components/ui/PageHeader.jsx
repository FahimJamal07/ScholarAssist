import React from 'react';

function PageHeader({ title, subtitle, icon: Icon, actions }) {
  return (
    <div className="border-b border-slate-800/60 pb-5 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
      <div className="flex items-start gap-3">
        {Icon && (
          <div className="mt-1 p-2 rounded-lg bg-brand-500/10 text-brand-400">
            <Icon className="h-5 w-5" />
          </div>
        )}
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white font-display">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-1.5 text-sm text-slate-400 max-w-2xl">{subtitle}</p>
          )}
        </div>
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}

export default PageHeader;
