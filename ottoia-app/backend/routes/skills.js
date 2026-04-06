const express = require('express');
const SKILLS_DATA = require('../data/skills');

const router = express.Router();

// Get available skills, optionally filtered
router.get('/', (req, res) => {
  try {
    const { subject, grade } = req.query;
    let skills = [];

    if (subject && SKILLS_DATA[subject]) {
      skills = SKILLS_DATA[subject];
    } else {
      // Return all skills from all subjects
      Object.values(SKILLS_DATA).forEach(subjectSkills => {
        skills = skills.concat(subjectSkills);
      });
    }

    // Filter by grade if provided
    if (grade) {
      const gradeLevel = parseInt(grade, 10);
      skills = skills.filter(s => s.grade_level <= gradeLevel);
    }

    res.json(skills);
  } catch (error) {
    console.error('Error fetching skills:', error);
    res.status(500).json({ detail: 'Error al obtener habilidades' });
  }
});

module.exports = router;
