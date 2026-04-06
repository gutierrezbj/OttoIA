import React, { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { Toaster } from './components/ui/sonner';

// Eagerly loaded (first paint)
import Landing from './pages/Landing';
import AuthCallback from './pages/AuthCallback';

// Lazy loaded (code-split)
const ParentDashboard = lazy(() => import('./pages/ParentDashboard'));
const ChildDashboard = lazy(() => import('./pages/ChildDashboard'));
const ChildSetup = lazy(() => import('./pages/ChildSetup'));
const TutorChat = lazy(() => import('./pages/TutorChat'));
const Practice = lazy(() => import('./pages/Practice'));
const WeeklyReport = lazy(() => import('./pages/WeeklyReport'));
const AdventureMap = lazy(() => import('./pages/AdventureMap'));

const API = import.meta.env.VITE_API_URL || '/api';

// Auth context
export const AuthContext = React.createContext(null);
export { API };

// Protected Route Component
const ProtectedRoute = ({ children, requiredType }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.user) {
      setUser(location.state.user);
      setIsAuthenticated(true);
      return;
    }

    const checkAuth = async () => {
      try {
        const response = await axios.get(`${API}/auth/me`, {
          withCredentials: true
        });
        setUser(response.data);
        setIsAuthenticated(true);
      } catch (error) {
        setIsAuthenticated(false);
        navigate('/');
      }
    };

    checkAuth();
  }, [navigate, location.state]);

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFFDF5]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#4CC9F0] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg font-medium text-[#2B2D42]">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// App Router — handles session_id fragment detection
function AppRouter() {
  const location = useLocation();

  if (location.hash?.includes('session_id=')) {
    return <AuthCallback />;
  }

  const LazyFallback = (
    <div className="min-h-screen flex items-center justify-center bg-[#FFFDF5]">
      <div className="w-16 h-16 border-4 border-[#4CC9F0] border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <Suspense fallback={LazyFallback}>
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/auth/callback" element={<AuthCallback />} />

      {/* Parent Routes */}
      <Route path="/parent" element={
        <ProtectedRoute requiredType="parent">
          <ParentDashboard />
        </ProtectedRoute>
      } />
      <Route path="/parent/setup" element={
        <ProtectedRoute requiredType="parent">
          <ChildSetup />
        </ProtectedRoute>
      } />
      <Route path="/parent/report/:childId" element={
        <ProtectedRoute requiredType="parent">
          <WeeklyReport />
        </ProtectedRoute>
      } />

      {/* Child Routes */}
      <Route path="/child/:childId" element={
        <ProtectedRoute requiredType="child">
          <ChildDashboard />
        </ProtectedRoute>
      } />
      <Route path="/child/:childId/tutor" element={
        <ProtectedRoute requiredType="child">
          <TutorChat />
        </ProtectedRoute>
      } />
      <Route path="/child/:childId/practice" element={
        <ProtectedRoute requiredType="child">
          <Practice />
        </ProtectedRoute>
      } />
      <Route path="/child/:childId/practice/:subject" element={
        <ProtectedRoute requiredType="child">
          <Practice />
        </ProtectedRoute>
      } />
      <Route path="/child/:childId/map" element={
        <ProtectedRoute requiredType="child">
          <AdventureMap />
        </ProtectedRoute>
      } />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
    </Suspense>
  );
}

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <AppRouter />
        <Toaster position="top-center" richColors />
      </BrowserRouter>
    </div>
  );
}

export default App;
