const express = require('express');
const router = express.Router();
const { authenticateAdmin } = require('../middleware/auth');

// Get settings (public - limited)
router.get('/public', (req, res) => {
  try {
    const db = req.app.locals.db;
    const settings = db.prepare("SELECT * FROM settings WHERE setting_group IN ('business', 'ecommerce', 'shipping', 'payment', 'general')").all();
    const map = {};
    settings.forEach(s => { map[s.setting_key] = s.setting_value; });
    res.json(map);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all settings (admin)
router.get('/', authenticateAdmin, (req, res) => {
  try {
    const db = req.app.locals.db;
    const { group } = req.query;
    let query = 'SELECT * FROM settings';
    const params = [];
    if (group) {
      query += ' WHERE setting_group = ?';
      params.push(group);
    }
    query += ' ORDER BY setting_group, setting_key';
    const settings = db.prepare(query).all(...params);
    res.json(settings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update settings (admin)
router.put('/', authenticateAdmin, (req, res) => {
  try {
    const { settings } = req.body;
    const db = req.app.locals.db;

    const upsert = db.prepare(`INSERT INTO settings (setting_key, setting_value, setting_group) VALUES (?, ?, ?)
      ON CONFLICT(setting_key) DO UPDATE SET setting_value = ?, updated_at = CURRENT_TIMESTAMP`);

    const transaction = db.transaction((items) => {
      items.forEach(item => {
        upsert.run(item.key, item.value, item.group || 'general', item.value);
      });
    });

    transaction(settings);
    res.json({ message: 'Settings updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
