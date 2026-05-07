import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { AppShell } from '../components/layout/AppShell.jsx';
import { useAuth } from '../hooks/useAuth.js';

const AuthPage = lazy(() =>
  import('../features/auth/AuthPage.jsx').then((module) => ({ default: module.AuthPage }))
);
const DashboardPage = lazy(() =>
  import('../features/dashboard/DashboardPage.jsx').then((module) => ({
    default: module.DashboardPage
  }))
);

function ProtectedRoute({ children }) {
  const { token } = useAuth();
  return token ? children : <Navigate to="/auth" replace />;
}

export function App() {
  const { token } = useAuth();

  return (
    <Suspense fallback={<div className="loading-state">Loading experience...</div>}>
      <Routes>
        <Route
          path="/auth"
          element={token ? <Navigate to="/" replace /> : <AuthPage />}
        />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AppShell>
                <DashboardPage />
              </AppShell>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Suspense>
  );
}
