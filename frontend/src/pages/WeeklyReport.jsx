import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { API, AuthContext } from "../App";
import { 
  ArrowLeft, Calendar, TrendingUp, AlertTriangle, 
  CheckCircle, Clock, Smile, Meh, Frown 
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from "recharts";

const WeeklyReport = () => {
  const { childId } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReport();
  }, [childId]);

  const fetchReport = async () => {
    try {
      const response = await axios.get(`${API}/report/${childId}/weekly`, { withCredentials: true });
      setReport(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching report:", error);
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "green": return "#10B981";
      case "yellow": return "#F59E0B";
      case "red": return "#EF4444";
      default: return "#94A3B8";
    }
  };

  const getMoodIcon = (mood) => {
    switch (mood) {
      case "happy": return <Smile className="w-5 h-5 text-emerald-500" />;
      case "neutral": return <Meh className="w-5 h-5 text-amber-500" />;
      case "tired": return <Frown className="w-5 h-5 text-slate-400" />;
      default: return <Meh className="w-5 h-5 text-slate-400" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <p>Error al cargar el reporte</p>
      </div>
    );
  }

  const subjectChartData = Object.entries(report.subjects).map(([key, value]) => ({
    name: value.name || key,
    ejercicios: value.total,
    aciertos: value.correct,
    accuracy: value.accuracy
  }));

  const pieData = [
    { name: "Correctos", value: report.summary.correct_exercises, color: "#10B981" },
    { name: "Incorrectos", value: report.summary.total_exercises - report.summary.correct_exercises, color: "#EF4444" }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] parent-theme">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Button
              data-testid="back-btn"
              variant="ghost"
              onClick={() => navigate("/parent")}
              className="text-slate-600"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Volver
            </Button>
            <h1 className="text-xl font-semibold text-slate-900" style={{ fontFamily: 'Outfit, sans-serif' }}>
              Reporte Semanal
            </h1>
            <div className="w-20"></div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8 max-w-5xl">
        {/* Child Info */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center text-white text-2xl font-bold">
                {report.child.name.charAt(0)}
              </div>
              <div>
                <h2 className="text-xl font-semibold text-slate-900" style={{ fontFamily: 'Outfit, sans-serif' }}>
                  {report.child.name}
                </h2>
                <p className="text-slate-600">
                  {report.child.age} años • {report.child.grade}º de Primaria
                </p>
                <div className="flex items-center gap-2 mt-1 text-sm text-slate-500">
                  <Calendar className="w-4 h-4" />
                  <span>Semana del {new Date(report.period.start).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })} al {new Date(report.period.end).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Summary Stats */}
        <div className="grid sm:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-3xl font-bold text-slate-900">{report.summary.total_exercises}</p>
              <p className="text-sm text-slate-600">Ejercicios</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-3xl font-bold text-emerald-600">{report.summary.accuracy}%</p>
              <p className="text-sm text-slate-600">Aciertos</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-3xl font-bold text-blue-600">{report.summary.practice_days}</p>
              <p className="text-sm text-slate-600">Días activo</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="flex justify-center mb-1">
                {report.mood_summary === "positivo" ? (
                  <Smile className="w-8 h-8 text-emerald-500" />
                ) : report.mood_summary === "neutral" ? (
                  <Meh className="w-8 h-8 text-amber-500" />
                ) : (
                  <Frown className="w-8 h-8 text-slate-400" />
                )}
              </div>
              <p className="text-sm text-slate-600 capitalize">{report.mood_summary}</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row */}
        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          {/* Bar Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                Rendimiento por materia
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={subjectChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#fff', 
                        border: '1px solid #E2E8F0',
                        borderRadius: '8px'
                      }}
                    />
                    <Bar dataKey="ejercicios" fill="#94A3B8" name="Ejercicios" />
                    <Bar dataKey="aciertos" fill="#3B82F6" name="Aciertos" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Pie Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
                Distribución de resultados
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center">
                {report.summary.total_exercises > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-slate-500">Sin datos esta semana</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Subject Status */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Estado por materia</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {Object.entries(report.subjects).map(([key, subject]) => (
                <div 
                  key={key}
                  className="p-4 rounded-lg border"
                  style={{ borderColor: getStatusColor(subject.status), borderWidth: '2px' }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: getStatusColor(subject.status) }}
                    ></div>
                    <span className="font-medium text-slate-900">{subject.name || key}</span>
                  </div>
                  <div className="space-y-1 text-sm text-slate-600">
                    <p>Ejercicios: {subject.total}</p>
                    <p>Aciertos: {subject.accuracy}%</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Skills to Improve */}
        {report.skills_to_improve?.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
                Habilidades a reforzar
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {report.skills_to_improve.map((skill, index) => (
                  <div 
                    key={skill.skill_id}
                    className="flex items-center justify-between p-3 bg-amber-50 border border-amber-200 rounded-lg"
                  >
                    <div>
                      <span className="text-xs font-medium text-slate-500 uppercase">
                        {skill.subject}
                      </span>
                      <p className="font-medium text-slate-900">{skill.name}</p>
                    </div>
                    <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm font-medium">
                      {skill.accuracy}%
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recommendation */}
        <Card className="mb-6 border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-lg text-blue-900">Recomendación de la semana</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-blue-800">{report.recommendation}</p>
          </CardContent>
        </Card>

        {/* Check-ins */}
        {report.checkins?.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="w-5 h-5 text-slate-600" />
                Registro de ánimo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 overflow-x-auto pb-2">
                {report.checkins.map((checkin, index) => (
                  <div 
                    key={checkin.checkin_id || index}
                    className="flex-shrink-0 text-center p-3 bg-slate-50 rounded-lg"
                  >
                    {getMoodIcon(checkin.mood)}
                    <p className="text-xs text-slate-500 mt-1">
                      {new Date(checkin.created_at).toLocaleDateString('es-ES', { weekday: 'short' })}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default WeeklyReport;
