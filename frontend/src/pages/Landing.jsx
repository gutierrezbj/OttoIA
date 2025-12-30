import React from "react";
import { BookOpen, Star, Users, BarChart3, CheckCircle, ArrowRight } from "lucide-react";
import { Button } from "../components/ui/button";

const Landing = () => {
  const handleLogin = () => {
    // REMINDER: DO NOT HARDCODE THE URL, OR ADD ANY FALLBACKS OR REDIRECT URLS, THIS BREAKS THE AUTH
    const redirectUrl = window.location.origin + '/parent';
    window.location.href = `https://auth.emergentagent.com/?redirect=${encodeURIComponent(redirectUrl)}`;
  };

  const features = [
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: "Tutor Conversacional",
      description: "IA que explica y guía paso a paso, sin dar respuestas directas"
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Mapa de Habilidades",
      description: "Detecta carencias reales y sugiere práctica enfocada"
    },
    {
      icon: <Star className="w-8 h-8" />,
      title: "Motivación Positiva",
      description: "Refuerzo sin presión, metas pequeñas y rachas sanas"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Panel para Padres",
      description: "Reportes claros con semáforos y recomendaciones accionables"
    }
  ];

  const subjects = [
    { name: "Matemáticas", color: "#4CC9F0", icon: "➕" },
    { name: "Lengua", color: "#FFD60A", icon: "📖" },
    { name: "Ciencias", color: "#10B981", icon: "🔬" },
    { name: "Inglés", color: "#F72585", icon: "🌍" }
  ];

  return (
    <div className="min-h-screen landing-gradient">
      {/* Hero Section */}
      <header className="relative overflow-hidden">
        {/* Floating shapes */}
        <div className="floating-shape shape-1"></div>
        <div className="floating-shape shape-2"></div>
        <div className="floating-shape shape-3"></div>

        <nav className="container mx-auto px-6 py-6 flex justify-between items-center relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-[#4CC9F0] border-4 border-black rounded-2xl flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-black" />
            </div>
            <span className="text-2xl font-bold text-[#2B2D42]" style={{ fontFamily: 'Fredoka, sans-serif' }}>
              TutorIA
            </span>
          </div>
          <Button
            data-testid="login-btn"
            onClick={handleLogin}
            className="bg-[#2B2D42] text-white hover:bg-[#1a1b26] rounded-full px-6 py-2 font-medium"
          >
            Iniciar sesión
          </Button>
        </nav>

        <div className="container mx-auto px-6 py-16 md:py-24 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 
              className="text-4xl md:text-6xl font-bold text-[#2B2D42] mb-6"
              style={{ fontFamily: 'Fredoka, sans-serif' }}
            >
              El tutor personal que tu hijo necesita
            </h1>
            <p className="text-lg md:text-xl text-[#8D99AE] mb-8 max-w-2xl mx-auto">
              Práctica corta y enfocada. Explicaciones paso a paso. 
              Sin agobios, con resultados.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                data-testid="get-started-btn"
                onClick={handleLogin}
                className="btn-clay text-xl"
              >
                Empezar gratis
                <ArrowRight className="inline-block ml-2 w-6 h-6" />
              </button>
            </div>
            <p className="text-sm text-[#8D99AE] mt-4">
              Para alumnos de 1º a 6º de Primaria • Currículo LOMLOE
            </p>
          </div>
        </div>

        {/* Subject Pills */}
        <div className="container mx-auto px-6 pb-12">
          <div className="flex flex-wrap justify-center gap-4">
            {subjects.map((subject, index) => (
              <div
                key={subject.name}
                className="flex items-center gap-2 px-6 py-3 bg-white border-4 border-black rounded-full shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] animate-bounce-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <span className="text-2xl">{subject.icon}</span>
                <span className="font-bold text-[#2B2D42]">{subject.name}</span>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <h2 
            className="text-3xl md:text-4xl font-bold text-center text-[#2B2D42] mb-4"
            style={{ fontFamily: 'Fredoka, sans-serif' }}
          >
            ¿Qué hace TutorIA diferente?
          </h2>
          <p className="text-center text-[#8D99AE] mb-12 max-w-xl mx-auto">
            No es más tarea. Es práctica corta y bien enfocada.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="card-clay animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-14 h-14 bg-[#4CC9F0] border-3 border-black rounded-2xl flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-[#2B2D42] mb-2" style={{ fontFamily: 'Fredoka, sans-serif' }}>
                  {feature.title}
                </h3>
                <p className="text-[#8D99AE]">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-[#FFFDF5]">
        <div className="container mx-auto px-6">
          <h2 
            className="text-3xl md:text-4xl font-bold text-center text-[#2B2D42] mb-12"
            style={{ fontFamily: 'Fredoka, sans-serif' }}
          >
            Sesiones de 5 a 15 minutos
          </h2>

          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-4 gap-6">
              {[
                { step: "1", title: "Check-in", desc: "¿Cómo te sientes hoy?" },
                { step: "2", title: "Mini-reto", desc: "2-5 ejercicios adaptados" },
                { step: "3", title: "Guía", desc: "Pistas si te atascas" },
                { step: "4", title: "Celebra", desc: "Resumen motivador" }
              ].map((item, index) => (
                <div key={item.step} className="text-center">
                  <div 
                    className="w-16 h-16 mx-auto mb-4 bg-[#FFD60A] border-4 border-black rounded-full flex items-center justify-center text-2xl font-bold"
                    style={{ fontFamily: 'Fredoka, sans-serif' }}
                  >
                    {item.step}
                  </div>
                  <h3 className="font-bold text-[#2B2D42] mb-1" style={{ fontFamily: 'Fredoka, sans-serif' }}>
                    {item.title}
                  </h3>
                  <p className="text-sm text-[#8D99AE]">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Parent Dashboard Preview */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 
              className="text-3xl md:text-4xl font-bold text-center text-[#2B2D42] mb-4"
              style={{ fontFamily: 'Fredoka, sans-serif' }}
            >
              Padres informados, sin ruido
            </h2>
            <p className="text-center text-[#8D99AE] mb-12">
              Ve el progreso de tu hijo de un vistazo
            </p>

            {/* Mock Dashboard Card */}
            <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-[#0F172A]" style={{ fontFamily: 'Outfit, sans-serif' }}>
                  Resumen semanal de María
                </h3>
                <span className="streak-badge">
                  <span>🔥</span> 5 días seguidos
                </span>
              </div>
              
              <div className="grid grid-cols-4 gap-4 mb-6">
                {[
                  { name: "Mates", status: "green", pct: 85 },
                  { name: "Lengua", status: "yellow", pct: 62 },
                  { name: "Ciencias", status: "green", pct: 78 },
                  { name: "Inglés", status: "red", pct: 45 }
                ].map((subj) => (
                  <div key={subj.name} className="text-center">
                    <div className={`w-4 h-4 rounded-full mx-auto mb-2 status-${subj.status}`}></div>
                    <p className="text-sm font-medium text-[#0F172A]">{subj.name}</p>
                    <p className="text-xs text-[#64748B]">{subj.pct}%</p>
                  </div>
                ))}
              </div>

              <div className="bg-[#FEF3C7] border border-[#F59E0B] rounded-lg p-4">
                <p className="text-sm text-[#92400E]">
                  <strong>Recomendación:</strong> Esta semana mejoró en sumas. En comprensión lectora 
                  se confunde con datos irrelevantes. 3 sesiones de 8 min enfocadas en subrayar datos.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-[#2B2D42]">
        <div className="container mx-auto px-6 text-center">
          <h2 
            className="text-3xl md:text-4xl font-bold text-white mb-4"
            style={{ fontFamily: 'Fredoka, sans-serif' }}
          >
            ¿Listo para empezar?
          </h2>
          <p className="text-[#8D99AE] mb-8">
            Crea una cuenta gratuita y configura el perfil de tu hijo en 2 minutos
          </p>
          <button
            data-testid="cta-btn"
            onClick={handleLogin}
            className="btn-clay-secondary text-xl"
          >
            Crear cuenta gratis
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-[#1a1b26]">
        <div className="container mx-auto px-6 text-center">
          <p className="text-[#8D99AE] text-sm">
            © 2025 TutorIA • Diseñado para alumnos de primaria en España
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
