import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API } from "../App";

const AuthCallback = () => {
  const navigate = useNavigate();
  const hasProcessed = useRef(false);

  useEffect(() => {
    // Use ref to prevent double processing in StrictMode
    if (hasProcessed.current) return;
    hasProcessed.current = true;

    const processAuth = async () => {
      try {
        // Extract session_id from URL fragment
        const hash = window.location.hash;
        const sessionIdMatch = hash.match(/session_id=([^&]+)/);
        
        if (!sessionIdMatch) {
          console.error("No session_id found in URL");
          navigate("/");
          return;
        }

        const sessionId = sessionIdMatch[1];

        // Exchange session_id for user data
        const response = await axios.get(`${API}/auth/session`, {
          params: { session_id: sessionId },
          withCredentials: true
        });

        const user = response.data;

        // Clear the hash from URL
        window.history.replaceState(null, "", window.location.pathname);

        // Navigate to parent dashboard with user data
        navigate("/parent", { state: { user }, replace: true });
      } catch (error) {
        console.error("Auth error:", error);
        navigate("/");
      }
    };

    processAuth();
  }, [navigate]);

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
