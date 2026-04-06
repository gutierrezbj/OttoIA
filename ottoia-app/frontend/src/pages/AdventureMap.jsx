import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { API, AuthContext } from "../App";
import { ArrowLeft, Star, Lock, CheckCircle, Trophy, Sparkles } from "lucide-react";
import { Button } from "../components/ui/button";

const AdventureMap = () => {
  const { childId } = useParams();
  const navigate = useNavigate();
  const [child, setChild] = useState(null);
  const [progress, setProgress] = useState(null);
  const [selectedWorld, setSelectedWorld] = useState(null);
  const [loading, setLoading] = useState(true);

  const worlds = [
    {
      key: "matematicas",
      name: "Reino de los Números",
      icon: "🏰",
      color: "#4CC9F0",
      bgGradient: "from-cyan-400 to-blue-500",
      description: "Sumas, restas, multiplicaciones y más"
    },
    {
      key: "lengua",
      name: "Bosque de las Palabras",
      icon: "🌲",
      color: "#FFD60A",
      bgGradient: "from-yellow-400 to-orange-500",
      description: "Ortografía, gramática y lectura"
    },
    {
      key: "ciencias",
      name: "Laboratorio Mágico",
      icon: "🔬",
      color: "#10B981",
      bgGradient: "from-emerald-400 to-teal-500",
      description: "Naturaleza, cuerpo humano y más"
    },
    {
      key: "ingles",
      name: "Isla del Inglés",
      icon: "🏝️",
      color: "#F72585",
      bgGradient: "from-pink-400 to-purple-500",
      description: "Vocabulario y frases en inglés"
    }
  ];

  useEffect(() => {
    fetchData();
  }, [childId]);

  const fetchData = async () => {
    try {
      const [childRes, progressRes] = await Promise.all([
        axios.get(`${API}/children/${childId}`, { withCredentials: true }),
        axios.get(`${API}/progress/${childId}`, { withCredentials: true })
      ]);
      setChild(childRes.data);
      setProgress(progressRes.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  const getSkillStatus = (skill) => {
    if (!skill.attempts || skill.attempts === 0) return "locked";
    if (skill.accuracy >= 80) return "mastered";
    if (skill.accuracy >= 50) return "in-progress";
    return "needs-work";
  };

  const getWorldProgress = (worldKey) => {
    if (!progress?.subjects[worldKey]) return { completed: 0, total: 0, percentage: 0 };
    const subject = progress.subjects[worldKey];
    const skills = subject.skills || [];
    const masteredSkills = skills.filter(s => s.accuracy >= 70).length;
    return {
      completed: masteredSkills,
      total: skills.length,
      percentage: skills.length > 0 ? Math.round((masteredSkills / skills.length) * 100) : 0
    };
  };

  const getTotalStars = () => {
    if (!progress) return 0;
    let stars = 0;
    Object.values(progress.subjects).forEach(subject => {
      (subject.skills || []).forEach(skill => {
        if (skill.accuracy >= 80) stars += 3;
        else if (skill.accuracy >= 60) stars += 2;
        else if (skill.accuracy >= 40) stars += 1;
      });
    });
    return stars;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-indigo-900 via-purple-900 to-indigo-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg font-medium text-white">Cargando tu aventura...</p>
        </div>
      </div>
    );
  }

  // World Detail View
  if (selectedWorld) {
    const world = worlds.find(w => w.key === selectedWorld);
    const subjectData = progress?.subjects[selectedWorld];
    const skills = subjectData?.skills || [];

    return (
      <div className={`min-h-screen bg-gradient-to-b ${world.bgGradient}`}>
        {/* Header */}
        <header className="p-4 md:p-6">
          <div className="flex items-center justify-between max-w-4xl mx-auto">
            <Button
              data-testid="back-to-map-btn"
              variant="ghost"
              onClick={() => setSelectedWorld(null)}
              className="text-white hover:bg-white/20"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Volver al mapa
            </Button>
            <div className="flex items-center gap-2 bg-white/20 rounded-full px-4 py-2">
              <Star className="w-5 h-5 text-yellow-300 fill-yellow-300" />
              <span className="font-bold text-white">{getTotalStars()}</span>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 pb-8 max-w-4xl">
          {/* World Header */}
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">{world.icon}</div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2" style={{ fontFamily: 'Fredoka, sans-serif' }}>
              {world.name}
            </h1>
            <p className="text-white/80">{world.description}</p>
          </div>

          {/* Skills Path */}
          <div className="relative">
            {/* Path Line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-2 bg-white/30 -translate-x-1/2 rounded-full"></div>

            {/* Skills */}
            <div className="space-y-8 relative">
              {skills.map((skill, index) => {
                const status = getSkillStatus(skill);
                const isLeft = index % 2 === 0;

                return (
                  <div
                    key={skill.skill_id}
                    className={`flex items-center gap-4 ${isLeft ? 'flex-row' : 'flex-row-reverse'}`}
                  >
                    {/* Skill Card */}
                    <div
                      className={`flex-1 ${isLeft ? 'text-right' : 'text-left'}`}
                      style={{ maxWidth: '45%' }}
                    >
                      <button
                        data-testid={`skill-${skill.skill_id}`}
                        onClick={() => {
                          if (status !== "locked") {
                            navigate(`/child/${childId}/practice/${selectedWorld}`);
                          }
                        }}
                        disabled={status === "locked"}
                        className={`
                          inline-block p-4 rounded-2xl border-4 border-white/50
                          transition-all hover:scale-105
                          ${status === "locked" ? "bg-white/20 cursor-not-allowed" : "bg-white/90 cursor-pointer shadow-lg"}
                        `}
                      >
                        <div className={`flex items-center gap-3 ${isLeft ? 'flex-row-reverse' : 'flex-row'}`}>
                          {status === "locked" && <Lock className="w-5 h-5 text-gray-400" />}
                          {status === "mastered" && <CheckCircle className="w-5 h-5 text-emerald-500" />}
                          {status === "in-progress" && <Sparkles className="w-5 h-5 text-amber-500" />}
                          {status === "needs-work" && <Star className="w-5 h-5 text-orange-500" />}

                          <div>
                            <h3 className={`font-bold ${status === "locked" ? "text-gray-400" : "text-gray-800"}`}>
                              {skill.name}
                            </h3>
                            {status !== "locked" && (
                              <div className="flex items-center gap-1 mt-1">
                                {[1, 2, 3].map((star) => (
                                  <Star
                                    key={star}
                                    className={`w-4 h-4 ${
                                      skill.accuracy >= star * 27
                                        ? "text-yellow-400 fill-yellow-400"
                                        : "text-gray-300"
                                    }`}
                                  />
                                ))}
                                <span className="text-xs text-gray-500 ml-1">{skill.accuracy}%</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </button>
                    </div>

                    {/* Center Node */}
                    <div className="relative z-10">
                      <div
                        className={`
                          w-12 h-12 rounded-full border-4 border-white flex items-center justify-center text-xl
                          ${status === "mastered" ? "bg-emerald-500" : status === "locked" ? "bg-gray-400" : "bg-amber-500"}
                        `}
                      >
                        {status === "mastered" ? "⭐" : status === "locked" ? "🔒" : "📚"}
                      </div>
                    </div>

                    {/* Spacer */}
                    <div className="flex-1" style={{ maxWidth: '45%' }}></div>
                  </div>
                );
              })}

              {/* Final Trophy */}
              <div className="flex justify-center pt-4">
                <div className={`
                  w-20 h-20 rounded-full border-4 border-yellow-400 flex items-center justify-center text-4xl
                  ${getWorldProgress(selectedWorld).percentage === 100 ? "bg-yellow-400" : "bg-white/30"}
                `}>
                  🏆
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Main Map View
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-900 via-purple-900 to-indigo-900 overflow-hidden">
      {/* Stars Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              opacity: Math.random() * 0.7 + 0.3
            }}
          />
        ))}
      </div>

      {/* Header */}
      <header className="relative z-10 p-4 md:p-6">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <Button
            data-testid="back-to-dashboard-btn"
            variant="ghost"
            onClick={() => navigate(`/child/${childId}`)}
            className="text-white hover:bg-white/20"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Volver
          </Button>
          <div className="flex items-center gap-2 bg-yellow-400/20 border-2 border-yellow-400 rounded-full px-4 py-2">
            <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
            <span className="font-bold text-yellow-400">{getTotalStars()} estrellas</span>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 pb-8 max-w-4xl relative z-10">
        {/* Title */}
        <div className="text-center mb-8">
          <h1
            className="text-3xl md:text-4xl font-bold text-white mb-2"
            style={{ fontFamily: 'Fredoka, sans-serif' }}
          >
            🗺️ Mapa de Aventuras
          </h1>
          <p className="text-purple-200">
            ¡Hola {child?.name}! Explora los mundos y gana estrellas
          </p>
        </div>

        {/* Worlds Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {worlds.map((world, index) => {
            const worldProgress = getWorldProgress(world.key);

            return (
              <button
                key={world.key}
                data-testid={`world-${world.key}`}
                onClick={() => setSelectedWorld(world.key)}
                className="group relative bg-white/10 backdrop-blur-sm border-4 border-white/30 rounded-3xl p-6 text-left hover:scale-105 hover:bg-white/20 transition-all duration-300 overflow-hidden"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Glow Effect */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity rounded-3xl"
                  style={{ backgroundColor: world.color }}
                />

                <div className="relative z-10">
                  {/* World Icon */}
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className="w-16 h-16 rounded-2xl flex items-center justify-center text-4xl border-4 border-white/50"
                      style={{ backgroundColor: world.color }}
                    >
                      {world.icon}
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1">
                        {[1, 2, 3].map((star) => (
                          <Star
                            key={star}
                            className={`w-5 h-5 ${
                              worldProgress.percentage >= star * 33
                                ? "text-yellow-400 fill-yellow-400"
                                : "text-white/30"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* World Name */}
                  <h2
                    className="text-xl font-bold text-white mb-1"
                    style={{ fontFamily: 'Fredoka, sans-serif' }}
                  >
                    {world.name}
                  </h2>
                  <p className="text-sm text-purple-200 mb-4">{world.description}</p>

                  {/* Progress Bar */}
                  <div className="bg-white/20 rounded-full h-3 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${worldProgress.percentage}%`,
                        backgroundColor: world.color
                      }}
                    />
                  </div>
                  <p className="text-xs text-purple-200 mt-2">
                    {worldProgress.completed} de {worldProgress.total} habilidades completadas
                  </p>
                </div>

                {/* Trophy Badge if completed */}
                {worldProgress.percentage === 100 && (
                  <div className="absolute -top-2 -right-2 w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center text-2xl border-4 border-white shadow-lg">
                    🏆
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-8 bg-white/10 backdrop-blur-sm rounded-2xl p-4">
          <h3 className="text-white font-bold mb-3" style={{ fontFamily: 'Fredoka, sans-serif' }}>
            ¿Cómo funciona?
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="flex items-center gap-2 text-purple-200">
              <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center">🔒</div>
              <span>Por descubrir</span>
            </div>
            <div className="flex items-center gap-2 text-purple-200">
              <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">📚</div>
              <span>Practicando</span>
            </div>
            <div className="flex items-center gap-2 text-purple-200">
              <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center">⭐</div>
              <span>Casi listo</span>
            </div>
            <div className="flex items-center gap-2 text-purple-200">
              <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">✅</div>
              <span>¡Dominado!</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdventureMap;
