import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Upload,
  MessageSquareText,
  BookOpenText,
  Sparkles,
  BarChart3,
  ArrowRight,
} from 'lucide-react';

/**
 * QuickActions — Dashboard quick-launch cards linking to primary features.
 * Each card has a unique gradient, icon, and subtle hover animation.
 */
const actions = [
  {
    name: 'Upload Papers',
    description: 'Ingest new research PDFs into the knowledge base',
    icon: Upload,
    path: '/upload',
    gradient: 'from-brand-600/20 via-brand-700/10 to-transparent',
    iconBg: 'bg-brand-500/15',
    iconColor: 'text-brand-400',
  },
  {
    name: 'Chat with Papers',
    description: 'RAG-powered Q&A across your research library',
    icon: MessageSquareText,
    path: '/chat',
    gradient: 'from-cyan-600/20 via-cyan-700/10 to-transparent',
    iconBg: 'bg-cyan-500/15',
    iconColor: 'text-accent-cyan',
  },
  {
    name: 'Literature Review',
    description: 'AI-synthesized thematic reviews with Claude',
    icon: BookOpenText,
    path: '/literature-review',
    gradient: 'from-purple-600/20 via-purple-700/10 to-transparent',
    iconBg: 'bg-purple-500/15',
    iconColor: 'text-purple-400',
  },
  {
    name: 'Novelty Detection',
    description: 'Evaluate research originality with semantic analysis',
    icon: Sparkles,
    path: '/novelty',
    gradient: 'from-amber-600/20 via-amber-700/10 to-transparent',
    iconBg: 'bg-amber-500/15',
    iconColor: 'text-accent-amber',
  },
  {
    name: 'Analytics',
    description: 'Citation graphs, keyword density, and paper statistics',
    icon: BarChart3,
    path: '/analytics',
    gradient: 'from-rose-600/20 via-rose-700/10 to-transparent',
    iconBg: 'bg-rose-500/15',
    iconColor: 'text-accent-rose',
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.3 + i * 0.06, duration: 0.35, ease: 'easeOut' },
  }),
};

function QuickActions() {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-slate-200 font-display">Quick Actions</h2>
        <span className="text-xs text-slate-600">{actions.length} features</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {actions.map((action, idx) => {
          const Icon = action.icon;
          return (
            <motion.div
              key={action.path}
              custom={idx}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
            >
              <Link to={action.path} className="block group">
                <div
                  className={`glass-card-hover p-5 bg-gradient-to-br ${action.gradient} relative overflow-hidden`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2.5 rounded-xl ${action.iconBg} shrink-0 transition-transform group-hover:scale-110 duration-300`}>
                      <Icon className={`h-5 w-5 ${action.iconColor}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-semibold text-white">{action.name}</h3>
                        <ArrowRight className="h-3.5 w-3.5 text-slate-600 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
                      </div>
                      <p className="mt-1 text-xs text-slate-400 leading-relaxed">
                        {action.description}
                      </p>
                    </div>
                  </div>

                  {/* Hover glow accent */}
                  <div className="absolute -bottom-4 -right-4 w-20 h-20 rounded-full bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500" />
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

export default QuickActions;
