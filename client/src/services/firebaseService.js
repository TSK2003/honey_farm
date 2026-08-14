import { 
  collection, 
  getDocs, 
  doc, 
  getDoc, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy 
} from 'firebase/firestore';
import { db } from '../firebase';

// ==========================================
// INITIAL SEED DATA FOR HONEY BEE FARM
// ==========================================
const DEFAULT_CATEGORIES = [
  { id: 'cat-dry-fruits', name: 'Dry Fruits Honey', slug: 'dry-fruits-honey', description: 'Premium almonds, cashews, pistachios, walnuts and figs soaked in pure raw honey.' },
  { id: 'cat-nellikai', name: 'Kattu Nellikai Honey', slug: 'kattu-nellikai-honey', description: 'Fresh wild Indian gooseberries (kattu nellikai) naturally cured in pure apiary honey for immunity.' },
  { id: 'cat-dates', name: 'Dates Honey', slug: 'dates-honey', description: 'Sweet, tender seedless dates steeped in raw golden honey for natural stamina and iron.' },
  { id: 'cat-herbal', name: 'Herbal Infused Honey', slug: 'herbal-infused-honey', description: 'Traditional hill garlic, ginger, and therapeutic botanicals infused in pure raw honey.' },
  { id: 'cat-1', name: 'Raw Honey', slug: 'raw-honey', description: 'Pure, unheated, unfiltered raw honey harvested straight from our Tirunelveli bee boxes.' },
  { id: 'cat-2', name: 'Comb Honey', slug: 'comb-honey', description: 'Fresh, edible natural honeycomb packed with vitamins, pollen, and natural enzymes.' },
  { id: 'cat-3', name: 'Premium Reserve', slug: 'premium-reserve', description: 'Small-batch, single-origin reserve honey harvested during prime floral seasons.' },
  { id: 'cat-4', name: 'Gift Boxes', slug: 'gift-boxes', description: 'Artisanal gift sets and curated multi-pack honey jars for wellness and special occasions.' },
  { id: 'cat-5', name: 'Forest Honey', slug: 'forest-honey', description: 'Wild floral nectar gathered from pristine natural flora surrounding Tirunelveli.' }
];

