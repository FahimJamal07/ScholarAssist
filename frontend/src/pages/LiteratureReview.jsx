import React, { useState } from 'react';
import { BookOpenText, Wand2, FileText, Lightbulb, FlaskConical, GitFork, Target } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader.jsx';
import Card from '../components/ui/Card.jsx';
import Button from '../components/ui/Button.jsx';
import Loader from '../components/ui/Loader.jsx';
import { paperService } from '../services/paperService.js';

const sectionIcons = {
  introduction: Lightbulb,
  methodology_trends: FlaskConical,
  comparative_analysis: GitFork,
  research_gaps: Target,
  conclusion: BookOpenText,
};

const sectionLabels = {
  introduction: 'Introduction',
  methodology_trends: 'Methodology Trends',
  comparative_analysis: 'Comparative Analysis',
  research_gaps: 'Research Gaps',
  conclusion: 'Conclusion',
};

function LiteratureReview() {
  const [prompt, setPrompt] = useState('');
  const [paperIds, setPaperIds] = useState('');
  const [loading, setLoading] = useState(false);
  const [review, setReview] = useState(null);
  const [error, setError] = useState(null);
  const [activeSection, setActiveSection] = useState(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Please provide a thematic review prompt.');
      return;
    }
    setLoading(true);
    setError(null);
    setReview(null);
    try {
      const ids = paperIds.trim() ? paperIds.split(',').map((id) => id.trim()) : [];
      const res = await paperService.generateLiteratureReview(prompt.trim(), ids);
      if (res.success) {
        setReview(res.data.review);
        setActiveSection('introduction');
      } else {
        setError(res.error || 'Review generation failed.');
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
        icon={BookOpenText}
        title="Literature Review Generator"
        subtitle="Synthesize long-form thematic reviews across your research library. Powered by Claude for deep academic synthesis."
      />

      {/* Input Form */}
      <Card>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Review Theme / Prompt
            </label>
            <textarea
              rows={3}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="input-field resize-none"
              placeholder="e.g., Synthesize findings on transformer self-attention performance optimizations under sparse conditions."
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Paper IDs <span className="text-slate-600 normal-case">(comma-separated, optional)</span>
            </label>
            <input
              type="text"
              value={paperIds}
              onChange={(e) => setPaperIds(e.target.value)}
              className="input-field"
              placeholder="e.g., paper_001, paper_002, paper_003"
            />
          </div>
          <Button onClick={handleGenerate} loading={loading} icon={Wand2} size="lg">
            Generate Literature Review
          </Button>
        </div>
      </Card>

      {error && (
        <Card className="border-red-500/30 animate-slide-up">
          <p className="text-sm text-red-300">{error}</p>
        </Card>
      )}

      {loading && (
        <Card>
          <Loader text="Claude is synthesizing your literature review. This may take a moment..." size="lg" />
        </Card>
      )}

      {/* Review Output */}
      {review && !loading && (
        <div className="animate-slide-up space-y-4">
          {/* Section Tabs */}
          <div className="flex flex-wrap gap-2">
            {Object.keys(sectionLabels).map((key) => {
              const Icon = sectionIcons[key] || FileText;
              const isActive = activeSection === key;
              return (
                <button
                  key={key}
                  onClick={() => setActiveSection(key)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-brand-500/15 text-brand-300 shadow-glow-sm'
                      : 'bg-slate-800/50 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {sectionLabels[key]}
                </button>
              );
            })}
          </div>

          {/* Active Section Content */}
          {activeSection && review[activeSection] && (
            <Card className="animate-fade-in">
              <div className="flex items-center gap-2 mb-3">
                {React.createElement(sectionIcons[activeSection] || FileText, { className: 'h-5 w-5 text-brand-400' })}
                <h2 className="text-lg font-semibold text-white font-display">{sectionLabels[activeSection]}</h2>
              </div>
              <div className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
                {review[activeSection]}
              </div>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}

export default LiteratureReview;
