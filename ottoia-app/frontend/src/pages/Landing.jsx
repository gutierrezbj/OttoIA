import React from 'react';
import { BookOpen, Star, Users, BarChart3, ArrowRight } from 'lucide-react';
import { API } from '../App';

const Landing = () => {
  const handleLogin = () => {
    window.location.href = `${API}/auth/google`;
  };

  const features = [
    { icon: <BookOpen className="w-8 h-8" />, title: "Tutor Conversacional", description: "IA que explica y guia paso a paso" },
    { icon: <BarChart3 className="w-8 h-8" />, title: "Mapa de Habilidades", description: "Detecta carencias y sugiere practica" },
    { icon: <Star className="w-8 h-8" />, title: "Motivacion Positiva", description: "Refuerzo sin presion, metas pequenas" },
    { icon: <Users className="w-8 h-8" />, title: "Panel para Padres", description: "Reportes claros con semaforos" },
  ];

  const subjects = [
    { name: "Matematicas", color: "#4CC9F0", icon: "➕" },
    { name: "Lengua", color: "#FFD60A", icon: "📖" },
    { name: "Ciencias", color: "#10B981", icon: "🔬" },
    { name: "Ingles", color: "#F72585", icon: "🌍" },
  ];

  return (
    <div className="min-h-screen landing-gradient">
      {/* Hero */}
      <header className="relative overflow-hidden">
        <div className="floating-shape shape-1"></div>
        <div className="floating-shape shape-2"></div>
        <div className="floating-shape shape-3"></div>

        <nav className="container mx-auto px-6 py-6 flex justify-between items-center relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-[#4CC9F0] border-4 border-black rounded-2xl flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-black" />
            </div>
            <span className="text-2xl font-bold text-[#2B2D42] font-fredoka">OttoAI</span>
          </div>
          <button onClick={handleLogin} className="bg-[#2B2D42] text-white hover:bg-[#1a1b26] rounded-full px-6 py-2 font-medium transition-colors">
            Iniciar sesion
          </button>
        </nav>

        <div className="container mx-auto px-6 py-16 md:py-24 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-[#2B2D42] mb-6 font-fredoka">
              El tutor personal que tu hijo necesita
            </h1>
            <p className="text-lg md:text-xl text-[#8D99AE] mb-8 max-w-2xl mx-auto">
              Practica corta y enfocada. Explicaciones paso a paso. Sin agobios, con resultados.
            </p>
            <button onClick={handleLogin} className="btn-clay text-xl">
              Empezar gratis <ArrowRight className="inline-block ml-2 w-6 h-6" />
            </button>
            <p className="text-sm text-[#8D99AE] mt-4">
              Para alumnos de 1 a 6 de Primaria
            </p>
          </div>
        </div>

        {/* Subject Pills */}
        <div className="container mx-auto px-6 pb-12">
          <div className="flex flex-wrap justify-center gap-4">
            {subjects.map((subject, i) => (
              <div
                key={subject.name}
                className="flex items-center gap-2 px-6 py-3 bg-white border-4 border-black rounded-full shadow-clay-sm animate-bounce-in"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <span className="text-2xl">{subject.icon}</span>
                <span className="font-bold text-[#2B2D42]">{subject.name}</span>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-[#2B2D42] mb-12 font-fredoka">
            Que hace OttoAI diferente?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <div key={f.title} className="card-clay animate-fade-in" style={{ animationDelay: `${i * 100}ms` }}>
                <div className="w-14 h-14 bg-[#4CC9F0] border-3 border-black rounded-2xl flex items-center justify-center mb-4">
                  {f.icon}
                </div>
                <h3 className="text-xl font-bold text-[#2B2D42] mb-2 font-fredoka">{f.title}</h3>
                <p className="text-[#8D99AE]">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[#2B2D42]">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 font-fredoka">
            Listo para empezar?
          </h2>
          <p className="text-[#8D99AE] mb-8">
            Crea una cuenta gratuita y configura el perfil de tu hijo en 2 minutos
          </p>
          <button onClick={handleLogin} className="btn-clay-secondary text-xl">Crear cuenta gratis</button>
        </div>
      </section>

      <footer className="py-8 bg-[#1a1b26]">
        <div className="container mx-auto px-6 text-center">
          <p className="text-[#8D99AE] text-sm">2025 OttoAI - Disenado para alumnos de primaria</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