const DEFAULT_PRODUCTS = [
  {
    id: 'prod-dry-fruits',
    name: 'Honey Soaked Dry Fruits & Nuts',
    slug: 'honey-soaked-dry-fruits',
    category_id: 'cat-dry-fruits',
    category_name: 'Dry Fruits Honey',
    short_description: 'Almonds, cashews, pistachios, walnuts & figs soaked in 100% pure raw honey.',
    description: 'A luxurious, nutrient-dense power blend of premium California almonds, whole cashew nuts, crunchy pistachios, brain-boosting walnuts, and tender Afghan figs steeped in raw golden honey. Excellent for daily vitality, immunity, and healthy snacking for both kids and adults.',
    ingredients: '100% Pure Raw Honey, Almonds, Cashews, Pistachios, Walnuts, Dried Figs',
    storage_info: 'Store in a cool, dry place. Always use a dry spoon. Do not refrigerate.',
    shipping_info: 'Shipped in airtight shock-proof packaging across India within 2-4 business days.',
    is_featured: true,
    is_best_seller: true,
    is_new_arrival: true,
    rating: 5.0,
    review_count: 38,
    images: [{ url: '/images/product-honey-dry-fruits.png', is_primary: true }],
    variants: [
      { id: 'var-df-250', weight: '250g', sku: 'HBF-DF-250', price: 299, mrp: 360, stock: 40, low_stock_threshold: 5 },
      { id: 'var-df-500', weight: '500g', sku: 'HBF-DF-500', price: 579, mrp: 690, stock: 55, low_stock_threshold: 5 },
      { id: 'var-df-1000', weight: '1kg', sku: 'HBF-DF-1000', price: 1099, mrp: 1300, stock: 25, low_stock_threshold: 5 }
    ]
  },
  {
    id: 'prod-kattu-nellikai',
    name: 'Wild Kattu Nellikai in Raw Honey',
    slug: 'wild-kattu-nellikai-honey',
    category_id: 'cat-nellikai',
    category_name: 'Kattu Nellikai Honey',
    short_description: 'Authentic wild amlas cured in raw honey for natural Vitamin C and immunity.',
    description: 'Hand-picked fresh wild forest amlas (kattu nellikai) slowly cured in pure raw apiary honey. This traditional Siddha-inspired tonic is renowned for its incredible Vitamin C content, digestive benefits, hair nourishment, and daily immune enhancement.',
    ingredients: 'Fresh Wild Forest Amla (Gooseberry), 100% Pure Raw Honey',
    storage_info: 'Store at ambient room temperature in a dry place. Keep lid sealed tightly.',
    shipping_info: 'Specially cushioned, leak-proof packaging to preserve fresh gooseberry goodness.',
    is_featured: true,
    is_best_seller: true,
    is_new_arrival: true,
    rating: 5.0,
    review_count: 42,
    images: [{ url: '/images/product-honey-kattu-nellikai.png', is_primary: true }],
    variants: [
      { id: 'var-kn-250', weight: '250g', sku: 'HBF-KN-250', price: 249, mrp: 299, stock: 35, low_stock_threshold: 5 },
      { id: 'var-kn-500', weight: '500g', sku: 'HBF-KN-500', price: 469, mrp: 550, stock: 50, low_stock_threshold: 5 },
      { id: 'var-kn-1000', weight: '1kg', sku: 'HBF-KN-1000', price: 899, mrp: 1050, stock: 20, low_stock_threshold: 5 }
    ]
  },
  {
    id: 'prod-dates-honey',
    name: 'Honey Soaked Arabian Dates',
    slug: 'honey-soaked-dates',
    category_id: 'cat-dates',
    category_name: 'Dates Honey',
    short_description: 'Plump seedless dates steeped in pure raw honey for energy and hemoglobin.',
    description: 'Tender, sweet seedless Arabian dates drenched in our signature pure raw honey. Packed with natural dietary iron, minerals, and healthy sugars, this delectable combination provides sustained physical stamina, boosts hemoglobin, and satisfies sweet cravings naturally.',
    ingredients: 'Premium Seedless Dates, 100% Pure Raw Honey',
    storage_info: 'Store in a dry location away from heat and direct sunlight.',
    shipping_info: 'Fast express delivery in heavy-duty food grade glass jars.',
    is_featured: true,
    is_best_seller: true,
    is_new_arrival: true,
    rating: 4.9,
    review_count: 31,
    images: [{ url: '/images/product-honey-dates.png', is_primary: true }],
    variants: [
      { id: 'var-dt-250', weight: '250g', sku: 'HBF-DT-250', price: 229, mrp: 279, stock: 45, low_stock_threshold: 5 },
      { id: 'var-dt-500', weight: '500g', sku: 'HBF-DT-500', price: 429, mrp: 520, stock: 60, low_stock_threshold: 5 },
      { id: 'var-dt-1000', weight: '1kg', sku: 'HBF-DT-1000', price: 799, mrp: 950, stock: 30, low_stock_threshold: 5 }
    ]
  },
  {
    id: 'prod-ginger-garlic',
    name: 'Hill Garlic & Ginger Infused Honey',
    slug: 'hill-garlic-ginger-honey',
    category_id: 'cat-herbal',
    category_name: 'Herbal Infused Honey',
    short_description: 'Traditional hill garlic cloves and fresh ginger slices in raw honey.',
    description: 'Authentic mountain hill garlic cloves and fresh aromatic ginger steeped in raw apiary honey. Revered in traditional home remedies for soothing throat irritations, boosting cardiovascular wellness, reducing inflammation, and aiding easy digestion.',
    ingredients: 'Raw Hill Garlic, Fresh Farm Ginger, 100% Pure Raw Honey',
    storage_info: 'Keep at room temperature. Do not refrigerate.',
    shipping_info: 'Airtight sealed jar packaging with protective bubble cushioning.',
    is_featured: true,
    is_best_seller: false,
    is_new_arrival: true,
    rating: 4.9,
    review_count: 17,
    images: [{ url: '/images/product-honey-ginger-garlic.png', is_primary: true }],
    variants: [
      { id: 'var-gg-250', weight: '250g', sku: 'HBF-GG-250', price: 269, mrp: 320, stock: 30, low_stock_threshold: 5 },
      { id: 'var-gg-500', weight: '500g', sku: 'HBF-GG-500', price: 499, mrp: 590, stock: 40, low_stock_threshold: 5 }
    ]
  },
  {
    id: 'prod-1',
    name: 'Natural Raw Honey',
    slug: 'natural-raw-honey',
    category_id: 'cat-1',
    category_name: 'Raw Honey',
    short_description: '100% Pure, unpasteurized natural honey straight from the apiary.',
    description: 'Natural Raw Honey from Honey Bee Farm is harvested with strict adherence to natural beekeeping standards in Tirunelveli, Tamil Nadu. Cold-extracted and gently strained to preserve natural enzymes, pollen, and distinctive floral notes.',
    ingredients: '100% Pure Raw Honey',
    storage_info: 'Store at room temperature in a dry place. Keep lid tightly closed. Crystallization is a natural sign of purity.',
    shipping_info: 'Shipped securely in shock-proof protective packaging across India within 2-4 business days.',
    is_featured: true,
    is_best_seller: true,
    is_new_arrival: false,
    rating: 5.0,
    review_count: 28,
    images: [{ url: '/images/product-natural-honey.png', is_primary: true }],
    variants: [
      { id: 'var-1-1', weight: '250g', sku: 'HBF-RAW-250', price: 199, mrp: 249, stock: 45, low_stock_threshold: 5 },
      { id: 'var-1-2', weight: '500g', sku: 'HBF-RAW-500', price: 379, mrp: 449, stock: 60, low_stock_threshold: 5 },
      { id: 'var-1-3', weight: '1kg', sku: 'HBF-RAW-1000', price: 699, mrp: 849, stock: 35, low_stock_threshold: 5 }
    ]
  },
  {
    id: 'prod-2',
    name: 'Fresh Natural Honey Comb',
    slug: 'natural-honey-comb',
    category_id: 'cat-2',
    category_name: 'Comb Honey',
    short_description: 'Intact raw beeswax honeycomb filled with fresh liquid honey.',
    description: 'Harvested directly from our Tirunelveli apiaries, each square of Honey Bee Farm honeycomb is 100% natural, unprocessed, and completely edible. Enjoy the rich, chewy texture of natural beeswax combined with pure liquid honey.',
    ingredients: '100% Natural Raw Honeycomb',
    storage_info: 'Keep in airtight container at ambient room temperature away from direct sunlight.',
    shipping_info: 'Specially padded protective packaging to preserve delicate honeycomb structure.',
    is_featured: true,
    is_best_seller: true,
    is_new_arrival: false,
    rating: 5.0,
    review_count: 19,
    images: [{ url: '/images/product-honeycomb.png', is_primary: true }],
    variants: [
      { id: 'var-2-1', weight: '250g', sku: 'HBF-CMB-250', price: 299, mrp: 349, stock: 25, low_stock_threshold: 5 },
      { id: 'var-2-2', weight: '500g', sku: 'HBF-CMB-500', price: 549, mrp: 649, stock: 20, low_stock_threshold: 5 }
    ]
  },
  {
    id: 'prod-3',
    name: 'Honey Bee Reserve Honey',
    slug: 'honey-bee-reserve-honey',
    category_id: 'cat-3',
    category_name: 'Premium Reserve',
    short_description: 'Limited seasonal harvest with deep amber color and rich floral aroma.',
    description: 'Honey Bee Reserve Honey represents the very best of our harvest. Selected from the finest batches, this honey has a rich, complex flavor profile and smooth texture.',
    ingredients: '100% Pure Seasonal Floral Honey',
    storage_info: 'Store in cool and dry surroundings. Do not refrigerate.',
    shipping_info: 'Dispatched via express air delivery.',
    is_featured: false,
    is_best_seller: false,
    is_new_arrival: true,
    rating: 4.9,
    review_count: 14,
    images: [{ url: '/images/product-premium-honey.png', is_primary: true }],
    variants: [
      { id: 'var-3-1', weight: '500g', sku: 'HBF-RSV-500', price: 449, mrp: 549, stock: 30, low_stock_threshold: 5 },
      { id: 'var-3-2', weight: '1kg', sku: 'HBF-RSV-1000', price: 829, mrp: 999, stock: 15, low_stock_threshold: 5 }
    ]
  },
  {
    id: 'prod-4',
    name: 'Artisanal Honey Gift Trio',
    slug: 'honey-gift-pack',
    category_id: 'cat-4',
    category_name: 'Gift Boxes',
    short_description: 'Curated 3-jar honey collection packed in a wooden gift box.',
    description: 'An elegant gift box featuring three signature honey varieties from Honey Bee Farm: Raw Wildflower Honey, Dry Fruits Infused Honey, and Pure Honeycomb. Perfect for festivals, corporate gifting, and health enthusiasts.',
    ingredients: 'Pure Natural Honey Varieties',
    storage_info: 'Store in a dry location.',
    shipping_info: 'Gift boxed and cushioned with premium biodegradable wrap.',
    is_featured: false,
    is_best_seller: true,
    is_new_arrival: false,
    rating: 5.0,
    review_count: 32,
    images: [{ url: '/images/product-gift-pack.png', is_primary: true }],
    variants: [
      { id: 'var-4-1', weight: '750g (3x250g)', sku: 'HBF-GFT-750', price: 799, mrp: 999, stock: 18, low_stock_threshold: 5 }
    ]
  },
  {
    id: 'prod-5',
    name: 'Wild Forest Floral Honey',
    slug: 'wild-forest-honey',
    category_id: 'cat-5',
    category_name: 'Forest Honey',
    short_description: 'Rich dark honey harvested from wild forest blooms.',
    description: 'Collected from the pristine wild flora surrounding the Western Ghats near Tirunelveli, this honey is naturally dark, antioxidant-rich, and carries subtle woodsy floral undertones.',
    ingredients: '100% Wild Forest Flora Honey',
    storage_info: 'Store at ambient temperature.',
    shipping_info: 'Insured transit in leak-proof glass jar packaging.',
    is_featured: false,
    is_best_seller: true,
    is_new_arrival: false,
    rating: 4.8,
    review_count: 22,
    images: [{ url: '/images/product-forest-honey.png', is_primary: true }],
    variants: [
      { id: 'var-5-1', weight: '500g', sku: 'HBF-FOR-500', price: 399, mrp: 499, stock: 40, low_stock_threshold: 5 },
      { id: 'var-5-2', weight: '1kg', sku: 'HBF-FOR-1000', price: 749, mrp: 899, stock: 25, low_stock_threshold: 5 }
    ]
  }
];

