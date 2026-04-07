<p align="center">
  <img src="https://ottoia.systemrapid.io/favicon.svg" width="60" alt="OttoIA" />
</p>

<h1 align="center">OttoIA</h1>

<p align="center">
  <strong>El tutor personal que tu hijo necesita</strong><br/>
  Tutor IA para alumnos de primaria (1º–6º) en España. Práctica corta, adaptativa y enfocada — alineada con el currículo LOMLOE.
</p>

<p align="center">
  <a href="https://ottoia.systemrapid.io">🌐 Demo</a> ·
  <a href="#quick-start">🚀 Quick Start</a> ·
  <a href="#arquitectura">📐 Arquitectura</a>
</p>

---

## ¿Qué es OttoIA?

OttoIA es un tutor conversacional con IA para niños de primaria. No solo explica: evalúa comprensión, detecta carencias reales por habilidad, motiva con refuerzo positivo y mantiene a los padres informados con reportes claros y accionables.

Interfaz dual:
- **Mundo infantil** (claymorphism, Fredoka, colores vivos) para los niños
- **Dashboard profesional** (Swiss, Outfit/Inter, semáforo) para los padres

### Roles

| Rol | Qué hace |
|-----|----------|
| **🧒 Alumno** | Aprende con explicaciones, ejemplos, juegos y práctica adaptativa |
| **👨‍👩‍👧 Padre/Madre** | Ve avances, carencias, hábitos y recomendaciones semanales |
| **👩‍🏫 Docente** *(futuro)* | Recibe resumen para coordinar refuerzos en aula |

---

## Tech Stack

| Capa | Tecnología |
|------|-----------|
| **Frontend** | React 19, Vite, Tailwind CSS 3.4, shadcn/ui (44 componentes), React Router v7, Recharts, Lucide, Sonner |
| **Backend** | Node.js, Express 4.21, MongoDB native driver, Passport.js |
| **AI** | `@anthropic-ai/sdk` · Claude Haiku 4.5 (`claude-haiku-4-5-20251001`) |
| **Auth** | Google OAuth 2.0 + express-session |
| **DB / Cache** | MongoDB 7, Redis 7 |
| **Infra** | Docker Compose, Nginx reverse proxy, Let's Encrypt, Hostinger VPS |

---

## Estructura

```
OttoIA/
├── ottoia-app/
│   ├── frontend/             # React 19 SPA (puerto 3130)
│   │   ├── src/
│   │   │   ├── pages/        # 9 páginas (Landing, Dashboard, Practice, Chat...)
│   │   │   ├── components/ui # shadcn/ui (44 componentes)
│   │   │   ├── hooks/
│   │   │   ├── lib/
│   │   │   └── App.jsx       # Routing + Auth context
│   │   ├── __tests__/        # Vitest + Testing Library
│   │   └── vite.config.js
│   ├── backend/              # Express API (puerto 4130)
│   │   ├── server.js
│   │   ├── routes/           # 9 módulos: auth, children, skills,
│   │   │                     #   exercises, attempts, chat, checkin,
│   │   │                     #   progress, report
│   │   ├── middleware/       # Auth, error handling
│   │   ├── data/             # 26 skills, banco de ejercicios fallback
│   │   └── .env.example
│   ├── docker-compose.yml            # PROD
│   └── docker-compose.staging.yml    # STAGING
├── design-system/            # tailwind tokens, claymorphism CSS
│   ├── tailwind.config.ottoia.js
│   ├── ottoia-base.css
│   └── DESIGN-SYSTEM.md
├── company.md                # Docs internos SRS
├── glossary.md               # Glosario del proyecto
└── ottoia-arquitectura.svg
```

---

## Quick Start

### Requisitos

- Node.js 20+
- Docker & Docker Compose
- API keys: Anthropic, Google OAuth

### Desarrollo local

```bash
# Clonar
git clone https://github.com/gutierrezbj/OttoIA.git
cd OttoIA/ottoia-app

# Configurar variables de entorno
cp backend/.env.example backend/.env
# Editar backend/.env con tus credenciales

# Levantar todo el stack
docker compose up -d --build
```

- **Frontend:** http://localhost:3130
- **API:** http://localhost:4130
- **MongoDB:** localhost:6130
- **Redis:** localhost:6131

---

## API

