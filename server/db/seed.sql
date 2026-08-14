-- Honey Bee Farm - Seed Data
-- Admin password: HoneyBeeAdmin@2026 (bcrypt hash)

-- ============================================================
-- ADMIN
-- ============================================================
INSERT OR IGNORE INTO admins (name, email, password, phone, role)
VALUES ('Honey Bee Admin', 'admin@honeybeefarm.com', '$2b$10$placeholder_will_be_set_by_server', '7708510872', 'admin');

-- ============================================================
-- CATEGORIES
-- ============================================================
INSERT OR REPLACE INTO categories (id, name, slug, description, sort_order, is_active) VALUES
(1, 'Dry Fruits Honey', 'dry-fruits-honey', 'Premium almonds, cashews, pistachios, walnuts and figs soaked in pure raw honey', 1, 1),
(2, 'Kattu Nellikai Honey', 'kattu-nellikai-honey', 'Fresh wild Indian gooseberries naturally cured in pure apiary honey for immunity', 2, 1),
(3, 'Dates Honey', 'dates-honey', 'Sweet, tender seedless dates steeped in raw golden honey for natural stamina', 3, 1),
(4, 'Herbal Infused Honey', 'herbal-infused-honey', 'Traditional hill garlic, ginger, and therapeutic botanicals in pure raw honey', 4, 1),
(5, 'Raw Honey', 'raw-honey', 'Pure, unheated, unfiltered raw honey harvested straight from our Tirunelveli bee boxes', 5, 1),
(6, 'Comb Honey', 'comb-honey', 'Fresh, edible natural honeycomb packed with vitamins, pollen, and natural enzymes', 6, 1),
(7, 'Premium Reserve', 'premium-reserve', 'Small-batch, single-origin reserve honey harvested during prime floral seasons', 7, 1),
(8, 'Gift Boxes', 'gift-boxes', 'Artisanal gift sets and curated multi-pack honey jars for wellness and special occasions', 8, 1),
(9, 'Forest Honey', 'forest-honey', 'Wild floral nectar gathered from pristine natural flora surrounding Tirunelveli', 9, 1);

-- ============================================================
-- PRODUCTS
-- ============================================================
INSERT OR REPLACE INTO products (id, name, slug, category_id, short_description, description, ingredients, storage_info, shipping_info, is_featured, is_best_seller, is_new_arrival, status) VALUES
(1, 'Honey Soaked Dry Fruits & Nuts', 'honey-soaked-dry-fruits', 1,
 'Almonds, cashews, pistachios, walnuts & figs soaked in 100% pure raw honey.',
 'A luxurious, nutrient-dense power blend of premium California almonds, whole cashew nuts, crunchy pistachios, brain-boosting walnuts, and tender Afghan figs steeped in raw golden honey. Excellent for daily vitality, immunity, and healthy snacking.',
 '100% Pure Raw Honey, Almonds, Cashews, Pistachios, Walnuts, Dried Figs',
 'Store in a cool, dry place. Always use a dry spoon. Do not refrigerate.',
 'Shipped in airtight shock-proof packaging across India within 2-4 business days.',
 1, 1, 1, 'active'),

(2, 'Wild Kattu Nellikai in Raw Honey', 'wild-kattu-nellikai-honey', 2,
 'Authentic wild amlas cured in raw honey for natural Vitamin C and immunity.',
 'Hand-picked fresh wild forest amlas (kattu nellikai) slowly cured in pure raw apiary honey. This traditional Siddha-inspired tonic is renowned for its incredible Vitamin C content, digestive benefits, hair nourishment, and daily immune enhancement.',
 'Fresh Wild Forest Amla (Gooseberry), 100% Pure Raw Honey',
 'Store at ambient room temperature in a dry place. Keep lid sealed tightly.',
 'Specially cushioned, leak-proof packaging to preserve fresh gooseberry goodness.',
 1, 1, 1, 'active'),

