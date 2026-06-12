import React, { lazy, Suspense, useContext } from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';
import Loader from '../components/ui/Loader.jsx';

// ---------------------------------------------------------------------------
// Lazy-loaded page imports — each page is code-split into its own chunk
// ---------------------------------------------------------------------------
const Dashboard = lazy(() => import('../pages/Dashboard.jsx'));
const Upload = lazy(() => import('../pages/Upload.jsx'));
const Chat = lazy(() => import('../pages/Chat.jsx'));
const Compare = lazy(() => import('../pages/Compare.jsx'));
const LiteratureReview = lazy(() => import('../pages/LiteratureReview.jsx'));
const Novelty = lazy(() => import('../pages/Novelty.jsx'));
const Analytics = lazy(() => import('../pages/Analytics.jsx'));

// ---------------------------------------------------------------------------
// Suspense wrapper — provides a consistent loading fallback for lazy routes
// ---------------------------------------------------------------------------
function SuspenseLayout() {
  return (
    <Suspense
      fallback={
        <div className="flex-1 flex items-center justify-center">
          <Loader text="Loading page..." size="lg" />
        </div>
      }
    >
      <Outlet />
    </Suspense>
  );
}

// ---------------------------------------------------------------------------
// ProtectedRoute — redirects unauthenticated users to dashboard (or a future
// login page). Renders child routes when authenticated.
// ---------------------------------------------------------------------------
function ProtectedRoute({ redirectTo = '/dashboard' }) {
  const { isAuthenticated, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader text="Authenticating..." />
      </div>
    );
  }

  return isAuthenticated ? <Outlet /> : <Navigate to={redirectTo} replace />;
}

// ---------------------------------------------------------------------------
// Route Configuration — single source of truth for all application routes
// ---------------------------------------------------------------------------
const routeConfig = [
  // Public routes (accessible without authentication)
  { path: '/dashboard', element: <Dashboard />, isPublic: true },
  { path: '/upload', element: <Upload />, isPublic: true },
  { path: '/chat', element: <Chat />, isPublic: true },
  { path: '/compare', element: <Compare />, isPublic: true },
  { path: '/literature-review', element: <LiteratureReview />, isPublic: true },
  { path: '/novelty', element: <Novelty />, isPublic: true },
  { path: '/analytics', element: <Analytics />, isPublic: true },

  // Protected routes (uncomment & set isPublic: false when auth is enforced)
  // { path: '/settings', element: <Settings />, isPublic: false },
];

// ---------------------------------------------------------------------------
// AppRoutes — centralized router with layout nesting
// ---------------------------------------------------------------------------
function AppRoutes() {
  const publicRoutes = routeConfig.filter((r) => r.isPublic);
  const protectedRoutes = routeConfig.filter((r) => !r.isPublic);

  return (
    <Routes>
      {/* Redirect root to dashboard */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      {/* All routes wrapped in a Suspense layout for lazy loading */}
      <Route element={<SuspenseLayout />}>
        {/* Public routes */}
        {publicRoutes.map((route) => (
          <Route key={route.path} path={route.path} element={route.element} />
        ))}

        {/* Protected routes — nested under auth guard */}
        <Route element={<ProtectedRoute />}>
          {protectedRoutes.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}
        </Route>
      </Route>

      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default AppRoutes;
