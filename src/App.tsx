import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';
import type { ReactNode } from 'react';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Consent from './pages/Consent';
import CreditSimulator from './pages/CreditSimulator';
import CreditoAprovado from './pages/CreditoAprovado';
import { getAuthUser, hasRequiredConsent, isAuthenticated } from './lib/auth';

function ProtectedRoute({ children, requiresConsent = false }: { children: ReactNode; requiresConsent?: boolean }) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  if (requiresConsent) {
    const user = getAuthUser();
    if (!user || !hasRequiredConsent(user.id)) {
      return <Navigate to="/consent" replace />;
    }
  }

  return <>{children}</>;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/consent"
          element={
            <ProtectedRoute>
              <Consent />
            </ProtectedRoute>
          }
        />
        <Route
          path="/simulator"
          element={
            <ProtectedRoute requiresConsent>
              <CreditSimulator />
            </ProtectedRoute>
          }
        />
        <Route
          path="/approved"
          element={
            <ProtectedRoute requiresConsent>
              <CreditoAprovado />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
