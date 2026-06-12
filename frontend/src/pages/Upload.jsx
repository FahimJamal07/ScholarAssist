import React from 'react';
import { motion } from 'framer-motion';
import {
  Upload as UploadIcon,
  Trash2,
  CheckCircle2,
  Rocket,
} from 'lucide-react';
import PageHeader from '../components/ui/PageHeader.jsx';
import Button from '../components/ui/Button.jsx';
import UploadDropzone from '../components/upload/UploadDropzone.jsx';
import FileQueue from '../components/upload/FileQueue.jsx';
import UploadStats from '../components/upload/UploadStats.jsx';
import UploadGuidelines from '../components/upload/UploadGuidelines.jsx';
import { useUpload, UPLOAD_STATUS } from '../hooks/useUpload.js';

/**
 * Upload — Full-featured PDF upload page with drag-and-drop, multi-file queue,
 * real-time progress tracking, validation, retry, and backend integration.
 *
 * Architecture:
 * - useUpload hook: manages queue state, validation, upload logic
 * - UploadDropzone: drag-and-drop / click-to-browse file selection
 * - FileQueue: renders individual file entries with progress bars
 * - UploadStats: summary bar with queue counts
 * - UploadGuidelines: informational sidebar about the processing pipeline
 *
 * Following instructions.md:
 * - PDF only (Rule 20)
 * - Max 50MB (Rule 20)
 * - MIME type + extension validation (Rule 20)
 * - Modular component architecture (Rule 1)
 * - Reusable components (Rule 2)
 * - No hardcoded values — uses constants.js (Rule 3)
 * - Centralized API via paperService (Rule 14)
 */
function Upload() {
  const {
    queue,
    stats,
    isUploading,
    addFiles,
    uploadAll,
    retryUpload,
    removeFile,
    clearCompleted,
    clearAll,
  } = useUpload();

  const hasPendingFiles = stats.pending > 0;
  const hasCompletedFiles = stats.completed > 0;
  const hasFiles = stats.total > 0;

  return (
    <div className="page-container">
      {/* Page Header */}
      <PageHeader
        icon={UploadIcon}
        title="Upload Research Papers"
        subtitle="Upload PDF files for vector store ingestion, text chunking, and AI-powered analysis. Maximum 50 MB per file."
        actions={
          hasFiles && (
            <div className="flex items-center gap-2">
              {hasCompletedFiles && (
                <Button
                  variant="ghost"
                  size="sm"
                  icon={CheckCircle2}
                  onClick={clearCompleted}
                >
                  Clear Completed
                </Button>
              )}
              {stats.total > 1 && (
                <Button
                  variant="ghost"
                  size="sm"
                  icon={Trash2}
                  onClick={clearAll}
                  className="text-rose-400 hover:text-rose-300"
                >
                  Clear All
                </Button>
              )}
            </div>
          )
        }
      />

      {/* Two-column layout: main upload area + guidelines sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main upload area (wider) */}
        <div className="lg:col-span-2 space-y-5">
          {/* Dropzone */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
          >
            <UploadDropzone onFilesSelected={addFiles} disabled={isUploading} />
          </motion.div>

          {/* Stats bar + Upload button */}
          {hasFiles && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
            >
              <UploadStats stats={stats} />

              {hasPendingFiles && (
                <Button
                  onClick={uploadAll}
                  loading={isUploading}
                  icon={Rocket}
                  size="md"
                  className="shrink-0"
                >
                  {isUploading
                    ? `Uploading (${stats.uploading}/${stats.total})`
                    : `Upload ${stats.pending} File${stats.pending !== 1 ? 's' : ''}`}
                </Button>
              )}
            </motion.div>
          )}

          {/* File queue */}
          <FileQueue
            queue={queue}
            onRemove={removeFile}
            onRetry={retryUpload}
          />

          {/* Success summary when all completed */}
          {hasFiles && stats.pending === 0 && stats.uploading === 0 && hasCompletedFiles && stats.failed === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-card p-5 border-emerald-500/20"
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-500/10">
                  <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-emerald-400">
                    All uploads completed successfully
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {stats.completed} paper{stats.completed !== 1 ? 's' : ''} indexed and ready for
                    AI analysis. You can now use Chat, Compare, or Literature Review.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Guidelines sidebar */}
        <div className="lg:col-span-1">
          <UploadGuidelines />
        </div>
      </div>
    </div>
  );
}

export default Upload;
