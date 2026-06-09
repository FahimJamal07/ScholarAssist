import React from 'react';

function StatCard({ title, value, description }) {
  return (
    <div className="rounded-lg bg-slate-900 px-4 py-5 shadow border border-slate-800">
      <p className="truncate text-sm font-medium text-slate-400">{title}</p>
      <p className="mt-1 text-3xl font-semibold text-white">{value}</p>
      {description && <p className="mt-1 text-xs text-slate-500">{description}</p>}
    </div>
  );
}

export default StatCard;
