import React, { lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import LazyPage from './lazy/LazyPage';
import { ProtectedRoute, AdminRoute, PublicOnlyRoute } from './routes/RouteGuards';

// Lazy-loaded pages as per README Section 11
const Login = lazy(() => import('./pages/auth/Login'));
const Register = lazy(() => import('./pages/auth/Register'));
const ForgotPassword = lazy(() => import('./pages/auth/ForgotPassword'));
const Dashboard = lazy(() => import('./pages/dashboard/Dashboard'));
const Feed = lazy(() => import('./pages/feed/Feed'));
const Discovery = lazy(() => import('./pages/discovery/Discovery'));
const Profile = lazy(() => import('./pages/profile/Profile'));
const VerificationCenter = lazy(() => import('./pages/verification/VerificationCenter'));
const Networking = lazy(() => import('./pages/networking/Networking'));
const Messaging = lazy(() => import('./pages/messaging/Messaging'));
const Notifications = lazy(() => import('./pages/notifications/Notifications'));
const Organisations = lazy(() => import('./pages/organisation/Organisations'));
const OrganisationDetails = lazy(() => import('./pages/organisation/OrganisationDetails'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          {/* Public Auth Routes */}
          <Route
            path="/login"
            element={
              <PublicOnlyRoute>
                <LazyPage component={Login} />
              </PublicOnlyRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicOnlyRoute>
                <LazyPage component={Register} />
              </PublicOnlyRoute>
            }
          />
          <Route
            path="/forgot-password"
            element={
              <PublicOnlyRoute>
                <LazyPage component={ForgotPassword} />
              </PublicOnlyRoute>
            }
          />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <LazyPage component={Feed} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <LazyPage component={Profile} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/verification"
            element={
              <ProtectedRoute>
                <LazyPage component={VerificationCenter} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/network"
            element={
              <ProtectedRoute>
                <LazyPage component={Networking} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/discovery"
            element={
              <ProtectedRoute>
                <LazyPage component={Discovery} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/messaging"
            element={
              <ProtectedRoute>
                <LazyPage component={Messaging} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/notifications"
            element={
              <ProtectedRoute>
                <LazyPage component={Notifications} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/organisations"
            element={
              <ProtectedRoute>
                <LazyPage component={Organisations} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/organisations/:id"
            element={
              <ProtectedRoute>
                <LazyPage component={OrganisationDetails} />
              </ProtectedRoute>
            }
          />

          {/* Admin Protected Route */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <LazyPage component={AdminDashboard} />
              </AdminRoute>
            }
          />

          {/* Default Redirect */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;

