const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { generate } = require('../lib/gemini');
const { getCurrentUser } = require('../middleware/auth');
const SKILLS_DATA = require('../data/skills');
const EXERCISE_BANK = require('../data/exercises');

const router = express.Router();

// Helper function to get fallback exercise
function getFallbackExercise(subject, skillInfo, childId) {
  const exercises = EXERCISE_BANK[subject] || EXERCISE_BANK.matematicas;
  const randomExercise = exercises[Math.floor(Math.random() * exercises.length)];

  return {
    exercise_id: `ex_${uuidv4().toString().replace(/-/g, '').substring(0, 12)}`,
    child_id: childId,
    subject,
    skill_ids: [skillInfo.skill_id],
    question: randomExercise.question,
    correct_answer: randomExercise.correct_answer,
    options: randomExercise.options,
    hints: randomExercise.hints,
    difficulty: 1,
    created_at: new Date().toISOString()
  };
}

// Generate an exercise using Claude API
router.post('/generate', getCurrentUser, async (req, res) => {
  try {
    const { child_id, subject, skill_id } = req.body;
    const db = req.app.locals.db;

    // Verify child belongs to user
    const child = await db.collection('children').findOne({
      child_id,
      parent_id: req.user.user_id
    });

    if (!child) {
      return res.status(404).json({ detail: 'Niño no encontrado' });
    }

    // Get skill info
    let skillInfo = null;
    if (skill_id && SKILLS_DATA[subject]) {
      skillInfo = SKILLS_DATA[subject].find(s => s.skill_id === skill_id);
    }

    // If no skill specified or not found, pick random skill for grade
    if (!skillInfo) {
      const gradeSkills = (SKILLS_DATA[subject] || []).filter(s => s.grade_level <= child.grade);
      if (gradeSkills.length > 0) {
        skillInfo = gradeSkills[Math.floor(Math.random() * gradeSkills.length)];
      }
    }

    if (!skillInfo) {
      return res.status(400).json({ detail: 'No hay habilidades disponibles' });
    }

    // Try to generate with Claude
    try {
      const prompt = `Genera un ejercicio de ${subject} para un niño de ${child.age} años en ${child.grade}º de primaria.
Habilidad: ${skillInfo.name} - ${skillInfo.description}

Responde SOLO con un JSON válido con esta estructura exacta:
{
    "question": "pregunta del ejercicio",
    "correct_answer": "respuesta correcta",
    "options": ["opción1", "opción2", "opción3", "opción4"],
    "hint1": "pista suave",
    "hint2": "pista más directa"
}

El ejercicio debe ser apropiado para la edad y nivel. Las opciones deben incluir la respuesta correcta.`;

      let content = await generate({
        system: 'Eres un tutor de primaria experto. Genera ejercicios educativos en español de España. Responde SOLO con JSON válido, sin explicaciones adicionales ni markdown.',
        messages: [{ role: 'user', content: prompt }],
        maxTokens: 500,
        temperature: 0.6
      });

      // Clean up JSON if wrapped in markdown
      if (content.includes('```json')) {
        content = content.split('```json')[1].split('```')[0];
      } else if (content.includes('```')) {
        content = content.split('```')[1].split('```')[0];
      }

      const exerciseData = JSON.parse(content.trim());

      const exercise = {
        exercise_id: `ex_${uuidv4().toString().replace(/-/g, '').substring(0, 12)}`,
        child_id,
        subject,
        skill_ids: [skillInfo.skill_id],
        question: exerciseData.question,
        correct_answer: exerciseData.correct_answer,
        options: exerciseData.options || [],
        hints: [exerciseData.hint1 || '', exerciseData.hint2 || ''],
        difficulty: 1,
        created_at: new Date().toISOString()
      };

      await db.collection('exercises').insertOne(exercise);
      res.json(exercise);
    } catch (aiError) {
      console.error('Gemini API error:', aiError);
      // Fallback to exercise bank
      const fallback = getFallbackExercise(subject, skillInfo, child_id);
      await db.collection('exercises').insertOne(fallback);
      res.json(fallback);
    }
  } catch (error) {
    console.error('Error generating exercise:', error);
    res.status(500).json({ detail: 'Error al generar ejercicio' });
  }
});

module.exports = router;
