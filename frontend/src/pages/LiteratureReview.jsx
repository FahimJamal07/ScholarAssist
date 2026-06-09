import React from 'react';

function LiteratureReview() {
  return (
    <div className="p-8 max-w-5xl mx-auto w-full space-y-6">
      <div className="border-b border-slate-800 pb-5">
        <h1 className="text-3xl font-bold tracking-tight text-white">Literature Review Generator</h1>
        <p className="mt-2 text-sm text-slate-400">
          Synthesize long-form thematic analyses across your libraries, powered by Claude.
        </p>
      </div>

      <div className="p-6 bg-slate-900 border border-slate-800 rounded-lg space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-300">Thematic Review Prompt</label>
          <textarea
            rows={4}
            className="mt-1 block w-full bg-slate-950 border border-slate-700 rounded-md p-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-brand-500"
            placeholder="e.g. Synthesize the findings on transformer self-attention performance optimizations under sparse conditions."
          />
        </div>
        <button className="bg-brand-500 hover:bg-brand-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
          Generate Review
        </button>
      </div>
    </div>
  );
}

export default LiteratureReview;
