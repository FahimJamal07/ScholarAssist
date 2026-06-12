import React from 'react';
import { motion } from 'framer-motion';
import {
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ChevronRight,
  Upload,
} from 'lucide-react';

/**
 * RecentUploads — Displays a list of recently uploaded papers with status
 * indicators, file sizes, and processing state. Designed for the dashboard sidebar panel.
 *
 * @param {Array} uploads - Array of upload objects from the API
 */
const defaultUploads = [
  {
    id: 1,
    filename: 'attention_mechanisms_2024.pdf',
    size: '2.4 MB',
    status: 'completed',
    chunks: 156,
    uploadedAt: '2 min ago',
  },
  {
    id: 2,
    filename: 'transformer_survey_v3.pdf',
    size: '5.1 MB',
    status: 'completed',
    chunks: 312,
    uploadedAt: '15 min ago',
  },
  {
    id: 3,
    filename: 'rag_optimization_methods.pdf',
    size: '1.8 MB',
    status: 'processing',
    chunks: null,
    uploadedAt: '32 min ago',
  },
  {
    id: 4,
    filename: 'neural_scaling_laws_2024.pdf',
    size: '3.6 MB',
    status: 'completed',
    chunks: 203,
    uploadedAt: '1 hour ago',
  },
  {
    id: 5,
    filename: 'multimodal_llm_benchmark.pdf',
    size: '8.2 MB',
    status: 'failed',
    chunks: null,
    uploadedAt: '2 hours ago',
  },
];

const statusConfig = {
  completed: {
    icon: CheckCircle2,
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500/10',
    label: 'Indexed',
  },
  processing: {
    icon: Loader2,
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/10',
    label: 'Processing',
    animate: true,
  },
  failed: {
    icon: AlertCircle,
    color: 'text-rose-400',
    bgColor: 'bg-rose-500/10',
    label: 'Failed',
  },
};

function RecentUploads({ uploads = defaultUploads }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.5 }}
      className="glass-card p-5"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Upload className="h-4 w-4 text-brand-400" />
          <h2 className="text-base font-semibold text-slate-200 font-display">Recent Uploads</h2>
        </div>
        <span className="text-xs text-slate-600 font-mono">{uploads.length} papers</span>
      </div>

      {/* Upload list */}
      <div className="space-y-1">
        {uploads.map((upload, idx) => {
          const status = statusConfig[upload.status];
          const StatusIcon = status.icon;

          return (
            <motion.div
              key={upload.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.55 + idx * 0.05 }}
              className="group flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800/40 transition-colors cursor-pointer"
            >
              {/* File icon */}
              <div className="shrink-0 p-2 rounded-lg bg-slate-800/80">
                <FileText className="h-4 w-4 text-slate-400" />
              </div>

              {/* File details */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-200 truncate group-hover:text-white transition-colors">
                  {upload.filename}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[11px] text-slate-500">{upload.size}</span>
                  {upload.chunks && (
                    <>
                      <span className="text-slate-700">·</span>
                      <span className="text-[11px] text-slate-500">{upload.chunks} chunks</span>
                    </>
                  )}
                </div>
              </div>

              {/* Status badge */}
              <div className="shrink-0 flex flex-col items-end gap-1">
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold ${status.color} ${status.bgColor}`}
                >
                  <StatusIcon className={`h-3 w-3 ${status.animate ? 'animate-spin' : ''}`} />
                  {status.label}
                </span>
                <span className="text-[10px] text-slate-600">{upload.uploadedAt}</span>
              </div>

              {/* Hover arrow */}
              <ChevronRight className="h-4 w-4 text-slate-700 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
            </motion.div>
          );
        })}
      </div>

      {/* View all link */}
      <div className="mt-3 pt-3 border-t border-slate-800/40">
        <a
          href="/upload"
          className="text-xs font-medium text-brand-400 hover:text-brand-300 transition-colors inline-flex items-center gap-1"
        >
          View all uploads
          <ChevronRight className="h-3 w-3" />
        </a>
      </div>
    </motion.div>
  );
}

export default RecentUploads;
