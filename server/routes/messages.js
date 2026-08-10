const express = require('express');
const router = express.Router();
const { authenticateAdmin } = require('../middleware/auth');

// Submit contact message (public)
router.post('/', (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;
    if (!name || !message) return res.status(400).json({ error: 'Name and message are required' });

    const db = req.app.locals.db;
    const result = db.prepare('INSERT INTO contact_messages (name, email, phone, subject, message) VALUES (?, ?, ?, ?, ?)')
      .run(name, email || '', phone || '', subject || '', message);

    res.status(201).json({ id: result.lastInsertRowid, message: 'Message sent successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin: Get all messages
router.get('/', authenticateAdmin, (req, res) => {
  try {
    const db = req.app.locals.db;
    const { status, page = 1, limit = 20 } = req.query;

    let query = 'SELECT * FROM contact_messages WHERE 1=1';
    const params = [];
    if (status && status !== 'all') {
      query += ' AND status = ?';
      params.push(status);
    }

    const countQ = query.replace('SELECT *', 'SELECT COUNT(*) as total');
    const total = db.prepare(countQ).get(...params).total;

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), (parseInt(page) - 1) * parseInt(limit));

    const messages = db.prepare(query).all(...params);
    res.json({ messages, total, page: parseInt(page), totalPages: Math.ceil(total / parseInt(limit)) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin: Update message status
router.put('/:id', authenticateAdmin, (req, res) => {
  try {
    const { status, admin_notes } = req.body;
    const db = req.app.locals.db;
    db.prepare('UPDATE contact_messages SET status=?, admin_notes=?, updated_at=CURRENT_TIMESTAMP WHERE id=?')
      .run(status, admin_notes || '', req.params.id);
    res.json({ message: 'Message updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
