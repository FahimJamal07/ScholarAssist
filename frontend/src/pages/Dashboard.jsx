import React from 'react';

function Dashboard() {
  return (
    <div className="p-8 max-w-7xl mx-auto w-full space-y-6">
      <div className="border-b border-slate-800 pb-5">
        <h1 className="text-3xl font-bold tracking-tight text-white">Research Intelligence Dashboard</h1>
        <p className="mt-2 text-sm text-slate-400">
          Welcome to ScholarAssist. Monitor upload queues, run analytics, compare research, and search papers.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Metric Cards */}
        {[
          { name: 'Total Papers Analyzed', value: '124' },
          { name: 'Vector Database Chunks', value: '45,201' },
          { name: 'Synthesis Operations', value: '42' },
          { name: 'API System Load', value: 'Healthy' }
        ].map((item) => (
          <div key={item.name} className="relative overflow-hidden rounded-lg bg-slate-900 px-4 py-5 shadow sm:px-6 sm:py-6 border border-slate-800">
            <dt>
              <p className="truncate text-sm font-medium text-slate-400">{item.name}</p>
            </dt>
            <dd className="flex items-baseline pb-6 sm:pb-7">
              <p className="text-2xl font-semibold text-white">{item.value}</p>
            </dd>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