(3, 'Honey Soaked Arabian Dates', 'honey-soaked-dates', 3,
 'Plump seedless dates steeped in pure raw honey for energy and hemoglobin.',
 'Tender, sweet seedless Arabian dates drenched in our signature pure raw honey. Packed with natural dietary iron, minerals, and healthy sugars, this delectable combination provides sustained physical stamina, boosts hemoglobin, and satisfies sweet cravings naturally.',
 'Premium Seedless Dates, 100% Pure Raw Honey',
 'Store in a dry location away from heat and direct sunlight.',
 'Fast express delivery in heavy-duty food grade glass jars.',
 1, 1, 1, 'active'),

(4, 'Hill Garlic & Ginger Infused Honey', 'hill-garlic-ginger-honey', 4,
 'Traditional hill garlic cloves and fresh ginger slices in raw honey.',
 'Authentic mountain hill garlic cloves and fresh aromatic ginger steeped in raw apiary honey. Revered in traditional home remedies for soothing throat irritations, boosting cardiovascular wellness, reducing inflammation, and aiding easy digestion.',
 'Raw Hill Garlic, Fresh Farm Ginger, 100% Pure Raw Honey',
 'Keep at room temperature. Do not refrigerate.',
 'Airtight sealed jar packaging with protective bubble cushioning.',
 1, 0, 1, 'active'),

(5, 'Pure Natural Raw Honey', 'pure-natural-honey', 5,
 '100% Pure, unpasteurized natural honey straight from the apiary.',
 'Natural Raw Honey from Honey Bee Farm is harvested with strict adherence to natural beekeeping standards in Tirunelveli, Tamil Nadu. Cold-extracted and gently strained to preserve natural enzymes, pollen, and distinctive floral notes.',
 '100% Pure Raw Honey',
 'Store at room temperature in a dry place. Keep lid tightly closed. Crystallization is a natural sign of purity.',
 'Shipped securely in shock-proof protective packaging across India within 2-4 business days.',
 1, 1, 0, 'active'),

(6, 'Fresh Natural Honey Comb', 'natural-honey-comb', 6,
 'Intact raw beeswax honeycomb filled with fresh liquid honey.',
 'Harvested directly from our Tirunelveli apiaries, each square of Honey Bee Farm honeycomb is 100% natural, unprocessed, and completely edible. Enjoy the rich, chewy texture of natural beeswax combined with pure liquid honey.',
 '100% Natural Raw Honeycomb',
 'Keep in airtight container at ambient room temperature away from direct sunlight.',
 'Specially padded protective packaging to preserve delicate honeycomb structure.',
 1, 1, 0, 'active'),

(7, 'Honey Bee Reserve Honey', 'honey-bee-reserve-honey', 7,
 'Limited seasonal harvest with deep amber color and rich floral aroma.',
 'Honey Bee Reserve Honey represents the very best of our harvest. Selected from the finest batches, this honey has a rich, complex flavor profile and smooth texture.',
 '100% Pure Seasonal Floral Honey',
 'Store in cool and dry surroundings. Do not refrigerate.',
 'Dispatched via express air delivery.',
 0, 0, 1, 'active'),

(8, 'Artisanal Honey Gift Trio', 'honey-gift-pack', 8,
 'Curated 3-jar honey collection packed in a wooden gift box.',
 'An elegant gift box featuring three signature honey varieties from Honey Bee Farm: Raw Wildflower Honey, Dry Fruits Infused Honey, and Pure Honeycomb. Perfect for festivals, corporate gifting, and health enthusiasts.',
 'Pure Natural Honey Varieties',
 'Store in a dry location.',
 'Gift boxed and cushioned with premium biodegradable wrap.',
 0, 1, 0, 'active'),

(9, 'Wild Forest Floral Honey', 'wild-forest-honey', 9,
 'Rich dark honey harvested from wild forest blooms.',
 'Collected from the pristine wild flora surrounding the Western Ghats near Tirunelveli, this honey is naturally dark, antioxidant-rich, and carries subtle woodsy floral undertones.',
 '100% Wild Forest Flora Honey',
 'Store at ambient temperature.',
 'Insured transit in leak-proof glass jar packaging.',
 0, 1, 0, 'active');

