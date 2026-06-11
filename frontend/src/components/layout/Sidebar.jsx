import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Upload,
  MessageSquareText,
  GitCompareArrows,
  BookOpenText,
  Sparkles,
  BarChart3,
  PanelLeftClose,
  PanelLeft,
  GraduationCap,
} from 'lucide-react';

const navLinks = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Upload Papers', path: '/upload', icon: Upload },
  { name: 'Chat', path: '/chat', icon: MessageSquareText },
  { name: 'Compare', path: '/compare', icon: GitCompareArrows },
  { name: 'Literature Review', path: '/literature-review', icon: BookOpenText },
  { name: 'Novelty Detection', path: '/novelty', icon: Sparkles },
  { name: 'Analytics', path: '/analytics', icon: BarChart3 },
];

function Sidebar() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`relative flex flex-col h-screen bg-slate-900/80 backdrop-blur-xl border-r border-slate-800/60 transition-all duration-300 ${
        collapsed ? 'w-[68px]' : 'w-64'
      }`}
    >
      {/* Brand */}
      <div className="flex items-center gap-2.5 px-4 h-16 border-b border-slate-800/60 shrink-0">
        <div className="p-1.5 rounded-lg bg-brand-500/15">
          <GraduationCap className="h-5 w-5 text-brand-400" />
        </div>
        {!collapsed && (
          <div className="flex items-center gap-2 animate-fade-in">
            <span className="text-lg font-bold text-white font-display tracking-wide">ScholarAssist</span>
            <span className="bg-brand-500/15 text-brand-400 text-[9px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
              Beta
            </span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-2.5 space-y-1">
        {navLinks.map((link) => {
          const isActive = location.pathname === link.path;
          const Icon = link.icon;
          return (
            <Link
              key={link.path}
              to={link.path}
              title={collapsed ? link.name : undefined}
              className={`group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-brand-500/15 text-brand-300 shadow-glow-sm'
                  : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
              }`}
            >
              <Icon className={`h-[18px] w-[18px] shrink-0 transition-colors ${isActive ? 'text-brand-400' : 'text-slate-500 group-hover:text-slate-300'}`} />
              {!collapsed && <span className="truncate">{link.name}</span>}
              {isActive && !collapsed && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-brand-400 shadow-[0_0_6px_rgba(99,102,241,0.6)]" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Collapse Toggle */}
      <div className="px-2.5 py-3 border-t border-slate-800/60 shrink-0">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-slate-500 hover:text-slate-300 hover:bg-slate-800/60 transition-colors"
        >
          {collapsed ? <PanelLeft className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
          {!collapsed && <span>Collapse</span>}
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
