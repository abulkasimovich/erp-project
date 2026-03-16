import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Pages
import LoginPage    from './pages/LoginPage';
import Layout       from './components/Layout';
import Dashboard    from './pages/Dashboard';
import GroupsPage   from './pages/GroupsPage';
import GroupDetail  from './pages/GroupDetail';
import TeachersPage from './pages/TeachersPage';
import StudentsPage from './pages/StudentsPage';
import StaffPage    from './pages/StaffPage';

// ── ProtectedRoute: redirect to /login if not logged in ─────
function ProtectedRoute({ children }) {
  const { isLoggedIn } = useAuth();
  if (!isLoggedIn) return <Navigate to="/login" replace />;
  return children;
}

function AppRoutes() {
  const { isLoggedIn } = useAuth();
  return (
    <Routes>
      {/* Public */}
      <Route
        path="/login"
        element={isLoggedIn ? <Navigate to="/" replace /> : <LoginPage />}
      />
      
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index         element={<Dashboard />} />
        <Route path="groups" element={<GroupsPage />} />
        <Route path="groups/:id" element={<GroupDetail />} />
        <Route path="teachers" element={<TeachersPage />} />
        <Route path="students" element={<StudentsPage />} />
        <Route path="staff"    element={<StaffPage />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
