import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API, AuthContext } from "../App";
import { toast } from "sonner";
import { 
  Plus, LogOut, User, BookOpen, BarChart3, 
  ChevronRight, Calendar, Trophy, TrendingUp 
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";

const ParentDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [children, setChildren] = useState([]);
  const [selectedChild, setSelectedChild] = useState(null);
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchChildren();
  }, []);

  useEffect(() => {
    if (selectedChild) {
      fetchProgress(selectedChild.child_id);
    }
  }, [selectedChild]);

  const fetchChildren = async () => {
    try {
      const response = await axios.get(`${API}/children`, { withCredentials: true });
      setChildren(response.data);
      if (response.data.length > 0) {
        setSelectedChild(response.data[0]);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching children:", error);
      setLoading(false);
    }
  };

  const fetchProgress = async (childId) => {
    try {
      const response = await axios.get(`${API}/progress/${childId}`, { withCredentials: true });
      setProgress(response.data);
    } catch (error) {
      console.error("Error fetching progress:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post(`${API}/auth/logout`, {}, { withCredentials: true });
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
      navigate("/");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "green": return "bg-emerald-500";
      case "yellow": return "bg-amber-500";
      case "red": return "bg-red-500";
      default: return "bg-slate-300";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "green": return "Bien";
      case "yellow": return "Reforzar";
      case "red": return "Atención";
      default: return "Sin datos";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] parent-theme">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-semibold text-slate-900" style={{ fontFamily: 'Outfit, sans-serif' }}>
                TutorIA
              </span>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-slate-600" />
                </div>
                <span className="text-sm font-medium text-slate-700">{user?.name}</span>
              </div>
              <Button
                data-testid="logout-btn"
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-slate-600 hover:text-slate-900"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {/* Children Selector or Add Child */}
        {children.length === 0 ? (
          <div className="max-w-md mx-auto text-center py-16">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <User className="w-10 h-10 text-blue-600" />
            </div>
            <h2 className="text-2xl font-semibold text-slate-900 mb-2" style={{ fontFamily: 'Outfit, sans-serif' }}>
              ¡Bienvenido a TutorIA!
            </h2>
            <p className="text-slate-600 mb-6">
              Añade el perfil de tu hijo para empezar con las sesiones de práctica personalizadas.
            </p>
            <Button
              data-testid="add-child-btn"
              onClick={() => navigate("/parent/setup")}
              className="bg-slate-900 hover:bg-slate-800 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Añadir hijo
            </Button>
          </div>
        ) : (
          <>
            {/* Children Tabs */}
            <div className="flex items-center gap-4 mb-8">
              <div className="flex gap-2 flex-1">
                {children.map((child) => (
                  <button
                    key={child.child_id}
                    data-testid={`child-tab-${child.child_id}`}
                    onClick={() => setSelectedChild(child)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      selectedChild?.child_id === child.child_id
                        ? "bg-slate-900 text-white"
                        : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                    }`}
                  >
                    {child.name}
                  </button>
                ))}
              </div>
              <Button
                data-testid="add-another-child-btn"
                variant="outline"
                size="sm"
                onClick={() => navigate("/parent/setup")}
              >
                <Plus className="w-4 h-4 mr-1" />
                Añadir
              </Button>
            </div>

            {selectedChild && (
              <>
                {/* Child Info Card */}
                <Card className="mb-6">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center text-white text-2xl font-bold">
                          {selectedChild.name.charAt(0)}
                        </div>
                        <div>
                          <h2 className="text-xl font-semibold text-slate-900" style={{ fontFamily: 'Outfit, sans-serif' }}>
                            {selectedChild.name}
                          </h2>
                          <p className="text-slate-600">
                            {selectedChild.age} años • {selectedChild.grade}º de Primaria
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          data-testid="view-report-btn"
                          variant="outline"
                          onClick={() => navigate(`/parent/report/${selectedChild.child_id}`)}
                        >
                          <BarChart3 className="w-4 h-4 mr-2" />
                          Ver reporte
                        </Button>
                        <Button
                          data-testid="start-session-btn"
                          onClick={() => navigate(`/child/${selectedChild.child_id}`)}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          Iniciar sesión
                          <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Progress Grid */}
                {progress && (
                  <div className="grid lg:grid-cols-3 gap-6">
                    {/* Weekly Stats */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Calendar className="w-5 h-5 text-blue-600" />
                          Esta semana
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="text-center p-4 bg-slate-50 rounded-lg">
                            <p className="text-3xl font-bold text-slate-900">
                              {progress.weekly_stats.total_exercises}
                            </p>
                            <p className="text-sm text-slate-600">Ejercicios</p>
                          </div>
                          <div className="text-center p-4 bg-slate-50 rounded-lg">
                            <p className="text-3xl font-bold text-emerald-600">
                              {progress.weekly_stats.total_exercises > 0
                                ? Math.round((progress.weekly_stats.correct_exercises / progress.weekly_stats.total_exercises) * 100)
                                : 0}%
                            </p>
                            <p className="text-sm text-slate-600">Aciertos</p>
                          </div>
                          <div className="text-center p-4 bg-slate-50 rounded-lg col-span-2">
                            <div className="flex items-center justify-center gap-2">
                              <Trophy className="w-5 h-5 text-amber-500" />
                              <p className="text-2xl font-bold text-slate-900">
                                {progress.weekly_stats.streak} días
                              </p>
                            </div>
                            <p className="text-sm text-slate-600">Racha activa</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Subject Status */}
                    <Card className="lg:col-span-2">
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <TrendingUp className="w-5 h-5 text-blue-600" />
                          Progreso por materia
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid sm:grid-cols-2 gap-4">
                          {Object.entries(progress.subjects).map(([key, subject]) => (
                            <div 
                              key={key}
                              className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg"
                            >
                              <div className={`w-3 h-3 rounded-full ${getStatusColor(subject.status)}`}></div>
                              <div className="flex-1">
                                <div className="flex items-center justify-between mb-1">
                                  <span className="font-medium text-slate-900">{subject.name}</span>
                                  <span className="text-sm text-slate-600">{subject.accuracy}%</span>
                                </div>
                                <div className="w-full bg-slate-200 rounded-full h-2">
                                  <div 
                                    className={`h-2 rounded-full ${getStatusColor(subject.status)}`}
                                    style={{ width: `${subject.accuracy}%` }}
                                  ></div>
                                </div>
                                <p className="text-xs text-slate-500 mt-1">
                                  {subject.total_attempts} ejercicios • {getStatusText(subject.status)}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Skills to Practice */}
                    <Card className="lg:col-span-3">
                      <CardHeader>
                        <CardTitle className="text-lg">Habilidades a reforzar</CardTitle>
                      </CardHeader>
                      <CardContent>
                        {Object.values(progress.subjects).some(s => s.skills_to_practice?.length > 0) ? (
                          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {Object.entries(progress.subjects).map(([key, subject]) =>
                              subject.skills_to_practice?.slice(0, 2).map((skill) => (
                                <div
                                  key={skill.skill_id}
                                  className="p-4 border border-slate-200 rounded-lg"
                                >
                                  <div className="flex items-start justify-between">
                                    <div>
                                      <span className="text-xs font-medium text-slate-500 uppercase">
                                        {subject.name}
                                      </span>
                                      <p className="font-medium text-slate-900 mt-1">{skill.name}</p>
                                      <p className="text-sm text-slate-600">{skill.description}</p>
                                    </div>
                                    <span className={`px-2 py-1 text-xs font-medium rounded ${
                                      skill.accuracy < 50 ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"
                                    }`}>
                                      {skill.accuracy}%
                                    </span>
                                  </div>
                                </div>
                              ))
                            )}
                          </div>
                        ) : (
                          <p className="text-slate-600 text-center py-4">
                            ¡Genial! No hay habilidades que necesiten refuerzo urgente.
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default ParentDashboard;
