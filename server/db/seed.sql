-- Kamala Honey Farm - Seed Data
-- Admin password: KamalaAdmin@2026 (bcrypt hash)

-- ============================================================
-- ADMIN
-- ============================================================
INSERT OR IGNORE INTO admins (name, email, password, phone, role)
VALUES ('Kamala Admin', 'admin@kamalahoney.com', '$2b$10$placeholder_will_be_set_by_server', '7708510872', 'admin');

-- ============================================================
-- CATEGORIES
-- ============================================================
INSERT OR IGNORE INTO categories (name, slug, description, sort_order, is_active) VALUES
('Natural Honey', 'natural-honey', 'Pure and natural honey sourced directly from our farm', 1, 1),
('Honey Comb', 'honey-comb', 'Fresh honeycomb straight from the hive', 2, 1),
('Premium Honey', 'premium-honey', 'Our finest selection of premium quality honey', 3, 1),
('Honey Gift Packs', 'honey-gift-packs', 'Beautifully packaged honey gift sets', 4, 1),
('Bee Products', 'bee-products', 'Natural bee-related products from our farm', 5, 1);

-- ============================================================
-- PRODUCTS
-- ============================================================
INSERT OR IGNORE INTO products (name, slug, category_id, short_description, description, ingredients, storage_info, shipping_info, is_featured, is_best_seller, is_new_arrival, status) VALUES
('Pure Natural Honey', 'pure-natural-honey', 1,
 'Farm-fresh natural honey from Tirunelveli',
 'Experience the authentic taste of pure natural honey, carefully harvested from our bee farms in Tirunelveli, Tamil Nadu. Our honey is unprocessed and retains all its natural goodness. Each jar is filled with honey that comes straight from healthy bee colonies nurtured in the lush environment of Tirunelveli.',
 '100% Natural Honey',
 'Store in a cool, dry place away from direct sunlight. Do not refrigerate. Crystallization is natural and does not affect quality.',
 'Shipped in secure packaging. Delivery within 5-7 business days across India.',
 1, 1, 0, 'active'),

('Natural Honey Comb', 'natural-honey-comb', 2,
 'Fresh honeycomb with pure honey',
 'Enjoy honey in its most natural form — straight from the comb. Our fresh honeycomb is harvested carefully to preserve the delicate wax structure filled with pure, raw honey. A true delicacy for honey lovers who appreciate nature''s craftsmanship.',
 '100% Natural Honeycomb with Raw Honey',
 'Store in a cool, dry place. Best consumed within 3 months of purchase for optimal freshness.',
 'Carefully packed to preserve comb structure. Delivery within 5-7 business days.',
 1, 0, 1, 'active'),

('Premium Honey', 'premium-honey', 3,
 'Our finest quality premium honey selection',
 'Kamala Premium Honey represents the very best of our harvest. Selected from the finest batches, this honey has a rich, complex flavor profile and smooth texture. Ideal for those who appreciate the subtle nuances of high-quality natural honey.',
 '100% Pure Premium Honey',
 'Store in a cool, dry place away from direct sunlight. Crystallization is a sign of purity.',
 'Premium packaging with secure delivery. Ships within 3-5 business days.',
 1, 1, 0, 'active'),

('Premium Honey Gift Pack', 'premium-honey-gift-pack', 4,
 'Beautifully packaged honey gift set',
 'The perfect gift for honey enthusiasts. Our Premium Honey Gift Pack features a curated selection of our finest honey varieties, elegantly packaged in a beautiful gift box. Ideal for festivals, celebrations, and special occasions.',
 'Assorted Natural Honey Varieties',
 'Store in a cool, dry place. Keep the gift box away from moisture.',
 'Gift-wrapped and shipped in protective packaging. Delivery within 5-7 business days.',
 1, 0, 1, 'active'),

('Forest Honey', 'forest-honey', 1,
 'Wild forest honey with rich aroma',
 'Our Forest Honey is sourced from bee colonies in the dense forests surrounding Tirunelveli. The bees collect nectar from a diverse range of wildflowers, resulting in a honey with a distinctively rich, deep flavor and dark amber color.',
 '100% Natural Forest Honey',
 'Store in a cool, dry place away from direct sunlight.',
 'Shipped in secure, leak-proof packaging. Delivery within 5-7 business days.',
 0, 1, 0, 'active');

-- ============================================================
-- PRODUCT IMAGES
-- ============================================================
INSERT OR IGNORE INTO product_images (product_id, url, alt_text, is_primary) VALUES
(1, '/images/product-natural-honey.png', 'Pure Natural Honey', 1),
(2, '/images/product-honeycomb.png', 'Natural Honey Comb', 1),
(3, '/images/product-premium-honey.png', 'Premium Honey', 1),
(4, '/images/product-gift-pack.png', 'Premium Honey Gift Pack', 1),
(5, '/images/product-forest-honey.png', 'Forest Honey', 1);

-- ============================================================
-- PRODUCT VARIANTS
-- ============================================================
INSERT OR IGNORE INTO product_variants (product_id, weight, sku, price, mrp, stock, low_stock_threshold, is_default) VALUES
(1, '250g', 'KHF-PNH-250', 199, 249, 50, 10, 1),
(1, '500g', 'KHF-PNH-500', 379, 449, 40, 10, 0),
(1, '1kg', 'KHF-PNH-1000', 699, 849, 30, 5, 0),
(2, '250g', 'KHF-NHC-250', 349, 449, 20, 5, 1),
(2, '500g', 'KHF-NHC-500', 649, 799, 15, 5, 0),
(3, '250g', 'KHF-PMH-250', 299, 399, 25, 5, 1),
(3, '500g', 'KHF-PMH-500', 549, 699, 20, 5, 0),
(3, '1kg', 'KHF-PMH-1000', 999, 1249, 15, 3, 0),
(4, '500g', 'KHF-HGP-500', 799, 999, 20, 5, 1),
(4, '1kg', 'KHF-HGP-1000', 1499, 1799, 10, 3, 0),
(5, '250g', 'KHF-FRH-250', 249, 329, 30, 5, 1),
(5, '500g', 'KHF-FRH-500', 449, 599, 25, 5, 0),
(5, '1kg', 'KHF-FRH-1000', 849, 1049, 15, 3, 0);

-- ============================================================
-- SETTINGS
-- ============================================================
INSERT OR IGNORE INTO settings (setting_key, setting_value, setting_group) VALUES
('business_name', 'Kamala Honey Farm', 'business'),
('business_tagline', 'Natural Honey Farm', 'business'),
('business_phone', '7708510872', 'business'),
('business_whatsapp', '7708510872', 'business'),
('business_email', 'contact@kamalahoneyfarm.com', 'business'),
('business_address', 'Tirunelveli, Tamil Nadu, India', 'business'),
('business_instagram', 'https://www.instagram.com/kamala_honey_farm_tirunelveli', 'business'),
('currency', '₹', 'ecommerce'),
('shipping_charge', '50', 'shipping'),
('free_shipping_threshold', '500', 'shipping'),
('cod_enabled', '1', 'payment'),
('online_payment_enabled', '0', 'payment'),
('online_payment_message', 'Coming Soon', 'payment'),
('store_status', 'open', 'general'),
('min_order_amount', '0', 'ecommerce');
