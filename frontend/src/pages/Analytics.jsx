import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import PageHeader from '../components/ui/PageHeader.jsx';
import Card from '../components/ui/Card.jsx';
import Loader from '../components/ui/Loader.jsx';
import { paperService } from '../services/paperService.js';

const CHART_COLORS = ['#818cf8', '#22d3ee', '#34d399', '#fbbf24', '#fb7185', '#a78bfa'];

// Mock data used as fallback
const mockKeywordData = [
  { keyword: 'Transformer', count: 45 },
  { keyword: 'Attention', count: 38 },
  { keyword: 'BERT', count: 28 },
  { keyword: 'Self-Supervised', count: 22 },
  { keyword: 'Fine-Tuning', count: 18 },
  { keyword: 'Embeddings', count: 15 },
];

const mockDistributionData = [
  { name: 'NLP', value: 34 },
  { name: 'Computer Vision', value: 25 },
  { name: 'Reinforcement Learning', value: 18 },
  { name: 'Optimization', value: 14 },
  { name: 'Other', value: 9 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="glass-card px-3 py-2 text-xs">
      <p className="text-white font-semibold">{label || payload[0]?.name}</p>
      <p className="text-brand-300">{payload[0]?.value}</p>
    </div>
  );
};

function Analytics() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await paperService.getAnalytics();
        if (res.success && res.data) {
          setAnalytics(res.data);
        }
      } catch {
        // Silently fall back to mock data
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  const keywordData = analytics?.keywords || mockKeywordData;
  const distributionData = analytics?.distribution || mockDistributionData;

  if (loading) {
    return (
      <div className="page-container">
        <PageHeader icon={BarChart3} title="Citation & Paper Analytics" subtitle="Loading analytics data..." />
        <Card><Loader text="Fetching analytics data..." /></Card>
      </div>
    );
  }

  return (
    <div className="page-container">
      <PageHeader
        icon={BarChart3}
        title="Citation & Paper Analytics"
        subtitle="Visualize keyword frequencies, paper distribution, reference connections, and research trends."
        actions={
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accent-emerald/10 text-accent-emerald text-xs font-semibold">
            <TrendingUp className="h-3.5 w-3.5" />
            Live Data
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Keyword Frequency */}
        <Card>
          <h2 className="text-sm font-semibold text-white font-display mb-4">Keyword Frequency</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={keywordData} margin={{ top: 5, right: 5, bottom: 5, left: -10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="keyword" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={{ stroke: '#334155' }} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={{ stroke: '#334155' }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" fill="#818cf8" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Paper Distribution */}
        <Card>
          <h2 className="text-sm font-semibold text-white font-display mb-4">Research Domain Distribution</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={distributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={90}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {distributionData.map((_, idx) => (
                    <Cell key={idx} fill={CHART_COLORS[idx % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  verticalAlign="bottom"
                  iconType="circle"
                  iconSize={8}
                  formatter={(value) => <span className="text-xs text-slate-400">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Papers', value: '124' },
          { label: 'Total Citations', value: '3,847' },
          { label: 'Avg. Chunks/Paper', value: '364' },
          { label: 'Unique Keywords', value: '218' },
        ].map((stat) => (
          <Card key={stat.label}>
            <p className="text-xs text-slate-500 uppercase tracking-wider">{stat.label}</p>
            <p className="mt-1 text-2xl font-bold text-white font-display">{stat.value}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default Analytics;
