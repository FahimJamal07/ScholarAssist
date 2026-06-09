import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function Sidebar() {
  const location = useLocation();

  const links = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Upload Papers', path: '/upload' },
    { name: 'Chat', path: '/chat' },
    { name: 'Compare', path: '/compare' },
    { name: 'Literature Review', path: '/literature-review' },
    { name: 'Novelty Detection', path: '/novelty' },
    { name: 'Analytics', path: '/analytics' }
  ];

  return (
    <div className="w-64 bg-slate-900 border-r border-slate-800 p-4 space-y-6">
      <div className="flex items-center gap-2 px-2">
        <span className="text-xl font-bold text-white tracking-wider">ScholarAssist</span>
        <span className="bg-brand-500/20 text-brand-400 text-[10px] px-2 py-0.5 rounded-full font-semibold">Beta</span>
      </div>

      <nav className="space-y-1">
        {links.map((link) => {
          const isActive = location.pathname === link.path;
          return (
            <Link
              key={link.path}
              to={link.path}
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${isActive ? 'bg-brand-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
            >
              {link.name}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

export default Sidebar;
