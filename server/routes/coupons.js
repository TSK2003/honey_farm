const express = require('express');
const router = express.Router();
const { authenticateAdmin, authenticateCustomer } = require('../middleware/auth');

// Get all coupons (admin)
router.get('/', authenticateAdmin, (req, res) => {
  try {
    const db = req.app.locals.db;
    const coupons = db.prepare('SELECT * FROM coupons ORDER BY created_at DESC').all();
    res.json(coupons);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Validate coupon (customer)
router.post('/validate', authenticateCustomer, (req, res) => {
  try {
    const { code, subtotal } = req.body;
    const db = req.app.locals.db;

    const coupon = db.prepare('SELECT * FROM coupons WHERE code = ? AND is_active = 1').get(code);
    if (!coupon) return res.status(404).json({ error: 'Invalid coupon code' });

    const now = new Date().toISOString();
    if (coupon.expiry_date && coupon.expiry_date < now) {
      return res.status(400).json({ error: 'Coupon has expired' });
    }
    if (coupon.usage_limit && coupon.used_count >= coupon.usage_limit) {
      return res.status(400).json({ error: 'Coupon usage limit reached' });
    }
    if (coupon.min_order && subtotal < coupon.min_order) {
      return res.status(400).json({ error: `Minimum order amount is ₹${coupon.min_order}` });
    }

    let discount = 0;
    if (coupon.type === 'percentage') {
      discount = (subtotal * coupon.value) / 100;
      if (coupon.max_discount && discount > coupon.max_discount) discount = coupon.max_discount;
    } else {
      discount = coupon.value;
    }

    res.json({ valid: true, discount, coupon: { code: coupon.code, type: coupon.type, value: coupon.value } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create coupon
router.post('/', authenticateAdmin, (req, res) => {
  try {
    const { code, type, value, min_order, max_discount, usage_limit, expiry_date, is_active } = req.body;
    if (!code || !value) return res.status(400).json({ error: 'Code and value are required' });

    const db = req.app.locals.db;
    const existing = db.prepare('SELECT id FROM coupons WHERE code = ?').get(code);
    if (existing) return res.status(409).json({ error: 'Coupon code already exists' });

    const result = db.prepare(`INSERT INTO coupons (code, type, value, min_order, max_discount, usage_limit, expiry_date, is_active)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`).run(
      code.toUpperCase(), type || 'percentage', value, min_order || 0, max_discount || null,
      usage_limit || null, expiry_date || null, is_active !== undefined ? is_active : 1
    );

    res.status(201).json({ id: result.lastInsertRowid, message: 'Coupon created' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update coupon
router.put('/:id', authenticateAdmin, (req, res) => {
  try {
    const { code, type, value, min_order, max_discount, usage_limit, expiry_date, is_active } = req.body;
    const db = req.app.locals.db;
    db.prepare(`UPDATE coupons SET code=?, type=?, value=?, min_order=?, max_discount=?, usage_limit=?, expiry_date=?, is_active=?, updated_at=CURRENT_TIMESTAMP WHERE id=?`)
      .run(code.toUpperCase(), type, value, min_order || 0, max_discount || null, usage_limit || null, expiry_date || null, is_active !== undefined ? is_active : 1, req.params.id);
    res.json({ message: 'Coupon updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete coupon
router.delete('/:id', authenticateAdmin, (req, res) => {
  try {
    const db = req.app.locals.db;
    db.prepare('DELETE FROM coupons WHERE id = ?').run(req.params.id);
    res.json({ message: 'Coupon deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
