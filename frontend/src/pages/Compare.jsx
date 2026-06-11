import React, { useState } from 'react';
import { GitCompareArrows, ArrowRightLeft, FileText } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader.jsx';
import Card from '../components/ui/Card.jsx';
import Button from '../components/ui/Button.jsx';
import Loader from '../components/ui/Loader.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import { paperService } from '../services/paperService.js';

function Compare() {
  const [paperA, setPaperA] = useState('');
  const [paperB, setPaperB] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleCompare = async () => {
    if (!paperA.trim() || !paperB.trim()) {
      setError('Please enter both Paper IDs to compare.');
      return;
    }
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await paperService.comparePapers([paperA.trim(), paperB.trim()]);
      if (res.success) {
        setResult(res.data);
      } else {
        setError(res.error || 'Comparison failed.');
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <PageHeader
        icon={GitCompareArrows}
        title="Compare Research Papers"
        subtitle="Side-by-side comparative analysis of methodologies, datasets, results, and limitations across papers."
      />

      {/* Paper Input */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Paper A — ID</label>
          <input
            type="text"
            value={paperA}
            onChange={(e) => setPaperA(e.target.value)}
            placeholder="e.g., paper_001"
            className="input-field"
          />
        </Card>
        <Card>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Paper B — ID</label>
          <input
            type="text"
            value={paperB}
            onChange={(e) => setPaperB(e.target.value)}
            placeholder="e.g., paper_002"
            className="input-field"
          />
        </Card>
      </div>

      <div className="flex justify-center">
        <Button onClick={handleCompare} loading={loading} icon={ArrowRightLeft} size="lg">
          Run Comparative Analysis
        </Button>
      </div>

      {error && (
        <Card className="border-red-500/30 animate-slide-up">
          <p className="text-sm text-red-300">{error}</p>
        </Card>
      )}

      {loading && (
        <Card>
          <Loader text="Running comparative analysis across both documents..." />
        </Card>
      )}

      {result && !loading && (
        <Card className="animate-slide-up">
          <h2 className="text-lg font-semibold text-white font-display mb-4">Comparative Analysis Results</h2>
          <div className="prose prose-sm prose-invert max-w-none text-slate-300 leading-relaxed whitespace-pre-wrap">
            {typeof result === 'string' ? result : JSON.stringify(result, null, 2)}
          </div>
        </Card>
      )}

      {!result && !loading && !error && (
        <EmptyState
          icon={FileText}
          title="No comparison yet"
          description="Enter two paper IDs above to generate a detailed side-by-side comparative analysis."
        />
      )}
    </div>
  );
}

export default Compare;
