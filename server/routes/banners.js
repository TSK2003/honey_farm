const express = require('express');
const router = express.Router();
const { authenticateAdmin } = require('../middleware/auth');

// Get active banners (public)
router.get('/', (req, res) => {
  try {
    const db = req.app.locals.db;
    const banners = db.prepare('SELECT * FROM banners WHERE is_active = 1 ORDER BY sort_order ASC').all();
    res.json(banners);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin: Get all banners
router.get('/admin/all', authenticateAdmin, (req, res) => {
  try {
    const db = req.app.locals.db;
    const banners = db.prepare('SELECT * FROM banners ORDER BY sort_order ASC').all();
    res.json(banners);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create banner
router.post('/', authenticateAdmin, (req, res) => {
  try {
    const { title, subtitle, image, cta_text, cta_link, sort_order, is_active } = req.body;
    const db = req.app.locals.db;
    const result = db.prepare('INSERT INTO banners (title, subtitle, image, cta_text, cta_link, sort_order, is_active) VALUES (?, ?, ?, ?, ?, ?, ?)')
      .run(title || '', subtitle || '', image || '', cta_text || '', cta_link || '', sort_order || 0, is_active !== undefined ? is_active : 1);
    res.status(201).json({ id: result.lastInsertRowid, message: 'Banner created' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update banner
router.put('/:id', authenticateAdmin, (req, res) => {
  try {
    const { title, subtitle, image, cta_text, cta_link, sort_order, is_active } = req.body;
    const db = req.app.locals.db;
    db.prepare('UPDATE banners SET title=?, subtitle=?, image=?, cta_text=?, cta_link=?, sort_order=?, is_active=?, updated_at=CURRENT_TIMESTAMP WHERE id=?')
      .run(title || '', subtitle || '', image || '', cta_text || '', cta_link || '', sort_order || 0, is_active !== undefined ? is_active : 1, req.params.id);
    res.json({ message: 'Banner updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete banner
router.delete('/:id', authenticateAdmin, (req, res) => {
  try {
    const db = req.app.locals.db;
    db.prepare('DELETE FROM banners WHERE id = ?').run(req.params.id);
    res.json({ message: 'Banner deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
