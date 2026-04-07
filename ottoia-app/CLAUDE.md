# OttoIA — Claude Code Project Context

## What is this
Tutor IA para alumnos de primaria (1-6) en Espana. Interfaz dual: mundo infantil (claymorphism) para ninos + dashboard profesional (Swiss) para padres. Practica adaptativa, chat con tutor IA, mapa de aventuras gamificado.

## Current State (Abril 2026)
- MVP funcional completo: frontend React 19 + backend Express + MongoDB
- Backend migrado de FastAPI (Python) a Node.js/Express (completado)
- Design system extraido y documentado (tailwind.config.ottoia.js)
- Infraestructura reservada: offset +130 (puertos 3130/4130/6130/6131)
- Docker Compose configurado (PROD + STAGING)
- Fase 5 Kickoff SRS: staging listo, pendiente deploy produccion
- Referencia original en /ottoia-reference/ (FastAPI, solo lectura)
- 26 skills definidas (4 materias), 9 rutas API, 9 paginas frontend
- Tests configurados con Vitest + Testing Library

## Tech Stack
- **Frontend**: React 19 + Vite + Tailwind CSS 3.4 + shadcn/ui + React Router v7
- **Backend**: Node.js + Express 4.21 + MongoDB native driver (no Mongoose)
- **AI**: @anthropic-ai/sdk (Claude Sonnet) — ejercicios + chat tutor
- **Auth**: Passport.js + Google OAuth 2.0 + express-session
- **DB**: MongoDB 7 (Docker, puerto 6130)
- **Cache**: Redis 7 (sesiones + rate limiting, puerto 6131)
- **Infra**: Docker Compose, Nginx reverse proxy, Hostinger VPS
- **Charts**: Recharts (progress visualization)
- **Icons**: Lucide React (stroke-width=3 en child UI)
- **Toasts**: Sonner

## Project Structure
```
OttoIA/
├── ottoia-app/
│   ├── frontend/
│   │   ├── src/
│   │   │   ├── pages/            # 9 paginas
│   │   │   │   ├── Landing.jsx
│   │   │   │   ├── AuthCallback.jsx
│   │   │   │   ├── ParentDashboard.jsx
│   │   │   │   ├── ChildDashboard.jsx
│   │   │   │   ├── ChildSetup.jsx
│   │   │   │   ├── TutorChat.jsx
│   │   │   │   ├── Practice.jsx
│   │   │   │   ├── WeeklyReport.jsx
│   │   │   │   └── AdventureMap.jsx
│   │   │   ├── components/ui/    # shadcn/ui (7 componentes)
│   │   │   ├── hooks/use-toast.js
│   │   │   ├── lib/utils.js
│   │   │   ├── App.jsx           # Routing + Auth context
│   │   │   └── main.jsx
│   │   ├── __tests__/            # Vitest + Testing Library
│   │   ├── vite.config.js
│   │   └── tailwind.config.js
│   ├── backend/
│   │   ├── server.js             # Express app principal
│   │   ├── routes/               # 9 modulos de rutas
│   │   │   ├── auth.js           # Google OAuth + sesiones
│   │   │   ├── children.js       # CRUD perfiles hijos
│   │   │   ├── skills.js         # Listado de skills por materia/grado
│   │   │   ├── exercises.js      # Generacion AI de ejercicios
│   │   │   ├── attempts.js       # Registro de intentos
│   │   │   ├── chat.js           # Chat tutor IA (Claude + 18 fallbacks)
│   │   │   ├── checkin.js        # Check-in diario (mood/energy)
│   │   │   ├── progress.js       # Progreso + semaforo
│   │   │   └── report.js         # Reportes semanales padres
│   │   ├── middleware/auth.js     # Validacion de sesion
│   │   ├── data/
│   │   │   ├── skills.js         # 26 skills (4 materias)
│   │   │   └── exercises.js      # Banco de ejercicios fallback
│   │   └── .env
│   ├── docker-compose.yml        # PROD (offset +130)
│   ├── docker-compose.staging.yml
│   ├── INFRA-RESERVA.md
│   └── CLAUDE.md
├── design-system/
│   ├── tailwind.config.ottoia.js # Todos los design tokens
│   ├── ottoia-base.css           # CSS custom (claymorphism, bubbles)
│   └── DESIGN-SYSTEM.md
└── ottoia-arquitectura.svg
```

## API Endpoints
- `GET /api/auth/session` — Exchange session for user + cookie
- `GET /api/auth/me` — Usuario autenticado actual
- `POST /api/auth/logout` — Cerrar sesion
- `GET/POST /api/children` — CRUD hijos
- `GET /api/skills?subject=&grade=` — Skills por materia/grado
- `POST /api/exercises/generate` — Generar ejercicio con Claude
- `POST /api/attempts` — Registrar intento
- `POST/GET /api/chat/:child_id` — Chat tutor IA + historial
- `POST/GET /api/checkin/:child_id` — Check-in diario
- `GET /api/progress/:child_id` — Progreso + semaforo
- `GET /api/report/:child_id/weekly` — Reporte semanal

## Key Patterns
- Dual theme: `.child-theme` (Fredoka/Varela, claymorphism) vs `.parent-theme` (Outfit/Inter, clean)
- Route detection: /child/* = child theme, /parent/* = parent theme
- Subject colors: matematicas=#4CC9F0, lengua=#FFD60A, ciencias=#10B981, ingles=#F72585
- All buttons/inputs MUST have data-testid
- Lucide icons con stroke-width={3} en child UI
- MongoDB native driver (NO Mongoose) — indexes en server.js startup
- Claude API con fallback bank (26+ ejercicios pre-hechos, 18 respuestas chat)
- Semaforo padres: verde (>70%), amarillo (40-70%), rojo (<40%)

## Deploy
- **Puertos (offset +130)**: Frontend 3130, API 4130, MongoDB 6130, Redis 6131
- **Dominio**: ottoia.systemrapid.io
- **PROD**: 72.62.41.234 (Tailscale: 100.71.174.77) → /opt/apps/ottoia/
- **STAGING**: 187.77.71.102 (Tailscale: 100.110.52.22) → /opt/apps/ottoia/
- **Comando**: `docker compose up -d --build`
- **SIEMPRE**: 127.0.0.1:PUERTO:INTERNO (nunca 0.0.0.0)
- **Nginx**: / → :3130, /api/ → :4130
- **SSL**: Let's Encrypt via certbot

## Skills Database (26 total)
- **Matematicas (9)**: suma_basica, resta_basica, suma_llevadas, resta_llevadas, multiplicacion, division, fracciones, decimales, problemas
- **Lengua (8)**: lectura_fluida, comprension_literal, comprension_inferencial, ortografia_bv, ortografia_hache, acentuacion, gramatica, redaccion
- **Ciencias (6)**: seres_vivos, cuerpo_humano, plantas, animales, ecosistemas, materia
- **Ingles (5)**: vocabulario_basico, colores_numeros, familia, presente_simple, preguntas

## SRS Context
- Proyecto dentro del portafolio de System Rapid Solutions
- Metodologia SDD-SRS v1.2 (8 secciones obligatorias por proyecto)
- Precio objetivo: 9-12 EUR/mes
- Target: Familias con hijos en primaria en Espana
