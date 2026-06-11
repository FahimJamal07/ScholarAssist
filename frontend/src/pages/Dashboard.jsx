import React from 'react';
import { Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Upload,
  MessageSquareText,
  BookOpenText,
  Sparkles,
  BarChart3,
  TrendingUp,
  Database,
  Cpu,
  Activity,
} from 'lucide-react';
import Card from '../components/ui/Card.jsx';
import PageHeader from '../components/ui/PageHeader.jsx';

const metrics = [
  { name: 'Papers Analyzed', value: '124', change: '+12 this week', icon: TrendingUp, color: 'text-accent-emerald' },
  { name: 'Vector Chunks', value: '45,201', change: '768-dim embeddings', icon: Database, color: 'text-accent-cyan' },
  { name: 'Synthesis Ops', value: '42', change: '6 today', icon: Cpu, color: 'text-brand-400' },
  { name: 'System Status', value: 'Healthy', change: '99.8% uptime', icon: Activity, color: 'text-accent-emerald' },
];

const quickActions = [
  { name: 'Upload Papers', description: 'Ingest new research PDFs into the knowledge base', icon: Upload, path: '/upload', gradient: 'from-brand-600/20 to-brand-800/10' },
  { name: 'Chat with Papers', description: 'RAG-powered Q&A across your research library', icon: MessageSquareText, path: '/chat', gradient: 'from-cyan-600/20 to-cyan-800/10' },
  { name: 'Literature Review', description: 'AI-synthesized thematic reviews with Claude', icon: BookOpenText, path: '/literature-review', gradient: 'from-purple-600/20 to-purple-800/10' },
  { name: 'Novelty Detection', description: 'Evaluate research originality with semantic analysis', icon: Sparkles, path: '/novelty', gradient: 'from-amber-600/20 to-amber-800/10' },
  { name: 'Analytics', description: 'Citation graphs, keyword density, and paper statistics', icon: BarChart3, path: '/analytics', gradient: 'from-rose-600/20 to-rose-800/10' },
];

function Dashboard() {
  return (
    <div className="page-container">
      <PageHeader
        icon={LayoutDashboard}
        title="Research Intelligence Dashboard"
        subtitle="Monitor your knowledge base, run analytics, compare research, and explore your papers with AI."
      />

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((item, idx) => {
          const Icon = item.icon;
          return (
            <Card key={item.name} className={`animate-slide-up`} style={{ animationDelay: `${idx * 80}ms` }}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">{item.name}</p>
                  <p className="mt-2 text-2xl font-bold text-white font-display">{item.value}</p>
                  <p className={`mt-1 text-xs ${item.color}`}>{item.change}</p>
                </div>
                <div className="p-2 rounded-lg bg-slate-800/60">
                  <Icon className={`h-5 w-5 ${item.color}`} />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold text-slate-200 font-display mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link key={action.path} to={action.path}>
                <Card hover className={`bg-gradient-to-br ${action.gradient}`}>
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-slate-800/60 shrink-0">
                      <Icon className="h-5 w-5 text-brand-300" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-white">{action.name}</h3>
                      <p className="mt-1 text-xs text-slate-400 leading-relaxed">{action.description}</p>
                    </div>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Recent Activity Placeholder */}
      <Card>
        <h2 className="text-lg font-semibold text-slate-200 font-display mb-3">Recent Activity</h2>
        <div className="space-y-3">
          {[
            { action: 'Paper uploaded', detail: 'attention_mechanisms_2024.pdf', time: '2 min ago' },
            { action: 'Literature review generated', detail: 'Transformer Optimization Survey', time: '15 min ago' },
            { action: 'Novelty analysis complete', detail: 'Score: 78/100', time: '1 hour ago' },
          ].map((item, idx) => (
            <div key={idx} className="flex items-center justify-between py-2 border-b border-slate-800/40 last:border-0">
              <div>
                <p className="text-sm text-slate-200">{item.action}</p>
                <p className="text-xs text-slate-500">{item.detail}</p>
              </div>
              <span className="text-xs text-slate-600">{item.time}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

export default Dashboard;