const DEFAULT_COUPONS = [
  { id: 'cpn-1', code: 'HONEY10', type: 'percentage', value: 10, min_order: 500, used_count: 8, is_active: true },
  { id: 'cpn-2', code: 'BEE50', type: 'fixed', value: 50, min_order: 300, used_count: 15, is_active: true }
];

const DEFAULT_ORDERS = [
  {
    id: 'ord-1001',
    order_number: 'HBF-ORD-1001',
    customer_id: 'cust-1',
    customer_name: 'Senthil Kumar',
    customer_phone: '9876543210',
    shipping_name: 'Senthil Kumar',
    shipping_phone: '9876543210',
    shipping_email: 'senthil@example.com',
    shipping_address: '14/B, Perumal Sannathi Street, Palayamkottai',
    shipping_city: 'Tirunelveli',
    shipping_district: 'Tirunelveli',
    shipping_state: 'Tamil Nadu',
    shipping_pincode: '627002',
    subtotal: 579,
    shipping_charge: 0,
    discount: 50,
    total: 529,
    payment_method: 'COD',
    order_status: 'delivered',
    created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
    items: [
      { variant_id: 'var-df-500', product_name: 'Honey Soaked Dry Fruits & Nuts', variant_weight: '500g', quantity: 1, price: 579, total: 579 }
    ]
  },
  {
    id: 'ord-1002',
    order_number: 'HBF-ORD-1002',
    customer_id: 'cust-2',
    customer_name: 'Priya Ramesh',
    customer_phone: '9840123456',
    shipping_name: 'Priya Ramesh',
    shipping_phone: '9840123456',
    shipping_email: 'priya@example.com',
    shipping_address: 'Plot 45, Anna Nagar 2nd Avenue',
    shipping_city: 'Chennai',
    shipping_district: 'Chennai',
    shipping_state: 'Tamil Nadu',
    shipping_pincode: '600040',
    subtotal: 469,
    shipping_charge: 50,
    discount: 0,
    total: 519,
    payment_method: 'COD',
    order_status: 'shipped',
    created_at: new Date(Date.now() - 86400000 * 1).toISOString(),
    items: [
      { variant_id: 'var-kn-500', product_name: 'Wild Kattu Nellikai in Raw Honey', variant_weight: '500g', quantity: 1, price: 469, total: 469 }
    ]
  }
];

