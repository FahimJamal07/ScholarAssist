import React from 'react';
import { motion } from 'framer-motion';
import {
  Info,
  FileText,
  HardDrive,
  ShieldCheck,
  Layers,
  Cpu,
  Database,
} from 'lucide-react';

/**
 * UploadGuidelines — Informational sidebar panel explaining the upload
 * pipeline, accepted formats, and processing steps. Provides user
 * confidence in the upload process.
 */

const guidelines = [
  {
    icon: FileText,
    title: 'Accepted Format',
    description: 'PDF documents only (.pdf)',
    color: 'text-brand-400',
    bgColor: 'bg-brand-500/10',
  },
  {
    icon: HardDrive,
    title: 'Maximum Size',
    description: '50 MB per file',
    color: 'text-accent-cyan',
    bgColor: 'bg-cyan-500/10',
  },
  {
    icon: ShieldCheck,
    title: 'Validation',
    description: 'MIME type, extension, and file size are verified',
    color: 'text-accent-emerald',
    bgColor: 'bg-emerald-500/10',
  },
  {
    icon: Layers,
    title: 'Text Extraction',
    description: 'PDF text is extracted and split into semantic chunks',
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/10',
  },
  {
    icon: Cpu,
    title: 'Embedding Generation',
    description: '768-dim vectors generated per chunk for semantic search',
    color: 'text-accent-amber',
    bgColor: 'bg-amber-500/10',
  },
  {
    icon: Database,
    title: 'Vector Indexing',
    description: 'Chunks indexed in FAISS for fast RAG-based retrieval',
    color: 'text-accent-rose',
    bgColor: 'bg-rose-500/10',
  },
];

function UploadGuidelines() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="glass-card p-5"
    >
      <div className="flex items-center gap-2 mb-4">
        <Info className="h-4 w-4 text-brand-400" />
        <h3 className="text-sm font-semibold text-slate-200 font-display">Upload Pipeline</h3>
      </div>

      <div className="space-y-3">
        {guidelines.map((item, idx) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35 + idx * 0.05 }}
              className="flex items-start gap-3"
            >
              <div className={`shrink-0 p-1.5 rounded-lg ${item.bgColor} mt-0.5`}>
                <Icon className={`h-3.5 w-3.5 ${item.color}`} />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-300">{item.title}</p>
                <p className="text-[11px] text-slate-500 leading-relaxed mt-0.5">
                  {item.description}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Pipeline visual */}
      <div className="mt-5 pt-4 border-t border-slate-800/40">
        <p className="text-[10px] text-slate-600 uppercase tracking-wider mb-3">Processing Flow</p>
        <div className="flex items-center gap-1 flex-wrap">
          {['Upload', 'Validate', 'Extract', 'Chunk', 'Embed', 'Index'].map((step, idx) => (
            <React.Fragment key={step}>
              <span className="px-2 py-1 rounded-md bg-slate-800/60 text-[10px] font-medium text-slate-400">
                {step}
              </span>
              {idx < 5 && (
                <span className="text-slate-700 text-[10px]">→</span>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default UploadGuidelines;
