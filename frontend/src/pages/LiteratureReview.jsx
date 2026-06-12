import React, { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  BookOpenText,
  Wand2,
  FileText,
  Lightbulb,
  FlaskConical,
  GitFork,
  Target,
  Plus,
  X,
  Copy,
  Check,
  Download,
  RotateCcw,
  Sparkles,
  Cpu,
  ChevronRight,
  AlertCircle,
  Clock,
  Hash,
  ArrowRight,
} from 'lucide-react';
import PageHeader from '../components/ui/PageHeader.jsx';
import Card from '../components/ui/Card.jsx';
import Button from '../components/ui/Button.jsx';
import Loader from '../components/ui/Loader.jsx';
import { paperService } from '../services/paperService.js';

/**
 * Section configuration — maps backend keys to display labels, icons, colors,
 * and descriptions. Drives the section tabs and content rendering.
 */
const SECTIONS = [
  {
    key: 'introduction',
    label: 'Introduction',
    icon: Lightbulb,
    color: 'text-accent-amber',
    bgColor: 'bg-amber-500/10',
    description: 'Overview and scope of the review',
  },
  {
    key: 'methodology_trends',
    label: 'Methodology Trends',
    icon: FlaskConical,
    color: 'text-accent-emerald',
    bgColor: 'bg-emerald-500/10',
    description: 'Analysis of research approaches',
  },
  {
    key: 'comparative_analysis',
    label: 'Comparative Analysis',
    icon: GitFork,
    color: 'text-brand-400',
    bgColor: 'bg-brand-500/10',
    description: 'Cross-paper comparison of findings',
  },
  {
    key: 'research_gaps',
    label: 'Research Gaps',
    icon: Target,
    color: 'text-accent-rose',
    bgColor: 'bg-rose-500/10',
    description: 'Identified gaps and opportunities',
  },
  {
    key: 'conclusion',
    label: 'Conclusion',
    icon: BookOpenText,
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/10',
    description: 'Summary and future directions',
  },
];

/**
 * Suggested review prompts for quick start.
 */
const PROMPT_SUGGESTIONS = [
  'Synthesize findings on transformer self-attention optimization techniques',
  'Compare approaches to retrieval-augmented generation across recent studies',
  'Review methodologies for evaluating LLM reasoning capabilities',
  'Analyze the evolution of multi-modal learning architectures',
];

/**
 * Markdown components for rendering review sections — consistent with chat styling.
 */
const markdownComponents = {
  p: ({ children }) => <p className="mb-3 last:mb-0 leading-relaxed">{children}</p>,
  strong: ({ children }) => <strong className="font-semibold text-white">{children}</strong>,
  em: ({ children }) => <em className="text-slate-300 italic">{children}</em>,
  h1: ({ children }) => <h1 className="text-xl font-bold text-white mt-6 mb-3 font-display">{children}</h1>,
  h2: ({ children }) => <h2 className="text-lg font-bold text-white mt-5 mb-2 font-display">{children}</h2>,
  h3: ({ children }) => <h3 className="text-base font-semibold text-white mt-4 mb-2 font-display">{children}</h3>,
  ul: ({ children }) => <ul className="list-disc list-outside pl-5 space-y-1.5 mb-3 text-slate-300">{children}</ul>,
  ol: ({ children }) => <ol className="list-decimal list-outside pl-5 space-y-1.5 mb-3 text-slate-300">{children}</ol>,
  li: ({ children }) => <li className="text-sm leading-relaxed">{children}</li>,
  a: ({ href, children }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className="text-brand-400 hover:text-brand-300 underline underline-offset-2 transition-colors">
      {children}
    </a>
  ),
  code: ({ inline, children }) => {
    if (inline) {
      return <code className="px-1.5 py-0.5 rounded-md bg-slate-800 text-brand-300 text-xs font-mono border border-slate-700/50">{children}</code>;
    }
    return (
      <pre className="my-3 p-4 rounded-xl bg-slate-900/80 border border-slate-700/40 overflow-x-auto">
        <code className="text-xs font-mono text-slate-300 leading-relaxed">{children}</code>
      </pre>
    );
  },
  blockquote: ({ children }) => (
    <blockquote className="border-l-2 border-brand-500/40 pl-4 my-3 text-slate-400 italic">{children}</blockquote>
  ),
  table: ({ children }) => (
    <div className="overflow-x-auto my-3 rounded-xl border border-slate-700/40">
      <table className="w-full text-sm border-collapse">{children}</table>
    </div>
  ),
  thead: ({ children }) => <thead className="bg-slate-800/60">{children}</thead>,
  th: ({ children }) => <th className="px-4 py-2.5 text-left font-semibold text-slate-300 border-b border-slate-700/40 text-xs">{children}</th>,
  td: ({ children }) => <td className="px-4 py-2.5 text-slate-400 border-b border-slate-800/30 text-xs">{children}</td>,
  hr: () => <hr className="my-4 border-slate-700/40" />,
};

