import React, { useState, useEffect, useRef } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { Toaster } from "./components/ui/sonner";
import { toast } from "sonner";

// Pages
import Landing from "./pages/Landing";
import AuthCallback from "./pages/AuthCallback";
import ParentDashboard from "./pages/ParentDashboard";
import ChildDashboard from "./pages/ChildDashboard";
import ChildSetup from "./pages/ChildSetup";
import TutorChat from "./pages/TutorChat";
import Practice from "./pages/Practice";
import WeeklyReport from "./pages/WeeklyReport";
import AdventureMap from "./pages/AdventureMap";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const API = `${BACKEND_URL}/api`;

// Auth context
export const AuthContext = React.createContext(null);

// Protected Route Component
const ProtectedRoute = ({ children, requiredType }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Skip if user was passed from AuthCallback
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
        navigate("/");
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

// App Router to handle session_id detection
function AppRouter() {
  const location = useLocation();

  // Check URL fragment for session_id SYNCHRONOUSLY during render
  // This prevents race conditions by processing new session_id FIRST
  if (location.hash?.includes('session_id=')) {
    return <AuthCallback />;
  }

  return (
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

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
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
