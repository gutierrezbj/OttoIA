const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { getCurrentUser } = require('../middleware/auth');

const router = express.Router();

// Get all children for current parent
router.get('/', getCurrentUser, async (req, res) => {
  try {
    const db = req.app.locals.db;
    const children = await db.collection('children')
      .find({ parent_id: req.user.user_id })
      .project({ _id: 0 })
      .toArray();
    res.json(children);
  } catch (error) {
    console.error('Error fetching children:', error);
    res.status(500).json({ detail: 'Error al obtener niños' });
  }
});

// Create a new child profile
router.post('/', getCurrentUser, async (req, res) => {
  try {
    const { name, age, grade } = req.body;
    const db = req.app.locals.db;

    if (!name || !age || !grade) {
      return res.status(400).json({ detail: 'name, age, grade son requeridos' });
    }

    const child = {
      child_id: `child_${uuidv4().toString().replace(/-/g, '').substring(0, 12)}`,
      parent_id: req.user.user_id,
      name,
      age,
      grade,
      subjects: ['matematicas', 'lengua', 'ciencias', 'ingles'],
      created_at: new Date().toISOString()
    };

    await db.collection('children').insertOne(child);
    res.json(child);
  } catch (error) {
    console.error('Error creating child:', error);
    res.status(500).json({ detail: 'Error al crear perfil de niño' });
  }
});

// Get a specific child
router.get('/:child_id', getCurrentUser, async (req, res) => {
  try {
    const { child_id } = req.params;
    const db = req.app.locals.db;

    const child = await db.collection('children').findOne(
      { child_id, parent_id: req.user.user_id },
      { projection: { _id: 0 } }
    );

    if (!child) {
      return res.status(404).json({ detail: 'Niño no encontrado' });
    }

    res.json(child);
  } catch (error) {
    console.error('Error fetching child:', error);
    res.status(500).json({ detail: 'Error al obtener niño' });
  }
});

// Delete a child profile
router.delete('/:child_id', getCurrentUser, async (req, res) => {
  try {
    const { child_id } = req.params;
    const db = req.app.locals.db;

    const result = await db.collection('children').deleteOne({
      child_id,
      parent_id: req.user.user_id
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ detail: 'Niño no encontrado' });
    }

    res.json({ message: 'Perfil eliminado' });
  } catch (error) {
    console.error('Error deleting child:', error);
    res.status(500).json({ detail: 'Error al eliminar niño' });
  }
});

module.exports = router;