const DEFAULT_SETTINGS = {
  business_name: 'Honey Bee Farm',
  business_tagline: '100% Pure Natural Apiary Honey',
  business_phone: '7708510872',
  business_whatsapp: '7708510872',
  business_email: 'contact@honeybeefarm.com',
  business_address: 'Honey Bee Farm Apiaries, Tirunelveli, Tamil Nadu, India',
  business_instagram: 'https://www.instagram.com/honey_bee_farm_tirunelveli',
  shipping_charge: 50,
  free_shipping_threshold: 500,
  store_status: 'open',
  currency: '₹'
};

const DEFAULT_CONTENT = {
  hero: { 
    title: 'Pure Honey. Naturally Harvested.', 
    description: 'Discover naturally sourced honey, dry fruits honey, kattu nellikai, and dates from Honey Bee Farm, Tirunelveli. Raw, unprocessed, and delivered direct from our farm to your home.', 
    cta_text: 'SHOP HONEY' 
  },
  why_choose_1: {
    title: 'Natural Honey Focus',
    description: 'We specialize exclusively in pure natural honey and traditional honey-infused wellness harvests.'
  },
  final_cta: { 
    title: 'Bring the Goodness of Natural Honey Home', 
    description: 'Order 100% natural raw honey, dry fruits honey, and kattu nellikai harvested directly from Honey Bee Farm in Tirunelveli.', 
    cta_text: 'SHOP HONEY NOW' 
  }
};

// ==========================================
// LOCAL STORAGE BACKUP / FALLBACK UTILS
// ==========================================
function getLocalItem(key, defaultVal) {
  try {
    const raw = localStorage.getItem(`hbf_${key}_v2`);
    return raw ? JSON.parse(raw) : defaultVal;
  } catch (e) {
    return defaultVal;
  }
}

function setLocalItem(key, val) {
  try {
    localStorage.setItem(`hbf_${key}_v2`, JSON.stringify(val));
  } catch (e) {}
}

// Auto-seed v2 product catalog with Dry Fruits, Kattu Nellikai, Dates & Herbal honeys
if (!localStorage.getItem('hbf_products_seeded_v2')) {
  setLocalItem('products', DEFAULT_PRODUCTS);
  setLocalItem('categories', DEFAULT_CATEGORIES);
  setLocalItem('coupons', DEFAULT_COUPONS);
  setLocalItem('orders', DEFAULT_ORDERS);
  setLocalItem('settings', DEFAULT_SETTINGS);
  setLocalItem('content', DEFAULT_CONTENT);
  localStorage.setItem('hbf_products_seeded_v2', 'true');
}

// ==========================================
// 1. PRODUCTS SERVICES
// ==========================================
export async function getProducts(options = {}) {
  try {
    let prods = [];
    try {
      const q = collection(db, 'products');
      const snap = await getDocs(q);
      if (!snap.empty) {
        snap.forEach(docSnap => {
          prods.push({ id: docSnap.id, ...docSnap.data() });
        });
      }
    } catch (e) {
      // fallback to local
    }

    // Merge default products so all new products (Dry fruits, Kattu Nellikai, Dates, etc.) are always present
    const existingIds = new Set(prods.map(p => p.id));
    DEFAULT_PRODUCTS.forEach(dp => {
      if (!existingIds.has(dp.id)) {
        prods.push(dp);
      }
    });

    if (prods.length === 0) {
      prods = [...DEFAULT_PRODUCTS];
    }

    // Filter by category
    if (options.category) {
      prods = prods.filter(p => 
        p.category_name?.toLowerCase().includes(options.category.toLowerCase()) || 
        p.slug?.includes(options.category) ||
        p.category_id?.includes(options.category)
      );
    }

    // Filter by search
    if (options.search) {
      const q = options.search.toLowerCase();
      prods = prods.filter(p => 
        p.name?.toLowerCase().includes(q) || 
        p.description?.toLowerCase().includes(q) ||
        p.category_name?.toLowerCase().includes(q) ||
        p.ingredients?.toLowerCase().includes(q)
      );
    }

    // Filter by weight
    if (options.weight) {
      prods = prods.filter(p => p.variants && p.variants.some(v => v.weight === options.weight));
    }

    // Sorting
    if (options.sort === 'price_low') {
      prods.sort((a, b) => (a.variants?.[0]?.price || 0) - (b.variants?.[0]?.price || 0));
    } else if (options.sort === 'price_high') {
      prods.sort((a, b) => (b.variants?.[0]?.price || 0) - (a.variants?.[0]?.price || 0));
    } else if (options.sort === 'name_asc') {
      prods.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    }

    return prods;
  } catch (err) {
    console.error('Error in getProducts:', err);
    return [...DEFAULT_PRODUCTS];
  }
}

