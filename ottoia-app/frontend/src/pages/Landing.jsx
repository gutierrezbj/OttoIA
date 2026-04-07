import React from 'react';
import { BookOpen, Star, Users, BarChart3, ArrowRight, Flame, Sparkles, ShieldCheck, Check, Quote, ChevronDown } from 'lucide-react';
import { API } from '../App';

const Landing = () => {
  const handleLogin = () => {
    window.location.href = `${API}/auth/google`;
  };

  const features = [
    { icon: <BookOpen className="w-8 h-8" />, title: "Tutor Conversacional", description: "IA que explica y guia paso a paso", color: "#4CC9F0" },
    { icon: <BarChart3 className="w-8 h-8" />, title: "Mapa de Habilidades", description: "Detecta carencias y sugiere practica", color: "#10B981" },
    { icon: <Star className="w-8 h-8" />, title: "Motivacion Positiva", description: "Refuerzo sin presion, metas pequenas", color: "#FFD60A" },
    { icon: <Users className="w-8 h-8" />, title: "Panel para Padres", description: "Reportes claros con semaforos", color: "#F72585" },
  ];

  const subjects = [
    { name: "Matematicas", color: "#4CC9F0", icon: "➕" },
    { name: "Lengua", color: "#FFD60A", icon: "📖" },
    { name: "Ciencias", color: "#10B981", icon: "🔬" },
    { name: "Ingles", color: "#F72585", icon: "🌍" },
  ];

  const sessionSteps = [
    { number: 1, title: "Check-in", description: "Como te sientes hoy?" },
    { number: 2, title: "Mini-reto", description: "2-5 ejercicios adaptados" },
    { number: 3, title: "Guia", description: "Pistas si te atascas" },
    { number: 4, title: "Celebra", description: "Resumen motivador" },
  ];

  const testimonials = [
    { name: "Lucia M.", role: "Madre de Hugo (3º)", text: "En 3 semanas Hugo pide el solo hacer su sesion. Antes habia que rogarle.", color: "#4CC9F0" },
    { name: "Carlos R.", role: "Padre de Sara (5º)", text: "El reporte semanal me dice exactamente donde ayudarla. Vale oro.", color: "#FFD60A" },
    { name: "Marta G.", role: "Madre de Leo (2º)", text: "Sin pantallas infinitas. 10 minutos al dia y se nota. Por fin algo sano.", color: "#F72585" },
  ];

  const plans = [
    {
      name: "Gratis",
      price: "0",
      tagline: "Para empezar",
      features: ["1 hijo", "3 sesiones / semana", "Reporte basico", "Sin tarjeta"],
      cta: "Empezar gratis",
      highlight: false,
    },
    {
      name: "Familia",
      price: "9",
      tagline: "El mas elegido",
      features: ["Hasta 3 hijos", "Sesiones ilimitadas", "Reportes semanales completos", "Mapa de habilidades", "Soporte prioritario"],
      cta: "Probar 14 dias gratis",
      highlight: true,
    },
    {
      name: "Familia+",
      price: "12",
      tagline: "Maxima cobertura",
      features: ["Hasta 5 hijos", "Todo lo de Familia", "Sesiones de tutoria 1:1 (mensual)", "Plan personalizado por hijo"],
      cta: "Probar 14 dias gratis",
      highlight: false,
    },
  ];

  const faqs = [
    { q: "A partir de que edad funciona?", a: "OttoIA esta disenado para ninos de 1º a 6º de Primaria (6 a 12 anos), alineado con LOMLOE." },
    { q: "Cuanto tiempo al dia recomendais?", a: "Sesiones de 5 a 15 minutos, 3-5 veces por semana. Mejor poco y constante que mucho y agobiante." },
    { q: "Reemplaza al profesor o al refuerzo escolar?", a: "No. Es un complemento. Detecta carencias y motiva la practica diaria, pero el aula sigue siendo el centro." },
    { q: "Es seguro para mi hijo?", a: "Sin anuncios, sin chats con extranos, sin compras dentro de la app. Tu controlas todo desde el panel de padres." },
    { q: "Puedo cancelar cuando quiera?", a: "Si. Sin permanencia, sin letra pequena. Cancelas en 1 clic desde tu cuenta." },
    { q: "Que pasa con los datos de mi hijo?", a: "Cumplimos RGPD. Datos cifrados, nunca se venden, y puedes borrarlos cuando quieras." },
  ];

  const weeklyMaria = [
    { name: "Mates", color: "#10B981", value: "85%" },
    { name: "Lengua", color: "#FFD60A", value: "62%" },
    { name: "Ciencias", color: "#10B981", value: "78%" },
    { name: "Ingles", color: "#F72585", value: "45%" },
  ];

  return (
    <div className="min-h-screen landing-gradient">
      {/* Hero */}
      <header className="relative overflow-hidden">
        <div className="floating-shape shape-1"></div>
        <div className="floating-shape shape-2"></div>
        <div className="floating-shape shape-3"></div>
        <div className="floating-shape shape-4"></div>
        <div className="floating-shape shape-5"></div>

        <nav className="container mx-auto px-6 py-6 flex justify-between items-center relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-[#4CC9F0] border-4 border-black rounded-2xl flex items-center justify-center shadow-clay-sm">
              <BookOpen className="w-6 h-6 text-black" strokeWidth={3} />
            </div>
            <span className="text-2xl font-bold text-[#2B2D42] font-fredoka">OttoIA</span>
          </div>
          <button onClick={handleLogin} className="bg-[#2B2D42] text-white hover:bg-[#1a1b26] rounded-full px-6 py-2 font-medium transition-colors border-2 border-black shadow-clay-sm">
            Iniciar sesion
          </button>
        </nav>

        <div className="container mx-auto px-6 py-16 md:py-24 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 bg-white border-3 border-black rounded-full shadow-clay-sm animate-bounce-in">
              <Sparkles className="w-4 h-4 text-[#F72585]" strokeWidth={3} />
              <span className="text-sm font-bold text-[#2B2D42]">Alineado con LOMLOE</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-[#2B2D42] mb-6 font-fredoka leading-tight">
              El tutor personal<br/>que <span className="relative inline-block">
                <span className="relative z-10">tu hijo</span>
                <span className="absolute inset-x-0 bottom-1 h-4 bg-[#FFD60A] -z-0 rounded-sm"></span>
              </span> necesita
            </h1>
            <p className="text-lg md:text-xl text-[#5a6577] mb-10 max-w-2xl mx-auto">
              Practica corta y enfocada. Explicaciones paso a paso.<br/>
              <span className="font-semibold text-[#2B2D42]">Sin agobios, con resultados.</span>
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button onClick={handleLogin} className="btn-clay text-xl group">
                Empezar gratis <ArrowRight className="inline-block ml-2 w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </button>
              <div className="flex items-center gap-2 text-sm text-[#5a6577]">
                <ShieldCheck className="w-5 h-5 text-[#10B981]" strokeWidth={3} />
                <span><strong>Gratis</strong> · Sin tarjeta · 1 a 6 de Primaria</span>
              </div>
            </div>
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
            Que hace OttoIA diferente?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <div
                key={f.title}
                className="card-clay animate-fade-in hover:-translate-y-2 transition-transform duration-200"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div
                  className="w-16 h-16 border-4 border-black rounded-2xl flex items-center justify-center mb-4 shadow-clay-sm"
                  style={{ backgroundColor: f.color }}
                >
                  {React.cloneElement(f.icon, { strokeWidth: 3, className: 'w-8 h-8 text-[#2B2D42]' })}
                </div>
                <h3 className="text-xl font-bold text-[#2B2D42] mb-2 font-fredoka">{f.title}</h3>
                <p className="text-[#5a6577]">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sesiones */}
      <section className="py-16 bg-[#FFFCF0]">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-[#2B2D42] mb-12 font-fredoka">
            Sesiones de 5 a 15 minutos
          </h2>
          <div className="relative grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {/* Connector line (desktop only) */}
            <div className="hidden md:block absolute top-8 left-[12%] right-[12%] h-1 bg-[#2B2D42] rounded-full -z-0" style={{ borderTop: '3px dashed #2B2D42', background: 'transparent' }}></div>
            {sessionSteps.map((step, i) => {
              const colors = ['#4CC9F0', '#FFD60A', '#F72585', '#10B981'];
              return (
                <div
                  key={step.number}
                  className="relative flex flex-col items-center text-center animate-fade-in z-10"
                  style={{ animationDelay: `${i * 120}ms` }}
                >
                  <div
                    className="w-16 h-16 border-4 border-black rounded-full flex items-center justify-center mb-4 shadow-clay-sm"
                    style={{ backgroundColor: colors[i] }}
                  >
                    <span className="text-2xl font-bold text-[#2B2D42] font-fredoka">{step.number}</span>
                  </div>
                  <h3 className="text-lg font-bold text-[#2B2D42] mb-1 font-fredoka">{step.title}</h3>
                  <p className="text-sm text-[#5a6577]">{step.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Padres informados */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-[#2B2D42] mb-2 font-fredoka">
            Padres informados, sin ruido
          </h2>
          <p className="text-center text-[#8D99AE] mb-12">Ve el progreso de tu hijo de un vistazo</p>
          <div className="max-w-2xl mx-auto bg-white border-4 border-black rounded-3xl p-6 shadow-clay">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-[#2B2D42] font-fredoka">Resumen semanal de Maria</h3>
              <div className="flex items-center gap-2 px-4 py-2 bg-[#FFD60A] border-3 border-black rounded-full">
                <Flame className="w-5 h-5 text-[#2B2D42]" />
                <span className="font-bold text-[#2B2D42] text-sm">5 dias seguidos</span>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-4 mb-6">
              {weeklyMaria.map((s) => (
                <div key={s.name} className="flex flex-col items-center">
                  <div className="w-4 h-4 rounded-full mb-2" style={{ backgroundColor: s.color }}></div>
                  <span className="text-sm font-bold text-[#2B2D42]">{s.name}</span>
                  <span className="text-xs text-[#8D99AE]">{s.value}</span>
                </div>
              ))}
            </div>
            <div className="bg-[#FFFCF0] border-2 border-[#FFD60A] rounded-2xl p-4">
              <p className="text-sm text-[#2B2D42]">
                <strong>Recomendacion:</strong> Esta semana mejoro en sumas. En comprension lectora se confunde con datos irrelevantes. 3 sesiones de 8 min enfocadas en subrayar datos.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonios */}
      <section className="py-16 bg-[#FFFCF0]">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-[#2B2D42] mb-2 font-fredoka">
            Familias que ya confian en OttoIA
          </h2>
          <p className="text-center text-[#5a6577] mb-12">Padres reales, resultados reales</p>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {testimonials.map((t, i) => (
              <div
                key={t.name}
                className="card-clay animate-fade-in hover:-translate-y-2 transition-transform duration-200"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div
                  className="w-12 h-12 border-4 border-black rounded-2xl flex items-center justify-center mb-4 shadow-clay-sm"
                  style={{ backgroundColor: t.color }}
                >
                  <Quote className="w-5 h-5 text-[#2B2D42]" strokeWidth={3} />
                </div>
                <p className="text-[#2B2D42] mb-4 leading-relaxed">{t.text}</p>
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(5)].map((_, idx) => (
                    <Star key={idx} className="w-4 h-4 fill-[#FFD60A] text-[#FFD60A]" strokeWidth={2} />
                  ))}
                </div>
                <div>
                  <div className="font-bold text-[#2B2D42]">{t.name}</div>
                  <div className="text-sm text-[#5a6577]">{t.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-[#2B2D42] mb-2 font-fredoka">
            Precios honestos
          </h2>
          <p className="text-center text-[#5a6577] mb-12">Empieza gratis. Sin tarjeta. Sin permanencia.</p>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {plans.map((p, i) => (
              <div
                key={p.name}
                className={`relative card-clay animate-fade-in flex flex-col ${p.highlight ? 'md:-translate-y-4 ring-4 ring-[#F72585]' : ''}`}
                style={{ animationDelay: `${i * 100}ms` }}
              >
                {p.highlight && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#F72585] text-white border-4 border-black rounded-full px-4 py-1 text-xs font-bold shadow-clay-sm">
                    MAS ELEGIDO
                  </div>
                )}
                <div className="text-sm font-bold text-[#5a6577] uppercase tracking-wide mb-2">{p.tagline}</div>
                <h3 className="text-2xl font-bold text-[#2B2D42] mb-4 font-fredoka">{p.name}</h3>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-5xl font-bold text-[#2B2D42] font-fredoka">{p.price}€</span>
                  <span className="text-[#5a6577]">/mes</span>
                </div>
                <ul className="space-y-3 mb-8 flex-1">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <div className="w-5 h-5 rounded-full bg-[#10B981] border-2 border-black flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-white" strokeWidth={4} />
                      </div>
                      <span className="text-[#2B2D42] text-sm">{f}</span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={handleLogin}
                  className={p.highlight ? 'btn-clay w-full' : 'btn-clay-secondary w-full'}
                >
                  {p.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-[#FFFCF0]">
        <div className="container mx-auto px-6 max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-[#2B2D42] mb-12 font-fredoka">
            Preguntas frecuentes
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <details
                key={i}
                className="group bg-white border-4 border-black rounded-2xl shadow-clay-sm overflow-hidden"
              >
                <summary className="flex items-center justify-between cursor-pointer p-5 font-bold text-[#2B2D42] list-none">
                  <span>{faq.q}</span>
                  <ChevronDown className="w-5 h-5 transition-transform group-open:rotate-180" strokeWidth={3} />
                </summary>
                <div className="px-5 pb-5 text-[#5a6577] leading-relaxed">{faq.a}</div>
              </details>
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
          <p className="text-[#8D99AE] text-sm">2025 OttoIA - Disenado para alumnos de primaria</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
