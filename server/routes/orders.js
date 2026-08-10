const express = require('express');
const router = express.Router();
const { authenticateAdmin, authenticateCustomer } = require('../middleware/auth');

// Generate order number
function generateOrderNumber(db) {
  const year = new Date().getFullYear();
  const lastOrder = db.prepare("SELECT order_number FROM orders WHERE order_number LIKE ? ORDER BY id DESC LIMIT 1").get(`KHF-${year}-%`);
  let seq = 1;
  if (lastOrder) {
    const parts = lastOrder.order_number.split('-');
    seq = parseInt(parts[2]) + 1;
  }
  return `KHF-${year}-${String(seq).padStart(5, '0')}`;
}

// Create order (customer)
router.post('/', authenticateCustomer, (req, res) => {
  try {
    const db = req.app.locals.db;
    const { items, shipping, coupon_code, notes } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'No items in order' });
    }
    if (!shipping || !shipping.name || !shipping.phone || !shipping.address_line || !shipping.city || !shipping.pincode) {
      return res.status(400).json({ error: 'Shipping details are required' });
    }

    const createOrder = db.transaction(() => {
      // Validate stock and calculate totals
      let subtotal = 0;
      const validatedItems = [];

      for (const item of items) {
        const variant = db.prepare('SELECT pv.*, p.name as product_name FROM product_variants pv JOIN products p ON pv.product_id = p.id WHERE pv.id = ?').get(item.variant_id);
        if (!variant) {
          throw new Error(`Variant not found: ${item.variant_id}`);
        }
        if (variant.stock < item.quantity) {
          throw new Error(`Insufficient stock for ${variant.product_name} (${variant.weight}). Available: ${variant.stock}`);
        }
        const itemTotal = variant.price * item.quantity;
        subtotal += itemTotal;
        validatedItems.push({ ...item, variant, itemTotal });
      }

      // Get shipping settings
      const shippingCharge = parseFloat(db.prepare("SELECT setting_value FROM settings WHERE setting_key = 'shipping_charge'").get()?.setting_value || '50');
      const freeThreshold = parseFloat(db.prepare("SELECT setting_value FROM settings WHERE setting_key = 'free_shipping_threshold'").get()?.setting_value || '500');
      const actualShipping = subtotal >= freeThreshold ? 0 : shippingCharge;

      // Apply coupon
      let discount = 0;
      let appliedCoupon = null;
      if (coupon_code) {
        const coupon = db.prepare("SELECT * FROM coupons WHERE code = ? AND is_active = 1").get(coupon_code);
        if (coupon) {
          const now = new Date().toISOString();
          if (coupon.expiry_date && coupon.expiry_date < now) {
            throw new Error('Coupon has expired');
          }
          if (coupon.usage_limit && coupon.used_count >= coupon.usage_limit) {
            throw new Error('Coupon usage limit reached');
          }
          if (coupon.min_order && subtotal < coupon.min_order) {
            throw new Error(`Minimum order amount for this coupon is ₹${coupon.min_order}`);
          }

          if (coupon.type === 'percentage') {
            discount = (subtotal * coupon.value) / 100;
            if (coupon.max_discount && discount > coupon.max_discount) {
              discount = coupon.max_discount;
            }
          } else {
            discount = coupon.value;
          }
          appliedCoupon = coupon;
        }
      }

      const total = subtotal + actualShipping - discount;
      const orderNumber = generateOrderNumber(db);

      // Save address
      const addrResult = db.prepare(`INSERT INTO addresses (customer_id, name, phone, address_line, city, district, state, pincode)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`).run(
        req.customer.id, shipping.name, shipping.phone, shipping.address_line, shipping.city,
        shipping.district || '', shipping.state || 'Tamil Nadu', shipping.pincode
      );

      // Create order
      const orderResult = db.prepare(`INSERT INTO orders (order_number, customer_id, address_id, shipping_name, shipping_phone, shipping_address, shipping_city, shipping_district, shipping_state, shipping_pincode, subtotal, shipping_charge, discount, coupon_code, total, payment_method, payment_status, order_status, notes)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`).run(
        orderNumber, req.customer.id, addrResult.lastInsertRowid,
        shipping.name, shipping.phone, shipping.address_line, shipping.city,
        shipping.district || '', shipping.state || 'Tamil Nadu', shipping.pincode,
        subtotal, actualShipping, discount, coupon_code || null, total,
        'COD', 'pending', 'pending', notes || null
      );

      const orderId = orderResult.lastInsertRowid;

      // Create order items and reduce stock
      for (const item of validatedItems) {
        db.prepare(`INSERT INTO order_items (order_id, product_id, variant_id, product_name, variant_weight, price, quantity, total)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)`).run(
          orderId, item.variant.product_id, item.variant_id, item.variant.product_name,
          item.variant.weight, item.variant.price, item.quantity, item.itemTotal
        );

        // Reduce stock
        db.prepare('UPDATE product_variants SET stock = stock - ? WHERE id = ?').run(item.quantity, item.variant_id);

        // Record stock movement
        db.prepare(`INSERT INTO stock_movements (variant_id, product_id, type, quantity, reference_type, reference_id, notes)
          VALUES (?, ?, 'decrease', ?, 'order', ?, 'Order placed')`).run(
          item.variant_id, item.variant.product_id, item.quantity, orderId
        );
      }

      // Update coupon usage
      if (appliedCoupon) {
        db.prepare('UPDATE coupons SET used_count = used_count + 1 WHERE id = ?').run(appliedCoupon.id);
        db.prepare('INSERT INTO coupon_usage (coupon_id, customer_id, order_id) VALUES (?, ?, ?)').run(appliedCoupon.id, req.customer.id, orderId);
      }

      return { orderId, orderNumber, total };
    });

    const result = createOrder();
    res.status(201).json({ message: 'Order placed successfully', order_id: result.orderId, order_number: result.orderNumber, total: result.total });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get customer orders
