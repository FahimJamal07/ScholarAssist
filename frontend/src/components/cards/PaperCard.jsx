import React from 'react';

function PaperCard({ title, authors, date, score }) {
  return (
    <div className="p-4 bg-slate-900 border border-slate-800 rounded-lg hover:border-brand-500 transition-colors">
      <div className="flex justify-between items-start gap-4">
        <h3 className="font-semibold text-slate-100 text-sm line-clamp-2">{title}</h3>
        {score && (
          <span className="bg-brand-500/20 text-brand-400 text-xs px-2 py-0.5 rounded font-mono">
            {score}
          </span>
        )}
      </div>
      <p className="mt-1 text-xs text-slate-400 truncate">{authors}</p>
      <div className="mt-4 text-[10px] text-slate-500">{date}</div>
    </div>
  );
}

export default PaperCard;