Base URL: `/api`

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/auth/session` | Intercambiar sesión Google OAuth |
| `GET` | `/auth/me` | Usuario autenticado actual |
| `POST` | `/auth/logout` | Cerrar sesión |
| `GET/POST` | `/children` | CRUD perfiles de hijos |
| `GET` | `/skills?subject=&grade=` | Skills por materia/curso |
| `POST` | `/exercises/generate` | Generar ejercicio con Claude |
| `POST` | `/attempts` | Registrar intento |
| `POST/GET` | `/chat/:child_id` | Chat tutor IA + historial |
| `POST/GET` | `/checkin/:child_id` | Check-in diario (mood/energy) |
| `GET` | `/progress/:child_id` | Progreso + semáforo |
| `GET` | `/report/:child_id/weekly` | Reporte semanal para padres |

---

## Skills Database

**26 habilidades** distribuidas en 4 materias, alineadas con LOMLOE (segundo y tercer ciclo de primaria):

| Materia | Habilidades |
|---------|-------------|
| **Matemáticas (9)** | suma básica, resta básica, sumas/restas con llevadas, multiplicación, división, fracciones, decimales, problemas |
| **Lengua (8)** | lectura fluida, comprensión literal/inferencial, ortografía b/v, ortografía h, acentuación, gramática, redacción |
| **Ciencias (6)** | seres vivos, cuerpo humano, plantas, animales, ecosistemas, materia |
| **Inglés (5)** | vocabulario básico, colores y números, familia, presente simple, preguntas |

Cada ejercicio se etiqueta con habilidad, tipo de error (cálculo, comprensión, atención…), nivel de ayuda usado y tiempo, para alimentar el motor adaptativo.

---

## Arquitectura

```
Niño / Padre
     │
     ▼
┌────────────────────┐       ┌──────────────────┐
│  Frontend React    │──────▶│  Express API     │
│  (Vite + shadcn)   │       │  (9 módulos)     │
└────────────────────┘       └─────────┬────────┘
                                       │
                  ┌────────────────────┼────────────────────┐
                  ▼                    ▼                    ▼
           ┌─────────────┐      ┌────────────┐      ┌──────────────┐
           │  MongoDB 7  │      │  Redis 7   │      │ Claude API   │
           │  (datos)    │      │ (sesiones) │      │  (Haiku 4.5) │
           └─────────────┘      └────────────┘      └──────────────┘
```

**Fallback bank:** la API tiene 26+ ejercicios pre-hechos y 18 respuestas de chat para cuando Claude no está disponible o se quiere ahorrar coste.

---

## Deploy

| Entorno | Host | Tailscale | Path |
|---------|------|-----------|------|
| **DEV** | Mac Mini bleu | `100.107.171.77` | local |
| **STAGING** | `187.77.71.102` | `100.110.52.22` | `/opt/apps/ottoia/` |
| **PROD** | `72.62.41.234` | `100.71.174.77` | `/opt/apps/ottoia/` |

```bash
# Staging
ssh root@100.110.52.22
cd /opt/apps/ottoia/ottoia-app
git pull && docker compose -f docker-compose.staging.yml up -d --build

# Producción
ssh root@100.71.174.77
cd /opt/apps/ottoia/ottoia-app
git pull && docker compose up -d --build
```

Reglas SRS:
- **Puertos**: offset `+130` → Frontend `3130`, API `4130`, MongoDB `6130`, Redis `6131`
- **Bind seguro**: SIEMPRE `127.0.0.1:PUERTO:INTERNO` (nunca `0.0.0.0`)
- **Nginx**: `/` → `:3130`, `/api/` → `:4130`
- **SSL**: `certbot --nginx -d ottoia.systemrapid.io`
- **Monitoring**: containers registrados en `healthcheck.sh` y SA99 InfraService

---

## Variables de Entorno

| Variable | Descripción |
|----------|-------------|
| `MONGO_URL` | URI de MongoDB |
| `REDIS_URL` | URI de Redis |
| `SESSION_SECRET` | Secret para express-session |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth secret |
| `GOOGLE_CALLBACK_URL` | Callback OAuth (ej. `https://ottoia.systemrapid.io/api/auth/callback`) |
| `ANTHROPIC_API_KEY` | API key de Anthropic (Claude Haiku 4.5) |
| `FRONTEND_URL` | URL base del frontend |

---

## Documentación

Documentación SDD-SRS completa en Notion (privado):

- SDD-01 — Definición del problema
- SDD-02 — Alcance y límites
- SDD-03 — Arquitectura técnica
- SDD-04 — ADRs (decisiones técnicas)
- SDD-05 — Backlog inicial
- SDD-06 — Reglas de desarrollo
- SDD-07 — Plan de testing
- SDD-08 — Plan de despliegue
- Checklist de Kickoff SRS

---

## Licencia

Propietario · © 2026 SystemRapid

---

<p align="center">
  Hecho con 📚 por <a href="https://systemrapid.io">SystemRapid</a>
</p>
