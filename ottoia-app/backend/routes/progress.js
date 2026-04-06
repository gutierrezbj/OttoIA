const express = require('express');
const { getCurrentUser } = require('../middleware/auth');
const SKILLS_DATA = require('../data/skills');

const router = express.Router();

// Get progress summary for a child
router.get('/:child_id', getCurrentUser, async (req, res) => {
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

    // Get skill progress
    const skillProgress = await db.collection('skill_progress')
      .find({ child_id })
      .project({ _id: 0 })
      .toArray();

    // Calculate subject summaries
    const subjects = {};

    for (const [subject, skills] of Object.entries(SKILLS_DATA)) {
      const subjectSkills = [];
      let totalCorrect = 0;
      let totalAttempts = 0;

      for (const skill of skills) {
        if (skill.grade_level > child.grade) {
          continue;
        }

        const progress = skillProgress.find(p => p.skill_id === skill.skill_id);
        let skillData;

        if (progress) {
          const accuracy = progress.total_attempts > 0
            ? Math.round((progress.correct_attempts / progress.total_attempts) * 100)
            : 0;
          skillData = {
            ...skill,
            accuracy,
            attempts: progress.total_attempts,
            needs_practice: accuracy < 70
          };
          totalCorrect += progress.correct_attempts;
          totalAttempts += progress.total_attempts;
        } else {
          skillData = {
            ...skill,
            accuracy: 0,
            attempts: 0,
            needs_practice: true
          };
        }

        subjectSkills.push(skillData);
      }

      const overallAccuracy = totalAttempts > 0
        ? Math.round((totalCorrect / totalAttempts) * 100)
        : 0;
      const status = overallAccuracy >= 70 ? 'green' : (overallAccuracy >= 50 ? 'yellow' : 'red');

      subjects[subject] = {
        name: subject.charAt(0).toUpperCase() + subject.slice(1),
        status,
        accuracy: overallAccuracy,
        total_attempts: totalAttempts,
        skills: subjectSkills,
        skills_to_practice: subjectSkills.filter(s => s.needs_practice).slice(0, 3)
      };
    }

    // Get recent attempts for streak calculation
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const recentAttempts = await db.collection('attempts')
      .find({
        child_id,
        created_at: { $gte: weekAgo }
      })
      .project({ _id: 0 })
      .toArray();

    // Calculate streak
    const practiceDays = new Set();
    for (const attempt of recentAttempts) {
      const date = attempt.created_at.substring(0, 10);
      practiceDays.add(date);
    }

    res.json({
      child,
      subjects,
      weekly_stats: {
        total_exercises: recentAttempts.length,
        correct_exercises: recentAttempts.filter(a => a.is_correct).length,
        practice_days: practiceDays.size,
        streak: practiceDays.size
      }
    });
  } catch (error) {
    console.error('Error fetching progress:', error);
    res.status(500).json({ detail: 'Error al obtener progreso' });
  }
});

module.exports = router;
