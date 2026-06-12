import React from 'react';
import { LayoutDashboard } from 'lucide-react';
import DashboardHeader from '../components/layout/DashboardHeader.jsx';
import StatsGrid from '../components/cards/StatsGrid.jsx';
import QuickActions from '../components/cards/QuickActions.jsx';
import RecentUploads from '../components/cards/RecentUploads.jsx';
import AnalyticsPreview from '../components/analytics/AnalyticsPreview.jsx';
import ActivityFeed from '../components/cards/ActivityFeed.jsx';
import SystemStatus from '../components/cards/SystemStatus.jsx';

/**
 * Dashboard — Main landing page for ScholarAssist.
 * Renders the hero header, KPI stats grid, quick action cards,
 * and a two-column lower section with uploads/analytics on the left
 * and activity/system status on the right.
 *
 * All sub-components are modular and reusable, following the project's
 * strict architecture rules from instructions.md.
 */
function Dashboard() {
  return (
    <div className="page-container">
      {/* Hero Header */}
      <DashboardHeader
        icon={LayoutDashboard}
        greeting="Research Intelligence Dashboard"
        subtitle="Monitor your knowledge base, run analytics, compare research, and explore your papers with AI-powered tools."
      />

      {/* KPI Metrics */}
      <StatsGrid />

      {/* Quick Actions */}
      <QuickActions />

      {/* Two-column lower section */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left column — uploads + analytics (wider) */}
        <div className="lg:col-span-3 space-y-6">
          <RecentUploads />
          <AnalyticsPreview />
        </div>

        {/* Right column — activity + system status */}
        <div className="lg:col-span-2 space-y-6">
          <ActivityFeed />
          <SystemStatus />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
