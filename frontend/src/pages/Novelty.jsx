import React, { useState } from 'react';
import { Sparkles, Search, AlertTriangle, CheckCircle2, FileText } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader.jsx';
import Card from '../components/ui/Card.jsx';
import Button from '../components/ui/Button.jsx';
import Loader from '../components/ui/Loader.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import { paperService } from '../services/paperService.js';

function getScoreColor(score) {
  if (score >= 80) return 'text-accent-emerald';
  if (score >= 50) return 'text-accent-amber';
  return 'text-accent-rose';
}

function getScoreLabel(score) {
  if (score >= 80) return 'Highly Novel';
  if (score >= 50) return 'Moderately Novel';
  return 'Low Novelty';
}

function Novelty() {
  const [paperId, setPaperId] = useState('');
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState(null);
  const [error, setError] = useState(null);

  const handleAnalyze = async () => {
    if (!paperId.trim()) {
      setError('Please enter a Paper ID.');
      return;
    }
    setLoading(true);
    setError(null);
    setReport(null);
    try {
      const res = await paperService.detectNovelty(paperId.trim());
      if (res.success) {
        setReport(res.data);
      } else {
        setError(res.error || 'Novelty analysis failed.');
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
        icon={Sparkles}
        title="Novelty & Gap Detection"
        subtitle="Evaluate research originality by comparing against your knowledge base using semantic vector analysis."
      />

      {/* Input */}
      <Card>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Paper ID</label>
            <input
              type="text"
              value={paperId}
              onChange={(e) => setPaperId(e.target.value)}
              placeholder="e.g., paper_001"
              className="input-field"
            />
          </div>
          <div className="flex items-end">
            <Button onClick={handleAnalyze} loading={loading} icon={Search} size="lg">
              Analyze Novelty
            </Button>
          </div>
        </div>
      </Card>

      {error && (
        <Card className="border-red-500/30 animate-slide-up">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-red-400 shrink-0" />
            <p className="text-sm text-red-300">{error}</p>
          </div>
        </Card>
      )}

      {loading && (
        <Card>
          <Loader text="Running semantic similarity analysis and computing novelty score..." size="lg" />
        </Card>
      )}

      {report && !loading && (
        <div className="space-y-4 animate-slide-up">
          {/* Novelty Score */}
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Novelty Score</p>
                <div className="flex items-baseline gap-3 mt-1">
                  <span className={`text-4xl font-bold font-display ${getScoreColor(report.novelty_score)}`}>
                    {report.novelty_score}
                  </span>
                  <span className="text-lg text-slate-500 font-medium">/ 100</span>
                </div>
                <p className={`mt-1 text-sm font-medium ${getScoreColor(report.novelty_score)}`}>
                  {getScoreLabel(report.novelty_score)}
                </p>
              </div>
              <div className="relative w-20 h-20">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="15.9" fill="none" className="stroke-slate-800" strokeWidth="3" />
                  <circle
                    cx="18" cy="18" r="15.9" fill="none"
                    className={report.novelty_score >= 80 ? 'stroke-accent-emerald' : report.novelty_score >= 50 ? 'stroke-accent-amber' : 'stroke-accent-rose'}
                    strokeWidth="3"
                    strokeDasharray={`${report.novelty_score} ${100 - report.novelty_score}`}
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>
          </Card>

          {/* Summary */}
          {report.summary && (
            <Card>
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="h-4 w-4 text-brand-400" />
                <h3 className="text-sm font-semibold text-white">Summary</h3>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">{report.summary}</p>
            </Card>
          )}

          {/* Overlap Analysis */}
          {report.overlap_analysis && (
            <Card>
              <h3 className="text-sm font-semibold text-white mb-2">Overlap Analysis</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{report.overlap_analysis}</p>
            </Card>
          )}

          {/* Research Gaps */}
          {report.research_gap_identified && (
            <Card className="border-accent-emerald/20">
              <h3 className="text-sm font-semibold text-accent-emerald mb-2">Research Gaps Identified</h3>
              <p className="text-sm text-slate-300 leading-relaxed">{report.research_gap_identified}</p>
            </Card>
          )}

          {/* Similar Papers */}
          {report.similar_papers && report.similar_papers.length > 0 && (
            <Card>
              <h3 className="text-sm font-semibold text-white mb-3">Similar Papers Found</h3>
              <div className="space-y-2">
                {report.similar_papers.map((paper, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-slate-900/60 border border-slate-800/40">
                    <FileText className="h-4 w-4 text-slate-500 mt-0.5 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-mono text-brand-300">{paper.id}</p>
                      <p className="text-xs text-slate-400 mt-1 truncate">{paper.snippet}</p>
                    </div>
                    <span className="text-xs font-semibold text-slate-500 shrink-0">
                      {(paper.similarity_score * 100).toFixed(0)}%
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      )}

      {!report && !loading && !error && (
        <EmptyState
          icon={Sparkles}
          title="No analysis yet"
          description="Enter a paper ID to evaluate its novelty against your research knowledge base."
        />
      )}
    </div>
  );
}

export default Novelty;
