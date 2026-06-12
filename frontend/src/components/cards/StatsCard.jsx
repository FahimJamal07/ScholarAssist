import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

/**
 * StatsCard — Premium statistics card with trend indicator, sparkline-like visual,
 * and glassmorphism styling. Used in the dashboard metrics grid.
 *
 * @param {string} title - Metric label
 * @param {string} value - Primary display value
 * @param {string} change - Change description text
 * @param {number} changeValue - Numeric change for trend color (positive/negative/zero)
 * @param {React.Component} icon - Lucide icon component
 * @param {string} color - Tailwind text color class for the icon and accent
 * @param {string} bgColor - Background gradient class for the icon container
 * @param {number} index - Animation stagger index
 */
function StatsCard({
  title,
  value,
  change,
  changeValue = 0,
  icon: Icon,
  color = 'text-brand-400',
  bgColor = 'from-brand-500/10 to-brand-600/5',
  index = 0,
}) {
  const getTrendIcon = () => {
    if (changeValue > 0) return TrendingUp;
    if (changeValue < 0) return TrendingDown;
    return Minus;
  };

  const getTrendColor = () => {
    if (changeValue > 0) return 'text-emerald-400 bg-emerald-500/10';
    if (changeValue < 0) return 'text-rose-400 bg-rose-500/10';
    return 'text-slate-400 bg-slate-500/10';
  };

  const TrendIcon = getTrendIcon();
  const trendColor = getTrendColor();

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08, ease: 'easeOut' }}
      className="glass-card-hover p-5 relative overflow-hidden group"
    >
      {/* Ambient glow background */}
      <div
        className={`absolute -top-8 -right-8 w-24 h-24 rounded-full bg-gradient-to-br ${bgColor} blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
      />

      <div className="relative z-10 flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider truncate">
            {title}
          </p>
          <p className="mt-2 text-2xl font-bold text-white font-display tracking-tight">
            {value}
          </p>

          {/* Trend indicator */}
          <div className="mt-2 flex items-center gap-1.5">
            <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-semibold ${trendColor}`}>
              <TrendIcon className="h-3 w-3" />
              {change}
            </span>
          </div>
        </div>

        {/* Icon container with layered glow */}
        <div className={`relative p-2.5 rounded-xl bg-gradient-to-br ${bgColor}`}>
          <Icon className={`h-5 w-5 ${color}`} />
          <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${bgColor} blur-md opacity-50`} />
        </div>
      </div>

      {/* Bottom decorative line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-500/20 to-transparent" />
    </motion.div>
  );
}

export default StatsCard;
