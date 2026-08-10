const express = require('express');
const router = express.Router();
const { authenticateAdmin } = require('../middleware/auth');

// Get gallery images (public)
router.get('/', (req, res) => {
  try {
    const db = req.app.locals.db;
    const { category } = req.query;
    let query = 'SELECT * FROM gallery WHERE is_active = 1';
    const params = [];
    if (category && category !== 'all') {
      query += ' AND category = ?';
      params.push(category);
    }
    query += ' ORDER BY sort_order ASC, created_at DESC';
    const images = db.prepare(query).all(...params);
    res.json(images);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin: Get all gallery images
router.get('/admin/all', authenticateAdmin, (req, res) => {
  try {
    const db = req.app.locals.db;
    const images = db.prepare('SELECT * FROM gallery ORDER BY sort_order ASC, created_at DESC').all();
    res.json(images);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add gallery image
router.post('/', authenticateAdmin, (req, res) => {
  try {
    const { image, title, category, sort_order } = req.body;
    const db = req.app.locals.db;
    const result = db.prepare('INSERT INTO gallery (image, title, category, sort_order) VALUES (?, ?, ?, ?)')
      .run(image, title || '', category || 'honey', sort_order || 0);
    res.status(201).json({ id: result.lastInsertRowid, message: 'Image added' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete gallery image
router.delete('/:id', authenticateAdmin, (req, res) => {
  try {
    const db = req.app.locals.db;
    db.prepare('DELETE FROM gallery WHERE id = ?').run(req.params.id);
    res.json({ message: 'Image deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
