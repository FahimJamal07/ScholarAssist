import React from 'react';
import { motion } from 'framer-motion';
import {
  Files,
  Clock,
  Loader2,
  CheckCircle2,
  AlertCircle,
  HardDrive,
} from 'lucide-react';
import { formatBytes } from '../../utils/helpers.js';

/**
 * UploadStats — Summary bar showing upload queue statistics.
 * Displays total files, pending, uploading, completed, failed counts
 * and total file size in a horizontal pill layout.
 *
 * @param {object} stats - Stats object from useUpload hook
 */
function UploadStats({ stats }) {
  if (stats.total === 0) return null;

  const items = [
    {
      icon: Files,
      label: 'Total',
      value: stats.total,
      color: 'text-slate-300',
      bgColor: 'bg-slate-500/10',
    },
    {
      icon: Clock,
      label: 'Pending',
      value: stats.pending,
      color: 'text-slate-400',
      bgColor: 'bg-slate-500/10',
      hide: stats.pending === 0,
    },
    {
      icon: Loader2,
      label: 'Uploading',
      value: stats.uploading,
      color: 'text-brand-400',
      bgColor: 'bg-brand-500/10',
      animate: stats.uploading > 0,
      hide: stats.uploading === 0,
    },
    {
      icon: CheckCircle2,
      label: 'Completed',
      value: stats.completed,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10',
      hide: stats.completed === 0,
    },
    {
      icon: AlertCircle,
      label: 'Failed',
      value: stats.failed,
      color: 'text-rose-400',
      bgColor: 'bg-rose-500/10',
      hide: stats.failed === 0,
    },
    {
      icon: HardDrive,
      label: 'Size',
      value: formatBytes(stats.totalSize),
      color: 'text-slate-400',
      bgColor: 'bg-slate-500/10',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="flex flex-wrap items-center gap-2"
    >
      {items
        .filter((item) => !item.hide)
        .map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.label}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg ${item.bgColor}`}
            >
              <Icon
                className={`h-3 w-3 ${item.color} ${
                  item.animate ? 'animate-spin' : ''
                }`}
              />
              <span className={`text-[10px] font-semibold uppercase tracking-wider ${item.color}`}>
                {item.label}
              </span>
              <span className={`text-xs font-bold ${item.color} font-mono`}>
                {item.value}
              </span>
            </div>
          );
        })}
    </motion.div>
  );
}

export default UploadStats;
