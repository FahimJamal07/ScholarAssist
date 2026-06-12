import React from 'react';
import { motion } from 'framer-motion';
import {
  Upload,
  BookOpenText,
  Sparkles,
  MessageSquareText,
  GitCompareArrows,
  Clock,
  ChevronRight,
} from 'lucide-react';

/**
 * ActivityFeed — Timeline-style activity log for the dashboard.
 * Shows recent actions with type-specific icons, colors, and timestamps.
 *
 * @param {Array} activities - Array of activity objects
 */
const defaultActivities = [
  {
    id: 1,
    type: 'upload',
    action: 'Paper uploaded',
    detail: 'attention_mechanisms_2024.pdf',
    time: '2 min ago',
    icon: Upload,
    color: 'text-brand-400',
    bgColor: 'bg-brand-500/10',
  },
  {
    id: 2,
    type: 'review',
    action: 'Literature review generated',
    detail: 'Transformer Optimization Survey',
    time: '15 min ago',
    icon: BookOpenText,
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/10',
  },
  {
    id: 3,
    type: 'novelty',
    action: 'Novelty analysis complete',
    detail: 'Score: 78/100 — Moderate novelty',
    time: '1 hour ago',
    icon: Sparkles,
    color: 'text-accent-amber',
    bgColor: 'bg-amber-500/10',
  },
  {
    id: 4,
    type: 'chat',
    action: 'Q&A session completed',
    detail: '12 questions answered from RAG pipeline',
    time: '2 hours ago',
    icon: MessageSquareText,
    color: 'text-accent-cyan',
    bgColor: 'bg-cyan-500/10',
  },
  {
    id: 5,
    type: 'compare',
    action: 'Paper comparison',
    detail: 'Compared 3 papers on attention mechanisms',
    time: '3 hours ago',
    icon: GitCompareArrows,
    color: 'text-accent-emerald',
    bgColor: 'bg-emerald-500/10',
  },
];

function ActivityFeed({ activities = defaultActivities }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.7 }}
      className="glass-card p-5"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-brand-400" />
          <h2 className="text-base font-semibold text-slate-200 font-display">Recent Activity</h2>
        </div>
        <span className="text-[10px] text-slate-600 uppercase tracking-wider font-semibold">
          Live
          <span className="inline-block ml-1.5 w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        </span>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical connector line */}
        <div className="absolute left-[19px] top-3 bottom-3 w-px bg-gradient-to-b from-slate-700/60 via-slate-800/40 to-transparent" />

        <div className="space-y-1">
          {activities.map((activity, idx) => {
            const Icon = activity.icon;

            return (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.75 + idx * 0.05 }}
                className="group relative flex items-start gap-3 p-2.5 rounded-lg hover:bg-slate-800/30 transition-colors cursor-default"
              >
                {/* Timeline dot */}
                <div className={`relative z-10 shrink-0 p-1.5 rounded-lg ${activity.bgColor}`}>
                  <Icon className={`h-3.5 w-3.5 ${activity.color}`} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 pt-0.5">
                  <p className="text-sm font-medium text-slate-200">{activity.action}</p>
                  <p className="text-xs text-slate-500 mt-0.5 truncate">{activity.detail}</p>
                </div>

                {/* Timestamp */}
                <span className="shrink-0 text-[10px] text-slate-600 pt-1">{activity.time}</span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}

export default ActivityFeed;