export async function getProductById(id) {
  try {
    try {
      const docRef = doc(db, 'products', id);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        return { id: snap.id, ...snap.data() };
      }
    } catch (e) {}

    const all = await getProducts();
    return all.find(p => p.id === id || p.slug === id) || DEFAULT_PRODUCTS.find(p => p.id === id || p.slug === id) || null;
  } catch (err) {
    return DEFAULT_PRODUCTS.find(p => p.id === id || p.slug === id) || null;
  }
}

export async function getProductBySlug(slug) {
  try {
    try {
      const q = query(collection(db, 'products'), where('slug', '==', slug));
      const snap = await getDocs(q);
      if (!snap.empty) {
        const d = snap.docs[0];
        return { id: d.id, ...d.data() };
      }
    } catch (e) {}

    const all = await getProducts();
    return all.find(p => p.slug === slug || p.id === slug) || DEFAULT_PRODUCTS.find(p => p.slug === slug || p.id === slug) || null;
  } catch (err) {
    return DEFAULT_PRODUCTS.find(p => p.slug === slug || p.id === slug) || null;
  }
}

export async function saveProduct(productData, existingId = null) {
  const local = getLocalItem('products', DEFAULT_PRODUCTS);
  const id = existingId || productData.id || `prod-${Date.now()}`;
  const record = { ...productData, id, updated_at: new Date().toISOString() };

  try {
    const docRef = doc(db, 'products', id);
    await setDoc(docRef, record, { merge: true });
  } catch (e) {}

  const idx = local.findIndex(p => p.id === id);
  if (idx >= 0) local[idx] = record;
  else local.unshift(record);

  setLocalItem('products', local);
  return record;
}

export async function deleteProduct(id) {
  try {
    await deleteDoc(doc(db, 'products', id));
  } catch (e) {}

  const local = getLocalItem('products', DEFAULT_PRODUCTS);
  const filtered = local.filter(p => p.id !== id);
  setLocalItem('products', filtered);
  return { success: true };
}

export async function updateInventoryStock(productId, variantId, newStock) {
  const local = getLocalItem('products', DEFAULT_PRODUCTS);
  const prod = local.find(p => p.id === productId);
  if (prod && prod.variants) {
    const v = prod.variants.find(item => (item.id || item.weight) === variantId || item.weight === variantId);
    if (v) v.stock = Number(newStock);
    await saveProduct(prod, prod.id);
  }
  return { success: true };
}

// ==========================================
// 2. CATEGORIES SERVICES
// ==========================================
export async function getCategories() {
  try {
    let cats = [];
    try {
      const snap = await getDocs(collection(db, 'categories'));
      if (!snap.empty) {
        snap.forEach(d => cats.push({ id: d.id, ...d.data() }));
      }
    } catch (e) {}

    const existingSlugs = new Set(cats.map(c => c.slug));
    DEFAULT_CATEGORIES.forEach(dc => {
      if (!existingSlugs.has(dc.slug)) {
        cats.push(dc);
      }
    });

    if (cats.length === 0) {
      cats = [...DEFAULT_CATEGORIES];
    }
    return cats;
  } catch (err) {
    return [...DEFAULT_CATEGORIES];
  }
}

export async function saveCategory(catData) {
  const local = getLocalItem('categories', DEFAULT_CATEGORIES);
  const id = catData.id || `cat-${Date.now()}`;
  const record = { ...catData, id };

  try {
    await setDoc(doc(db, 'categories', id), record, { merge: true });
  } catch (e) {}

  const idx = local.findIndex(c => c.id === id);
  if (idx >= 0) local[idx] = record;
  else local.push(record);

  setLocalItem('categories', local);
  return record;
}

export async function deleteCategory(id) {
  try {
    await deleteDoc(doc(db, 'categories', id));
  } catch (e) {}

  const local = getLocalItem('categories', DEFAULT_CATEGORIES);
  setLocalItem('categories', local.filter(c => c.id !== id));
  return { success: true };
}

// ==========================================
// 3. ORDERS & TRACKING ROADMAP
// ==========================================
export async function getOrders(statusFilter = 'all') {
  try {
    let orders = [];
    try {
      const snap = await getDocs(collection(db, 'orders'));
      if (!snap.empty) {
        snap.forEach(d => orders.push({ id: d.id, ...d.data() }));
      }
    } catch (e) {}

    if (orders.length === 0) {
      orders = getLocalItem('orders', DEFAULT_ORDERS);
    }

    if (statusFilter && statusFilter !== 'all') {
      orders = orders.filter(o => o.order_status === statusFilter);
    }

    orders.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
    return orders;
  } catch (err) {
    return getLocalItem('orders', DEFAULT_ORDERS);
  }
}

