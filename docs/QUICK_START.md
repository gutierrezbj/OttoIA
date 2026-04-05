# OttoAI - Guía Rápida

## 🚀 Acceso Rápido

**URL de la App:** https://tutoria-demo.preview.emergentagent.com

---

## 👨‍👩‍👧 Para Padres

### Crear Cuenta
1. Entra a la web
2. Haz clic en **"Empezar gratis"**
3. Inicia sesión con tu cuenta de Google
4. ¡Listo! Ya puedes añadir el perfil de tu hijo

### Añadir un Hijo
1. En el panel de padres, haz clic en **"Añadir hijo"**
2. Introduce el nombre o apodo
3. Selecciona la edad y el curso
4. Haz clic en **"Crear perfil"**

### Ver Progreso
- **Semáforo por materia:** Verde (bien), Amarillo (reforzar), Rojo (atención)
- **Habilidades a reforzar:** Las 3 principales que necesitan práctica
- **Reporte semanal:** Haz clic en "Ver reporte" para más detalles

---

## 👧 Para Niños

### Empezar una Sesión
1. El padre hace clic en **"Iniciar sesión"** junto a tu nombre
2. Dinos cómo te sientes hoy (😊 😐 😴)
3. ¡Elige qué quieres hacer!

### Opciones Disponibles

#### 💬 Ayúdame con la tarea
- Escribe tu duda o pregunta
- El tutor te guiará paso a paso
- ¡No te dará la respuesta directa, te ayudará a pensarla!

#### 🎯 Practicar
- Elige una asignatura (Mates, Lengua, Ciencias, Inglés)
- Responde los ejercicios
- Si te atascas, pide una **pista**
- Gana estrellas por cada acierto

#### 🗺️ Mapa de Aventuras
- Explora los 4 mundos:
  - 🏰 **Reino de los Números** (Matemáticas)
  - 🌲 **Bosque de las Palabras** (Lengua)
  - 🔬 **Laboratorio Mágico** (Ciencias)
  - 🏝️ **Isla del Inglés**
- Desbloquea habilidades completando ejercicios
- ¡Consigue el trofeo de cada mundo!

---

## 🔧 API Rápida (Desarrolladores)

### Base URL
```
https://tutoria-demo.preview.emergentagent.com/api
```

### Endpoints Principales
```bash
# Obtener usuario actual
GET /api/auth/me

# Listar hijos
GET /api/children

# Generar ejercicio
POST /api/exercises/generate?child_id=xxx&subject=matematicas

# Chat con tutor
POST /api/chat/{child_id}
Body: {"message": "tu pregunta"}

# Progreso
GET /api/progress/{child_id}
```

### Autenticación
Todas las peticiones requieren cookie `session_token` o header:
```
Authorization: Bearer {session_token}
```

---

## 📁 Archivos Importantes

| Archivo | Descripción |
|---------|-------------|
| `/app/backend/server.py` | API completa FastAPI |
| `/app/backend/.env` | Variables de entorno (API keys) |
| `/app/frontend/src/App.js` | Rutas y componente principal |
| `/app/frontend/src/pages/` | Todas las páginas |
| `/app/docs/DOCUMENTATION.md` | Documentación técnica completa |

---

## 🎨 Personalización

### Colores del Tema Niño
```css
--color-primary: #4CC9F0;    /* Cyan */
--color-secondary: #FFD60A;  /* Amarillo */
--color-accent: #F72585;     /* Rosa */
```

### Colores por Asignatura
- Matemáticas: `#4CC9F0` (Cyan)
- Lengua: `#FFD60A` (Amarillo)
- Ciencias: `#10B981` (Verde)
- Inglés: `#F72585` (Rosa)

---

## ❓ Solución de Problemas

### "No puedo iniciar sesión"
- Asegúrate de usar una cuenta de Google
- Limpia las cookies y vuelve a intentar

### "Los ejercicios no cargan"
- Verifica que el backend esté corriendo
- Comprueba la API key de Anthropic en `.env`

### "El chat no responde"
- La API de Claude puede tardar unos segundos
- Si persiste, revisa los logs del backend

---

*OttoAI - Tu tutor personal de primaria* 🎓
