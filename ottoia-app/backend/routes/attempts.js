const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { getCurrentUser } = require('../middleware/auth');

const router = express.Router();

// Record an attempt at an exercise
router.post('/', getCurrentUser, async (req, res) => {
  try {
    const { exercise_id, answer_given, hints_used = 0, time_seconds } = req.body;
    const db = req.app.locals.db;

    // Find exercise
    const exercise = await db.collection('exercises').findOne({ exercise_id });
    if (!exercise) {
      return res.status(404).json({ detail: 'Ejercicio no encontrado' });
    }

    // Verify child belongs to user
    const child = await db.collection('children').findOne({
      child_id: exercise.child_id,
      parent_id: req.user.user_id
    });

    if (!child) {
      return res.status(403).json({ detail: 'No autorizado' });
    }

    // Check if answer is correct (case-insensitive, trimmed)
    const isCorrect = answer_given.trim().toLowerCase() === exercise.correct_answer.trim().toLowerCase();

    // Create attempt record
    const attempt = {
      attempt_id: `att_${uuidv4().toString().replace(/-/g, '').substring(0, 12)}`,
      child_id: exercise.child_id,
      exercise_id,
      skill_ids: exercise.skill_ids,
      subject: exercise.subject,
      is_correct: isCorrect,
      answer_given,
      hints_used: hints_used || 0,
      time_seconds: time_seconds || null,
      created_at: new Date().toISOString()
    };

    await db.collection('attempts').insertOne(attempt);

    // Update skill progress for each skill in the exercise
    for (const skillId of exercise.skill_ids) {
      await db.collection('skill_progress').updateOne(
        { child_id: exercise.child_id, skill_id: skillId },
        {
          $inc: {
            total_attempts: 1,
            correct_attempts: isCorrect ? 1 : 0,
            hints_total: hints_used || 0
          },
          $set: {
            updated_at: new Date().toISOString()
          }
        },
        { upsert: true }
      );
    }

    res.json({
      is_correct: isCorrect,
      correct_answer: isCorrect ? null : exercise.correct_answer,
      message: isCorrect ? '¡Muy bien! 🎉' : 'No pasa nada, ¡inténtalo de nuevo!'
    });
  } catch (error) {
    console.error('Error recording attempt:', error);
    res.status(500).json({ detail: 'Error al registrar intento' });
  }
});

module.exports = router;
