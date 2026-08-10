const express = require('express');
const router = express.Router();
const { authenticateAdmin, authenticateCustomer } = require('../middleware/auth');

// Get product reviews (public)
router.get('/product/:productId', (req, res) => {
  try {
    const db = req.app.locals.db;
    const reviews = db.prepare(`SELECT r.*, c.name as customer_name FROM reviews r LEFT JOIN customers c ON r.customer_id = c.id WHERE r.product_id = ? AND r.status = 'approved' ORDER BY r.created_at DESC`).all(req.params.productId);
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin: Get all reviews
router.get('/admin/all', authenticateAdmin, (req, res) => {
  try {
    const db = req.app.locals.db;
    const { status, page = 1, limit = 20 } = req.query;

    let query = `SELECT r.*, c.name as customer_name, p.name as product_name FROM reviews r LEFT JOIN customers c ON r.customer_id = c.id LEFT JOIN products p ON r.product_id = p.id WHERE 1=1`;
    const params = [];

    if (status && status !== 'all') {
      query += ` AND r.status = ?`;
      params.push(status);
    }

    const countQ = query.replace(/SELECT r\.\*.*?FROM/, 'SELECT COUNT(*) as total FROM');
    const total = db.prepare(countQ).get(...params).total;

    query += ` ORDER BY r.created_at DESC LIMIT ? OFFSET ?`;
    params.push(parseInt(limit), (parseInt(page) - 1) * parseInt(limit));

    const reviews = db.prepare(query).all(...params);
    res.json({ reviews, total, page: parseInt(page), totalPages: Math.ceil(total / parseInt(limit)) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create review (customer)
router.post('/', authenticateCustomer, (req, res) => {
  try {
    const { product_id, rating, title, comment } = req.body;
    if (!product_id || !rating) return res.status(400).json({ error: 'Product and rating are required' });

    const db = req.app.locals.db;
    const result = db.prepare('INSERT INTO reviews (product_id, customer_id, rating, title, comment, status) VALUES (?, ?, ?, ?, ?, ?)')
      .run(product_id, req.customer.id, rating, title || '', comment || '', 'pending');

    res.status(201).json({ id: result.lastInsertRowid, message: 'Review submitted for approval' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin: Update review status
router.put('/:id/status', authenticateAdmin, (req, res) => {
  try {
    const { status } = req.body;
    const db = req.app.locals.db;
    db.prepare('UPDATE reviews SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(status, req.params.id);
    res.json({ message: 'Review status updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete review
router.delete('/:id', authenticateAdmin, (req, res) => {
  try {
    const db = req.app.locals.db;
    db.prepare('DELETE FROM reviews WHERE id = ?').run(req.params.id);
    res.json({ message: 'Review deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