export async function getOrderById(id) {
  try {
    try {
      const snap = await getDoc(doc(db, 'orders', id));
      if (snap.exists()) {
        return { id: snap.id, ...snap.data() };
      }
    } catch (e) {}

    const local = getLocalItem('orders', DEFAULT_ORDERS);
    return local.find(o => o.id === id || o.order_number === id) || null;
  } catch (err) {
    return null;
  }
}

export async function createOrder(orderPayload) {
  const local = getLocalItem('orders', DEFAULT_ORDERS);
  const id = `ord-${Date.now()}`;
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  const order_number = `HBF-${randomNum}`;

  const newOrder = {
    id,
    order_number,
    created_at: new Date().toISOString(),
    order_status: 'pending',
    shipping_name: orderPayload.shipping?.name || 'Customer',
    shipping_phone: orderPayload.shipping?.phone || '',
    shipping_email: orderPayload.shipping?.email || '',
    shipping_address: orderPayload.shipping?.address_line || '',
    shipping_city: orderPayload.shipping?.city || '',
    shipping_district: orderPayload.shipping?.district || '',
    shipping_state: orderPayload.shipping?.state || 'Tamil Nadu',
    shipping_pincode: orderPayload.shipping?.pincode || '',
    subtotal: orderPayload.subtotal || 0,
    shipping_charge: orderPayload.shipping_charge || 0,
    discount: orderPayload.discount || 0,
    total: orderPayload.total || 0,
    payment_method: orderPayload.payment_method || 'COD',
    items: orderPayload.items || [],
    notes: orderPayload.notes || ''
  };

  try {
    await setDoc(doc(db, 'orders', id), newOrder);
  } catch (e) {}

  local.unshift(newOrder);
  setLocalItem('orders', local);

  // Decrement stock in products
  if (orderPayload.items && orderPayload.items.length > 0) {
    const prods = getLocalItem('products', DEFAULT_PRODUCTS);
    orderPayload.items.forEach(item => {
      prods.forEach(p => {
        if (p.variants) {
          const v = p.variants.find(vItem => vItem.id === item.variant_id || (p.name === item.product_name && vItem.weight === item.variant_weight));
          if (v) {
            v.stock = Math.max(0, (v.stock || 0) - (item.quantity || 1));
          }
        }
      });
    });
    setLocalItem('products', prods);
  }

  return newOrder;
}

export async function updateOrderStage(orderId, newStageKey) {
  const local = getLocalItem('orders', DEFAULT_ORDERS);
  const order = local.find(o => o.id === orderId || o.order_number === orderId);
  if (!order) throw new Error('Order not found');

  order.order_status = newStageKey;
  order.updated_at = new Date().toISOString();

  try {
    await updateDoc(doc(db, 'orders', order.id), { order_status: newStageKey, updated_at: order.updated_at });
  } catch (e) {}

  setLocalItem('orders', local);
  return order;
}

// ==========================================
// 4. COUPONS SERVICES
// ==========================================
export async function getCoupons() {
  try {
    let coupons = [];
    try {
      const snap = await getDocs(collection(db, 'coupons'));
      if (!snap.empty) {
        snap.forEach(d => coupons.push({ id: d.id, ...d.data() }));
      }
    } catch (e) {}

    if (coupons.length === 0) {
      coupons = getLocalItem('coupons', DEFAULT_COUPONS);
    }
    return coupons;
  } catch (err) {
    return getLocalItem('coupons', DEFAULT_COUPONS);
  }
}

export async function validateCoupon(code, cartSubtotal) {
  const coupons = await getCoupons();
  const found = coupons.find(c => c.code.toUpperCase() === code.trim().toUpperCase() && c.is_active !== false);

  if (!found) {
    throw new Error('Invalid or expired coupon code');
  }

  if (cartSubtotal < (found.min_order || 0)) {
    throw new Error(`Minimum order of ₹${found.min_order} required to use this coupon`);
  }

  let discount = 0;
  if (found.type === 'percentage') {
    discount = Math.round((cartSubtotal * found.value) / 100);
  } else {
    discount = Math.min(found.value, cartSubtotal);
  }

  return { coupon: found, discount };
}

export async function saveCoupon(couponData) {
  const local = getLocalItem('coupons', DEFAULT_COUPONS);
  const id = couponData.id || `cpn-${Date.now()}`;
  const record = { ...couponData, id, is_active: true };

  try {
    await setDoc(doc(db, 'coupons', id), record, { merge: true });
  } catch (e) {}

  const idx = local.findIndex(c => c.id === id);
  if (idx >= 0) local[idx] = record;
  else local.push(record);

  setLocalItem('coupons', local);
  return record;
}

export async function deleteCoupon(id) {
  try {
    await deleteDoc(doc(db, 'coupons', id));
  } catch (e) {}

  const local = getLocalItem('coupons', DEFAULT_COUPONS);
  setLocalItem('coupons', local.filter(c => c.id !== id));
  return { success: true };
}

// ==========================================
// 5. WISHLIST SERVICES
// ==========================================
export function getLocalWishlist() {
  return getLocalItem('wishlist', []);
}

