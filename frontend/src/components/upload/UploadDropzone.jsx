import React, { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, Shield, HardDrive, Zap } from 'lucide-react';

/**
 * UploadDropzone — Premium drag-and-drop file upload zone with visual feedback,
 * animated states, and file format guidance. Supports both click-to-browse
 * and drag-and-drop interactions.
 *
 * @param {Function} onFilesSelected - Callback with selected FileList/File[]
 * @param {boolean} disabled - Disable interactions during upload
 */
function UploadDropzone({ onFilesSelected, disabled = false }) {
  const [dragActive, setDragActive] = useState(false);
  const [dragCounter, setDragCounter] = useState(0);
  const inputRef = useRef(null);

  const handleDragEnter = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragCounter((prev) => prev + 1);
    setDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragCounter((prev) => {
      const next = prev - 1;
      if (next <= 0) setDragActive(false);
      return Math.max(0, next);
    });
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);
      setDragCounter(0);

      if (disabled) return;

      const files = e.dataTransfer?.files;
      if (files?.length) {
        onFilesSelected(files);
      }
    },
    [onFilesSelected, disabled]
  );

  const handleClick = () => {
    if (!disabled) inputRef.current?.click();
  };

  const handleInputChange = (e) => {
    const files = e.target.files;
    if (files?.length) {
      onFilesSelected(files);
    }
    // Reset input so same file can be re-selected
    e.target.value = '';
  };

  return (
    <div className="relative">
      {/* Hidden file input */}
      <input
        ref={inputRef}
        id="file-upload"
        type="file"
        accept=".pdf,application/pdf"
        multiple
        className="sr-only"
        onChange={handleInputChange}
        disabled={disabled}
      />

      {/* Drop zone */}
      <motion.div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={handleClick}
        whileTap={!disabled ? { scale: 0.995 } : {}}
        className={`
          relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed
          px-6 py-14 md:py-20 transition-all duration-300 cursor-pointer
          ${disabled ? 'opacity-60 cursor-not-allowed' : ''}
          ${
            dragActive
              ? 'border-brand-400 bg-brand-500/[0.06] shadow-glow-md'
              : 'border-slate-700/60 bg-slate-900/30 hover:border-slate-600 hover:bg-slate-900/50'
          }
        `}
      >
        {/* Animated background glow when dragging */}
        <AnimatePresence>
          {dragActive && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute inset-0 rounded-2xl bg-glow-brand pointer-events-none"
            />
          )}
        </AnimatePresence>

        {/* Icon */}
        <motion.div
          animate={dragActive ? { scale: 1.1, y: -4 } : { scale: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          className={`relative p-5 rounded-2xl mb-5 transition-colors duration-300 ${
            dragActive
              ? 'bg-brand-500/20 border border-brand-500/30'
              : 'bg-slate-800/60 border border-slate-700/40'
          }`}
        >
          <Upload
            className={`h-10 w-10 transition-colors duration-300 ${
              dragActive ? 'text-brand-400' : 'text-slate-500'
            }`}
          />

          {/* Animated ring */}
          {dragActive && (
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1.5, opacity: 0 }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="absolute inset-0 rounded-2xl border-2 border-brand-400/30"
            />
          )}
        </motion.div>

        {/* Text */}
        <div className="relative z-10 text-center">
          <div className="text-sm">
            <span className="font-semibold text-brand-400 hover:text-brand-300 transition-colors">
              Choose files
            </span>
            <span className="text-slate-400 ml-1">or drag and drop</span>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            PDF only • Max 50 MB per file • Multiple files supported
          </p>
        </div>

        {/* Drag-active overlay text */}
        <AnimatePresence>
          {dragActive && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className="absolute inset-0 flex items-center justify-center rounded-2xl bg-brand-500/[0.08] backdrop-blur-[1px]"
            >
              <div className="text-center">
                <Upload className="h-8 w-8 text-brand-400 mx-auto mb-2 animate-bounce" />
                <p className="text-sm font-semibold text-brand-300">Drop your PDFs here</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Feature badges */}
      <div className="flex flex-wrap items-center justify-center gap-4 mt-4">
        <FeatureBadge icon={Shield} text="Secure Upload" />
        <FeatureBadge icon={FileText} text="Auto-Chunking" />
        <FeatureBadge icon={HardDrive} text="Vector Indexing" />
        <FeatureBadge icon={Zap} text="AI Processing" />
      </div>
    </div>
  );
}

/**
 * FeatureBadge — Small informational badge below the dropzone.
 */
function FeatureBadge({ icon: Icon, text }) {
  return (
    <div className="inline-flex items-center gap-1.5 text-[10px] text-slate-500">
      <Icon className="h-3 w-3 text-slate-600" />
      <span>{text}</span>
    </div>
  );
}

export default UploadDropzone;
