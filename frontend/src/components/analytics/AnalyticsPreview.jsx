import React from 'react';
import { motion } from 'framer-motion';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';
import { BarChart3, TrendingUp, ChevronRight } from 'lucide-react';

/**
 * AnalyticsPreview — Dashboard analytics widget with an area chart for
 * weekly upload trends and a mini bar chart for top research categories.
 * Uses Recharts for data visualization with the brand color palette.
 */

const weeklyData = [
  { day: 'Mon', papers: 4, queries: 12 },
  { day: 'Tue', papers: 7, queries: 18 },
  { day: 'Wed', papers: 3, queries: 24 },
  { day: 'Thu', papers: 9, queries: 15 },
  { day: 'Fri', papers: 12, queries: 31 },
  { day: 'Sat', papers: 6, queries: 9 },
  { day: 'Sun', papers: 8, queries: 22 },
];

const categoryData = [
  { name: 'NLP', count: 38 },
  { name: 'CV', count: 24 },
  { name: 'RL', count: 18 },
  { name: 'LLMs', count: 31 },
  { name: 'RAG', count: 13 },
];

/**
 * Custom tooltip component for the area chart.
 */
function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;

  return (
    <div className="glass-card p-3 !rounded-lg border-slate-700/80 shadow-xl">
      <p className="text-xs font-semibold text-slate-300 mb-1.5">{label}</p>
      {payload.map((entry) => (
        <div key={entry.dataKey} className="flex items-center gap-2 text-xs">
          <div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-slate-400 capitalize">{entry.dataKey}:</span>
          <span className="font-semibold text-white">{entry.value}</span>
        </div>
      ))}
    </div>
  );
}

function AnalyticsPreview() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.6 }}
      className="glass-card p-5"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-brand-400" />
          <h2 className="text-base font-semibold text-slate-200 font-display">
            Analytics Overview
          </h2>
        </div>
        <a
          href="/analytics"
          className="text-xs font-medium text-brand-400 hover:text-brand-300 transition-colors inline-flex items-center gap-1"
        >
          Full Report
          <ChevronRight className="h-3 w-3" />
        </a>
      </div>

      {/* Main area chart */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wider">Weekly Activity</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xl font-bold text-white font-display">49</span>
              <span className="text-xs text-emerald-400 font-semibold flex items-center gap-0.5">
                <TrendingUp className="h-3 w-3" />
                +23%
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-brand-400" />
              <span className="text-[10px] text-slate-500">Papers</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-accent-cyan" />
              <span className="text-[10px] text-slate-500">Queries</span>
            </div>
          </div>
        </div>

        <div className="h-[180px] -mx-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={weeklyData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="gradientPapers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#818cf8" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#818cf8" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradientQueries" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#64748b', fontSize: 11 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#64748b', fontSize: 11 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="papers"
                stroke="#818cf8"
                strokeWidth={2}
                fill="url(#gradientPapers)"
                dot={false}
                activeDot={{ r: 4, fill: '#818cf8', stroke: '#1e293b', strokeWidth: 2 }}
              />
              <Area
                type="monotone"
                dataKey="queries"
                stroke="#22d3ee"
                strokeWidth={2}
                fill="url(#gradientQueries)"
                dot={false}
                activeDot={{ r: 4, fill: '#22d3ee', stroke: '#1e293b', strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Category bar chart */}
      <div>
        <p className="text-xs text-slate-500 uppercase tracking-wider mb-3">Top Research Areas</p>
        <div className="h-[100px] -mx-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={categoryData} margin={{ top: 0, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#94a3b8', fontSize: 10 }}
              />
              <YAxis hide />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="count"
                fill="#6366f1"
                radius={[4, 4, 0, 0]}
                maxBarSize={32}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </motion.div>
  );
}

export default AnalyticsPreview;