/**
 * LiteratureReview — Full-featured literature review generation page.
 *
 * Features:
 * - Multi-paper selection with tag-based input
 * - Suggested prompts for quick start
 * - Multi-phase loading animation with progress steps
 * - Tabbed section navigation with active indicator
 * - Full markdown rendering of review content
 * - Copy and export actions
 * - Error handling with retry
 *
 * Per instructions.md:
 * - Claude handles literature review generation (Rule 17)
 * - No direct API calls — uses paperService (Rule 14)
 * - Modular architecture (Rule 1)
 * - Reusable components (Rule 2)
 */
function LiteratureReview() {
  const [prompt, setPrompt] = useState('');
  const [paperIdInput, setPaperIdInput] = useState('');
  const [paperIds, setPaperIds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingPhase, setLoadingPhase] = useState(0);
  const [review, setReview] = useState(null);
  const [error, setError] = useState(null);
  const [activeSection, setActiveSection] = useState(null);
  const [copiedSection, setCopiedSection] = useState(null);
  const paperIdInputRef = useRef(null);
  const reviewRef = useRef(null);

  /**
   * Add a paper ID tag.
   */
  const addPaperId = useCallback(() => {
    const id = paperIdInput.trim();
    if (id && !paperIds.includes(id)) {
      setPaperIds((prev) => [...prev, id]);
      setPaperIdInput('');
      paperIdInputRef.current?.focus();
    }
  }, [paperIdInput, paperIds]);

  /**
   * Remove a paper ID tag.
   */
  const removePaperId = useCallback((id) => {
    setPaperIds((prev) => prev.filter((p) => p !== id));
  }, []);

  /**
   * Handle Enter key in paper ID input.
   */
  const handlePaperIdKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addPaperId();
    }
    if (e.key === 'Backspace' && !paperIdInput && paperIds.length > 0) {
      removePaperId(paperIds[paperIds.length - 1]);
    }
  };

  /**
   * Use a suggested prompt.
   */
  const handleSuggestionClick = (text) => {
    setPrompt(text);
  };

  /**
   * Generate the literature review via the backend.
   */
  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Please provide a review topic or prompt.');
      return;
    }

    setLoading(true);
    setLoadingPhase(0);
    setError(null);
    setReview(null);

    // Simulate loading phases for UX
    const phaseTimer1 = setTimeout(() => setLoadingPhase(1), 2000);
    const phaseTimer2 = setTimeout(() => setLoadingPhase(2), 5000);
    const phaseTimer3 = setTimeout(() => setLoadingPhase(3), 9000);

    try {
      const res = await paperService.generateLiteratureReview(prompt.trim(), paperIds);
      if (res.success) {
        setReview(res.data.review || res.data);
        // Auto-select first available section
        const firstKey = SECTIONS.find((s) => res.data.review?.[s.key] || res.data?.[s.key]);
        setActiveSection(firstKey?.key || SECTIONS[0].key);

        // Scroll to review output
        setTimeout(() => {
          reviewRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 300);
      } else {
        setError(res.error || 'Review generation failed. Please try again.');
      }
    } catch (err) {
      setError(
        err.response?.data?.detail ||
        err.response?.data?.error ||
        err.message ||
        'An unexpected error occurred. Please check if the backend is running.'
      );
    } finally {
      clearTimeout(phaseTimer1);
      clearTimeout(phaseTimer2);
      clearTimeout(phaseTimer3);
      setLoading(false);
      setLoadingPhase(0);
    }
  };

  /**
   * Copy a section's content to clipboard.
   */
  const handleCopySection = async (sectionKey) => {
    const content = review?.[sectionKey];
    if (!content) return;
    try {
      await navigator.clipboard.writeText(content);
      setCopiedSection(sectionKey);
      setTimeout(() => setCopiedSection(null), 2000);
    } catch {
      // Clipboard API may fail
    }
  };

  /**
   * Copy entire review to clipboard.
   */
  const handleCopyAll = async () => {
    if (!review) return;
    const fullText = SECTIONS
      .filter((s) => review[s.key])
      .map((s) => `## ${s.label}\n\n${review[s.key]}`)
      .join('\n\n---\n\n');
    try {
      await navigator.clipboard.writeText(fullText);
      setCopiedSection('__all__');
      setTimeout(() => setCopiedSection(null), 2000);
    } catch {
      // Clipboard API may fail
    }
  };

  const canGenerate = prompt.trim().length > 0 && !loading;
  const activeSectionData = SECTIONS.find((s) => s.key === activeSection);
  const sectionContent = review?.[activeSection];
  const availableSections = SECTIONS.filter((s) => review?.[s.key]);

  return (
    <div className="page-container">
      {/* Header */}
      <PageHeader
        icon={BookOpenText}
        title="Literature Review Generator"
        subtitle="Synthesize long-form thematic reviews across your research library. Powered by Claude for deep academic synthesis."
        actions={
          review && (
            <Button
              variant="secondary"
              size="sm"
              icon={copiedSection === '__all__' ? Check : Copy}
              onClick={handleCopyAll}
            >
              {copiedSection === '__all__' ? 'Copied!' : 'Copy All'}
            </Button>
          )
        }
      />

      {/* Input Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main form (wider) */}
        <div className="lg:col-span-2 space-y-5">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
          >
            <Card>
              <div className="space-y-5">
                {/* Prompt input */}
                <div>
                  <label
                    htmlFor="review-prompt"
                    className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2"
                  >
                    Review Topic / Prompt
                  </label>
                  <textarea
                    id="review-prompt"
                    rows={4}
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="input-field resize-none"
                    placeholder="e.g., Synthesize findings on transformer self-attention performance optimizations under sparse conditions."
                  />
                  <div className="flex items-center justify-between mt-1.5">
                    <span className="text-[10px] text-slate-600">
                      Describe the theme, scope, or question for your review
                    </span>
                    {prompt.length > 0 && (
                      <span className="text-[10px] text-slate-600 font-mono">
                        {prompt.length} chars
                      </span>
                    )}
                  </div>
                </div>

                {/* Paper IDs tag input */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Paper Selection{' '}
                    <span className="text-slate-600 normal-case font-normal">
                      (optional — leave empty to use all papers)
                    </span>
                  </label>

                  <div
                    className="input-field !p-2 flex flex-wrap items-center gap-1.5 min-h-[42px] cursor-text"
                    onClick={() => paperIdInputRef.current?.focus()}
                  >
                    {/* Paper ID tags */}
                    <AnimatePresence mode="popLayout">
                      {paperIds.map((id) => (
                        <motion.span
                          key={id}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          transition={{ duration: 0.15 }}
                          className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-brand-500/10 text-brand-300 text-xs font-medium border border-brand-500/20"
                        >
                          <Hash className="h-3 w-3 text-brand-400/60" />
                          {id}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              removePaperId(id);
                            }}
                            className="ml-0.5 p-0.5 rounded hover:bg-brand-500/20 transition-colors"
                          >
                            <X className="h-2.5 w-2.5" />
                          </button>
                        </motion.span>
                      ))}
                    </AnimatePresence>

                    {/* Input field */}
                    <input
                      ref={paperIdInputRef}
                      type="text"
                      value={paperIdInput}
                      onChange={(e) => setPaperIdInput(e.target.value)}
                      onKeyDown={handlePaperIdKeyDown}
                      className="flex-1 min-w-[120px] bg-transparent text-sm text-slate-100 placeholder-slate-500 focus:outline-none py-1 px-1"
                      placeholder={paperIds.length ? 'Add more...' : 'Type paper ID and press Enter'}
                    />

                    {/* Add button */}
                    {paperIdInput.trim() && (
                      <button
                        onClick={addPaperId}
                        className="p-1 rounded-md bg-brand-500/15 text-brand-400 hover:bg-brand-500/25 transition-colors"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-600 mt-1 block">
                    Press Enter to add • Backspace to remove last
                  </span>
                </div>

                {/* Generate button */}
                <div className="flex items-center gap-3 pt-1">
                  <Button
                    onClick={handleGenerate}
                    loading={loading}
                    disabled={!canGenerate}
                    icon={Wand2}
                    size="lg"
                  >
                    {loading ? 'Generating Review...' : 'Generate Literature Review'}
                  </Button>

                  <div className="flex items-center gap-1.5 text-[10px] text-slate-600">
                    <Cpu className="h-3 w-3" />
                    <span>Powered by Claude</span>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Suggested prompts */}
          {!review && !loading && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-2.5">
                Suggested Topics
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {PROMPT_SUGGESTIONS.map((suggestion, idx) => (
                  <motion.button
                    key={idx}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 + idx * 0.05 }}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="group glass-card-hover !p-3 text-left"
                  >
                    <div className="flex items-start gap-2">
                      <Sparkles className="h-3.5 w-3.5 text-brand-400/60 shrink-0 mt-0.5" />
                      <p className="text-xs text-slate-400 group-hover:text-slate-300 transition-colors leading-relaxed">
                        {suggestion}
                      </p>
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </div>

        {/* Info sidebar */}
        <div className="lg:col-span-1">
          <ReviewInfoPanel loading={loading} loadingPhase={loadingPhase} />
        </div>
      </div>

      {/* Error display */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
          >
            <Card className="border-rose-500/20">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-rose-400 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-rose-300">Generation Failed</p>
                  <p className="text-xs text-rose-400/80 mt-1">{error}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  icon={RotateCcw}
                  onClick={handleGenerate}
                  disabled={!canGenerate}
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
            <GenerationLoader phase={loadingPhase} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Review output */}
      <AnimatePresence>
        {review && !loading && (
          <motion.div
            ref={reviewRef}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-5"
          >
            {/* Section tabs */}
            <div className="flex flex-wrap items-center gap-2">
              {availableSections.map((section) => {
                const Icon = section.icon;
                const isActive = activeSection === section.key;
                return (
                  <motion.button
                    key={section.key}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    onClick={() => setActiveSection(section.key)}
                    className={`relative flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                      isActive
                        ? 'text-white'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="review-section-pill"
                        className={`absolute inset-0 rounded-xl ${section.bgColor} border border-current/10`}
                        style={{ borderColor: 'currentColor', opacity: 0.15 }}
                        transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                      />
                    )}
                    <Icon className={`relative z-10 h-3.5 w-3.5 ${isActive ? section.color : ''}`} />
                    <span className="relative z-10">{section.label}</span>
                  </motion.button>
                );
              })}
            </div>

            {/* Active section content */}
            <AnimatePresence mode="wait">
              {activeSectionData && sectionContent && (
                <motion.div
                  key={activeSection}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                >
                  <Card>
                    {/* Section header */}
                    <div className="flex items-center justify-between mb-5 pb-4 border-b border-slate-800/40">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-xl ${activeSectionData.bgColor}`}>
                          <activeSectionData.icon className={`h-5 w-5 ${activeSectionData.color}`} />
                        </div>
                        <div>
                          <h2 className="text-lg font-bold text-white font-display">
                            {activeSectionData.label}
                          </h2>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            {activeSectionData.description}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => handleCopySection(activeSection)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transition-colors"
                      >
                        {copiedSection === activeSection ? (
                          <><Check className="h-3.5 w-3.5 text-emerald-400" /> Copied</>
                        ) : (
                          <><Copy className="h-3.5 w-3.5" /> Copy</>
                        )}
                      </button>
                    </div>

                    {/* Rendered content */}
                    <div className="prose-review text-sm text-slate-300 leading-relaxed">
                      <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                        {sectionContent}
                      </ReactMarkdown>
                    </div>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Section navigation */}
            {availableSections.length > 1 && (
              <SectionNavigator
                sections={availableSections}
                activeSection={activeSection}
                onNavigate={setActiveSection}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/**
 * ReviewInfoPanel — Sidebar explaining the review process and showing
 * generation progress during loading.
 */
function ReviewInfoPanel({ loading, loadingPhase }) {
  const steps = [
    { label: 'Retrieving context', description: 'Pulling relevant chunks from vector store' },
    { label: 'Analyzing themes', description: 'Identifying key patterns across papers' },
    { label: 'Synthesizing review', description: 'Claude generating structured review' },
    { label: 'Formatting output', description: 'Structuring sections and citations' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="glass-card p-5"
    >
      <div className="flex items-center gap-2 mb-4">
        <Cpu className="h-4 w-4 text-brand-400" />
        <h3 className="text-sm font-semibold text-slate-200 font-display">
          {loading ? 'Generation Progress' : 'How It Works'}
        </h3>
      </div>

      <div className="space-y-3">
        {steps.map((step, idx) => {
          const isActive = loading && idx === loadingPhase;
          const isCompleted = loading && idx < loadingPhase;
          const isFuture = loading && idx > loadingPhase;

          return (
            <div key={step.label} className="flex items-start gap-3">
              {/* Step indicator */}
              <div className={`shrink-0 w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-bold transition-all duration-300 ${
                isActive
                  ? 'bg-brand-500/20 text-brand-400 border border-brand-500/30 animate-pulse'
                  : isCompleted
                  ? 'bg-emerald-500/15 text-emerald-400'
                  : isFuture
                  ? 'bg-slate-800/60 text-slate-600'
                  : 'bg-slate-800/60 text-slate-500'
              }`}>
                {isCompleted ? (
                  <Check className="h-3 w-3" />
                ) : (
                  idx + 1
                )}
              </div>

              <div>
                <p className={`text-xs font-medium transition-colors ${
                  isActive ? 'text-brand-300' : isCompleted ? 'text-emerald-400' : 'text-slate-400'
                }`}>
                  {step.label}
                </p>
                <p className="text-[10px] text-slate-600 mt-0.5">{step.description}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Review sections preview */}
      {!loading && (
        <div className="mt-5 pt-4 border-t border-slate-800/40">
          <p className="text-[10px] text-slate-600 uppercase tracking-wider mb-2.5">
            Generated Sections
          </p>
          <div className="space-y-1.5">
            {SECTIONS.map((section) => {
              const Icon = section.icon;
              return (
                <div key={section.key} className="flex items-center gap-2">
                  <Icon className={`h-3 w-3 ${section.color}`} />
                  <span className="text-[11px] text-slate-500">{section.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </motion.div>
  );
}

/**
 * GenerationLoader — Multi-phase loading animation shown during review generation.
 */
function GenerationLoader({ phase }) {
  const phases = [
    { label: 'Retrieving relevant research chunks...', icon: FileText },
    { label: 'Analyzing thematic patterns...', icon: Sparkles },
    { label: 'Claude is synthesizing your review...', icon: Cpu },
    { label: 'Formatting and structuring output...', icon: BookOpenText },
  ];

  const current = phases[phase] || phases[0];
  const Icon = current.icon;

  return (
    <Card>
      <div className="flex flex-col items-center justify-center py-8">
        <div className="relative mb-5">
          <div className="p-4 rounded-2xl bg-brand-500/10 border border-brand-500/20">
            <Icon className="h-8 w-8 text-brand-400" />
          </div>
          <div className="absolute inset-0 rounded-2xl bg-brand-500/10 animate-glow-pulse" />
        </div>

        <motion.p
          key={phase}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-slate-300 font-medium mb-4"
        >
          {current.label}
        </motion.p>

        {/* Progress dots */}
        <div className="flex items-center gap-2">
          {phases.map((_, idx) => (
            <div
              key={idx}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                idx <= phase
                  ? 'w-8 bg-brand-500'
                  : 'w-1.5 bg-slate-700'
              }`}
            />
          ))}
        </div>

        <p className="text-[10px] text-slate-600 mt-3">
          This may take 30–60 seconds depending on the number of papers
        </p>
      </div>
    </Card>
  );
}

/**
 * SectionNavigator — Previous/Next navigation for review sections.
 */
function SectionNavigator({ sections, activeSection, onNavigate }) {
  const currentIdx = sections.findIndex((s) => s.key === activeSection);
  const prevSection = currentIdx > 0 ? sections[currentIdx - 1] : null;
  const nextSection = currentIdx < sections.length - 1 ? sections[currentIdx + 1] : null;

  return (
    <div className="flex items-center justify-between">
      {prevSection ? (
        <button
          onClick={() => onNavigate(prevSection.key)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl glass-card hover:bg-slate-800/60 transition-colors text-xs font-medium text-slate-400 hover:text-slate-200"
        >
          <ChevronRight className="h-3.5 w-3.5 rotate-180" />
          {prevSection.label}
        </button>
      ) : (
        <div />
      )}

      <span className="text-[10px] text-slate-600 font-mono">
        {currentIdx + 1} / {sections.length}
      </span>

      {nextSection ? (
        <button
          onClick={() => onNavigate(nextSection.key)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl glass-card hover:bg-slate-800/60 transition-colors text-xs font-medium text-slate-400 hover:text-slate-200"
        >
          {nextSection.label}
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
      ) : (
        <div />
      )}
    </div>
  );
}

export default LiteratureReview;
