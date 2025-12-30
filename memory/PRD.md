# TutorIA - PRD (Product Requirements Document)

## Original Problem Statement
App tipo "tutor personal" para alumnos de primaria (6 a 12 años) que:
- Explique y acompañe en cualquier asignatura (lengua, mates, ciencias, inglés)
- Evalúe de forma continua para detectar carencias reales
- Motive al niño con refuerzo positivo y planes cortos de práctica
- Mantenga informados a los padres con reportes claros y accionables

## User Personas
1. **Alumno (6-12 años)**: Aprende con explicaciones, ejemplos y práctica adaptativa
2. **Padre/madre/tutor**: Ve avances, carencias, hábitos y recomendaciones

## Core Requirements (MVP)
- [x] Autenticación con Google (Emergent Auth)
- [x] Gestión de perfiles de hijos bajo cuenta de padres
- [x] Tutor conversacional con IA (Claude)
- [x] Generación de ejercicios adaptativos por materia
- [x] Sistema de pistas para guiar sin dar respuestas
- [x] Registro de intentos y progreso por habilidad
- [x] Check-in diario del estado de ánimo
- [x] Dashboard de padres con semáforo por materia
- [x] Reportes semanales con recomendaciones
- [x] Mapa de habilidades por asignatura (LOMLOE España)

## What's Been Implemented (Dec 30, 2025)

### Backend (FastAPI + MongoDB)
- Auth endpoints (Google OAuth via Emergent)
- Children CRUD endpoints
- AI-powered exercise generation (Claude Sonnet)
- Intelligent chat tutor with pedagogical guidelines
- Attempt tracking with skill progress
- Daily check-in system
- Weekly progress reports
- Skills database aligned with Spanish curriculum

### Frontend (React + Tailwind)
- Landing page with dual-persona design
- Parent dashboard with child management
- Child dashboard with claymorphism UI
- Practice mode with subject selection
- AI tutor chat interface
- Progress visualization
- Weekly report view

### Integration
- Claude API (Anthropic) for AI tutoring
- MongoDB for data persistence
- Emergent Google Auth

## Prioritized Backlog

### P0 (Critical for launch)
- [x] Core exercise flow
- [x] AI tutor chat
- [x] Parent dashboard

### P1 (Important)
- [ ] More exercise types (fill-in-blank, matching)
- [ ] Reading comprehension mode
- [ ] Push notifications for practice reminders
- [ ] PDF export of weekly reports

### P2 (Nice to have)
- [ ] Gamification (badges, achievements map)
- [ ] Voice input for younger children
- [ ] Teacher portal for school integration
- [ ] Multiple language support

## Architecture
```
Frontend (React) ─────► Backend (FastAPI) ─────► MongoDB
                              │
                              ├──► Claude API (AI)
                              └──► Emergent Auth
```

## Tech Stack
- **Frontend**: React 19, Tailwind CSS, Shadcn/UI, Recharts
- **Backend**: FastAPI, Motor (async MongoDB)
- **Database**: MongoDB
- **AI**: Anthropic Claude Sonnet
- **Auth**: Emergent Google OAuth

## Next Tasks
1. Add more exercise variety per subject
2. Implement achievement system
3. Add practice session history view
4. Create onboarding tutorial for children
