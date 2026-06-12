import React, { lazy, Suspense, useContext } from 'react';
import { Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
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

// Auth Pages
const Login = lazy(() => import('../pages/Login.jsx'));
const Register = lazy(() => import('../pages/Register.jsx'));

// ---------------------------------------------------------------------------
// Suspense wrapper — provides a consistent loading fallback for lazy routes
// ---------------------------------------------------------------------------
function SuspenseLayout() {
  return (
    <Suspense
      fallback={
        <div className="flex-1 flex items-center justify-center min-h-screen bg-slate-950">
          <Loader text="Loading page..." size="lg" />
        </div>
      }
    >
      <Outlet />
    </Suspense>
  );
}

// ---------------------------------------------------------------------------
// ProtectedRoute — redirects unauthenticated users to login
// ---------------------------------------------------------------------------
function ProtectedRoute({ redirectTo = '/login' }) {
  const { isAuthenticated, loading } = useContext(AuthContext);
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen bg-slate-950">
        <Loader text="Authenticating..." />
      </div>
    );
  }

  // Pass current location in state so we can redirect back after login
  return isAuthenticated ? <Outlet /> : <Navigate to={redirectTo} state={{ from: location }} replace />;
}

// ---------------------------------------------------------------------------
// PublicOnlyRoute — redirects authenticated users away from auth pages
// ---------------------------------------------------------------------------
function PublicOnlyRoute({ redirectTo = '/dashboard' }) {
  const { isAuthenticated, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen bg-slate-950">
        <Loader text="Loading..." />
      </div>
    );
  }

  return !isAuthenticated ? <Outlet /> : <Navigate to={redirectTo} replace />;
}

// ---------------------------------------------------------------------------
// Route Configuration
// ---------------------------------------------------------------------------
const routeConfig = [
  // Core application routes (now protected)
  { path: '/dashboard', element: <Dashboard />, isProtected: true },
  { path: '/upload', element: <Upload />, isProtected: true },
  { path: '/chat', element: <Chat />, isProtected: true },
  { path: '/compare', element: <Compare />, isProtected: true },
  { path: '/literature-review', element: <LiteratureReview />, isProtected: true },
  { path: '/novelty', element: <Novelty />, isProtected: true },
  { path: '/analytics', element: <Analytics />, isProtected: true },
  
  // Auth routes (public only)
  { path: '/login', element: <Login />, isPublicOnly: true },
  { path: '/register', element: <Register />, isPublicOnly: true },
];

// ---------------------------------------------------------------------------
// AppRoutes — centralized router
// ---------------------------------------------------------------------------
function AppRoutes() {
  const protectedRoutes = routeConfig.filter((r) => r.isProtected);
  const publicOnlyRoutes = routeConfig.filter((r) => r.isPublicOnly);

  return (
    <Routes>
      {/* Root redirect */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      {/* Lazy loading layout */}
      <Route element={<SuspenseLayout />}>
        
        {/* Public Only routes (Login, Register) */}
        <Route element={<PublicOnlyRoute />}>
          {publicOnlyRoutes.map((route) => (
            <Route key={route.path} path={route.path} element={route.element} />
          ))}
        </Route>

        {/* Protected routes (Dashboard, etc.) */}
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
