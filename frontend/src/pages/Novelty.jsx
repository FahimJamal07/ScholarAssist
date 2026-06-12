import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Search,
  AlertTriangle,
  CheckCircle2,
  FileText,
  Target,
  BarChart,
  Layers,
  ArrowRight,
  RotateCcw,
  Zap,
} from 'lucide-react';
import PageHeader from '../components/ui/PageHeader.jsx';
import Card from '../components/ui/Card.jsx';
import Button from '../components/ui/Button.jsx';
import { paperService } from '../services/paperService.js';

/**
 * Score utility functions
 */
function getScoreColor(score) {
  if (score >= 80) return 'text-emerald-400';
  if (score >= 50) return 'text-amber-400';
  return 'text-rose-400';
}

function getScoreBgColor(score) {
  if (score >= 80) return 'bg-emerald-500/10';
  if (score >= 50) return 'bg-amber-500/10';
  return 'bg-rose-500/10';
}

function getScoreBorderColor(score) {
  if (score >= 80) return 'border-emerald-500/20';
  if (score >= 50) return 'border-amber-500/20';
  return 'border-rose-500/20';
}

function getScoreLabel(score) {
  if (score >= 80) return 'Highly Novel';
  if (score >= 50) return 'Moderately Novel';
  return 'Low Novelty';
}

function getScoreStroke(score) {
  if (score >= 80) return 'stroke-emerald-400';
  if (score >= 50) return 'stroke-amber-400';
  return 'stroke-rose-400';
}

/**
 * Animated Circular Score Indicator
 */
function CircularScore({ score }) {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    const duration = 1500;
    const steps = 60;
    const stepTime = duration / steps;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      setAnimatedScore(Math.round((score * currentStep) / steps));
      if (currentStep >= steps) clearInterval(timer);
    }, stepTime);

    return () => clearInterval(timer);
  }, [score]);

  const strokeDashoffset = 100 - animatedScore;

  return (
    <div className="relative w-32 h-32 flex items-center justify-center">
      <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 36 36">
        <circle
          cx="18" cy="18" r="15.9155" fill="none"
          className="stroke-slate-800" strokeWidth="3"
        />
        <motion.circle
          cx="18" cy="18" r="15.9155" fill="none"
          className={getScoreStroke(score)}
          strokeWidth="3"
          strokeDasharray="100 100"
          initial={{ strokeDashoffset: 100 }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center">
        <span className={`text-4xl font-bold font-display ${getScoreColor(score)}`}>
          {animatedScore}
        </span>
        <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider mt-1">
          / 100
        </span>
      </div>
    </div>
  );
}

/**
 * GenerationLoader — Multi-phase loading animation
 */
