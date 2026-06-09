import React from 'react';

function Novelty() {
  return (
    <div className="p-8 max-w-5xl mx-auto w-full space-y-6">
      <div className="border-b border-slate-800 pb-5">
        <h1 className="text-3xl font-bold tracking-tight text-white">Novelty & Gap Detection</h1>
        <p className="mt-2 text-sm text-slate-400">
          Discover research gaps, identify contradictions, and inspect the methodological novelty of selected documents.
        </p>
      </div>

      <div className="p-6 bg-slate-900 border border-slate-800 rounded-lg space-y-4">
        <h3 className="text-lg font-semibold text-slate-200">Evaluate Novelty</h3>
        <p className="text-sm text-slate-400">
          Select a document to inspect. The system will process vector embeddings, cross-reference them with regional collections, and compute unique scores.
        </p>
        <button className="bg-brand-500 hover:bg-brand-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
          Analyze Novelty
        </button>
      </div>
    </div>
  );
}

export default Novelty;
