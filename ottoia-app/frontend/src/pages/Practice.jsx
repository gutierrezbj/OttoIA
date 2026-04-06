import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { API, AuthContext } from "../App";
import { toast } from "sonner";
import {
  ArrowLeft, CheckCircle, XCircle, Lightbulb,
  ArrowRight, Trophy, RefreshCw
} from "lucide-react";
import { Button } from "../components/ui/button";

const Practice = () => {
  const { childId, subject: subjectParam } = useParams();
  const navigate = useNavigate();
  const [child, setChild] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(subjectParam || null);
  const [exercise, setExercise] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [result, setResult] = useState(null);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [loading, setLoading] = useState(false);
  const [streak, setStreak] = useState(0);
  const [totalCorrect, setTotalCorrect] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);

  const subjects = [
    { key: "matematicas", name: "Matemáticas", icon: "➕", color: "#4CC9F0" },
    { key: "lengua", name: "Lengua", icon: "📖", color: "#FFD60A" },
    { key: "ciencias", name: "Ciencias", icon: "🔬", color: "#10B981" },
    { key: "ingles", name: "Inglés", icon: "🌍", color: "#F72585" }
  ];

  useEffect(() => {
    fetchChild();
  }, [childId]);

  useEffect(() => {
    if (selectedSubject && child) {
      generateExercise();
    }
  }, [selectedSubject, child]);

  const fetchChild = async () => {
    try {
      const response = await axios.get(`${API}/children/${childId}`, { withCredentials: true });
      setChild(response.data);
    } catch (error) {
      console.error("Error fetching child:", error);
      navigate(`/child/${childId}`);
    }
  };

  const generateExercise = async () => {
    setLoading(true);
    setSelectedAnswer(null);
    setResult(null);
    setHintsUsed(0);
    setShowHint(false);

    try {
      const response = await axios.post(
        `${API}/exercises/generate?child_id=${childId}&subject=${selectedSubject}`,
        {},
        { withCredentials: true }
      );
      setExercise(response.data);
    } catch (error) {
      console.error("Error generating exercise:", error);
      toast.error("Error al generar el ejercicio");
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = async (answer) => {
    if (result || !exercise) return;

    setSelectedAnswer(answer);
    setTotalAttempts(prev => prev + 1);

    try {
      const response = await axios.post(`${API}/attempts`, {
        exercise_id: exercise.exercise_id,
        answer_given: answer,
        hints_used: hintsUsed
      }, { withCredentials: true });

      setResult(response.data);

      if (response.data.is_correct) {
        setStreak(prev => prev + 1);
        setTotalCorrect(prev => prev + 1);
      } else {
        setStreak(0);
      }
    } catch (error) {
      console.error("Error recording attempt:", error);
    }
  };

  const handleHint = () => {
    if (hintsUsed < (exercise?.hints?.length || 0)) {
      setHintsUsed(prev => prev + 1);
      setShowHint(true);
    }
  };

  const currentSubject = subjects.find(s => s.key === selectedSubject);

  if (!selectedSubject) {
    return (
      <div className="min-h-screen bg-[#FFFDF5] child-theme">
        <div className="floating-shape shape-1"></div>
        <div className="floating-shape shape-2"></div>

        <header className="relative z-10 p-4 md:p-6">
          <Button
            data-testid="back-btn"
            variant="ghost"
            onClick={() => navigate(`/child/${childId}`)}
            className="text-[#2B2D42]"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Volver
          </Button>
        </header>

        <main className="container mx-auto px-4 md:px-6 pb-8 max-w-2xl relative z-10">
          <div className="text-center mb-8">
            <h1
              className="text-3xl font-bold text-[#2B2D42] mb-2"
              style={{ fontFamily: 'Fredoka, sans-serif' }}
            >
              ¿Qué quieres practicar?
            </h1>
            <p className="text-[#8D99AE]">
              Elige una asignatura para empezar
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {subjects.map((subject) => (
              <button
                key={subject.key}
                data-testid={`select-${subject.key}`}
                onClick={() => setSelectedSubject(subject.key)}
                className="card-clay text-left hover:scale-[1.02] transition-transform"
              >
                <div className="flex items-center gap-4">
                  <div
                    className="w-16 h-16 rounded-2xl border-4 border-black flex items-center justify-center text-3xl"
                    style={{ backgroundColor: subject.color }}
                  >
                    {subject.icon}
                  </div>
                  <div>
                    <h2
                      className="text-xl font-bold text-[#2B2D42]"
                      style={{ fontFamily: 'Fredoka, sans-serif' }}
                    >
                      {subject.name}
                    </h2>
                    <p className="text-[#8D99AE]">Ejercicios adaptados</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFDF5] child-theme">
      <div className="floating-shape shape-1"></div>
      <div className="floating-shape shape-2"></div>

      <header className="relative z-10 p-4 md:p-6 bg-white border-b-4 border-black">
        <div className="flex items-center justify-between max-w-3xl mx-auto">
          <Button
            data-testid="back-btn"
            variant="ghost"
            onClick={() => setSelectedSubject(null)}
            className="text-[#2B2D42]"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Cambiar
          </Button>

          <div className="flex items-center gap-2">
            <div
              className="w-10 h-10 rounded-full border-3 border-black flex items-center justify-center text-xl"
              style={{ backgroundColor: currentSubject?.color }}
            >
              {currentSubject?.icon}
            </div>
            <span className="font-bold text-[#2B2D42]" style={{ fontFamily: 'Fredoka, sans-serif' }}>
              {currentSubject?.name}
            </span>
          </div>

          {streak > 0 && (
            <div className="streak-badge">
              <span>🔥</span>
              <span>{streak}</span>
            </div>
          )}
        </div>
      </header>

      <main className="container mx-auto px-4 md:px-6 py-8 max-w-2xl relative z-10">
        {loading ? (
          <div className="card-clay text-center py-12">
            <div className="w-16 h-16 border-4 border-[#4CC9F0] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-[#8D99AE]">Preparando ejercicio...</p>
          </div>
        ) : exercise ? (
          <div className="space-y-6">
            <div className="card-clay">
              <h2
                className="text-xl md:text-2xl font-bold text-[#2B2D42] mb-2"
                style={{ fontFamily: 'Fredoka, sans-serif' }}
              >
                {exercise.question}
              </h2>

              {showHint && exercise.hints && exercise.hints[hintsUsed - 1] && (
                <div className="mt-4 p-4 bg-[#FEF3C7] border-3 border-[#F59E0B] rounded-xl animate-fade-in">
                  <div className="flex items-start gap-2">
                    <Lightbulb className="w-5 h-5 text-[#F59E0B] flex-shrink-0 mt-0.5" />
                    <p className="text-[#92400E]">{exercise.hints[hintsUsed - 1]}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              {exercise.options?.map((option, index) => {
                let bgColor = "bg-white";
                let borderColor = "border-black";

                if (result) {
                  if (option === exercise.correct_answer) {
                    bgColor = "bg-[#10B981]";
                    borderColor = "border-black";
                  } else if (selectedAnswer === option && !result.is_correct) {
                    bgColor = "bg-[#EF4444]";
                    borderColor = "border-black";
                  }
                } else if (selectedAnswer === option) {
                  bgColor = "bg-[#4CC9F0]";
                }

                return (
                  <button
                    key={index}
                    data-testid={`option-${index}`}
                    onClick={() => handleAnswer(option)}
                    disabled={!!result}
                    className={`${bgColor} border-4 ${borderColor} rounded-2xl p-4 md:p-6 text-lg md:text-xl font-bold text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-none transition-all disabled:cursor-not-allowed`}
                  >
                    {option}
                  </button>
                );
              })}
            </div>

            {!result ? (
              <div className="flex justify-center">
                <Button
                  data-testid="hint-btn"
                  onClick={handleHint}
                  disabled={hintsUsed >= (exercise.hints?.length || 0)}
                  className="btn-clay-secondary"
                >
                  <Lightbulb className="w-5 h-5 mr-2" />
                  Pista ({hintsUsed}/{exercise.hints?.length || 0})
                </Button>
              </div>
            ) : (
              <div className="space-y-4 animate-bounce-in">
                <div className={`card-clay text-center ${result.is_correct ? "bg-[#D1FAE5]" : "bg-[#FEE2E2]"}`}>
                  <div className="flex items-center justify-center gap-3 mb-2">
                    {result.is_correct ? (
                      <CheckCircle className="w-10 h-10 text-[#10B981]" />
                    ) : (
                      <XCircle className="w-10 h-10 text-[#EF4444]" />
                    )}
                    <h3
                      className="text-2xl font-bold"
                      style={{ fontFamily: 'Fredoka, sans-serif', color: result.is_correct ? "#10B981" : "#EF4444" }}
                    >
                      {result.message}
                    </h3>
                  </div>
                  {!result.is_correct && result.correct_answer && (
                    <p className="text-[#2B2D42]">
                      La respuesta correcta era: <strong>{result.correct_answer}</strong>
                    </p>
                  )}
                </div>

                <div className="flex justify-center gap-4">
                  <Button
                    data-testid="next-exercise-btn"
                    onClick={generateExercise}
                    className="btn-clay text-xl"
                  >
                    Siguiente ejercicio
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </div>
              </div>
            )}

            <div className="flex justify-center gap-6 text-center">
              <div>
                <p className="text-2xl font-bold text-[#2B2D42]">{totalAttempts}</p>
                <p className="text-sm text-[#8D99AE]">Intentos</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-[#10B981]">{totalCorrect}</p>
                <p className="text-sm text-[#8D99AE]">Correctos</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-[#4CC9F0]">
                  {totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0}%
                </p>
                <p className="text-sm text-[#8D99AE]">Aciertos</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="card-clay text-center py-12">
            <p className="text-[#8D99AE] mb-4">Error al cargar el ejercicio</p>
            <Button onClick={generateExercise} className="btn-clay">
              <RefreshCw className="w-5 h-5 mr-2" />
              Reintentar
            </Button>
          </div>
        )}
      </main>
    </div>
  );
};

export default Practice;
