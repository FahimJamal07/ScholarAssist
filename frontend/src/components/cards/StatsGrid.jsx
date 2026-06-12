import React from 'react';
import { TrendingUp, Database, Cpu, Activity } from 'lucide-react';
import StatsCard from './StatsCard.jsx';

/**
 * StatsGrid — Renders the primary KPI metric cards in a responsive grid.
 * Pulls data from props (or defaults to demo values) so it can be wired
 * to real API data via React Query in the future.
 *
 * @param {Array} stats - Array of stat objects to display
 */
const defaultStats = [
  {
    title: 'Papers Analyzed',
    value: '124',
    change: '+12 this week',
    changeValue: 12,
    icon: TrendingUp,
    color: 'text-accent-emerald',
    bgColor: 'from-emerald-500/10 to-emerald-600/5',
  },
  {
    title: 'Vector Chunks',
    value: '45,201',
    change: '768-dim embeddings',
    changeValue: 0,
    icon: Database,
    color: 'text-accent-cyan',
    bgColor: 'from-cyan-500/10 to-cyan-600/5',
  },
  {
    title: 'Synthesis Ops',
    value: '42',
    change: '+6 today',
    changeValue: 6,
    icon: Cpu,
    color: 'text-brand-400',
    bgColor: 'from-brand-500/10 to-brand-600/5',
  },
  {
    title: 'System Status',
    value: 'Healthy',
    change: '99.8% uptime',
    changeValue: 1,
    icon: Activity,
    color: 'text-accent-emerald',
    bgColor: 'from-emerald-500/10 to-emerald-600/5',
  },
];

function StatsGrid({ stats = defaultStats }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, idx) => (
        <StatsCard key={stat.title} {...stat} index={idx} />
      ))}
    </div>
  );
}

export default StatsGrid;
