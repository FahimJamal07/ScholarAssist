import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  X,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { UPLOAD_STATUS } from '../../hooks/useUpload.js';
import { formatBytes } from '../../utils/helpers.js';

/**
 * Status configuration — visual properties for each upload state.
 */
const statusConfig = {
  [UPLOAD_STATUS.PENDING]: {
    icon: FileText,
    label: 'Pending',
    color: 'text-slate-400',
    bgColor: 'bg-slate-500/10',
    progressColor: 'bg-slate-500',
  },
  [UPLOAD_STATUS.VALIDATING]: {
    icon: ShieldCheck,
    label: 'Validating',
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/10',
    progressColor: 'bg-amber-500',
    animate: true,
  },
  [UPLOAD_STATUS.UPLOADING]: {
    icon: Loader2,
    label: 'Uploading',
    color: 'text-brand-400',
    bgColor: 'bg-brand-500/10',
    progressColor: 'bg-brand-500',
    animate: true,
  },
  [UPLOAD_STATUS.PROCESSING]: {
    icon: Loader2,
    label: 'Processing',
    color: 'text-cyan-400',
    bgColor: 'bg-cyan-500/10',
    progressColor: 'bg-cyan-500',
    animate: true,
  },
  [UPLOAD_STATUS.COMPLETED]: {
    icon: CheckCircle2,
    label: 'Indexed',
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500/10',
    progressColor: 'bg-emerald-500',
  },
  [UPLOAD_STATUS.FAILED]: {
    icon: AlertCircle,
    label: 'Failed',
    color: 'text-rose-400',
    bgColor: 'bg-rose-500/10',
    progressColor: 'bg-rose-500',
  },
};

/**
 * FileQueueItem — Single file row in the upload queue with progress bar,
 * status badge, and action buttons.
 */
function FileQueueItem({ entry, onRemove, onRetry }) {
  const config = statusConfig[entry.status] || statusConfig[UPLOAD_STATUS.PENDING];
  const StatusIcon = config.icon;
  const isActive =
    entry.status === UPLOAD_STATUS.UPLOADING ||
    entry.status === UPLOAD_STATUS.VALIDATING ||
    entry.status === UPLOAD_STATUS.PROCESSING;
  const isCompleted = entry.status === UPLOAD_STATUS.COMPLETED;
  const isFailed = entry.status === UPLOAD_STATUS.FAILED;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0, marginBottom: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="overflow-hidden"
    >
      <div
        className={`relative p-4 rounded-xl border transition-all duration-200 ${
          isActive
            ? 'glass-card border-brand-500/30 shadow-glow-sm'
            : isFailed
            ? 'glass-card border-rose-500/20'
            : isCompleted
            ? 'glass-card border-emerald-500/20'
            : 'glass-card border-slate-700/40'
        }`}
      >
        <div className="flex items-center gap-3">
          {/* File icon */}
          <div
            className={`shrink-0 p-2.5 rounded-xl ${
              isCompleted
                ? 'bg-emerald-500/10'
                : isFailed
                ? 'bg-rose-500/10'
                : 'bg-slate-800/80'
            }`}
          >
            <FileText
              className={`h-5 w-5 ${
                isCompleted
                  ? 'text-emerald-400'
                  : isFailed
                  ? 'text-rose-400'
                  : 'text-slate-400'
              }`}
            />
          </div>

          {/* File info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium text-slate-200 truncate">{entry.name}</p>
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[11px] text-slate-500">{formatBytes(entry.size)}</span>
              {entry.result?.chunks_count != null && (
                <>
                  <span className="text-slate-700">·</span>
                  <span className="text-[11px] text-slate-500">
                    {entry.result.chunks_count} chunks
                  </span>
                </>
              )}
            </div>

            {/* Error message */}
            {isFailed && entry.error && (
              <p className="mt-1.5 text-xs text-rose-400/90 leading-relaxed">{entry.error}</p>
            )}
          </div>

          {/* Status badge */}
          <div className="shrink-0 flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-[10px] font-semibold uppercase tracking-wider ${config.color} ${config.bgColor}`}
            >
              <StatusIcon className={`h-3 w-3 ${config.animate ? 'animate-spin' : ''}`} />
              {config.label}
            </span>

            {/* Action buttons */}
            {isFailed && onRetry && (
              <button
                onClick={() => onRetry(entry.id)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-brand-400 hover:bg-brand-500/10 transition-colors"
                title="Retry upload"
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </button>
            )}

            {!isActive && (
              <button
                onClick={() => onRemove(entry.id)}
                className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                title="Remove from queue"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Progress bar */}
        {(isActive || isCompleted) && (
          <div className="mt-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] text-slate-500">
                {isActive ? 'Uploading...' : 'Complete'}
              </span>
              <span className={`text-[10px] font-mono font-semibold ${config.color}`}>
                {entry.progress}%
              </span>
            </div>
            <div className="h-1 rounded-full bg-slate-800/80 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${entry.progress}%` }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className={`h-full rounded-full ${config.progressColor}`}
              />
            </div>
          </div>
        )}

        {/* Success result details */}
        {isCompleted && entry.result && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-3 pt-3 border-t border-slate-800/40"
          >
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <ResultStat label="Secure Name" value={entry.result.saved_filename} mono />
              <ResultStat
                label="File Size"
                value={formatBytes(entry.result.size_bytes || entry.size)}
              />
              <ResultStat label="Chunks" value={entry.result.chunks_count ?? '—'} />
              <ResultStat label="Status" value="Indexed" highlight />
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

/**
 * ResultStat — Small key-value display used in the success detail row.
 */
function ResultStat({ label, value, mono = false, highlight = false }) {
  return (
    <div>
      <p className="text-[10px] text-slate-500 uppercase tracking-wider">{label}</p>
      <p
        className={`mt-0.5 text-xs truncate ${
          highlight
            ? 'text-emerald-400 font-semibold'
            : mono
            ? 'text-slate-300 font-mono'
            : 'text-slate-300'
        }`}
        title={typeof value === 'string' ? value : undefined}
      >
        {value}
      </p>
    </div>
  );
}

/**
 * FileQueue — Renders the full upload queue with all file entries.
 *
 * @param {Array} queue - Array of file entry objects from useUpload
 * @param {Function} onRemove - Remove file handler
 * @param {Function} onRetry - Retry upload handler
 */
function FileQueue({ queue, onRemove, onRetry }) {
  if (!queue.length) return null;

  return (
    <div className="space-y-2">
      <AnimatePresence mode="popLayout">
        {queue.map((entry) => (
          <FileQueueItem
            key={entry.id}
            entry={entry}
            onRemove={onRemove}
            onRetry={onRetry}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

export default FileQueue;