function GenerationLoader() {
  const [phase, setPhase] = useState(0);
  const phases = [
    { label: 'Extracting key concepts...', icon: FileText },
    { label: 'Querying vector database...', icon: Layers },
    { label: 'Computing semantic distance...', icon: BarChart },
    { label: 'Generating novelty report...', icon: Sparkles },
  ];

  useEffect(() => {
    const timer1 = setTimeout(() => setPhase(1), 1500);
    const timer2 = setTimeout(() => setPhase(2), 3500);
    const timer3 = setTimeout(() => setPhase(3), 6000);
    return () => { clearTimeout(timer1); clearTimeout(timer2); clearTimeout(timer3); };
  }, []);

  const current = phases[phase] || phases[0];
  const Icon = current.icon;

  return (
    <Card>
      <div className="flex flex-col items-center justify-center py-10">
        <div className="relative mb-6">
          <div className="p-4 rounded-2xl bg-brand-500/10 border border-brand-500/20">
            <Icon className="h-8 w-8 text-brand-400" />
          </div>
          <div className="absolute inset-0 rounded-2xl bg-brand-500/10 animate-glow-pulse" />
        </div>

        <motion.p
          key={phase}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-slate-300 font-medium mb-5"
        >
          {current.label}
        </motion.p>

        <div className="flex items-center gap-2">
          {phases.map((_, idx) => (
            <div
              key={idx}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                idx <= phase ? 'w-8 bg-brand-500' : 'w-1.5 bg-slate-700'
              }`}
            />
          ))}
        </div>
      </div>
    </Card>
  );
}

/**
 * Novelty - Full-featured Novelty Detection page
 */
function Novelty() {
  const [paperId, setPaperId] = useState('');
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState(null);
  const [error, setError] = useState(null);

  const handleAnalyze = async () => {
    if (!paperId.trim()) {
      setError('Please provide a Paper ID to analyze.');
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
        setError(res.error || 'Novelty analysis failed. Please try again.');
      }
    } catch (err) {
      setError(
        err.response?.data?.detail ||
        err.response?.data?.error ||
        err.message ||
        'An unexpected error occurred during novelty detection.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAnalyze();
    }
  };

  return (
    <div className="page-container">
      {/* Header */}
      <PageHeader
        icon={Sparkles}
        title="Novelty & Gap Detection"
        subtitle="Evaluate research originality by comparing your paper or abstract against the entire knowledge base using semantic vector analysis."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Input Section */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
          >
            <Card className="relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                <Target className="h-32 w-32" />
              </div>
              
              <div className="relative z-10 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Abstract or Paper ID
                  </label>
                  <textarea
                    rows={4}
                    value={paperId}
                    onChange={(e) => setPaperId(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="e.g., Enter paper_001 or paste an abstract to analyze its novelty against the knowledge base..."
                    className="input-field resize-none text-sm leading-relaxed"
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-slate-500">
                    Press Enter to analyze
                  </span>
                  <Button
                    onClick={handleAnalyze}
                    loading={loading}
                    disabled={!paperId.trim() || loading}
                    icon={Search}
                    size="md"
                  >
                    Analyze Novelty
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Error display */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <Card className="border-rose-500/20">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-rose-400 shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-rose-300">Analysis Failed</p>
                      <p className="text-xs text-rose-400/80 mt-1">{error}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={RotateCcw}
                      onClick={handleAnalyze}
                      disabled={!paperId.trim()}
                    >
                      Retry
                    </Button>
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Loading state */}
          <AnimatePresence>
            {loading && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
              >
                <GenerationLoader />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Results Area */}
          <AnimatePresence>
            {report && !loading && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, staggerChildren: 0.1 }}
                className="space-y-6"
              >
                {/* Score & Summary Card */}
                <Card className={`border-2 ${getScoreBorderColor(report.novelty_score)}`}>
                  <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
                    {/* Score Circle */}
                    <div className="shrink-0 flex flex-col items-center">
                      <CircularScore score={report.novelty_score} />
                      <div className={`mt-3 px-3 py-1 rounded-full ${getScoreBgColor(report.novelty_score)}`}>
                        <span className={`text-xs font-bold uppercase tracking-wider ${getScoreColor(report.novelty_score)}`}>
                          {getScoreLabel(report.novelty_score)}
                        </span>
                      </div>
                    </div>

                    {/* Summary */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-3">
                        <Zap className={`h-5 w-5 ${getScoreColor(report.novelty_score)}`} />
                        <h3 className="text-lg font-bold text-white font-display">Executive Summary</h3>
                      </div>
                      <p className="text-sm text-slate-300 leading-relaxed bg-slate-900/50 p-4 rounded-xl border border-slate-700/50">
                        {report.summary}
                      </p>
                    </div>
                  </div>
                </Card>

                {/* Overlap & Gaps Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Overlap Analysis */}
                  {report.overlap_analysis && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                      <Card className="h-full flex flex-col">
                        <div className="flex items-center gap-2 mb-3">
                          <Layers className="h-4 w-4 text-brand-400" />
                          <h3 className="text-sm font-semibold text-white">Overlap Analysis</h3>
                        </div>
                        <p className="text-sm text-slate-400 leading-relaxed flex-1">
                          {report.overlap_analysis}
                        </p>
                      </Card>
                    </motion.div>
                  )}

                  {/* Research Gaps */}
                  {report.research_gap_identified && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                      <Card className="h-full flex flex-col border-emerald-500/20 bg-emerald-500/[0.02]">
                        <div className="flex items-center gap-2 mb-3">
                          <Target className="h-4 w-4 text-emerald-400" />
                          <h3 className="text-sm font-semibold text-emerald-400">Identified Gaps</h3>
                        </div>
                        <p className="text-sm text-slate-300 leading-relaxed flex-1">
                          {report.research_gap_identified}
                        </p>
                      </Card>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {!report && !loading && !error && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
              <div className="flex flex-col items-center justify-center py-16 px-6 text-center border-2 border-dashed border-slate-800 rounded-2xl bg-slate-900/20">
                <div className="w-16 h-16 rounded-2xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center mb-4">
                  <Sparkles className="h-8 w-8 text-brand-400" />
                </div>
                <h3 className="text-lg font-semibold text-white font-display mb-2">Ready to Analyze</h3>
                <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
                  Enter a paper ID or paste an abstract above to evaluate its novelty and identify research gaps against your knowledge base.
                </p>
              </div>
            </motion.div>
          )}
        </div>

        {/* Sidebar - Similar Papers */}
        <div className="lg:col-span-1">
          <AnimatePresence>
            {report?.similar_papers && report.similar_papers.length > 0 ? (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.4 }}
                className="sticky top-6"
              >
                <div className="glass-card p-5 rounded-2xl">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-brand-400" />
                      <h3 className="text-sm font-semibold text-white font-display">Similar Papers</h3>
                    </div>
                    <span className="text-[10px] font-mono text-slate-500 bg-slate-800 px-2 py-0.5 rounded-full">
                      {report.similar_papers.length} found
                    </span>
                  </div>

                  <div className="space-y-3">
                    {report.similar_papers.map((paper, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 + idx * 0.1 }}
                        className="group p-3 rounded-xl bg-slate-800/40 hover:bg-slate-800/80 border border-slate-700/50 hover:border-brand-500/30 transition-all cursor-default"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-mono font-semibold text-brand-300">
                            {paper.id || `Source ${idx + 1}`}
                          </span>
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                            paper.similarity_score >= 0.8 ? 'bg-rose-500/20 text-rose-400' :
                            paper.similarity_score >= 0.6 ? 'bg-amber-500/20 text-amber-400' :
                            'bg-emerald-500/20 text-emerald-400'
                          }`}>
                            {(paper.similarity_score * 100).toFixed(1)}% Match
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed line-clamp-3 group-hover:text-slate-300 transition-colors">
                          {paper.snippet || paper.text || "No snippet available."}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="glass-card p-5 rounded-2xl h-full min-h-[300px] flex flex-col items-center justify-center text-center opacity-60"
              >
                <div className="p-3 rounded-full bg-slate-800 mb-3">
                  <BarChart className="h-6 w-6 text-slate-500" />
                </div>
                <h3 className="text-sm font-medium text-slate-300 mb-1">Similarity Index</h3>
                <p className="text-xs text-slate-500">
                  Similar papers will appear here once analysis is complete.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default Novelty;
