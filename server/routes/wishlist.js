const express = require('express');
const router = express.Router();
const { authenticateCustomer } = require('../middleware/auth');

// Get wishlist
router.get('/', authenticateCustomer, (req, res) => {
  try {
    const db = req.app.locals.db;
    const wishlist = db.prepare('SELECT * FROM wishlists WHERE customer_id = ?').get(req.customer.id);
    if (!wishlist) {
      return res.json({ items: [] });
    }

    const items = db.prepare(`SELECT wi.*, p.name, p.slug, p.short_description,
      (SELECT url FROM product_images WHERE product_id = p.id AND is_primary = 1 LIMIT 1) as image
      FROM wishlist_items wi JOIN products p ON wi.product_id = p.id WHERE wi.wishlist_id = ? ORDER BY wi.created_at DESC`).all(wishlist.id);

    const enriched = items.map(item => {
      const variants = db.prepare('SELECT * FROM product_variants WHERE product_id = ? AND is_active = 1 ORDER BY price ASC').all(item.product_id);
      return { ...item, variants };
    });

    res.json({ items: enriched });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add to wishlist
router.post('/', authenticateCustomer, (req, res) => {
  try {
    const { product_id } = req.body;
    const db = req.app.locals.db;

    let wishlist = db.prepare('SELECT * FROM wishlists WHERE customer_id = ?').get(req.customer.id);
    if (!wishlist) {
      const result = db.prepare('INSERT INTO wishlists (customer_id) VALUES (?)').run(req.customer.id);
      wishlist = { id: result.lastInsertRowid };
    }

    const existing = db.prepare('SELECT id FROM wishlist_items WHERE wishlist_id = ? AND product_id = ?').get(wishlist.id, product_id);
    if (existing) {
      return res.json({ message: 'Already in wishlist' });
    }

    db.prepare('INSERT INTO wishlist_items (wishlist_id, product_id) VALUES (?, ?)').run(wishlist.id, product_id);
    res.status(201).json({ message: 'Added to wishlist' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Remove from wishlist
router.delete('/:productId', authenticateCustomer, (req, res) => {
  try {
    const db = req.app.locals.db;
    const wishlist = db.prepare('SELECT * FROM wishlists WHERE customer_id = ?').get(req.customer.id);
    if (wishlist) {
      db.prepare('DELETE FROM wishlist_items WHERE wishlist_id = ? AND product_id = ?').run(wishlist.id, parseInt(req.params.productId));
    }
    res.json({ message: 'Removed from wishlist' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
