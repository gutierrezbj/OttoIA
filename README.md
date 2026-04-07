# OttoIA

Tutor IA para alumnos de primaria (1º–6º) en España. Interfaz dual: mundo infantil (claymorphism) para niños + dashboard profesional (Swiss) para padres. Práctica adaptativa, chat con tutor IA, mapa de aventuras gamificado.

> Proyecto del portafolio **System Rapid Solutions (SRS)** — sigue la metodología SDD-SRS v1.2.

---

## Estado actual (Abril 2026)

| Campo | Valor |
|---|---|
| Fase | 5 — Staging desplegado, pendiente PROD |
| Dominio | [ottoia.systemrapid.io](https://ottoia.systemrapid.io) |
| Stack | React 19 + Vite + Express + MongoDB 7 + Redis 7 + Claude Haiku 4.5 |
| Puertos (offset +130) | Frontend `3130`, API `4130`, MongoDB `6130`, Redis `6131` |
| Tests | Backend 22/22 (Jest) · Frontend 6/6 (Vitest) |
| Precio objetivo | 9–12 €/mes |

---

## Tech stack

- **Frontend**: React 19 · Vite · Tailwind CSS 3.4 · shadcn/ui (44 componentes) · React Router v7 · Recharts · Lucide · Sonner
- **Backend**: Node.js · Express 4.21 · MongoDB native driver (sin Mongoose)
- **AI**: `@anthropic-ai/sdk` con `claude-haiku-4-5-20251001` (ejercicios + chat tutor)
- **Auth**: Passport.js + Google OAuth 2.0 + express-session
- **DB**: MongoDB 7 (Docker)
- **Cache**: Redis 7 (sesiones + rate limiting)
- **Infra**: Docker Compose · Nginx reverse proxy · Hostinger VPS · Let's Encrypt

---

## Estructura

```
OttoAI/
├── ottoia-app/
│   ├── frontend/         # React 19 + Vite + shadcn/ui
│   ├── backend/          # Express + MongoDB
│   ├── docker-compose.yml          # PROD
│   └── docker-compose.staging.yml  # STAGING
├── design-system/        # tailwind tokens, claymorphism CSS
├── company.md            # Docs internos SRS
├── glossary.md           # Glosario del proyecto
└── ottoia-arquitectura.svg
```

---

## Quick start (local)

Requisitos: Docker Desktop.

```bash
git clone https://github.com/gutierrezbj/OttoAI.git
cd OttoAI/ottoia-app
cp backend/.env.example backend/.env   # rellena GOOGLE_CLIENT_ID, ANTHROPIC_API_KEY, etc.
docker compose up -d --build
```

- Frontend → http://localhost:3130
- API → http://localhost:4130

---

## API (9 módulos)

| Endpoint | Función |
|---|---|
| `/api/auth` | Google OAuth + sesiones |
| `/api/children` | CRUD perfiles de hijos |
| `/api/skills` | 26 skills (4 materias) |
| `/api/exercises` | Generación AI + banco fallback |
| `/api/attempts` | Registro de intentos |
| `/api/chat` | Tutor IA (Claude + 18 fallbacks) |
| `/api/checkin` | Check-in diario (mood / energy) |
| `/api/progress` | Progreso + semáforo |
| `/api/report` | Reportes semanales para padres |

---

## Skills (26 total)

- **Matemáticas (9)**: suma básica, resta básica, sumas/restas con llevadas, multiplicación, división, fracciones, decimales, problemas
- **Lengua (8)**: lectura fluida, comprensión literal/inferencial, ortografía b/v, ortografía h, acentuación, gramática, redacción
- **Ciencias (6)**: seres vivos, cuerpo humano, plantas, animales, ecosistemas, materia
- **Inglés (5)**: vocabulario básico, colores y números, familia, presente simple, preguntas

---

## Frontend (9 páginas)

Landing · AuthCallback · ParentDashboard · ChildDashboard · ChildSetup · TutorChat · Practice · WeeklyReport · AdventureMap

Dual theme:
- **Child** (`/child/*`): Fredoka/Varela, claymorphism, iconos `stroke-width=3`, colores vivos por materia
- **Parent** (`/parent/*`): Outfit/Inter, limpio, profesional, semáforo verde/amarillo/rojo

---

## Deploy

| Entorno | Host | Path |
|---|---|---|
| DEV | Mac Mini bleu (`100.107.171.77`) | local |
| STAGING | `187.77.71.102` (Tailscale `100.110.52.22`) | `/opt/apps/ottoia/` |
| PROD | `72.62.41.234` (Tailscale `100.71.174.77`) | `/opt/apps/ottoia/` |

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
- **SIEMPRE** `127.0.0.1:PUERTO:INTERNO` (nunca `0.0.0.0`)
- Nginx: `/` → `:3130`, `/api/` → `:4130`
- SSL: `certbot --nginx -d ottoia.systemrapid.io`
- Todos los containers registrados en `healthcheck.sh` y SA99 InfraService

---

## Documentación SDD

Documentación completa en Notion (privado): SDD-01 a SDD-08, Checklist de Kickoff SRS, ADRs.

---

## Licencia

Propietario — System Rapid Solutions.
