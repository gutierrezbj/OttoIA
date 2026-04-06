const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { getCurrentUser } = require('../middleware/auth');

const router = express.Router();

// Record daily check-in
router.post('/:child_id', getCurrentUser, async (req, res) => {
  try {
    const { child_id } = req.params;
    const { mood, energy, note } = req.body;
    const db = req.app.locals.db;

    // Verify child belongs to user
    const child = await db.collection('children').findOne({
      child_id,
      parent_id: req.user.user_id
    });

    if (!child) {
      return res.status(404).json({ detail: 'Niño no encontrado' });
    }

    if (!mood || !energy) {
      return res.status(400).json({ detail: 'mood y energy son requeridos' });
    }

    // Create check-in record
    const checkin = {
      checkin_id: `chk_${uuidv4().toString().replace(/-/g, '').substring(0, 12)}`,
      child_id,
      mood,
      energy: parseInt(energy),
      note: note || null,
      created_at: new Date().toISOString()
    };

    await db.collection('checkins').insertOne(checkin);
    res.json(checkin);
  } catch (error) {
    console.error('Error recording check-in:', error);
    res.status(500).json({ detail: 'Error al registrar check-in' });
  }
});

// Get today's check-in
router.get('/:child_id/today', getCurrentUser, async (req, res) => {
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

    // Get today's start
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStart = today.toISOString();

    // Find today's check-in
    const checkin = await db.collection('checkins').findOne(
      {
        child_id,
        created_at: { $gte: todayStart }
      },
      { projection: { _id: 0 } }
    );

    if (checkin) {
      res.json(checkin);
    } else {
      res.json(null);
    }
  } catch (error) {
    console.error('Error fetching check-in:', error);
    res.status(500).json({ detail: 'Error al obtener check-in' });
  }
});

module.exports = router;
