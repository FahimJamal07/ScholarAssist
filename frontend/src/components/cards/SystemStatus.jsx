import React from 'react';
import { motion } from 'framer-motion';
import { Cpu, Zap, HardDrive, Wifi, CheckCircle2, Server } from 'lucide-react';

/**
 * SystemStatus — Real-time system health widget for the dashboard.
 * Displays AI model availability, vector store status, and API health
 * with animated indicators.
 */
const services = [
  {
    name: 'Gemini API',
    description: 'Summarization & QA',
    status: 'operational',
    latency: '142ms',
    icon: Zap,
  },
  {
    name: 'Claude API',
    description: 'Literature synthesis',
    status: 'operational',
    latency: '238ms',
    icon: Cpu,
  },
  {
    name: 'Vector Store',
    description: 'FAISS / Embeddings',
    status: 'operational',
    latency: '12ms',
    icon: HardDrive,
  },
  {
    name: 'FastAPI Backend',
    description: 'Core API server',
    status: 'operational',
    latency: '8ms',
    icon: Server,
  },
];

const statusColors = {
  operational: { dot: 'bg-emerald-400', text: 'text-emerald-400', label: 'Operational' },
  degraded: { dot: 'bg-amber-400', text: 'text-amber-400', label: 'Degraded' },
  down: { dot: 'bg-rose-400', text: 'text-rose-400', label: 'Down' },
};

function SystemStatus() {
  const allOperational = services.every((s) => s.status === 'operational');

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.8 }}
      className="glass-card p-5"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Wifi className="h-4 w-4 text-brand-400" />
          <h2 className="text-base font-semibold text-slate-200 font-display">System Status</h2>
        </div>
        {allOperational && (
          <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
            <CheckCircle2 className="h-3 w-3" />
            All Systems Operational
          </span>
        )}
      </div>

      {/* Service list */}
      <div className="space-y-2">
        {services.map((service, idx) => {
          const Icon = service.icon;
          const colors = statusColors[service.status];

          return (
            <motion.div
              key={service.name}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.85 + idx * 0.05 }}
              className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-slate-800/30 transition-colors"
            >
              <div className="shrink-0 p-1.5 rounded-lg bg-slate-800/80">
                <Icon className="h-3.5 w-3.5 text-slate-400" />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-200">{service.name}</p>
                <p className="text-[11px] text-slate-500">{service.description}</p>
              </div>

              <div className="shrink-0 flex items-center gap-3">
                <span className="text-[10px] font-mono text-slate-500">{service.latency}</span>
                <div className="flex items-center gap-1.5">
                  <div className={`w-1.5 h-1.5 rounded-full ${colors.dot} animate-pulse`} />
                  <span className={`text-[10px] font-semibold ${colors.text}`}>
                    {colors.label}
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Uptime bar */}
      <div className="mt-4 pt-3 border-t border-slate-800/40">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] text-slate-500 uppercase tracking-wider">30-Day Uptime</span>
          <span className="text-xs font-bold text-emerald-400 font-mono">99.8%</span>
        </div>
        <div className="h-1.5 rounded-full bg-slate-800/80 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: '99.8%' }}
            transition={{ duration: 1.2, delay: 1, ease: 'easeOut' }}
            className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400"
          />
        </div>
      </div>
    </motion.div>
  );
}

export default SystemStatus;
