# OttoIA Design System

Extraido del MVP (React 19 + FastAPI + MongoDB) - repo `gutierrezbj/OttoAI`.

---

## Filosofia: Dual-World Interface

Dos mundos visuales segun el tipo de usuario:

| Aspecto | Child Theme | Parent Theme |
|---------|------------|--------------|
| Estilo | Claymorphism (cartoon, tactil) | Clean Swiss (profesional, datos) |
| Borders | 4px solid black | 1px solid slate-200 |
| Radius | 24px (cards), pill (buttons) | 8px (lg), 6px (md) |
| Shadows | Offset solido (4-6px) | Subtle (shadow-sm) |
| Hover | translate + remove shadow | bg-slate-50 transition |

---

## Paleta de Colores

### Child Theme
| Token | Hex | Uso |
|-------|-----|-----|
| `child-bg` | `#FFFDF5` | Background principal (warm cream) |
| `child-primary` | `#4CC9F0` | CTA principal, tutor, matematicas |
| `child-secondary` | `#FFD60A` | Lengua, botones secundarios, streak |
| `child-accent` | `#F72585` | Ingles, botones accent |
| `child-success` | `#10B981` | Ciencias, respuestas correctas |
| `child-text-main` | `#2B2D42` | Texto principal (dark navy) |
| `child-text-muted` | `#8D99AE` | Texto secundario (steel gray) |
| `child-border` | `#2B2D42` | Bordes claymorphism (= black) |

### Parent Theme
| Token | Hex | Uso |
|-------|-----|-----|
| `parent-bg` | `#F8FAFC` | Background (cool slate) |
| `parent-primary` | `#0F172A` | Texto principal, headers |
| `parent-secondary` | `#334155` | Texto secundario |
| `parent-accent` | `#3B82F6` | Iconos, links, CTAs |
| `parent-success` | `#10B981` | Semaforo verde |
| `parent-warning` | `#F59E0B` | Semaforo amarillo |
| `parent-error` | `#EF4444` | Semaforo rojo |
| `parent-text-muted` | `#64748B` | Texto terciario |
| `parent-border` | `#E2E8F0` | Bordes, separadores |

### Subject Colors (compartidos)
| Materia | Color | Icono |
|---------|-------|-------|
| Matematicas | `#4CC9F0` | ➕ |
| Lengua | `#FFD60A` | 📖 |
| Ciencias | `#10B981` | 🔬 |
| Ingles | `#F72585` | 🌍 |

---

## Tipografia

| Contexto | Fuente | Pesos | Uso |
|----------|--------|-------|-----|
| Child headings | Fredoka | 600, 700 | Titulos, nombres de mundos |
| Child body | Varela Round | 400 | Instrucciones, chat, feedback |
| Parent headings | Outfit | 500, 600 | Dashboard headers, reportes |
| Parent body | Inter | 400, 500 | Tablas, settings, texto largo |

Google Fonts import:
```
https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&family=Varela+Round&family=Outfit:wght@400;500;600&family=Inter:wght@400;500&display=swap
```

---

## Gradientes

### Adventure Map
- **Background principal:** `bg-gradient-to-b from-indigo-900 via-purple-900 to-indigo-900`
- **CTA en ChildDashboard:** `bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500`

### World Gradients (fondo al entrar en cada mundo)
| Mundo | Gradient |
|-------|----------|
| Matematicas | `from-cyan-400 to-blue-500` |
| Lengua | `from-yellow-400 to-orange-500` |
| Ciencias | `from-emerald-400 to-teal-500` |
| Ingles | `from-pink-400 to-purple-500` |

### Otros
- **Landing:** `linear-gradient(135deg, #FFFDF5 0%, #FEF3C7 100%)`
- **Streak badge:** `linear-gradient(135deg, #FFD60A, #F59E0B)`
- **Avatar parent:** `bg-gradient-to-br from-blue-500 to-purple-500`

---

## Componentes Clave

### card-clay (Child)
```css
background: #fff;
border: 4px solid #000;
border-radius: 24px;
padding: 24px;
box-shadow: 6px 6px 0px 0px rgba(0,0,0,0.1);
```

### btn-clay (Child Primary)
```css
background: #4CC9F0;
color: #000;
border: 4px solid #000;
border-radius: 9999px;
padding: 16px 32px;
font-weight: 700;
box-shadow: 4px 4px 0px 0px rgba(0,0,0,1);
/* hover: translate(2px, 2px) + shadow: none */
```

### Chat Bubbles
- **User:** bg `#4CC9F0`, border 3px black, radius `20px 20px 4px 20px`
- **Assistant:** bg white, border 3px black, radius `20px 20px 20px 4px`

### Progress Bar (Child)
```css
/* Track */
background: #E5E7EB;
border: 3px solid #000;
border-radius: 9999px;
height: 16px;
/* Fill: color varies by subject, radius 9999px */
```

### Streak Badge
```css
background: linear-gradient(135deg, #FFD60A, #F59E0B);
border: 3px solid #000;
border-radius: 12px;
padding: 8px 16px;
font-weight: 700;
```

---

## Animaciones

| Nombre | Duracion | Uso |
|--------|----------|-----|
| `bounce-in` | 0.5s ease | Entrada de modales, resultados |
| `fade-in` | 0.3s ease | Mensajes chat, cards |
| `pulse-glow` | 2s infinite | Elementos interactivos destacados |

---

## Reglas de Accesibilidad

- Contraste: texto sobre fondo de color siempre `#000000` o `#FFFFFF` segun APCA
- Touch targets: minimo 48px para elementos interactivos (child)
- Texto minimo: 16px body en child view
- Todos los botones e inputs llevan `data-testid`

---

## Estructura de Rutas

| Ruta | Pagina | Theme |
|------|--------|-------|
| `/` | Landing | child-theme |
| `/auth/callback` | AuthCallback | - |
| `/parent` | ParentDashboard | parent-theme |
| `/parent/setup` | ChildSetup | parent-theme |
| `/parent/report/:childId` | WeeklyReport | parent-theme |
| `/child/:childId` | ChildDashboard | child-theme |
| `/child/:childId/tutor` | TutorChat | child-theme |
| `/child/:childId/practice` | Practice | child-theme |
| `/child/:childId/practice/:subject` | Practice | child-theme |
| `/child/:childId/map` | AdventureMap | child-theme |

---

## Librerias UI

- Tailwind CSS + `tailwindcss-animate`
- Shadcn/ui (Button, Card, Input, Progress, Sonner toasts)
- Lucide React (iconos, `stroke-width={3}` en child)
- Recharts (graficas en parent dashboard)

---

## Archivos del Design System

| Archivo | Proposito |
|---------|-----------|
| `tailwind.config.ottoia.js` | Configuracion Tailwind con todos los tokens |
| `ottoia-base.css` | Clases CSS custom (claymorphism, bubbles, etc.) |
| `DESIGN-SYSTEM.md` | Este documento de referencia |
