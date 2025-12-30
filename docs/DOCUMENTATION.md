# OttoAI - Documentación Técnica

## 📋 Índice
1. [Descripción General](#descripción-general)
2. [Arquitectura](#arquitectura)
3. [Stack Tecnológico](#stack-tecnológico)
4. [Estructura del Proyecto](#estructura-del-proyecto)
5. [Variables de Entorno](#variables-de-entorno)
6. [API Endpoints](#api-endpoints)
7. [Modelos de Base de Datos](#modelos-de-base-de-datos)
8. [Componentes Frontend](#componentes-frontend)
9. [Flujos de Usuario](#flujos-de-usuario)
10. [Guía de Despliegue](#guía-de-despliegue)

---

## Descripción General

**OttoAI** es una plataforma de tutor personal con IA diseñada para alumnos de primaria (6-12 años) en España. La aplicación ofrece:

- Tutor conversacional con IA que guía sin dar respuestas directas
- Ejercicios adaptativos generados por IA
- Sistema de gamificación con mapa de aventuras
- Panel de control para padres con reportes semanales
- Alineación con el currículo español LOMLOE

### Usuarios
- **Padres/Tutores**: Crean cuenta, gestionan perfiles de hijos, ven reportes
- **Alumnos**: Practican, chatean con el tutor, exploran el mapa de aventuras

---

## Arquitectura

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│  React Frontend │────▶│  FastAPI Backend│────▶│    MongoDB      │
│  (Puerto 3000)  │     │  (Puerto 8001)  │     │                 │
│                 │     │                 │     │                 │
└─────────────────┘     └────────┬────────┘     └─────────────────┘
                                 │
                    ┌────────────┼────────────┐
                    ▼            ▼            ▼
              ┌──────────┐ ┌──────────┐ ┌──────────┐
              │ Claude   │ │ Emergent │ │ Skills   │
              │ API      │ │ Auth     │ │ Engine   │
              │(Anthropic)│ │ (Google) │ │          │
              └──────────┘ └──────────┘ └──────────┘
```

---

## Stack Tecnológico

### Backend
- **Framework**: FastAPI (Python 3.11)
- **Base de Datos**: MongoDB con Motor (async)
- **IA**: Anthropic Claude Sonnet
- **Autenticación**: Emergent Google OAuth

### Frontend
- **Framework**: React 19
- **Estilos**: Tailwind CSS
- **Componentes UI**: Shadcn/UI
- **Gráficos**: Recharts
- **Routing**: React Router v6

---

## Estructura del Proyecto

```
/app
├── backend/
│   ├── server.py           # API principal FastAPI
│   ├── requirements.txt    # Dependencias Python
│   └── .env               # Variables de entorno
│
├── frontend/
│   ├── src/
│   │   ├── App.js         # Componente raíz y rutas
│   │   ├── App.css        # Estilos globales
│   │   ├── pages/
│   │   │   ├── Landing.jsx        # Página de inicio
│   │   │   ├── AuthCallback.jsx   # Callback de autenticación
│   │   │   ├── ParentDashboard.jsx# Panel de padres
│   │   │   ├── ChildDashboard.jsx # Dashboard del niño
│   │   │   ├── ChildSetup.jsx     # Crear perfil de hijo
│   │   │   ├── TutorChat.jsx      # Chat con IA
│   │   │   ├── Practice.jsx       # Modo práctica
│   │   │   ├── WeeklyReport.jsx   # Reporte semanal
│   │   │   └── AdventureMap.jsx   # Mapa de aventuras
│   │   └── components/ui/         # Componentes Shadcn
│   ├── package.json
│   └── .env
│
└── memory/
    └── PRD.md             # Product Requirements Document
```

---

## Variables de Entorno

### Backend (`/app/backend/.env`)
```env
MONGO_URL="mongodb://localhost:27017"
DB_NAME="test_database"
CORS_ORIGINS="*"
ANTHROPIC_API_KEY=sk-ant-xxxxx
```

### Frontend (`/app/frontend/.env`)
```env
REACT_APP_BACKEND_URL=https://tu-dominio.com
```

---

## API Endpoints

### Autenticación

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/auth/session?session_id=xxx` | Intercambia session_id por datos de usuario |
| GET | `/api/auth/me` | Obtiene usuario autenticado actual |
| POST | `/api/auth/logout` | Cierra sesión |

### Gestión de Hijos

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/children` | Lista todos los hijos del padre |
| POST | `/api/children` | Crea nuevo perfil de hijo |
| GET | `/api/children/{child_id}` | Obtiene un hijo específico |
| DELETE | `/api/children/{child_id}` | Elimina perfil de hijo |

**Body para crear hijo:**
```json
{
  "name": "María",
  "age": 8,
  "grade": 3
}
```

### Ejercicios

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/exercises/generate?child_id=xxx&subject=matematicas` | Genera ejercicio con IA |
| POST | `/api/attempts` | Registra intento de respuesta |

**Body para registrar intento:**
```json
{
  "exercise_id": "ex_xxx",
  "answer_given": "12",
  "hints_used": 0,
  "time_seconds": 30
}
```

### Chat con Tutor

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/chat/{child_id}` | Envía mensaje al tutor IA |
| GET | `/api/chat/{child_id}/history?limit=50` | Obtiene historial de chat |

**Body para chat:**
```json
{
  "message": "¿Cómo se resuelven las fracciones?",
  "context": "homework"
}
```

### Check-in Diario

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/checkin/{child_id}` | Registra check-in de ánimo |
| GET | `/api/checkin/{child_id}/today` | Obtiene check-in de hoy |

**Body para check-in:**
```json
{
  "mood": "happy",
  "energy": 5,
  "note": "Me siento genial"
}
```

### Progreso y Reportes

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/progress/{child_id}` | Resumen de progreso por materia |
| GET | `/api/report/{child_id}/weekly` | Reporte semanal detallado |
| GET | `/api/skills?subject=matematicas&grade=3` | Lista habilidades disponibles |

---

## Modelos de Base de Datos

### User (Padre/Tutor)
```javascript
{
  user_id: "user_xxx",
  email: "padre@email.com",
  name: "Juan García",
  picture: "https://...",
  created_at: ISODate("2025-12-30T...")
}
```

### Child (Alumno)
```javascript
{
  child_id: "child_xxx",
  parent_id: "user_xxx",
  name: "María",
  age: 8,
  grade: 3,
  subjects: ["matematicas", "lengua", "ciencias", "ingles"],
  created_at: ISODate("2025-12-30T...")
}
```

### Exercise (Ejercicio)
```javascript
{
  exercise_id: "ex_xxx",
  child_id: "child_xxx",
  subject: "matematicas",
  skill_ids: ["mat_suma_basica"],
  question: "¿Cuánto es 7 + 5?",
  correct_answer: "12",
  options: ["10", "11", "12", "13"],
  hints: ["Cuenta desde 7", "7, 8, 9, 10, 11..."],
  difficulty: 1,
  created_at: ISODate("2025-12-30T...")
}
```

### Attempt (Intento)
```javascript
{
  attempt_id: "att_xxx",
  child_id: "child_xxx",
  exercise_id: "ex_xxx",
  skill_ids: ["mat_suma_basica"],
  subject: "matematicas",
  is_correct: true,
  answer_given: "12",
  hints_used: 0,
  time_seconds: 25,
  created_at: ISODate("2025-12-30T...")
}
```

### Skill Progress (Progreso por Habilidad)
```javascript
{
  child_id: "child_xxx",
  skill_id: "mat_suma_basica",
  total_attempts: 10,
  correct_attempts: 8,
  hints_total: 3,
  updated_at: ISODate("2025-12-30T...")
}
```

### Chat Message
```javascript
{
  message_id: "msg_xxx",
  child_id: "child_xxx",
  role: "user" | "assistant",
  content: "¿Cómo sumo fracciones?",
  created_at: ISODate("2025-12-30T...")
}
```

### Daily Check-in
```javascript
{
  checkin_id: "chk_xxx",
  child_id: "child_xxx",
  mood: "happy" | "neutral" | "tired" | "frustrated",
  energy: 1-5,
  note: "opcional",
  created_at: ISODate("2025-12-30T...")
}
```

---

## Componentes Frontend

### Páginas

| Componente | Ruta | Descripción |
|------------|------|-------------|
| `Landing` | `/` | Página de inicio para padres |
| `AuthCallback` | `/auth/callback` | Procesa callback de Google Auth |
| `ParentDashboard` | `/parent` | Panel principal de padres |
| `ChildSetup` | `/parent/setup` | Formulario para crear hijo |
| `WeeklyReport` | `/parent/report/:childId` | Reporte semanal |
| `ChildDashboard` | `/child/:childId` | Dashboard del niño |
| `TutorChat` | `/child/:childId/tutor` | Chat con IA |
| `Practice` | `/child/:childId/practice` | Selección de materia |
| `Practice` | `/child/:childId/practice/:subject` | Ejercicios |
| `AdventureMap` | `/child/:childId/map` | Mapa de aventuras |

### Temas de Diseño

**Tema Niño (child-theme)**
- Fuentes: Fredoka (títulos), Varela Round (cuerpo)
- Colores: Cyan (#4CC9F0), Amarillo (#FFD60A), Rosa (#F72585)
- Estilo: Claymorphism con bordes gruesos y sombras

**Tema Padres (parent-theme)**
- Fuentes: Outfit (títulos), Inter (cuerpo)
- Colores: Slate profesional, acentos azules
- Estilo: Limpio y minimalista

---

## Flujos de Usuario

### Flujo de Registro (Padre)
```
1. Landing → Clic "Empezar gratis"
2. Redirect a auth.emergentagent.com
3. Login con Google
4. Redirect con session_id
5. AuthCallback intercambia session_id
6. Cookie de sesión establecida
7. Redirect a /parent
8. Si no hay hijos → Prompt para crear
```

### Flujo de Práctica (Niño)
```
1. ChildDashboard → Check-in de ánimo (si no hecho)
2. Seleccionar "Practicar" o materia específica
3. Cargar ejercicio generado por IA
4. Mostrar pregunta y opciones
5. Si necesita ayuda → Mostrar pista
6. Registrar respuesta
7. Mostrar feedback (correcto/incorrecto)
8. Actualizar progreso de habilidad
9. Siguiente ejercicio o volver
```

### Flujo de Chat con Tutor
```
1. ChildDashboard → "Ayúdame con la tarea"
2. Cargar historial de mensajes
3. Usuario escribe pregunta
4. Enviar a Claude API con contexto del niño
5. Recibir respuesta pedagógica
6. Guardar en historial
7. Mostrar respuesta con animación
```

---

## Guía de Despliegue

### Requisitos
- Node.js 18+
- Python 3.11+
- MongoDB 6+
- API Key de Anthropic (Claude)

### Instalación Local

```bash
# Backend
cd /app/backend
pip install -r requirements.txt
# Configurar .env con ANTHROPIC_API_KEY

# Frontend
cd /app/frontend
yarn install

# Iniciar servicios
supervisorctl start backend frontend
```

### Variables de Producción
```env
# Backend
MONGO_URL=mongodb+srv://user:pass@cluster.mongodb.net/
DB_NAME=ottoia_prod
CORS_ORIGINS=https://tu-dominio.com
ANTHROPIC_API_KEY=sk-ant-xxxxx

# Frontend
REACT_APP_BACKEND_URL=https://api.tu-dominio.com
```

---

## Habilidades por Asignatura

### Matemáticas
| ID | Nombre | Curso |
|----|--------|-------|
| mat_suma_basica | Sumas básicas | 1º |
| mat_resta_basica | Restas básicas | 1º |
| mat_suma_llevadas | Sumas con llevadas | 2º |
| mat_resta_llevadas | Restas con llevadas | 2º |
| mat_multiplicacion | Multiplicación | 3º |
| mat_division | División | 3º |
| mat_fracciones | Fracciones | 4º |
| mat_decimales | Decimales | 5º |
| mat_problemas | Problemas | 3º |

### Lengua
| ID | Nombre | Curso |
|----|--------|-------|
| len_lectura_fluida | Lectura fluida | 1º |
| len_comprension_literal | Comprensión literal | 2º |
| len_comprension_inferencial | Comprensión inferencial | 3º |
| len_ortografia_bv | Ortografía B/V | 3º |
| len_ortografia_hache | Ortografía H | 3º |
| len_acentuacion | Acentuación | 4º |
| len_gramatica | Gramática | 4º |
| len_redaccion | Redacción | 5º |

### Ciencias
| ID | Nombre | Curso |
|----|--------|-------|
| cie_seres_vivos | Seres vivos | 1º |
| cie_cuerpo_humano | Cuerpo humano | 2º |
| cie_plantas | Plantas | 2º |
| cie_animales | Animales | 3º |
| cie_ecosistemas | Ecosistemas | 4º |
| cie_materia | Materia | 4º |

### Inglés
| ID | Nombre | Curso |
|----|--------|-------|
| ing_vocabulario_basico | Vocabulario básico | 1º |
| ing_colores_numeros | Colores y números | 1º |
| ing_familia | Familia | 2º |
| ing_presente_simple | Presente simple | 3º |
| ing_preguntas | Preguntas | 3º |

---

## Contacto y Soporte

**Desarrollado con Emergent**

Para soporte técnico o consultas sobre la plataforma Emergent, consulta la documentación en el panel de Emergent o contacta al equipo de soporte.

---

*Última actualización: Diciembre 2025*
