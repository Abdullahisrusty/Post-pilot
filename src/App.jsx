import { Routes, Route, Navigate } from 'react-router-dom';
import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';
import { ToastProvider } from './context/ToastContext';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import Community from './pages/Community';
import Analytics from './pages/Analytics';
import CalendarPage from './pages/CalendarPage';
import Drafts from './pages/Drafts';
import History from './pages/History';
import Settings from './pages/Settings';
import Integrations from './pages/Integrations';
import DashboardLayout from './components/DashboardLayout';
import './App.css';

function ProtectedRoute({ children }) {
  return (
    <>
      <SignedIn>{children}</SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route
        path="/app"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="community" element={<Community />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="calendar" element={<CalendarPage />} />
        <Route path="drafts" element={<Drafts />} />
        <Route path="history" element={<History />} />
        <Route path="settings" element={<Settings />} />
        <Route path="integrations" element={<Integrations />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AppRoutes />
    </ToastProvider>
  );
}