router.get('/my-orders', authenticateCustomer, (req, res) => {
  try {
    const db = req.app.locals.db;
    const orders = db.prepare('SELECT * FROM orders WHERE customer_id = ? ORDER BY created_at DESC').all(req.customer.id);

    const enriched = orders.map(order => {
      const items = db.prepare('SELECT * FROM order_items WHERE order_id = ?').all(order.id);
      return { ...order, items };
    });

    res.json(enriched);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single order (customer)
router.get('/my-orders/:id', authenticateCustomer, (req, res) => {
  try {
    const db = req.app.locals.db;
    const order = db.prepare('SELECT * FROM orders WHERE id = ? AND customer_id = ?').get(req.params.id, req.customer.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });

    const items = db.prepare(`SELECT oi.*, pi.url as image FROM order_items oi LEFT JOIN product_images pi ON oi.product_id = pi.product_id AND pi.is_primary = 1 WHERE oi.order_id = ?`).all(order.id);
    res.json({ ...order, items });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin: Get all orders
router.get('/admin/all', authenticateAdmin, (req, res) => {
  try {
    const db = req.app.locals.db;
    const { status, search, page = 1, limit = 20 } = req.query;

    let query = `SELECT o.*, c.name as customer_name, c.email as customer_email FROM orders o LEFT JOIN customers c ON o.customer_id = c.id WHERE 1=1`;
    const params = [];

    if (status && status !== 'all') {
      query += ` AND o.order_status = ?`;
      params.push(status);
    }
    if (search) {
      query += ` AND (o.order_number LIKE ? OR c.name LIKE ? OR o.shipping_phone LIKE ?)`;
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    const countQ = query.replace(/SELECT o\.\*, c\.name.*?FROM/, 'SELECT COUNT(*) as total FROM');
    const total = db.prepare(countQ).get(...params).total;

    query += ` ORDER BY o.created_at DESC LIMIT ? OFFSET ?`;
    params.push(parseInt(limit), (parseInt(page) - 1) * parseInt(limit));

    const orders = db.prepare(query).all(...params);

    const enriched = orders.map(order => {
      const items = db.prepare('SELECT * FROM order_items WHERE order_id = ?').all(order.id);
      return { ...order, items, item_count: items.length };
    });

    res.json({ orders: enriched, total, page: parseInt(page), totalPages: Math.ceil(total / parseInt(limit)) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin: Get single order
router.get('/admin/:id', authenticateAdmin, (req, res) => {
  try {
    const db = req.app.locals.db;
    const order = db.prepare(`SELECT o.*, c.name as customer_name, c.email as customer_email, c.phone as customer_phone FROM orders o LEFT JOIN customers c ON o.customer_id = c.id WHERE o.id = ?`).get(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });

    const items = db.prepare(`SELECT oi.*, pi.url as image FROM order_items oi LEFT JOIN product_images pi ON oi.product_id = pi.product_id AND pi.is_primary = 1 WHERE oi.order_id = ?`).all(order.id);
    const movements = db.prepare(`SELECT * FROM stock_movements WHERE reference_type = 'order' AND reference_id = ? ORDER BY created_at DESC`).all(order.id);

    res.json({ ...order, items, stock_movements: movements });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin: Update order status
router.put('/admin/:id/status', authenticateAdmin, (req, res) => {
  try {
    const db = req.app.locals.db;
    const { order_status, payment_status } = req.body;

    const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });

    const updateOrder = db.transaction(() => {
      // Check cancellation eligibility (cannot cancel if packed, shipped, out_for_delivery, or delivered)
      if (order_status === 'cancelled') {
        const nonCancellable = ['packed', 'shipped', 'out_for_delivery', 'delivered'];
        if (nonCancellable.includes(order.order_status)) {
          throw new Error('Orders that are already packed, shipped, or delivered cannot be cancelled');
        }

        if (order.order_status !== 'cancelled') {
          const items = db.prepare('SELECT * FROM order_items WHERE order_id = ?').all(order.id);
          items.forEach(item => {
            db.prepare('UPDATE product_variants SET stock = stock + ? WHERE id = ?').run(item.quantity, item.variant_id);
            db.prepare(`INSERT INTO stock_movements (variant_id, product_id, type, quantity, reference_type, reference_id, notes)
              VALUES (?, ?, 'increase', ?, 'order_cancel', ?, 'Order cancelled - stock restored')`).run(
              item.variant_id, item.product_id, item.quantity, order.id
            );
          });
        }
      }

      if (order_status) {
        db.prepare('UPDATE orders SET order_status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(order_status, req.params.id);
      }
      if (payment_status) {
        db.prepare('UPDATE orders SET payment_status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(payment_status, req.params.id);
      }
    });

    updateOrder();
    res.json({ message: 'Order status updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
