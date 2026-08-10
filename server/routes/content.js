const express = require('express');
const router = express.Router();
const { authenticateAdmin } = require('../middleware/auth');

// Get website content (public)
router.get('/', (req, res) => {
  try {
    const db = req.app.locals.db;
    const content = db.prepare('SELECT * FROM website_content WHERE is_active = 1').all();
    const map = {};
    content.forEach(c => { map[c.section_key] = c; });
    res.json(map);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get farm content (public)
router.get('/farm', (req, res) => {
  try {
    const db = req.app.locals.db;
    const content = db.prepare('SELECT * FROM farm_content WHERE is_active = 1 ORDER BY sort_order ASC').all();
    res.json(content);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin: Get all website content
router.get('/admin/all', authenticateAdmin, (req, res) => {
  try {
    const db = req.app.locals.db;
    const content = db.prepare('SELECT * FROM website_content ORDER BY section_key ASC').all();
    res.json(content);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin: Update website content
router.put('/:key', authenticateAdmin, (req, res) => {
  try {
    const { title, subtitle, description, image, cta_text, cta_link, extra_data } = req.body;
    const db = req.app.locals.db;

    const existing = db.prepare('SELECT id FROM website_content WHERE section_key = ?').get(req.params.key);
    if (existing) {
      db.prepare('UPDATE website_content SET title=?, subtitle=?, description=?, image=?, cta_text=?, cta_link=?, extra_data=?, updated_at=CURRENT_TIMESTAMP WHERE section_key=?')
        .run(title || '', subtitle || '', description || '', image || '', cta_text || '', cta_link || '', extra_data || '', req.params.key);
    } else {
      db.prepare('INSERT INTO website_content (section_key, title, subtitle, description, image, cta_text, cta_link, extra_data) VALUES (?, ?, ?, ?, ?, ?, ?, ?)')
        .run(req.params.key, title || '', subtitle || '', description || '', image || '', cta_text || '', cta_link || '', extra_data || '');
    }

    res.json({ message: 'Content updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin: Get all farm content
router.get('/farm/admin/all', authenticateAdmin, (req, res) => {
  try {
    const db = req.app.locals.db;
    const content = db.prepare('SELECT * FROM farm_content ORDER BY sort_order ASC').all();
    res.json(content);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin: Update farm content
router.put('/farm/:id', authenticateAdmin, (req, res) => {
  try {
    const { heading, description, image, cta_text, cta_link, section, sort_order } = req.body;
    const db = req.app.locals.db;
    db.prepare('UPDATE farm_content SET heading=?, description=?, image=?, cta_text=?, cta_link=?, section=?, sort_order=?, updated_at=CURRENT_TIMESTAMP WHERE id=?')
      .run(heading || '', description || '', image || '', cta_text || '', cta_link || '', section || 'main', sort_order || 0, req.params.id);
    res.json({ message: 'Farm content updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
