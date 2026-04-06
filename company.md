# System Rapid Solutions (SRS) — Company Context

## Overview
System Rapid Solutions es una empresa de desarrollo de software que gestiona un portafolio de productos propios y proyectos para clientes. Opera con metodologia propia (SDD-SRS) y infraestructura centralizada.

## Infraestructura (Marzo 2026)

### Servidores
| Servidor | IP Publica | Tailscale | Specs |
|----------|-----------|-----------|-------|
| PROD (VPS) | 72.62.41.234 | 100.71.174.77 | 2 vCPU, 8GB RAM, 96GB SSD |
| STAGING (VPS) | 187.77.71.102 | 100.110.52.22 | 1 vCPU, 4GB RAM, 50GB NVMe |

### Networking
- VPN: Tailscale mesh (todos los dispositivos)
- Firewall: UFW (solo puertos necesarios)
- SSH: Solo key-based, fail2ban activo
- Puertos: SIEMPRE bind a 127.0.0.1 (nunca 0.0.0.0)

### Convencion de Puertos
Cada proyecto tiene un offset asignado. Rangos:
- 3xxx: Frontend (Nginx/static)
- 4xxx: API/Backend
- 5xxx: Servicios auxiliares
- 6xxx: Bases de datos

| Proyecto | Offset |
|----------|--------|
| SA99 | +0 |
| OttoIA | +130 |
| (siguiente libre) | +140 |

### Containers Activos
- PROD: ~19 containers
- STAGING: ~12 containers
- Orquestacion: Docker Compose por proyecto

### Costos
- Hosting actual: ~21-22 EUR/mes total

### Monitoring & Backups
- Scripts: healthcheck.sh, backup-mongo.sh, docker cleanup
- DNS: Hostinger (registros A)
- SSL: Let's Encrypt via certbot

## Metodologia SDD-SRS v1.2

### Filosofia
Framework de documentacion y desarrollo propio. Cada proyecto pasa por fases definidas con 8 secciones documentales obligatorias.

### Secciones SDD
1. SDD-01: Definicion del problema
2. SDD-02: Alcance y limites
3. SDD-03: Arquitectura tecnica
4. SDD-04: Decisiones tecnicas (ADRs)
5. SDD-05: Backlog inicial
6. SDD-06: (varia por proyecto)
7. SDD-07: Plan de testing
8. SDD-08: (varia por proyecto)

### Fases de Proyecto
- Fase 0: Idea/Discovery
- Fase 1: SDD + Documentacion
- Fase 2: Desarrollo MVP
- Fase 3: Infraestructura (kickoff, reserva puertos)
- Fase 4: Testing + QA
- Fase 5: Staging deploy
- Fase 6: Produccion deploy
- Fase 7: Mantenimiento + iteracion

### Portafolio Activo
~12 proyectos en distintas fases de desarrollo. OttoIA actualmente en Fase 5 (staging).

## Design System SRS v2.0

### Filosofia
Cada producto tiene su propia identidad visual, creada mediante un "Identity Sprint" de 6 pasos. No se comparte paleta ni tipografia entre productos.

### Proceso Identity Sprint
1. Definir personalidad del producto
2. Explorar referencias visuales
3. Seleccionar tipografia + paleta
4. Definir motion vocabulary
5. Crear componentes con skin propio
6. Audit de distintividad pre-lanzamiento

### Fundamentos Compartidos
- Spacing: escala inmutable (4px base)
- Estructura de componentes fija, skin variable
- Blacklist de fuentes/paletas/layouts prohibidos

### OttoIA Identity
- Child: Claymorphism (Fredoka + Varela Round, bordes 4px negro, sombras solidas)
- Parent: Swiss clean (Outfit + Inter, bordes sutiles, sombras shadow-sm)

## Stack Tecnologico Aprobado
- Frontend: React 19, Vite, Tailwind CSS, shadcn/ui
- Backend: Node.js + Express (preferido) o FastAPI (legacy)
- DB: MongoDB 7 (Docker)
- Cache: Redis 7
- AI: Claude (Anthropic SDK)
- Auth: Google OAuth 2.0 (Passport.js)
- Infra: Docker Compose, Nginx, Hostinger VPS
- VPN: Tailscale
- CI/CD: Pendiente