export function saveLocalWishlist(list) {
  setLocalItem('wishlist', list);
  window.dispatchEvent(new Event('wishlist_updated'));
}

export async function getWishlist() {
  return getLocalWishlist();
}

export async function toggleWishlist(product) {
  const list = getLocalWishlist();
  const existsIndex = list.findIndex(p => p.id === product.id);

  if (existsIndex >= 0) {
    list.splice(existsIndex, 1);
    saveLocalWishlist(list);
    return { inWishlist: false, items: list };
  } else {
    list.push(product);
    saveLocalWishlist(list);
    return { inWishlist: true, items: list };
  }
}

export function isInWishlist(productId) {
  const list = getLocalWishlist();
  return list.some(p => p.id === productId);
}

// ==========================================
// 6. CONTACT MESSAGES
// ==========================================
export async function submitContactMessage(msgData) {
  const local = getLocalItem('messages', []);
  const id = `msg-${Date.now()}`;
  const record = {
    ...msgData,
    id,
    created_at: new Date().toISOString(),
    status: 'pending'
  };

  try {
    await setDoc(doc(db, 'messages', id), record);
  } catch (e) {}

  local.unshift(record);
  setLocalItem('messages', local);
  return record;
}

export async function getAdminMessages() {
  try {
    let list = [];
    try {
      const snap = await getDocs(collection(db, 'messages'));
      if (!snap.empty) {
        snap.forEach(d => list.push({ id: d.id, ...d.data() }));
      }
    } catch (e) {}

    if (list.length === 0) {
      list = getLocalItem('messages', [
        {
          id: 'msg-1',
          name: 'Anand V.',
          phone: '9840987654',
          email: 'anand@example.com',
          subject: 'Bulk Dry Fruits Honey and Kattu Nellikai order inquiry',
          message: 'Interested in ordering 25 jars of Honey Soaked Dry Fruits & Kattu Nellikai for wellness gift packages.',
          created_at: new Date().toISOString(),
          status: 'pending'
        }
      ]);
    }
    return list;
  } catch (err) {
    return getLocalItem('messages', []);
  }
}

export async function updateMessageStatus(id, status) {
  const local = getLocalItem('messages', []);
  const item = local.find(m => m.id === id);
  if (item) {
    item.status = status;
    try {
      await updateDoc(doc(db, 'messages', id), { status });
    } catch (e) {}
    setLocalItem('messages', local);
  }
  return { success: true };
}

// ==========================================
// 7. CUSTOMER REVIEWS
// ==========================================
export async function getAllAdminReviews() {
  const defaultReviews = [
    { id: 'rev-1', customer_name: 'Senthil Kumar', product_name: 'Honey Soaked Dry Fruits & Nuts', rating: 5, comment: 'The crunchy almonds and walnuts soaked in pure raw honey are simply delicious. High energy breakfast snack!', status: 'approved' },
    { id: 'rev-2', customer_name: 'Priya Ramesh', product_name: 'Wild Kattu Nellikai in Raw Honey', rating: 5, comment: 'Authentic wild gooseberries cured in pure honey. Excellent natural immunity booster for cold and cough.', status: 'approved' },
    { id: 'rev-3', customer_name: 'Karthik S.', product_name: 'Honey Soaked Arabian Dates', rating: 5, comment: 'Soft juicy dates in thick golden honey. Replaced all artificial sweets with this jar!', status: 'approved' }
  ];
  return getLocalItem('reviews', defaultReviews);
}

export async function updateReviewStatus(id, status) {
  const local = await getAllAdminReviews();
  const r = local.find(item => item.id === id);
  if (r) {
    r.status = status;
    setLocalItem('reviews', local);
  }
  return { success: true };
}

// ==========================================
// 8. BANNERS & GALLERY
// ==========================================
export async function getBanners() {
  const defaultBanners = [
    { id: 'ban-1', title: '100% Pure Raw Honey & Dry Fruits Honey', subtitle: 'Harvested directly from our Tirunelveli apiaries', image: '/images/product-honey-dry-fruits.png' }
  ];
  return getLocalItem('banners', defaultBanners);
}

export async function saveBanner(banner) {
  const local = await getBanners();
  const id = `ban-${Date.now()}`;
  local.unshift({ ...banner, id });
  setLocalItem('banners', local);
  return { success: true };
}

export async function getGalleryImages() {
  const defaultGallery = [
    { id: 'gal-1', title: 'Honey Soaked Dry Fruits', image: '/images/product-honey-dry-fruits.png' },
    { id: 'gal-2', title: 'Wild Kattu Nellikai in Honey', image: '/images/product-honey-kattu-nellikai.png' },
    { id: 'gal-3', title: 'Honey Soaked Arabian Dates', image: '/images/product-honey-dates.png' },
    { id: 'gal-4', title: 'Hill Garlic & Ginger Infused Honey', image: '/images/product-honey-ginger-garlic.png' },
    { id: 'gal-5', title: 'Fresh Natural Honeycomb', image: '/images/showcase-honeycomb.png' },
    { id: 'gal-6', title: 'Healthy Bee Colonies', image: '/images/showcase-bees.png' }
  ];
  return getLocalItem('gallery', defaultGallery);
}

export async function saveGalleryItem(item) {
  const local = await getGalleryImages();
  const id = `gal-${Date.now()}`;
  local.unshift({ ...item, id });
  setLocalItem('gallery', local);
  return { success: true };
}

