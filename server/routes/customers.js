const express = require('express');
const router = express.Router();
const { authenticateAdmin } = require('../middleware/auth');

// Get all customers (admin)
router.get('/', authenticateAdmin, (req, res) => {
  try {
    const db = req.app.locals.db;
    const { search, page = 1, limit = 20 } = req.query;

    let query = 'SELECT id, name, email, phone, is_active, created_at FROM customers WHERE 1=1';
    const params = [];

    if (search) {
      query += ' AND (name LIKE ? OR email LIKE ? OR phone LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    const countQ = query.replace('SELECT id, name, email, phone, is_active, created_at', 'SELECT COUNT(*) as total');
    const total = db.prepare(countQ).get(...params).total;

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), (parseInt(page) - 1) * parseInt(limit));

    const customers = db.prepare(query).all(...params);

    const enriched = customers.map(c => {
      const orderStats = db.prepare('SELECT COUNT(*) as count, COALESCE(SUM(total), 0) as total_spent FROM orders WHERE customer_id = ?').get(c.id);
      return { ...c, order_count: orderStats.count, total_spent: orderStats.total_spent };
    });

    res.json({ customers: enriched, total, page: parseInt(page), totalPages: Math.ceil(total / parseInt(limit)) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single customer (admin)
router.get('/:id', authenticateAdmin, (req, res) => {
  try {
    const db = req.app.locals.db;
    const customer = db.prepare('SELECT id, name, email, phone, is_active, created_at FROM customers WHERE id = ?').get(req.params.id);
    if (!customer) return res.status(404).json({ error: 'Customer not found' });

    const orders = db.prepare('SELECT * FROM orders WHERE customer_id = ? ORDER BY created_at DESC').all(customer.id);
    const addresses = db.prepare('SELECT * FROM addresses WHERE customer_id = ?').all(customer.id);
    const orderStats = db.prepare('SELECT COUNT(*) as count, COALESCE(SUM(total), 0) as total_spent FROM orders WHERE customer_id = ?').get(customer.id);

    res.json({ ...customer, orders, addresses, order_count: orderStats.count, total_spent: orderStats.total_spent });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
