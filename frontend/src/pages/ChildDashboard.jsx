import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { API, AuthContext } from "../App";
import { toast } from "sonner";
import { 
  ArrowLeft, MessageCircle, BookOpen, Target, 
  Trophy, Smile, Meh, Frown, Zap, Home, Map
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Progress } from "../components/ui/progress";

const ChildDashboard = () => {
  const { childId } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [child, setChild] = useState(null);
  const [progress, setProgress] = useState(null);
  const [todayCheckin, setTodayCheckin] = useState(null);
  const [showCheckin, setShowCheckin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [childId]);

  const fetchData = async () => {
    try {
      const [childRes, progressRes, checkinRes] = await Promise.all([
        axios.get(`${API}/children/${childId}`, { withCredentials: true }),
        axios.get(`${API}/progress/${childId}`, { withCredentials: true }),
        axios.get(`${API}/checkin/${childId}/today`, { withCredentials: true })
      ]);
      
      setChild(childRes.data);
      setProgress(progressRes.data);
      setTodayCheckin(checkinRes.data);
      
      // Show check-in if not done today
      if (!checkinRes.data) {
        setShowCheckin(true);
      }
      
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Error al cargar los datos");
      setLoading(false);
    }
  };

  const handleCheckin = async (mood, energy) => {
    try {
      await axios.post(`${API}/checkin/${childId}`, {
        mood,
        energy
      }, { withCredentials: true });
      
      setTodayCheckin({ mood, energy });
      setShowCheckin(false);
      toast.success("¡Genial! Ya podemos empezar 🎉");
    } catch (error) {
      console.error("Error saving checkin:", error);
    }
  };

  const subjects = [
    { key: "matematicas", name: "Matemáticas", icon: "➕", color: "#4CC9F0" },
    { key: "lengua", name: "Lengua", icon: "📖", color: "#FFD60A" },
    { key: "ciencias", name: "Ciencias", icon: "🔬", color: "#10B981" },
    { key: "ingles", name: "Inglés", icon: "🌍", color: "#F72585" }
  ];

  const moodOptions = [
    { mood: "happy", icon: Smile, label: "¡Genial!", color: "#10B981" },
    { mood: "neutral", icon: Meh, label: "Normal", color: "#F59E0B" },
    { mood: "tired", icon: Frown, label: "Cansado", color: "#8D99AE" }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFFDF5]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#4CC9F0] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg font-medium text-[#2B2D42]">Cargando...</p>
        </div>
      </div>
    );
  }

  // Check-in Modal
  if (showCheckin) {
    return (
      <div className="min-h-screen bg-[#FFFDF5] child-theme flex items-center justify-center p-6">
        <div className="floating-shape shape-1"></div>
        <div className="floating-shape shape-2"></div>
        
        <div className="card-clay max-w-md w-full animate-bounce-in relative z-10">
          <h1 
            className="text-2xl font-bold text-center text-[#2B2D42] mb-2"
            style={{ fontFamily: 'Fredoka, sans-serif' }}
          >
            ¡Hola, {child?.name}! 👋
          </h1>
          <p className="text-center text-[#8D99AE] mb-8">
            ¿Cómo te sientes hoy?
          </p>
          
          <div className="flex justify-center gap-4 mb-8">
            {moodOptions.map((option) => (
              <button
                key={option.mood}
                data-testid={`mood-${option.mood}`}
                onClick={() => handleCheckin(option.mood, option.mood === "happy" ? 5 : option.mood === "neutral" ? 3 : 2)}
                className="flex flex-col items-center gap-2 p-4 rounded-2xl border-4 border-black bg-white hover:scale-105 transition-transform"
                style={{ boxShadow: `4px 4px 0px 0px ${option.color}` }}
              >
                <option.icon className="w-12 h-12" style={{ color: option.color }} />
                <span className="font-bold text-[#2B2D42]">{option.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFDF5] child-theme">
      {/* Floating shapes */}
      <div className="floating-shape shape-1"></div>
      <div className="floating-shape shape-2"></div>
      <div className="floating-shape shape-3"></div>

      {/* Header */}
      <header className="relative z-10 p-4 md:p-6">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <Button
            data-testid="back-to-parent-btn"
            variant="ghost"
            onClick={() => navigate("/parent")}
            className="text-[#2B2D42]"
          >
            <Home className="w-5 h-5 mr-2" />
            Salir
          </Button>
          
          {progress?.weekly_stats.streak > 0 && (
            <div className="streak-badge">
              <span>🔥</span>
              <span>{progress.weekly_stats.streak} días</span>
            </div>
          )}
        </div>
      </header>

      <main className="container mx-auto px-4 md:px-6 pb-8 max-w-4xl relative z-10">
        {/* Welcome Section */}
        <div className="text-center mb-8">
          <h1 
            className="text-3xl md:text-4xl font-bold text-[#2B2D42] mb-2"
            style={{ fontFamily: 'Fredoka, sans-serif' }}
          >
            ¡Hola, {child?.name}! 🌟
          </h1>
          <p className="text-[#8D99AE] text-lg">
            ¿Qué quieres hacer hoy?
          </p>
        </div>

        {/* Main Actions Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Chat with Tutor */}
          <button
            data-testid="tutor-chat-btn"
            onClick={() => navigate(`/child/${childId}/tutor`)}
            className="card-clay text-left hover:scale-[1.02] transition-transform"
          >
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-[#4CC9F0] border-4 border-black rounded-2xl flex items-center justify-center">
                <MessageCircle className="w-8 h-8 text-black" />
              </div>
              <div>
                <h2 
                  className="text-xl font-bold text-[#2B2D42] mb-1"
                  style={{ fontFamily: 'Fredoka, sans-serif' }}
                >
                  Ayúdame con la tarea
                </h2>
                <p className="text-[#8D99AE]">
                  Pregúntame lo que necesites
                </p>
              </div>
            </div>
          </button>

          {/* Practice Mode */}
          <button
            data-testid="practice-btn"
            onClick={() => navigate(`/child/${childId}/practice`)}
            className="card-clay text-left hover:scale-[1.02] transition-transform"
          >
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-[#FFD60A] border-4 border-black rounded-2xl flex items-center justify-center">
                <Target className="w-8 h-8 text-black" />
              </div>
              <div>
                <h2 
                  className="text-xl font-bold text-[#2B2D42] mb-1"
                  style={{ fontFamily: 'Fredoka, sans-serif' }}
                >
                  Practicar
                </h2>
                <p className="text-[#8D99AE]">
                  Mini-retos para mejorar
                </p>
              </div>
            </div>
          </button>
        </div>

        {/* Subject Progress */}
        <div className="card-clay mb-8">
          <h2 
            className="text-xl font-bold text-[#2B2D42] mb-6"
            style={{ fontFamily: 'Fredoka, sans-serif' }}
          >
            Tu progreso 📈
          </h2>
          
          <div className="grid sm:grid-cols-2 gap-4">
            {subjects.map((subject) => {
              const subjectProgress = progress?.subjects[subject.key];
              const accuracy = subjectProgress?.accuracy || 0;
              
              return (
                <button
                  key={subject.key}
                  data-testid={`subject-${subject.key}`}
                  onClick={() => navigate(`/child/${childId}/practice/${subject.key}`)}
                  className="flex items-center gap-4 p-4 bg-white border-4 border-black rounded-2xl hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
                  style={{ boxShadow: `4px 4px 0px 0px ${subject.color}` }}
                >
                  <div 
                    className="w-14 h-14 rounded-xl border-3 border-black flex items-center justify-center text-2xl"
                    style={{ backgroundColor: subject.color }}
                  >
                    {subject.icon}
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className="font-bold text-[#2B2D42]">{subject.name}</h3>
                    <div className="progress-clay mt-2">
                      <div 
                        className="progress-clay-fill"
                        style={{ width: `${accuracy}%`, backgroundColor: subject.color }}
                      ></div>
                    </div>
                    <p className="text-sm text-[#8D99AE] mt-1">{accuracy}% completado</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Weekly Stats */}
        {progress && (
          <div className="grid grid-cols-3 gap-4">
            <div className="card-clay text-center">
              <div className="w-12 h-12 bg-[#4CC9F0] border-3 border-black rounded-full flex items-center justify-center mx-auto mb-2">
                <BookOpen className="w-6 h-6" />
              </div>
              <p className="text-2xl font-bold text-[#2B2D42]">{progress.weekly_stats.total_exercises}</p>
              <p className="text-sm text-[#8D99AE]">Ejercicios</p>
            </div>
            <div className="card-clay text-center">
              <div className="w-12 h-12 bg-[#10B981] border-3 border-black rounded-full flex items-center justify-center mx-auto mb-2">
                <Trophy className="w-6 h-6" />
              </div>
              <p className="text-2xl font-bold text-[#2B2D42]">{progress.weekly_stats.correct_exercises}</p>
              <p className="text-sm text-[#8D99AE]">Aciertos</p>
            </div>
            <div className="card-clay text-center">
              <div className="w-12 h-12 bg-[#FFD60A] border-3 border-black rounded-full flex items-center justify-center mx-auto mb-2">
                <Zap className="w-6 h-6" />
              </div>
              <p className="text-2xl font-bold text-[#2B2D42]">{progress.weekly_stats.practice_days}</p>
              <p className="text-sm text-[#8D99AE]">Días activo</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ChildDashboard;
