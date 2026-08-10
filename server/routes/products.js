const express = require('express');
const router = express.Router();
const { authenticateAdmin } = require('../middleware/auth');
const { createUpload } = require('../middleware/upload');

const upload = createUpload('products');

// Get all products (public)
router.get('/', (req, res) => {
  try {
    const db = req.app.locals.db;
    const { category, search, sort, min_price, max_price, weight, availability, page = 1, limit = 12, featured, best_seller } = req.query;

    let query = `SELECT p.*, c.name as category_name, c.slug as category_slug FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE p.status = 'active'`;
    const params = [];

    if (category) {
      query += ` AND c.slug = ?`;
      params.push(category);
    }
    if (search) {
      query += ` AND (p.name LIKE ? OR p.short_description LIKE ?)`;
      params.push(`%${search}%`, `%${search}%`);
    }
    if (featured === '1') {
      query += ` AND p.is_featured = 1`;
    }
    if (best_seller === '1') {
      query += ` AND p.is_best_seller = 1`;
    }

    // Get total count
    const countQuery = query.replace('SELECT p.*, c.name as category_name, c.slug as category_slug', 'SELECT COUNT(*) as total');
    const total = db.prepare(countQuery).get(...params).total;

    // Sort
    if (sort === 'price_low') {
      query += ` ORDER BY (SELECT MIN(price) FROM product_variants WHERE product_id = p.id) ASC`;
    } else if (sort === 'price_high') {
      query += ` ORDER BY (SELECT MIN(price) FROM product_variants WHERE product_id = p.id) DESC`;
    } else if (sort === 'name_asc') {
      query += ` ORDER BY p.name ASC`;
    } else if (sort === 'name_desc') {
      query += ` ORDER BY p.name DESC`;
    } else if (sort === 'newest') {
      query += ` ORDER BY p.created_at DESC`;
    } else {
      query += ` ORDER BY p.created_at DESC`;
    }

    // Pagination
    const offset = (parseInt(page) - 1) * parseInt(limit);
    query += ` LIMIT ? OFFSET ?`;
    params.push(parseInt(limit), offset);

    const products = db.prepare(query).all(...params);

    // Get variants and primary image for each product
    const enriched = products.map(product => {
      const variants = db.prepare('SELECT * FROM product_variants WHERE product_id = ? AND is_active = 1 ORDER BY price ASC').all(product.id);
      const images = db.prepare('SELECT * FROM product_images WHERE product_id = ? ORDER BY is_primary DESC, sort_order ASC').all(product.id);
      const avgRating = db.prepare('SELECT AVG(rating) as avg, COUNT(*) as count FROM reviews WHERE product_id = ? AND status = ?').get(product.id, 'approved');

      // Apply price/weight/availability filters
      let matchesFilter = true;
      if (min_price && variants.length > 0) {
        matchesFilter = matchesFilter && variants.some(v => v.price >= parseFloat(min_price));
      }
      if (max_price && variants.length > 0) {
        matchesFilter = matchesFilter && variants.some(v => v.price <= parseFloat(max_price));
      }
      if (weight) {
        matchesFilter = matchesFilter && variants.some(v => v.weight === weight);
      }
      if (availability === 'in_stock') {
        matchesFilter = matchesFilter && variants.some(v => v.stock > 0);
      }

      if (!matchesFilter) return null;

      return {
        ...product,
        variants,
        images,
        rating: avgRating.avg ? Math.round(avgRating.avg * 10) / 10 : 0,
        review_count: avgRating.count
      };
    }).filter(Boolean);

    res.json({
      products: enriched,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit))
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single product (public)
router.get('/:slug', (req, res) => {
  try {
    const db = req.app.locals.db;
    const product = db.prepare(`SELECT p.*, c.name as category_name, c.slug as category_slug FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE p.slug = ?`).get(req.params.slug);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const variants = db.prepare('SELECT * FROM product_variants WHERE product_id = ? AND is_active = 1 ORDER BY price ASC').all(product.id);
    const images = db.prepare('SELECT * FROM product_images WHERE product_id = ? ORDER BY is_primary DESC, sort_order ASC').all(product.id);
    const reviews = db.prepare(`SELECT r.*, cu.name as customer_name FROM reviews r LEFT JOIN customers cu ON r.customer_id = cu.id WHERE r.product_id = ? AND r.status = 'approved' ORDER BY r.created_at DESC`).all(product.id);
    const avgRating = db.prepare('SELECT AVG(rating) as avg, COUNT(*) as count FROM reviews WHERE product_id = ? AND status = ?').get(product.id, 'approved');

    // Related products
    const related = db.prepare(`SELECT p.* FROM products p WHERE p.category_id = ? AND p.id != ? AND p.status = 'active' LIMIT 4`).all(product.category_id, product.id);
    const relatedEnriched = related.map(rp => {
      const rv = db.prepare('SELECT * FROM product_variants WHERE product_id = ? AND is_active = 1 ORDER BY price ASC').all(rp.id);
      const ri = db.prepare('SELECT * FROM product_images WHERE product_id = ? ORDER BY is_primary DESC LIMIT 1').all(rp.id);
      const ra = db.prepare('SELECT AVG(rating) as avg, COUNT(*) as count FROM reviews WHERE product_id = ? AND status = ?').get(rp.id, 'approved');
      return { ...rp, variants: rv, images: ri, rating: ra.avg ? Math.round(ra.avg * 10) / 10 : 0, review_count: ra.count };
    });

    res.json({
      ...product,
      variants,
      images,
      reviews,
      rating: avgRating.avg ? Math.round(avgRating.avg * 10) / 10 : 0,
      review_count: avgRating.count,
      related: relatedEnriched
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get product by ID (admin)
router.get('/admin/:id', authenticateAdmin, (req, res) => {
  try {
    const db = req.app.locals.db;
    const product = db.prepare('SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE p.id = ?').get(req.params.id);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const variants = db.prepare('SELECT * FROM product_variants WHERE product_id = ? ORDER BY price ASC').all(product.id);
    const images = db.prepare('SELECT * FROM product_images WHERE product_id = ? ORDER BY is_primary DESC, sort_order ASC').all(product.id);

    res.json({ ...product, variants, images });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin: List all products
router.get('/admin/list/all', authenticateAdmin, (req, res) => {
  try {
    const db = req.app.locals.db;
    const { search, category, status, page = 1, limit = 20 } = req.query;

    let query = `SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE 1=1`;
    const params = [];

    if (search) {
      query += ` AND (p.name LIKE ? OR p.slug LIKE ?)`;
      params.push(`%${search}%`, `%${search}%`);
    }
    if (category) {
      query += ` AND c.slug = ?`;
      params.push(category);
    }
    if (status) {
      query += ` AND p.status = ?`;
      params.push(status);
    }

    const countQ = query.replace('SELECT p.*, c.name as category_name', 'SELECT COUNT(*) as total');
    const total = db.prepare(countQ).get(...params).total;

    query += ` ORDER BY p.created_at DESC LIMIT ? OFFSET ?`;
    params.push(parseInt(limit), (parseInt(page) - 1) * parseInt(limit));

    const products = db.prepare(query).all(...params);

    const enriched = products.map(p => {
      const variants = db.prepare('SELECT * FROM product_variants WHERE product_id = ? ORDER BY price ASC').all(p.id);
      const images = db.prepare('SELECT * FROM product_images WHERE product_id = ? ORDER BY is_primary DESC LIMIT 1').all(p.id);
      return { ...p, variants, images };
    });

    res.json({ products: enriched, total, page: parseInt(page), totalPages: Math.ceil(total / parseInt(limit)) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create product (admin)
router.post('/', authenticateAdmin, (req, res) => {
  try {
    const db = req.app.locals.db;
    const { name, slug, category_id, short_description, description, ingredients, storage_info, shipping_info,
            is_featured, is_best_seller, is_new_arrival, status, variants, images } = req.body;

    if (!name || !slug) {
      return res.status(400).json({ error: 'Name and slug are required' });
    }

    const existing = db.prepare('SELECT id FROM products WHERE slug = ?').get(slug);
    if (existing) {
      return res.status(409).json({ error: 'Product with this slug already exists' });
    }

    const result = db.prepare(`INSERT INTO products (name, slug, category_id, short_description, description, ingredients, storage_info, shipping_info, is_featured, is_best_seller, is_new_arrival, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`).run(
      name, slug, category_id || null, short_description || '', description || '', ingredients || '', storage_info || '', shipping_info || '',
      is_featured ? 1 : 0, is_best_seller ? 1 : 0, is_new_arrival ? 1 : 0, status || 'active'
    );

    const productId = result.lastInsertRowid;

    // Insert variants
    if (variants && variants.length > 0) {
      const insertVariant = db.prepare(`INSERT INTO product_variants (product_id, weight, sku, price, mrp, stock, low_stock_threshold, is_default) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`);
      variants.forEach((v, i) => {
        insertVariant.run(productId, v.weight, v.sku || null, v.price, v.mrp, v.stock || 0, v.low_stock_threshold || 5, i === 0 ? 1 : 0);
      });
    }

    // Insert images
    if (images && images.length > 0) {
      const insertImage = db.prepare(`INSERT INTO product_images (product_id, url, alt_text, sort_order, is_primary) VALUES (?, ?, ?, ?, ?)`);
      images.forEach((img, i) => {
        insertImage.run(productId, img.url, img.alt_text || name, i, i === 0 ? 1 : 0);
      });
    }

    res.status(201).json({ id: productId, message: 'Product created successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update product (admin)
router.put('/:id', authenticateAdmin, (req, res) => {
  try {
    const db = req.app.locals.db;
    const { name, slug, category_id, short_description, description, ingredients, storage_info, shipping_info,
            is_featured, is_best_seller, is_new_arrival, status, variants, images } = req.body;

    const product = db.prepare('SELECT id FROM products WHERE id = ?').get(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    db.prepare(`UPDATE products SET name=?, slug=?, category_id=?, short_description=?, description=?, ingredients=?, storage_info=?, shipping_info=?, is_featured=?, is_best_seller=?, is_new_arrival=?, status=?, updated_at=CURRENT_TIMESTAMP WHERE id=?`).run(
      name, slug, category_id || null, short_description || '', description || '', ingredients || '', storage_info || '', shipping_info || '',
      is_featured ? 1 : 0, is_best_seller ? 1 : 0, is_new_arrival ? 1 : 0, status || 'active', req.params.id
    );

    // Update variants
    if (variants) {
      // Remove old variants that aren't in the new list
      const existingIds = variants.filter(v => v.id).map(v => v.id);
      if (existingIds.length > 0) {
        db.prepare(`DELETE FROM product_variants WHERE product_id = ? AND id NOT IN (${existingIds.join(',')})`).run(req.params.id);
      } else {
        db.prepare('DELETE FROM product_variants WHERE product_id = ?').run(req.params.id);
      }

      variants.forEach((v, i) => {
        if (v.id) {
          db.prepare(`UPDATE product_variants SET weight=?, sku=?, price=?, mrp=?, stock=?, low_stock_threshold=?, is_default=?, updated_at=CURRENT_TIMESTAMP WHERE id=?`).run(
            v.weight, v.sku || null, v.price, v.mrp, v.stock || 0, v.low_stock_threshold || 5, i === 0 ? 1 : 0, v.id
          );
        } else {
          db.prepare(`INSERT INTO product_variants (product_id, weight, sku, price, mrp, stock, low_stock_threshold, is_default) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`).run(
            req.params.id, v.weight, v.sku || null, v.price, v.mrp, v.stock || 0, v.low_stock_threshold || 5, i === 0 ? 1 : 0
          );
        }
      });
    }

    // Update images
    if (images) {
      db.prepare('DELETE FROM product_images WHERE product_id = ?').run(req.params.id);
      const insertImage = db.prepare(`INSERT INTO product_images (product_id, url, alt_text, sort_order, is_primary) VALUES (?, ?, ?, ?, ?)`);
      images.forEach((img, i) => {
        insertImage.run(req.params.id, img.url, img.alt_text || name, i, i === 0 ? 1 : 0);
      });
    }

    res.json({ message: 'Product updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete product (admin)
router.delete('/:id', authenticateAdmin, (req, res) => {
  try {
    const db = req.app.locals.db;
    db.prepare('DELETE FROM products WHERE id = ?').run(req.params.id);
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Duplicate product (admin)
router.post('/:id/duplicate', authenticateAdmin, (req, res) => {
  try {
    const db = req.app.locals.db;
    const product = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const newSlug = `${product.slug}-copy-${Date.now()}`;
    const result = db.prepare(`INSERT INTO products (name, slug, category_id, short_description, description, ingredients, storage_info, shipping_info, is_featured, is_best_seller, is_new_arrival, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`).run(
      `${product.name} (Copy)`, newSlug, product.category_id, product.short_description, product.description, product.ingredients, product.storage_info, product.shipping_info,
      0, 0, 0, 'draft'
    );

    const newId = result.lastInsertRowid;
    const variants = db.prepare('SELECT * FROM product_variants WHERE product_id = ?').all(req.params.id);
    variants.forEach(v => {
      db.prepare(`INSERT INTO product_variants (product_id, weight, sku, price, mrp, stock, low_stock_threshold, is_default) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`).run(
        newId, v.weight, null, v.price, v.mrp, 0, v.low_stock_threshold, v.is_default
      );
    });

    res.status(201).json({ id: newId, message: 'Product duplicated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
