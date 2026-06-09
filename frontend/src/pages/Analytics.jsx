import React from 'react';

function Analytics() {
  return (
    <div className="p-8 max-w-7xl mx-auto w-full space-y-6">
      <div className="border-b border-slate-800 pb-5">
        <h1 className="text-3xl font-bold tracking-tight text-white">Citation & Paper Analytics</h1>
        <p className="mt-2 text-sm text-slate-400">
          Visualize distribution graphs, reference connections, and keyword densities.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-lg">
          <h2 className="text-lg font-semibold text-slate-200 mb-4">Keyword Frequency</h2>
          <div className="h-64 flex items-center justify-center border border-slate-800 rounded bg-slate-950 text-slate-500 text-sm">
            [Chart Placeholder]
          </div>
        </div>
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-lg">
          <h2 className="text-lg font-semibold text-slate-200 mb-4">Citation Connections</h2>
          <div className="h-64 flex items-center justify-center border border-slate-800 rounded bg-slate-950 text-slate-500 text-sm">
            [Network Graph Placeholder]
          </div>
        </div>
      </div>
    </div>
  );
}

export default Analytics;