-- ============================================================
-- PRODUCT IMAGES
-- ============================================================
INSERT OR REPLACE INTO product_images (id, product_id, url, alt_text, is_primary, sort_order) VALUES
(1, 1, '/images/product-honey-dry-fruits.png', 'Honey Soaked Dry Fruits', 1, 0),
(2, 2, '/images/product-honey-kattu-nellikai.png', 'Wild Kattu Nellikai in Raw Honey', 1, 0),
(3, 3, '/images/product-honey-dates.png', 'Honey Soaked Arabian Dates', 1, 0),
(4, 4, '/images/product-honey-ginger-garlic.png', 'Hill Garlic & Ginger Infused Honey', 1, 0),
(5, 5, '/images/product-natural-honey.png', 'Pure Natural Raw Honey', 1, 0),
(6, 6, '/images/product-honeycomb.png', 'Fresh Natural Honey Comb', 1, 0),
(7, 7, '/images/product-premium-honey.png', 'Honey Bee Reserve Honey', 1, 0),
(8, 8, '/images/product-gift-pack.png', 'Artisanal Honey Gift Trio', 1, 0),
(9, 9, '/images/product-forest-honey.png', 'Wild Forest Floral Honey', 1, 0);

-- ============================================================
-- PRODUCT VARIANTS
-- ============================================================
INSERT OR REPLACE INTO product_variants (id, product_id, weight, sku, price, mrp, stock, low_stock_threshold, is_default, is_active) VALUES
(1, 1, '250g', 'HBF-DF-250', 299, 360, 40, 5, 1, 1),
(2, 1, '500g', 'HBF-DF-500', 579, 690, 55, 5, 0, 1),
(3, 1, '1kg', 'HBF-DF-1000', 1099, 1300, 25, 5, 0, 1),

(4, 2, '250g', 'HBF-KN-250', 249, 299, 35, 5, 1, 1),
(5, 2, '500g', 'HBF-KN-500', 469, 550, 50, 5, 0, 1),
(6, 2, '1kg', 'HBF-KN-1000', 899, 1050, 20, 5, 0, 1),

(7, 3, '250g', 'HBF-DT-250', 229, 279, 45, 5, 1, 1),
(8, 3, '500g', 'HBF-DT-500', 429, 520, 60, 5, 0, 1),
(9, 3, '1kg', 'HBF-DT-1000', 799, 950, 30, 5, 0, 1),

(10, 4, '250g', 'HBF-GG-250', 269, 320, 30, 5, 1, 1),
(11, 4, '500g', 'HBF-GG-500', 499, 590, 40, 5, 0, 1),

(12, 5, '250g', 'HBF-RAW-250', 199, 249, 45, 5, 1, 1),
(13, 5, '500g', 'HBF-RAW-500', 379, 449, 60, 5, 0, 1),
(14, 5, '1kg', 'HBF-RAW-1000', 699, 849, 35, 5, 0, 1),

(15, 6, '250g', 'HBF-CMB-250', 299, 349, 25, 5, 1, 1),
(16, 6, '500g', 'HBF-CMB-500', 549, 649, 20, 5, 0, 1),

(17, 7, '500g', 'HBF-RSV-500', 449, 549, 30, 5, 1, 1),
(18, 7, '1kg', 'HBF-RSV-1000', 829, 999, 15, 5, 0, 1),

(19, 8, '750g (3x250g)', 'HBF-GFT-750', 799, 999, 18, 5, 1, 1),

(20, 9, '500g', 'HBF-FOR-500', 399, 499, 40, 5, 1, 1),
(21, 9, '1kg', 'HBF-FOR-1000', 749, 899, 25, 5, 0, 1);

-- ============================================================
-- SETTINGS
-- ============================================================
INSERT OR REPLACE INTO settings (setting_key, setting_value, setting_group) VALUES
('business_name', 'Honey Bee Farm', 'business'),
('business_tagline', '100% Pure Natural Apiary Honey', 'business'),
('business_phone', '7708510872', 'business'),
('business_whatsapp', '7708510872', 'business'),
('business_email', 'contact@honeybeefarm.com', 'business'),
('business_address', 'Honey Bee Farm Apiaries, Tirunelveli, Tamil Nadu, India', 'business'),
('business_instagram', 'https://www.instagram.com/honey_bee_farm_tirunelveli', 'business'),
('shipping_charge', '50', 'ecommerce'),
('free_shipping_threshold', '500', 'ecommerce'),
('store_status', 'open', 'ecommerce'),
('currency', '₹', 'ecommerce');
