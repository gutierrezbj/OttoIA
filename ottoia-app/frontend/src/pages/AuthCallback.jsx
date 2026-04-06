import React, { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { API } from "../App";

const AuthCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const hasProcessed = useRef(false);

  useEffect(() => {
    if (hasProcessed.current) return;
    hasProcessed.current = true;

    const processAuth = async () => {
      try {
        // Case 1: Google OAuth — cookie set by server, just fetch /me
        const loginParam = searchParams.get('login');
        if (loginParam === 'success') {
          const response = await axios.get(`${API}/auth/me`, { withCredentials: true });
          navigate("/parent", { state: { user: response.data }, replace: true });
          return;
        }

        // Case 2: Auth error from server
        if (searchParams.get('auth_error')) {
          navigate("/");
          return;
        }

        // Case 3: Legacy Emergent — session_id in URL hash
        const hash = window.location.hash;
        const sessionIdMatch = hash.match(/session_id=([^&]+)/);

        if (sessionIdMatch) {
          const sessionId = sessionIdMatch[1];
          const response = await axios.get(`${API}/auth/session`, {
            params: { session_id: sessionId },
            withCredentials: true
          });
          window.history.replaceState(null, "", window.location.pathname);
          navigate("/parent", { state: { user: response.data }, replace: true });
          return;
        }

        navigate("/");
      } catch (error) {
        console.error("Auth error:", error);
        navigate("/");
      }
    };

    processAuth();
  }, [navigate, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFFDF5]">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-[#4CC9F0] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-lg font-medium text-[#2B2D42]" style={{ fontFamily: 'Fredoka, sans-serif' }}>
          Iniciando sesión...
        </p>
      </div>
    </div>
  );
};

export default AuthCallback;
