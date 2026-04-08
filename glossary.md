# Glosario — OttoIA / SRS

## Proyecto OttoIA

| Termino | Definicion |
|---------|-----------|
| OttoIA | Tutor IA para primaria en Espana (1-6, LOMLOE). Nombre del producto. MVP LIVE en ottoia.systemrapid.io. |
| Claymorphism | Estilo visual infantil: bordes gruesos, sombras solidas, colores vibrantes, esquinas redondeadas. Usado en la interfaz del nino. |
| Swiss theme | Estilo visual limpio/profesional para la interfaz de padres. Inspirado en diseno suizo (tipografia clara, espaciado generoso). |
| Child theme | Tema visual para rutas /child/*. Fredoka + Varela Round, claymorphism. |
| Parent theme | Tema visual para rutas /parent/*. Outfit + Inter, dashboard profesional. |
| Semaforo | Sistema de estado por materia para padres: verde (>70% precision), amarillo (40-70%), rojo (<40%). |
| Check-in | Registro diario del nino: mood + energy (1-5) + nota opcional. Antes de empezar a practicar. |
| Adventure Map | Mapa gamificado con 4 mundos (uno por materia). Visualiza progreso del nino. |
| Skill | Habilidad especifica dentro de una materia (ej: suma_basica, ortografia_bv). 26 en total. |
| Attempt | Registro de un intento de ejercicio: respuesta, hints usados, tiempo. |
| Fallback bank | Banco de ejercicios pre-hechos (26+) y respuestas chat (18) para cuando Claude API no esta disponible. |
| Offset | Numero que se suma a los puertos base para asignar puertos unicos por proyecto. OttoIA = +130. |
| Identity Sprint | Proceso de 6 pasos para definir la identidad visual unica de un producto SRS. |

## Materias y Skills

| Materia | Color | Skills |
|---------|-------|--------|
| Matematicas | #4CC9F0 (Cyan) | suma_basica, resta_basica, suma_llevadas, resta_llevadas, multiplicacion, division, fracciones, decimales, problemas |
| Lengua | #FFD60A (Amarillo) | lectura_fluida, comprension_literal, comprension_inferencial, ortografia_bv, ortografia_hache, acentuacion, gramatica, redaccion |
| Ciencias | #10B981 (Verde) | seres_vivos, cuerpo_humano, plantas, animales, ecosistemas, materia |
| Ingles | #F72585 (Rosa) | vocabulario_basico, colores_numeros, familia, presente_simple, preguntas |

## Infraestructura SRS

| Termino | Definicion |
|---------|-----------|
| SRS | System Rapid Solutions. Empresa matriz. |
| SDD | Software Design Document. Framework documental de SRS con 8 secciones obligatorias. |
| SDD-SRS v1.2 | Version actual de la metodologia de desarrollo de SRS. |
| SA99 | Proyecto interno SRS (InfraService). Offset +0. |
| Offset de puertos | Convencion SRS para asignar puertos unicos: 3xxx (frontend), 4xxx (API), 5xxx (servicios), 6xxx (DB). |
| VPS PROD-1 | 187.77.71.102 — servidor de produccion (1 vCPU, 4GB RAM). Aloja OttoIA. |
| VPS PROD-2 | 72.62.41.234 — servidor de produccion (2 vCPU, 8GB RAM). Aloja SA99 y CRM. |
| Tailscale | VPN mesh que conecta todos los dispositivos SRS. |
| Kickoff | Proceso de arranque de proyecto SRS. 7 fases (0-7). |

## Fases de Proyecto SRS

| Fase | Nombre | Descripcion |
|------|--------|-------------|
| 0 | Discovery | Idea, validacion inicial |
| 1 | SDD | Documentacion completa del proyecto |
| 2 | MVP | Desarrollo del producto minimo viable |
| 3 | Infraestructura | Reserva de puertos, Docker, dominio |
| 4 | Testing/QA | Tests unitarios, integracion, E2E |
| 5 | Staging | Deploy en servidor de staging |
| 6 | Produccion | Deploy final en PROD |
| 7 | Iteracion | Mantenimiento y mejoras continuas |
