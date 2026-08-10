const express = require('express');
const router = express.Router();
const { authenticateAdmin } = require('../middleware/auth');

// Get inventory
router.get('/', authenticateAdmin, (req, res) => {
  try {
    const db = req.app.locals.db;
    const { search, status } = req.query;

    let query = `SELECT pv.*, p.name as product_name, p.slug FROM product_variants pv
      JOIN products p ON pv.product_id = p.id WHERE pv.is_active = 1`;
    const params = [];

    if (search) {
      query += ' AND (p.name LIKE ? OR pv.sku LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }
    if (status === 'low_stock') {
      query += ' AND pv.stock <= pv.low_stock_threshold AND pv.stock > 0';
    } else if (status === 'out_of_stock') {
      query += ' AND pv.stock = 0';
    } else if (status === 'in_stock') {
      query += ' AND pv.stock > pv.low_stock_threshold';
    }

    query += ' ORDER BY p.name ASC, pv.price ASC';
    const inventory = db.prepare(query).all(...params);
    res.json(inventory);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update stock
router.put('/:variantId', authenticateAdmin, (req, res) => {
  try {
    const { stock, low_stock_threshold, adjustment, notes } = req.body;
    const db = req.app.locals.db;

    const variant = db.prepare('SELECT * FROM product_variants WHERE id = ?').get(req.params.variantId);
    if (!variant) return res.status(404).json({ error: 'Variant not found' });

    let newStock = stock !== undefined ? stock : variant.stock;
    if (adjustment) {
      newStock = variant.stock + adjustment;
      if (newStock < 0) newStock = 0;
    }

    db.prepare('UPDATE product_variants SET stock = ?, low_stock_threshold = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
      .run(newStock, low_stock_threshold !== undefined ? low_stock_threshold : variant.low_stock_threshold, req.params.variantId);

    // Record stock movement
    const diff = newStock - variant.stock;
    if (diff !== 0) {
      db.prepare(`INSERT INTO stock_movements (variant_id, product_id, type, quantity, reference_type, notes) VALUES (?, ?, ?, ?, 'manual', ?)`)
        .run(variant.id, variant.product_id, diff > 0 ? 'increase' : 'decrease', Math.abs(diff), notes || 'Manual adjustment');
    }

    res.json({ message: 'Stock updated', new_stock: newStock });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