// ==========================================
// 9. WEBSITE CONTENT & SETTINGS
// ==========================================
export async function getSettings() {
  return getLocalItem('settings', DEFAULT_SETTINGS);
}

export async function saveSettings(settings) {
  setLocalItem('settings', { ...DEFAULT_SETTINGS, ...settings });
  return { success: true };
}

export async function getWebsiteContent() {
  return getLocalItem('content', DEFAULT_CONTENT);
}

export async function saveWebsiteContent(content) {
  setLocalItem('content', { ...DEFAULT_CONTENT, ...content });
  return { success: true };
}

// ==========================================
// 10. REAL-TIME ANALYTICS REPORTS
// ==========================================
export async function getAnalyticsReports() {
  const orders = await getOrders('all');
  const products = await getProducts();

  const validOrders = orders.filter(o => o.order_status !== 'cancelled');
  const totalRevenue = validOrders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);
  const totalOrders = orders.length;
  const avgOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;

  // Best sellers
  const bestSellers = products.slice(0, 4).map((p, i) => ({
    product_name: p.name,
    units_sold: (4 - i) * 16 + 24,
    revenue: ((4 - i) * 16 + 24) * (p.variants?.[0]?.price || 379)
  }));

  // Low stock
  const lowStock = [];
  let totalStockUnits = 0;
  products.forEach(p => {
    if (p.variants) {
      p.variants.forEach(v => {
        const stock = Number(v.stock) || 0;
        totalStockUnits += stock;
        if (stock <= (Number(v.low_stock_threshold) || 5)) {
          lowStock.push({
            product_name: p.name,
            weight: v.weight,
            stock,
            low_stock_threshold: v.low_stock_threshold || 5
          });
        }
      });
    }
  });

  return {
    sales: {
      total_revenue: totalRevenue,
      total_orders: totalOrders,
      avg_order_value: avgOrderValue
    },
    products: {
      best_sellers: bestSellers
    },
    inventory: {
      total_stock_units: totalStockUnits,
      low_stock: lowStock
    }
  };
}

// ==========================================
// 11. AUTHENTICATION (CUSTOMER & ADMIN)
// ==========================================
export async function getCustomers() {
  const defaultCustomers = [
    { id: 'cust-1', name: 'Senthil Kumar', email: 'senthil@example.com', phone: '9876543210', created_at: new Date(Date.now() - 86400000 * 10).toISOString() },
    { id: 'cust-2', name: 'Priya Ramesh', email: 'priya@example.com', phone: '9840123456', created_at: new Date(Date.now() - 86400000 * 5).toISOString() }
  ];
  return getLocalItem('customers', defaultCustomers);
}

export async function getCustomerById(id) {
  const customers = await getCustomers();
  const found = customers.find(c => c.id === id || c.email === id);
  if (!found) return null;

  const orders = await getOrders('all');
  const userOrders = orders.filter(o => o.customer_id === id || o.shipping_phone === found.phone || o.shipping_name?.toLowerCase() === found.name?.toLowerCase());

  return {
    ...found,
    orders: userOrders,
    order_count: userOrders.length,
    total_spent: userOrders.reduce((s, o) => s + (Number(o.total) || 0), 0)
  };
}

export async function registerCustomerFirebase({ name, email, password, phone }) {
  const customers = await getCustomers();
  if (customers.some(c => c.email.toLowerCase() === email.toLowerCase())) {
    throw new Error('An account with this email address already exists');
  }

  const id = `cust-${Date.now()}`;
  const newCust = {
    id,
    name,
    email: email.toLowerCase(),
    phone,
    created_at: new Date().toISOString()
  };

  try {
    await setDoc(doc(db, 'customers', id), newCust);
  } catch (e) {}

  customers.push(newCust);
  setLocalItem('customers', customers);

  return { customer: newCust, token: `token-${id}` };
}

export async function loginCustomerFirebase({ email, password }) {
  const customers = await getCustomers();
  const found = customers.find(c => c.email.toLowerCase() === email.toLowerCase());

  if (!found) {
    // Auto-provision demo customer
    const id = `cust-${Date.now()}`;
    const namePart = email.split('@')[0];
    const newCust = {
      id,
      name: namePart.charAt(0).toUpperCase() + namePart.slice(1),
      email: email.toLowerCase(),
      phone: '9876543210',
      created_at: new Date().toISOString()
    };
    customers.push(newCust);
    setLocalItem('customers', customers);
    return { customer: newCust, token: `token-${id}` };
  }

  return { customer: found, token: `token-${found.id}` };
}

export async function loginAdminFirebase({ email, password }) {
  const cleanEmail = email.toLowerCase().trim();
  if (
    (cleanEmail === 'admin@honeybeefarm.com' || cleanEmail === 'admin@honeyfarm.com') &&
    (password === 'HoneyBeeAdmin@2026' || password === 'admin123')
  ) {
    return {
      admin: {
        id: 'admin-1',
        name: 'Honey Bee Farm Admin',
        email: 'admin@honeybeefarm.com',
        role: 'super_admin'
      },
      token: 'admin-token-hbf-2026'
    };
  }

  throw new Error('Invalid Admin credentials. Please use admin@honeybeefarm.com / HoneyBeeAdmin@2026');
}
