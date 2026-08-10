const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { JWT_SECRET, authenticateAdmin, authenticateCustomer } = require('../middleware/auth');

// Admin Login
router.post('/admin/login', (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const db = req.app.locals.db;
    const admin = db.prepare('SELECT * FROM admins WHERE email = ? AND is_active = 1').get(email);

    if (!admin) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const valid = bcrypt.compareSync(password, admin.password);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: admin.id, email: admin.email, name: admin.name, role: 'admin' },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      admin: { id: admin.id, name: admin.name, email: admin.email, phone: admin.phone, role: admin.role }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Customer Register
router.post('/register', (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    const db = req.app.locals.db;
    const existing = db.prepare('SELECT id FROM customers WHERE email = ?').get(email);
    if (existing) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    const result = db.prepare(
      'INSERT INTO customers (name, email, password, phone) VALUES (?, ?, ?, ?)'
    ).run(name, email, hashedPassword, phone || null);

    // Create wishlist for customer
    db.prepare('INSERT INTO wishlists (customer_id) VALUES (?)').run(result.lastInsertRowid);

    const token = jwt.sign(
      { id: result.lastInsertRowid, email, name, role: 'customer' },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      token,
      customer: { id: result.lastInsertRowid, name, email, phone }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Customer Login
router.post('/login', (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const db = req.app.locals.db;
    const customer = db.prepare('SELECT * FROM customers WHERE email = ? AND is_active = 1').get(email);

    if (!customer) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const valid = bcrypt.compareSync(password, customer.password);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: customer.id, email: customer.email, name: customer.name, role: 'customer' },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      customer: { id: customer.id, name: customer.name, email: customer.email, phone: customer.phone }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get current admin
router.get('/admin/me', authenticateAdmin, (req, res) => {
  try {
    const db = req.app.locals.db;
    const admin = db.prepare('SELECT id, name, email, phone, role, avatar FROM admins WHERE id = ?').get(req.admin.id);
    res.json(admin);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get current customer
router.get('/me', authenticateCustomer, (req, res) => {
  try {
    const db = req.app.locals.db;
    const customer = db.prepare('SELECT id, name, email, phone, avatar, created_at FROM customers WHERE id = ?').get(req.customer.id);
    res.json(customer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update admin profile
router.put('/admin/profile', authenticateAdmin, (req, res) => {
  try {
    const { name, phone, currentPassword, newPassword } = req.body;
    const db = req.app.locals.db;

    if (newPassword) {
      const admin = db.prepare('SELECT password FROM admins WHERE id = ?').get(req.admin.id);
      if (!bcrypt.compareSync(currentPassword, admin.password)) {
        return res.status(400).json({ error: 'Current password is incorrect' });
      }
      const hashed = bcrypt.hashSync(newPassword, 10);
      db.prepare('UPDATE admins SET name = ?, phone = ?, password = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
        .run(name, phone, hashed, req.admin.id);
    } else {
      db.prepare('UPDATE admins SET name = ?, phone = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
        .run(name, phone, req.admin.id);
    }

    res.json({ message: 'Profile updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update customer profile
router.put('/profile', authenticateCustomer, (req, res) => {
  try {
    const { name, phone } = req.body;
    const db = req.app.locals.db;
    db.prepare('UPDATE customers SET name = ?, phone = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
      .run(name, phone, req.customer.id);
    res.json({ message: 'Profile updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
