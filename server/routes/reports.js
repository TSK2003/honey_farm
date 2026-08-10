const express = require('express');
const router = express.Router();
const { authenticateAdmin } = require('../middleware/auth');

// Sales report
router.get('/sales', authenticateAdmin, (req, res) => {
  try {
    const db = req.app.locals.db;
    const { from, to } = req.query;

    let dateFilter = '';
    const params = [];
    if (from) { dateFilter += ' AND created_at >= ?'; params.push(from); }
    if (to) { dateFilter += ' AND created_at <= ?'; params.push(to); }

    const totalOrders = db.prepare(`SELECT COUNT(*) as count FROM orders WHERE order_status != 'cancelled' ${dateFilter}`).get(...params);
    const totalRevenue = db.prepare(`SELECT COALESCE(SUM(total), 0) as total FROM orders WHERE order_status != 'cancelled' ${dateFilter}`).get(...params);
    const avgOrderValue = totalOrders.count > 0 ? totalRevenue.total / totalOrders.count : 0;

    const statusBreakdown = db.prepare(`SELECT order_status, COUNT(*) as count, COALESCE(SUM(total), 0) as total FROM orders WHERE 1=1 ${dateFilter} GROUP BY order_status`).all(...params);

    const dailySales = db.prepare(`SELECT DATE(created_at) as date, COUNT(*) as orders, COALESCE(SUM(total), 0) as revenue FROM orders WHERE order_status != 'cancelled' ${dateFilter} GROUP BY DATE(created_at) ORDER BY date DESC LIMIT 30`).all(...params);

    res.json({
      total_orders: totalOrders.count,
      total_revenue: totalRevenue.total,
      avg_order_value: Math.round(avgOrderValue * 100) / 100,
      status_breakdown: statusBreakdown,
      daily_sales: dailySales
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Product report
router.get('/products', authenticateAdmin, (req, res) => {
  try {
    const db = req.app.locals.db;

    const bestSellers = db.prepare(`SELECT oi.product_name, SUM(oi.quantity) as units_sold, SUM(oi.total) as revenue
      FROM order_items oi JOIN orders o ON oi.order_id = o.id WHERE o.order_status != 'cancelled'
      GROUP BY oi.product_id ORDER BY units_sold DESC LIMIT 10`).all();

    const totalProducts = db.prepare('SELECT COUNT(*) as count FROM products').get();
    const activeProducts = db.prepare("SELECT COUNT(*) as count FROM products WHERE status = 'active'").get();

    res.json({
      total_products: totalProducts.count,
      active_products: activeProducts.count,
      best_sellers: bestSellers
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Inventory report
router.get('/inventory', authenticateAdmin, (req, res) => {
  try {
    const db = req.app.locals.db;

    const lowStock = db.prepare(`SELECT pv.*, p.name as product_name FROM product_variants pv
      JOIN products p ON pv.product_id = p.id WHERE pv.stock <= pv.low_stock_threshold AND pv.stock > 0 AND pv.is_active = 1`).all();

    const outOfStock = db.prepare(`SELECT pv.*, p.name as product_name FROM product_variants pv
      JOIN products p ON pv.product_id = p.id WHERE pv.stock = 0 AND pv.is_active = 1`).all();

    const totalVariants = db.prepare('SELECT COUNT(*) as count FROM product_variants WHERE is_active = 1').get();
    const totalStock = db.prepare('SELECT COALESCE(SUM(stock), 0) as total FROM product_variants WHERE is_active = 1').get();

    res.json({
      total_variants: totalVariants.count,
      total_stock_units: totalStock.total,
      low_stock: lowStock,
      out_of_stock: outOfStock
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
