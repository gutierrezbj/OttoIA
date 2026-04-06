// Skills data exported as module
const SKILLS_DATA = {
  matematicas: [
    { skill_id: "mat_suma_basica", name: "Sumas básicas", description: "Sumas de números de un dígito", grade_level: 1 },
    { skill_id: "mat_resta_basica", name: "Restas básicas", description: "Restas de números de un dígito", grade_level: 1 },
    { skill_id: "mat_suma_llevadas", name: "Sumas con llevadas", description: "Sumas con llevadas de dos dígitos", grade_level: 2 },
    { skill_id: "mat_resta_llevadas", name: "Restas con llevadas", description: "Restas con llevadas", grade_level: 2 },
    { skill_id: "mat_multiplicacion", name: "Multiplicación", description: "Tablas de multiplicar", grade_level: 3 },
    { skill_id: "mat_division", name: "División", description: "División básica", grade_level: 3 },
    { skill_id: "mat_fracciones", name: "Fracciones", description: "Operaciones con fracciones", grade_level: 4 },
    { skill_id: "mat_decimales", name: "Decimales", description: "Números decimales", grade_level: 5 },
    { skill_id: "mat_problemas", name: "Problemas", description: "Resolución de problemas", grade_level: 3 },
  ],
  lengua: [
    { skill_id: "len_lectura_fluida", name: "Lectura fluida", description: "Leer con fluidez y expresión", grade_level: 1 },
    { skill_id: "len_comprension_literal", name: "Comprensión literal", description: "Entender información explícita", grade_level: 2 },
    { skill_id: "len_comprension_inferencial", name: "Comprensión inferencial", description: "Deducir información implícita", grade_level: 3 },
    { skill_id: "len_ortografia_bv", name: "Ortografía B/V", description: "Uso correcto de B y V", grade_level: 3 },
    { skill_id: "len_ortografia_hache", name: "Ortografía H", description: "Uso correcto de la H", grade_level: 3 },
    { skill_id: "len_acentuacion", name: "Acentuación", description: "Reglas de acentuación", grade_level: 4 },
    { skill_id: "len_gramatica", name: "Gramática", description: "Estructura gramatical", grade_level: 4 },
    { skill_id: "len_redaccion", name: "Redacción", description: "Escritura de textos", grade_level: 5 },
  ],
  ciencias: [
    { skill_id: "cie_seres_vivos", name: "Seres vivos", description: "Características de seres vivos", grade_level: 1 },
    { skill_id: "cie_cuerpo_humano", name: "Cuerpo humano", description: "Partes y funciones del cuerpo", grade_level: 2 },
    { skill_id: "cie_plantas", name: "Plantas", description: "Tipos y partes de plantas", grade_level: 2 },
    { skill_id: "cie_animales", name: "Animales", description: "Clasificación de animales", grade_level: 3 },
    { skill_id: "cie_ecosistemas", name: "Ecosistemas", description: "Relaciones en ecosistemas", grade_level: 4 },
    { skill_id: "cie_materia", name: "Materia", description: "Estados de la materia", grade_level: 4 },
  ],
  ingles: [
    { skill_id: "ing_vocabulario_basico", name: "Vocabulario básico", description: "Palabras comunes", grade_level: 1 },
    { skill_id: "ing_colores_numeros", name: "Colores y números", description: "Colors and numbers", grade_level: 1 },
    { skill_id: "ing_familia", name: "Familia", description: "Family members", grade_level: 2 },
    { skill_id: "ing_presente_simple", name: "Presente simple", description: "Simple present tense", grade_level: 3 },
    { skill_id: "ing_preguntas", name: "Preguntas", description: "Question formation", grade_level: 3 },
  ]
};

module.exports = SKILLS_DATA;
