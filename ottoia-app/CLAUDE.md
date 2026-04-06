# OttoIA — Claude Code Project Context

## What is this
Tutor IA para alumnos de primaria (1-6) en Espana. Interfaz dual: mundo infantil (claymorphism) para ninos + dashboard profesional (Swiss) para padres. Practica adaptativa, chat con tutor IA, mapa de aventuras gamificado.

## Current State
- MVP funcional generado en Emergent (React 19 + FastAPI + MongoDB)
- Migrando backend a Node.js/Express (manteniendo UX identica)
- Design system extraido y documentado (tailwind.config.ottoia.js)
- Fase 3 del Kickoff SRS: infraestructura reservada (offset +40)
- Pendiente: SDD completo, Dockerfiles, deploy

## Tech Stack
- **Frontend**: React 19 + Vite + Tailwind CSS + shadcn/ui
- **Backend**: Node.js + Express + Mongoose
- **DB**: MongoDB 7 (Docker local)
- **Cache**: Redis 7 (sesiones, rate limiting)
- **Infra**: Docker Compose, Nginx reverse proxy, Hostinger VPS

## Project Structure
```
ottoia-app/
├── frontend/
│   ├── src/
│   │   ├── pages/          # Landing, ChildDashboard, ParentDashboard, etc.
│   │   ├── components/ui/  # shadcn/ui components
│   │   ├── hooks/
│   │   └── lib/utils.js
│   ├── vite.config.js
│   └── tailwind.config.js  # imports design-system tokens
├── backend/
│   ├── server.js
│   └── package.json
├── docker-compose.yml       # PROD (offset +40)
├── docker-compose.staging.yml
└── CLAUDE.md
design-system/
├── tailwind.config.ottoia.js  # All design tokens
├── ottoia-base.css            # Custom CSS (claymorphism, bubbles)
└── DESIGN-SYSTEM.md           # Reference doc
```

## Key Patterns
- Dual theme: `.child-theme` (Fredoka/Varela, claymorphism) vs `.parent-theme` (Outfit/Inter, clean)
- Route detection for theme: /child/* = child theme, /parent/* = parent theme
- Subject colors: matematicas=#4CC9F0, lengua=#FFD60A, ciencias=#10B981, ingles=#F72585
- All buttons/inputs MUST have data-testid
- Lucide icons with stroke-width={3} in child UI

## Deploy
- **Puertos (offset +130)**: Frontend 3130, API 4130, MongoDB 6130, Redis 6131
- **Dominio**: ottoia.systemrapid.io
- **PROD**: 72.62.41.234 → /opt/apps/ottoia/
- **STAGING**: 187.77.71.102 → /opt/apps/ottoia/
- **Comando**: `docker compose up -d --build`
- **SIEMPRE**: 127.0.0.1:PUERTO:INTERNO (nunca 0.0.0.0)
- **Nginx**: / → :3130, /api/ → :4130
