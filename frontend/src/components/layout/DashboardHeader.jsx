import React from 'react';
import { motion } from 'framer-motion';

/**
 * DashboardHeader — Hero header for the dashboard with a gradient mesh background,
 * greeting message, and quick summary stats. Provides a premium "above the fold" feel.
 *
 * @param {string} greeting - Personalized greeting text
 * @param {string} subtitle - Description text
 * @param {React.Component} icon - Header icon
 * @param {React.ReactNode} actions - Optional action buttons
 */
function DashboardHeader({ greeting, subtitle, icon: Icon, actions }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative overflow-hidden rounded-2xl border border-slate-800/60 bg-gradient-to-br from-slate-900/90 via-surface to-slate-900/90 p-6 md:p-8"
    >
      {/* Background mesh decoration */}
      <div className="absolute inset-0 bg-glow-brand opacity-40" />
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gradient-radial from-brand-500/[0.07] to-transparent" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-gradient-radial from-accent-cyan/[0.04] to-transparent" />

      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />

      <div className="relative z-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div className="flex items-start gap-4">
          {Icon && (
            <div className="mt-1 p-3 rounded-xl bg-brand-500/10 border border-brand-500/20 text-brand-400 shrink-0">
              <Icon className="h-6 w-6" />
            </div>
          )}
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white font-display">
              {greeting}
            </h1>
            {subtitle && (
              <p className="mt-2 text-sm text-slate-400 max-w-2xl leading-relaxed">
                {subtitle}
              </p>
            )}

            {/* Inline mini stats */}
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <MiniStat label="Papers" value="124" />
              <MiniStat label="Queries Today" value="31" />
              <MiniStat label="Active Models" value="2" />
            </div>
          </div>
        </div>

        {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
      </div>
    </motion.div>
  );
}

/**
 * MiniStat — Tiny inline stat pill used in the dashboard header.
 */
function MiniStat({ label, value }) {
  return (
    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-800/60 border border-slate-700/40">
      <span className="text-xs font-bold text-white font-display">{value}</span>
      <span className="text-[10px] text-slate-500">{label}</span>
    </div>
  );
}

export default DashboardHeader;
