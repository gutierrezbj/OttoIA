const express = require('express');
const { getCurrentUser } = require('../middleware/auth');
const SKILLS_DATA = require('../data/skills');

const router = express.Router();

// Get weekly report for parents
router.get('/:child_id/weekly', getCurrentUser, async (req, res) => {
  try {
    const { child_id } = req.params;
    const db = req.app.locals.db;

    // Verify child belongs to user
    const child = await db.collection('children').findOne({
      child_id,
      parent_id: req.user.user_id
    });

    if (!child) {
      return res.status(404).json({ detail: 'Niño no encontrado' });
    }

    // Get data for the past week
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

    // Get attempts
    const attempts = await db.collection('attempts')
      .find({
        child_id,
        created_at: { $gte: weekAgo }
      })
      .project({ _id: 0 })
      .toArray();

    // Get check-ins
    const checkins = await db.collection('checkins')
      .find({
        child_id,
        created_at: { $gte: weekAgo }
      })
      .project({ _id: 0 })
      .toArray();

    // Calculate stats by subject
    const subjectStats = {};
    for (const subject of Object.keys(SKILLS_DATA)) {
      const subjectAttempts = attempts.filter(a => a.subject === subject);
      const correct = subjectAttempts.filter(a => a.is_correct).length;
      const total = subjectAttempts.length;
      const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;

      subjectStats[subject] = {
        total,
        correct,
        accuracy,
        status: accuracy >= 70 ? 'green' : (accuracy >= 50 ? 'yellow' : 'red')
      };
    }

    // Get skill progress
    const skillProgress = await db.collection('skill_progress')
      .find({ child_id })
      .project({ _id: 0 })
      .toArray();

    // Get skills that need improvement
    const skillsToImprove = [];
    for (const progress of skillProgress) {
      if (progress.total_attempts > 0) {
        const accuracy = (progress.correct_attempts / progress.total_attempts) * 100;
        if (accuracy < 70) {
          // Find skill name
          for (const [subject, skills] of Object.entries(SKILLS_DATA)) {
            const skill = skills.find(s => s.skill_id === progress.skill_id);
            if (skill) {
              skillsToImprove.push({
                skill_id: progress.skill_id,
                name: skill.name,
                subject,
                accuracy: Math.round(accuracy)
              });
              break;
            }
          }
        }
      }
    }

    skillsToImprove.sort((a, b) => a.accuracy - b.accuracy);

    // Generate recommendation
    const totalCorrect = Object.values(subjectStats).reduce((sum, s) => sum + s.correct, 0);
    const totalAttempts = Object.values(subjectStats).reduce((sum, s) => sum + s.total, 0);

    let recommendation;
    if (totalAttempts === 0) {
      recommendation = `${child.name} no ha practicado esta semana. Te recomendamos empezar con sesiones cortas de 5-10 minutos.`;
    } else if (totalCorrect / totalAttempts >= 0.7) {
      recommendation = `¡${child.name} lo está haciendo muy bien! Mantened el ritmo con sesiones de 10 minutos.`;
    } else {
      const weakSubject = Object.entries(subjectStats)
        .filter(([_, s]) => s.total > 0)
        .sort((a, b) => a[1].accuracy - b[1].accuracy)[0];
      const subject = weakSubject ? weakSubject[0] : 'matemáticas';
      recommendation = `Recomendamos practicar más ${subject} con 3 sesiones cortas de 8 minutos esta semana.`;
    }

    // Calculate mood average
    const avgEnergy = checkins.length > 0
      ? checkins.reduce((sum, c) => sum + c.energy, 0) / checkins.length
      : 0;
    const moodSummary = avgEnergy >= 3.5 ? 'positivo' : (avgEnergy >= 2.5 ? 'neutral' : 'bajo');

    res.json({
      child,
      period: {
        start: weekAgo,
        end: new Date().toISOString()
      },
      summary: {
        total_exercises: totalAttempts,
        correct_exercises: totalCorrect,
        accuracy: totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0,
        practice_days: new Set(attempts.map(a => a.created_at.substring(0, 10))).size
      },
      subjects: subjectStats,
      skills_to_improve: skillsToImprove.slice(0, 3),
      recommendation,
      mood_summary: moodSummary,
      checkins
    });
  } catch (error) {
    console.error('Error fetching weekly report:', error);
    res.status(500).json({ detail: 'Error al obtener reporte semanal' });
  }
});

module.exports = router;
