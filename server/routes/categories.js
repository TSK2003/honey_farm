const express = require('express');
const router = express.Router();
const { authenticateAdmin } = require('../middleware/auth');

// Get all categories (public)
router.get('/', (req, res) => {
  try {
    const db = req.app.locals.db;
    const categories = db.prepare('SELECT * FROM categories WHERE is_active = 1 ORDER BY sort_order ASC').all();
    // Add product count
    const enriched = categories.map(cat => {
      const count = db.prepare("SELECT COUNT(*) as count FROM products WHERE category_id = ? AND status = 'active'").get(cat.id);
      return { ...cat, product_count: count.count };
    });
    res.json(enriched);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin: get all categories
router.get('/admin/all', authenticateAdmin, (req, res) => {
  try {
    const db = req.app.locals.db;
    const categories = db.prepare('SELECT * FROM categories ORDER BY sort_order ASC').all();
    const enriched = categories.map(cat => {
      const count = db.prepare('SELECT COUNT(*) as count FROM products WHERE category_id = ?').get(cat.id);
      return { ...cat, product_count: count.count };
    });
    res.json(enriched);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create category
router.post('/', authenticateAdmin, (req, res) => {
  try {
    const { name, slug, description, image, sort_order, is_active } = req.body;
    if (!name || !slug) return res.status(400).json({ error: 'Name and slug are required' });

    const db = req.app.locals.db;
    const existing = db.prepare('SELECT id FROM categories WHERE slug = ?').get(slug);
    if (existing) return res.status(409).json({ error: 'Category slug already exists' });

    const result = db.prepare('INSERT INTO categories (name, slug, description, image, sort_order, is_active) VALUES (?, ?, ?, ?, ?, ?)')
      .run(name, slug, description || '', image || '', sort_order || 0, is_active !== undefined ? is_active : 1);

    res.status(201).json({ id: result.lastInsertRowid, message: 'Category created' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update category
router.put('/:id', authenticateAdmin, (req, res) => {
  try {
    const { name, slug, description, image, sort_order, is_active } = req.body;
    const db = req.app.locals.db;
    db.prepare('UPDATE categories SET name=?, slug=?, description=?, image=?, sort_order=?, is_active=?, updated_at=CURRENT_TIMESTAMP WHERE id=?')
      .run(name, slug, description || '', image || '', sort_order || 0, is_active !== undefined ? is_active : 1, req.params.id);
    res.json({ message: 'Category updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete category
router.delete('/:id', authenticateAdmin, (req, res) => {
  try {
    const db = req.app.locals.db;
    db.prepare('UPDATE products SET category_id = NULL WHERE category_id = ?').run(req.params.id);
    db.prepare('DELETE FROM categories WHERE id = ?').run(req.params.id);
    res.json({ message: 'Category deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Reorder categories
router.put('/reorder/batch', authenticateAdmin, (req, res) => {
  try {
    const { items } = req.body;
    const db = req.app.locals.db;
    const update = db.prepare('UPDATE categories SET sort_order = ? WHERE id = ?');
    const transaction = db.transaction((items) => {
      items.forEach(item => update.run(item.sort_order, item.id));
    });
    transaction(items);
    res.json({ message: 'Categories reordered' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
