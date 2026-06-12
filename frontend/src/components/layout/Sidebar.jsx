import React, { useState, useEffect, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
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
  Menu,
  X,
  LogOut,
  Settings,
  ChevronRight,
} from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';

/**
 * Navigation link configuration — single source of truth for sidebar items.
 * Each item maps to a page route defined in AppRoutes.jsx.
 */
const navLinks = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, shortcut: '⌘1' },
  { name: 'Upload Papers', path: '/upload', icon: Upload, shortcut: '⌘2' },
  { name: 'Chat', path: '/chat', icon: MessageSquareText, shortcut: '⌘3' },
  { name: 'Compare', path: '/compare', icon: GitCompareArrows, shortcut: '⌘4' },
  { name: 'Literature Review', path: '/literature-review', icon: BookOpenText, shortcut: '⌘5' },
  { name: 'Novelty Detection', path: '/novelty', icon: Sparkles, shortcut: '⌘6' },
  { name: 'Analytics', path: '/analytics', icon: BarChart3, shortcut: '⌘7' },
];

/**
 * Sidebar — Responsive navigation sidebar with collapse and mobile drawer support.
 * Features:
 * - Glassmorphism design with backdrop blur
 * - Animated active route indicator
 * - Collapsible desktop view
 * - Full mobile drawer with overlay
 * - User profile section
 */
function Sidebar() {
  const location = useLocation();
  const { user, logout } = useContext(AuthContext);
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close mobile sidebar on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  // Close mobile sidebar on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') setMobileOpen(false);
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, []);

  const sidebarContent = (isMobile = false) => {
    const isExpanded = isMobile || !collapsed;

    return (
      <>
        {/* Brand Header */}
        <div className="flex items-center gap-2.5 px-4 h-16 border-b border-slate-800/60 shrink-0">
          <div className="relative p-1.5 rounded-lg bg-brand-500/15 group-hover:bg-brand-500/25 transition-colors">
            <GraduationCap className="h-5 w-5 text-brand-400" />
            <div className="absolute inset-0 rounded-lg bg-brand-500/20 animate-glow-pulse opacity-50" />
          </div>
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-2 overflow-hidden"
              >
                <span className="text-lg font-bold text-white font-display tracking-wide whitespace-nowrap">
                  ScholarAssist
                </span>
                <span className="bg-brand-500/15 text-brand-400 text-[9px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider shrink-0">
                  Beta
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Mobile close button */}
          {isMobile && (
            <button
              onClick={() => setMobileOpen(false)}
              className="ml-auto p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
              aria-label="Close sidebar"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto py-4 px-2.5 space-y-1" aria-label="Main navigation">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            const Icon = link.icon;

            return (
              <Link
                key={link.path}
                to={link.path}
                title={!isExpanded ? link.name : undefined}
                className={`group relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'text-white'
                    : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                }`}
              >
                {/* Active background pill */}
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active-pill"
                    className="absolute inset-0 rounded-lg bg-brand-500/15 border border-brand-500/20 shadow-glow-sm"
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}

                <Icon
                  className={`relative z-10 h-[18px] w-[18px] shrink-0 transition-colors ${
                    isActive ? 'text-brand-400' : 'text-slate-500 group-hover:text-slate-300'
                  }`}
                />

                <AnimatePresence>
                  {isExpanded && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.15 }}
                      className="relative z-10 truncate"
                    >
                      {link.name}
                    </motion.span>
                  )}
                </AnimatePresence>

                {/* Active dot indicator */}
                {isActive && isExpanded && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="relative z-10 ml-auto w-1.5 h-1.5 rounded-full bg-brand-400 shadow-[0_0_6px_rgba(99,102,241,0.6)]"
                  />
                )}

                {/* Keyboard shortcut hint (desktop only) */}
                {!isActive && isExpanded && !isMobile && (
                  <span className="relative z-10 ml-auto text-[10px] text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity font-mono">
                    {link.shortcut}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Profile & Collapse Toggle */}
        <div className="border-t border-slate-800/60 shrink-0">
          {/* User section */}
          {isExpanded && user && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="px-3 pt-3 pb-2"
            >
              <div className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-slate-800/40 transition-colors group">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-400 to-accent-cyan flex items-center justify-center text-xs font-bold text-white shrink-0 uppercase">
                  {user.username ? user.username.substring(0, 2) : 'SA'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-200 truncate">{user.username}</p>
                  <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                </div>
                <button
                  onClick={logout}
                  className="p-1.5 rounded-md text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                  title="Sign out"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* Collapse button (desktop only) */}
          {!isMobile && (
            <div className="px-2.5 py-3">
              <button
                onClick={() => setCollapsed(!collapsed)}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-slate-500 hover:text-slate-300 hover:bg-slate-800/60 transition-colors"
                aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              >
                {collapsed ? (
                  <PanelLeft className="h-4 w-4" />
                ) : (
                  <PanelLeftClose className="h-4 w-4" />
                )}
                <AnimatePresence>
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      Collapse
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            </div>
          )}
        </div>
      </>
    );
  };

  return (
    <>
      {/* Mobile hamburger trigger */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-surface-raised/90 backdrop-blur-md border border-slate-700/50 text-slate-300 hover:text-white hover:bg-surface-overlay transition-colors lg:hidden shadow-lg"
        aria-label="Open navigation"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Mobile sidebar drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.aside
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed inset-y-0 left-0 z-50 flex flex-col w-72 bg-slate-900/95 backdrop-blur-xl border-r border-slate-800/60 lg:hidden"
          >
            {sidebarContent(true)}
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Desktop sidebar */}
      <aside
        className={`hidden lg:flex flex-col h-screen bg-slate-900/80 backdrop-blur-xl border-r border-slate-800/60 transition-all duration-300 ${
          collapsed ? 'w-[68px]' : 'w-64'
        }`}
      >
        {sidebarContent(false)}
      </aside>
    </>
  );
}

export default Sidebar;
