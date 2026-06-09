import React from 'react';

function Compare() {
  return (
    <div className="p-8 max-w-7xl mx-auto w-full space-y-6">
      <div className="border-b border-slate-800 pb-5">
        <h1 className="text-3xl font-bold tracking-tight text-white">Compare Research Papers</h1>
        <p className="mt-2 text-sm text-slate-400">
          Compare methodologies, datasets, results, and limitations across multiple documents side-by-side.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-lg">
          <h2 className="text-lg font-semibold text-slate-200 mb-4">Paper A</h2>
          <div className="text-sm text-slate-400">No paper selected. Select a paper to compare.</div>
        </div>
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-lg">
          <h2 className="text-lg font-semibold text-slate-200 mb-4">Paper B</h2>
          <div className="text-sm text-slate-400">No paper selected. Select a paper to compare.</div>
        </div>
      </div>
    </div>
  );
}

export default Compare;
