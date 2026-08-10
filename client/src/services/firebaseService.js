import { 
  collection, 
  getDocs, 
  getDoc, 
  doc, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit 
} from 'firebase/firestore';
import { db } from '../firebase';

// ============================================================
// DEFAULT SEED DATA FOR AUTOMATIC FIRESTORE SEEDING
// ============================================================
const DEFAULT_CATEGORIES = [
  { id: 'cat-1', name: 'Natural Honey', slug: 'natural-honey', description: 'Pure and natural honey sourced directly from our farm', sort_order: 1, is_active: true },
  { id: 'cat-2', name: 'Honey Comb', slug: 'honey-comb', description: 'Fresh honeycomb straight from the hive', sort_order: 2, is_active: true },
  { id: 'cat-3', name: 'Premium Honey', slug: 'premium-honey', description: 'Our finest selection of premium quality honey', sort_order: 3, is_active: true },
  { id: 'cat-4', name: 'Honey Gift Packs', slug: 'honey-gift-packs', description: 'Beautifully packaged honey gift sets', sort_order: 4, is_active: true },
  { id: 'cat-5', name: 'Bee Products', slug: 'bee-products', description: 'Natural bee-related products from our farm', sort_order: 5, is_active: true }
];

const DEFAULT_PRODUCTS = [
  {
    id: 'prod-1',
    name: 'Pure Natural Honey',
    slug: 'pure-natural-honey',
    category_id: 'cat-1',
    category_name: 'Natural Honey',
    short_description: 'Farm-fresh natural honey from Tirunelveli',
    description: 'Experience the authentic taste of pure natural honey, carefully harvested from our bee farms in Tirunelveli, Tamil Nadu. Our honey is unprocessed and retains all its natural goodness.',
    ingredients: '100% Natural Honey',
    storage_info: 'Store in a cool, dry place away from direct sunlight.',
    shipping_info: 'Shipped in secure packaging. Delivery within 5-7 business days across India.',
    is_featured: true,
    is_best_seller: true,
    is_new_arrival: false,
    status: 'active',
    rating: 5.0,
    review_count: 14,
    images: [{ url: '/images/product-natural-honey.png', is_primary: true }],
    variants: [
      { id: 'var-1', weight: '250g', sku: 'KHF-PNH-250', price: 199, mrp: 249, stock: 50, low_stock_threshold: 10 },
      { id: 'var-2', weight: '500g', sku: 'KHF-PNH-500', price: 379, mrp: 449, stock: 40, low_stock_threshold: 10 },
      { id: 'var-3', weight: '1kg', sku: 'KHF-PNH-1000', price: 699, mrp: 849, stock: 30, low_stock_threshold: 5 }
    ]
  },
  {
    id: 'prod-2',
    name: 'Natural Honey Comb',
    slug: 'natural-honey-comb',
    category_id: 'cat-2',
    category_name: 'Honey Comb',
    short_description: 'Fresh honeycomb with pure honey',
    description: 'Enjoy honey in its most natural form — straight from the comb. Our fresh honeycomb is harvested carefully to preserve the delicate wax structure filled with pure raw honey.',
    ingredients: '100% Natural Honeycomb with Raw Honey',
    storage_info: 'Store in a cool, dry place.',
    shipping_info: 'Carefully packed to preserve comb structure. Delivery within 5-7 business days.',
    is_featured: true,
    is_best_seller: false,
    is_new_arrival: true,
    status: 'active',
    rating: 4.9,
    review_count: 9,
    images: [{ url: '/images/product-honeycomb.png', is_primary: true }],
    variants: [
      { id: 'var-4', weight: '250g', sku: 'KHF-NHC-250', price: 349, mrp: 449, stock: 20, low_stock_threshold: 5 },
      { id: 'var-5', weight: '500g', sku: 'KHF-NHC-500', price: 649, mrp: 799, stock: 15, low_stock_threshold: 5 }
    ]
  },
  {
    id: 'prod-3',
    name: 'Premium Honey',
    slug: 'premium-honey',
    category_id: 'cat-3',
    category_name: 'Premium Honey',
    short_description: 'Our finest quality premium honey selection',
    description: 'Kamala Premium Honey represents the very best of our harvest. Selected from the finest batches, this honey has a rich, complex flavor profile and smooth texture.',
    ingredients: '100% Pure Premium Honey',
    storage_info: 'Store in a cool, dry place away from direct sunlight.',
    shipping_info: 'Premium packaging with secure delivery. Ships within 3-5 business days.',
    is_featured: true,
    is_best_seller: true,
    is_new_arrival: false,
    status: 'active',
    rating: 5.0,
    review_count: 22,
    images: [{ url: '/images/product-premium-honey.png', is_primary: true }],
    variants: [
      { id: 'var-6', weight: '250g', sku: 'KHF-PMH-250', price: 299, mrp: 399, stock: 25, low_stock_threshold: 5 },
      { id: 'var-7', weight: '500g', sku: 'KHF-PMH-500', price: 549, mrp: 699, stock: 20, low_stock_threshold: 5 },
      { id: 'var-8', weight: '1kg', sku: 'KHF-PMH-1000', price: 999, mrp: 1249, stock: 15, low_stock_threshold: 3 }
    ]
  },
  {
    id: 'prod-4',
    name: 'Premium Honey Gift Pack',
    slug: 'premium-honey-gift-pack',
    category_id: 'cat-4',
    category_name: 'Honey Gift Packs',
    short_description: 'Beautifully packaged honey gift set',
    description: 'The perfect gift for honey enthusiasts. Our Premium Honey Gift Pack features a curated selection of our finest honey varieties, elegantly packaged in a gift box.',
    ingredients: 'Assorted Natural Honey Varieties',
    storage_info: 'Store in a cool, dry place.',
    shipping_info: 'Gift-wrapped and shipped in protective packaging. Delivery within 5-7 business days.',
    is_featured: true,
    is_best_seller: false,
    is_new_arrival: true,
    status: 'active',
    rating: 4.8,
    review_count: 7,
    images: [{ url: '/images/product-gift-pack.png', is_primary: true }],
    variants: [
      { id: 'var-9', weight: '500g', sku: 'KHF-HGP-500', price: 799, mrp: 999, stock: 20, low_stock_threshold: 5 },
      { id: 'var-10', weight: '1kg', sku: 'KHF-HGP-1000', price: 1499, mrp: 1799, stock: 10, low_stock_threshold: 3 }
    ]
  },
  {
    id: 'prod-5',
    name: 'Forest Honey',
    slug: 'forest-honey',
    category_id: 'cat-1',
    category_name: 'Natural Honey',
    short_description: 'Wild forest honey with rich aroma',
    description: 'Our Forest Honey is sourced from bee colonies in the dense forests surrounding Tirunelveli. The bees collect nectar from wildflowers resulting in a honey with a deep rich flavor.',
    ingredients: '100% Natural Forest Honey',
    storage_info: 'Store in a cool, dry place away from direct sunlight.',
    shipping_info: 'Shipped in secure, leak-proof packaging. Delivery within 5-7 business days.',
    is_featured: false,
    is_best_seller: true,
    is_new_arrival: false,
    status: 'active',
    rating: 4.9,
    review_count: 18,
    images: [{ url: '/images/product-forest-honey.png', is_primary: true }],
    variants: [
      { id: 'var-11', weight: '250g', sku: 'KHF-FRH-250', price: 249, mrp: 329, stock: 30, low_stock_threshold: 5 },
      { id: 'var-12', weight: '500g', sku: 'KHF-FRH-500', price: 449, mrp: 599, stock: 25, low_stock_threshold: 5 },
      { id: 'var-13', weight: '1kg', sku: 'KHF-FRH-1000', price: 849, mrp: 1049, stock: 15, low_stock_threshold: 3 }
    ]
  }
];

const DEFAULT_COUPONS = [
  { id: 'cpn-1', code: 'HONEY10', type: 'percentage', value: 10, min_order: 500, used_count: 3, is_active: true },
  { id: 'cpn-2', code: 'KAMALA50', type: 'fixed', value: 50, min_order: 300, used_count: 1, is_active: true }
];

const DEFAULT_SETTINGS = {
  business_name: 'Kamala Honey Farm',
  business_tagline: 'Natural Honey Farm',
  business_phone: '7708510872',
  business_whatsapp: '7708510872',
  business_email: 'contact@kamalahoneyfarm.com',
  business_address: 'Tirunelveli, Tamil Nadu, India',
  business_instagram: 'https://www.instagram.com/kamala_honey_farm_tirunelveli',
  currency: '₹',
  shipping_charge: 50,
  free_shipping_threshold: 500,
  cod_enabled: true
};

let isSeeded = false;

export async function ensureFirestoreSeeded() {
  if (isSeeded) return;
  try {
    const categoriesSnap = await getDocs(collection(db, 'categories'));
    if (categoriesSnap.empty) {
      console.log('Seeding initial categories to Firestore...');
      for (const cat of DEFAULT_CATEGORIES) {
        await setDoc(doc(db, 'categories', cat.id), cat);
      }
    }

    const productsSnap = await getDocs(collection(db, 'products'));
    if (productsSnap.empty) {
      console.log('Seeding initial honey products to Firestore...');
      for (const prod of DEFAULT_PRODUCTS) {
        await setDoc(doc(db, 'products', prod.id), prod);
      }
    }

    const couponsSnap = await getDocs(collection(db, 'coupons'));
    if (couponsSnap.empty) {
      for (const cpn of DEFAULT_COUPONS) {
        await setDoc(doc(db, 'coupons', cpn.id), cpn);
      }
    }

    const settingsDoc = await getDoc(doc(db, 'settings', 'general'));
    if (!settingsDoc.exists()) {
      await setDoc(doc(db, 'settings', 'general'), DEFAULT_SETTINGS);
    }

    isSeeded = true;
  } catch (err) {
    console.error('Firestore seed note:', err.message);
  }
}

// ============================================================
// CATEGORIES SERVICE
// ============================================================
export async function getCategories() {
  await ensureFirestoreSeeded();
  try {
    const snap = await getDocs(collection(db, 'categories'));
    const cats = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return cats.length > 0 ? cats : DEFAULT_CATEGORIES;
  } catch (err) {
    return DEFAULT_CATEGORIES;
  }
}

export async function saveCategory(categoryData, id = null) {
  await ensureFirestoreSeeded();
  if (id) {
    await updateDoc(doc(db, 'categories', id), categoryData);
    return { id, ...categoryData };
  } else {
    const docRef = await addDoc(collection(db, 'categories'), {
      ...categoryData,
      is_active: true,
      created_at: new Date().toISOString()
    });
    return { id: docRef.id, ...categoryData };
  }
}

export async function deleteCategory(id) {
  await deleteDoc(doc(db, 'categories', id));
}

// ============================================================
// PRODUCTS SERVICE
// ============================================================
export async function getProducts(options = {}) {
  await ensureFirestoreSeeded();
  try {
    const snap = await getDocs(collection(db, 'products'));
    let prods = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    if (options.category) {
      prods = prods.filter(p => p.category_slug === options.category || p.category_id === options.category || p.category_name === options.category);
    }
    if (options.search) {
      const q = options.search.toLowerCase();
      prods = prods.filter(p => p.name.toLowerCase().includes(q) || (p.description && p.description.toLowerCase().includes(q)));
    }
    if (options.weight) {
      prods = prods.filter(p => p.variants && p.variants.some(v => v.weight === options.weight));
    }
    if (options.sort === 'price_low') {
      prods.sort((a, b) => (a.variants[0]?.price || 0) - (b.variants[0]?.price || 0));
    } else if (options.sort === 'price_high') {
      prods.sort((a, b) => (b.variants[0]?.price || 0) - (a.variants[0]?.price || 0));
    }

    return prods.length > 0 ? prods : DEFAULT_PRODUCTS;
  } catch (err) {
    console.error('getProducts error:', err);
    return DEFAULT_PRODUCTS;
  }
}

export async function getProductById(id) {
  await ensureFirestoreSeeded();
  try {
    const d = await getDoc(doc(db, 'products', id));
    if (d.exists()) {
      return { id: d.id, ...d.data() };
    }
  } catch (err) {}
  return DEFAULT_PRODUCTS.find(p => p.id === id) || DEFAULT_PRODUCTS[0];
}

export async function getProductBySlug(slug) {
  await ensureFirestoreSeeded();
  try {
    const q = query(collection(db, 'products'), where('slug', '==', slug));
    const snap = await getDocs(q);
    if (!snap.empty) {
      const d = snap.docs[0];
      return { id: d.id, ...d.data() };
    }
  } catch (err) {}
  return DEFAULT_PRODUCTS.find(p => p.slug === slug) || DEFAULT_PRODUCTS[0];
}

export async function saveProduct(productData, productId = null) {
  await ensureFirestoreSeeded();
  if (productId) {
    await updateDoc(doc(db, 'products', productId), { ...productData, updated_at: new Date().toISOString() });
    return { id: productId, ...productData };
  } else {
    const docRef = await addDoc(collection(db, 'products'), {
      ...productData,
      rating: 5.0,
      review_count: 0,
      created_at: new Date().toISOString()
    });
    return { id: docRef.id, ...productData };
  }
}

export async function deleteProduct(productId) {
  await deleteDoc(doc(db, 'products', productId));
}

// ============================================================
// INVENTORY SERVICE
// ============================================================
export async function updateInventoryStock(productId, variantId, newStock) {
  await ensureFirestoreSeeded();
  const prodRef = doc(db, 'products', productId);
  const prodSnap = await getDoc(prodRef);
  if (!prodSnap.exists()) return;

  const product = prodSnap.data();
  const updatedVariants = product.variants.map(v => {
    if (v.id === variantId || v.weight === variantId) {
      return { ...v, stock: parseInt(newStock) };
    }
    return v;
  });

  await updateDoc(prodRef, { variants: updatedVariants });
}

// ============================================================
// ORDERS SERVICE (WITH 7-STAGE ROADMAP & CANCELLATION LOCK)
// ============================================================
export async function createOrder(orderPayload) {
  await ensureFirestoreSeeded();
  const orderNum = `KHF-2026-${Math.floor(10000 + Math.random() * 90000)}`;

  const orderData = {
    order_number: orderNum,
    shipping_name: orderPayload.shipping.name,
    shipping_phone: orderPayload.shipping.phone,
    shipping_address: orderPayload.shipping.address_line,
    shipping_city: orderPayload.shipping.city,
    shipping_district: orderPayload.shipping.district || orderPayload.shipping.city,
    shipping_state: orderPayload.shipping.state,
    shipping_pincode: orderPayload.shipping.pincode,
    items: orderPayload.items || [],
    subtotal: orderPayload.subtotal || 0,
    shipping_charge: orderPayload.shipping_charge || 0,
    discount: orderPayload.discount || 0,
    total: orderPayload.total || 0,
    payment_method: 'COD',
    payment_status: 'pending',
    order_status: 'pending',
    created_at: new Date().toISOString()
  };

  const docRef = await addDoc(collection(db, 'orders'), orderData);
  return { id: docRef.id, ...orderData };
}

export async function getOrders(statusFilter = 'all') {
  await ensureFirestoreSeeded();
  try {
    const snap = await getDocs(collection(db, 'orders'));
    let orders = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    if (statusFilter && statusFilter !== 'all') {
      orders = orders.filter(o => o.order_status === statusFilter);
    }
    orders.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    return orders;
  } catch (err) {
    return [];
  }
}

export async function getOrderById(orderId) {
  await ensureFirestoreSeeded();
  try {
    const d = await getDoc(doc(db, 'orders', orderId));
    if (d.exists()) {
      return { id: d.id, ...d.data() };
    }
    // Try finding by order_number
    const q = query(collection(db, 'orders'), where('order_number', '==', orderId));
    const snap = await getDocs(q);
    if (!snap.empty) {
      return { id: snap.docs[0].id, ...snap.docs[0].data() };
    }
  } catch (err) {}
  return null;
}

export async function updateOrderStage(orderId, newStageKey) {
  await ensureFirestoreSeeded();
  const orderRef = doc(db, 'orders', orderId);
  const orderSnap = await getDoc(orderRef);

  if (!orderSnap.exists()) throw new Error('Order not found');
  const order = orderSnap.data();

  if (newStageKey === 'cancelled') {
    const lockedStages = ['packed', 'shipped', 'out_for_delivery', 'delivered'];
    if (lockedStages.includes(order.order_status)) {
      throw new Error('Orders that are already packed, shipped, or delivered cannot be cancelled!');
    }
  }

  await updateDoc(orderRef, {
    order_status: newStageKey,
    updated_at: new Date().toISOString()
  });

  return { ...order, order_status: newStageKey };
}

// ============================================================
// CUSTOMERS SERVICE
// ============================================================
export async function getCustomers() {
  await ensureFirestoreSeeded();
  try {
    const snap = await getDocs(collection(db, 'customers'));
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (err) {
    return [];
  }
}

// ============================================================
// COUPONS & SETTINGS SERVICE
// ============================================================
export async function getCoupons() {
  await ensureFirestoreSeeded();
  try {
    const snap = await getDocs(collection(db, 'coupons'));
    const c = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    return c.length > 0 ? c : DEFAULT_COUPONS;
  } catch (err) {
    return DEFAULT_COUPONS;
  }
}

export async function saveCoupon(couponData, id = null) {
  await ensureFirestoreSeeded();
  if (id) {
    await updateDoc(doc(db, 'coupons', id), couponData);
  } else {
    await addDoc(collection(db, 'coupons'), { ...couponData, is_active: true, created_at: new Date().toISOString() });
  }
}

export async function deleteCoupon(id) {
  await deleteDoc(doc(db, 'coupons', id));
}

export async function validateCoupon(code, subtotal) {
  const coupons = await getCoupons();
  const coupon = coupons.find(c => c.code.toUpperCase() === code.toUpperCase() && c.is_active);

  if (!coupon) throw new Error('Invalid or expired coupon code');
  if (subtotal < coupon.min_order) throw new Error(`Minimum order of ₹${coupon.min_order} required for this coupon`);

  const discount = coupon.type === 'percentage'
    ? Math.round((subtotal * coupon.value) / 100)
    : coupon.value;

  return { coupon, discount };
}

export async function getSettings() {
  await ensureFirestoreSeeded();
  try {
    const d = await getDoc(doc(db, 'settings', 'general'));
    if (d.exists()) return d.data();
  } catch (err) {}
  return DEFAULT_SETTINGS;
}

export async function saveSettings(settingsData) {
  await setDoc(doc(db, 'settings', 'general'), settingsData, { merge: true });
}

// ============================================================
// AUTHENTICATION SERVICES (FIREBASE FIRESTORE AUTH)
// ============================================================
export async function registerCustomerFirebase({ name, email, password, phone }) {
  await ensureFirestoreSeeded();
  const q = query(collection(db, 'customers'), where('email', '==', email.toLowerCase()));
  const existingSnap = await getDocs(q);
  if (!existingSnap.empty) {
    throw new Error('An account with this email already exists');
  }

  const customerData = {
    name,
    email: email.toLowerCase(),
    phone: phone || '',
    password,
    created_at: new Date().toISOString()
  };

  const docRef = await addDoc(collection(db, 'customers'), customerData);
  const customerObj = { id: docRef.id, name, email, phone };
  return { customer: customerObj, token: `fb_token_${docRef.id}` };
}

export async function loginCustomerFirebase({ email, password }) {
  await ensureFirestoreSeeded();
  const q = query(collection(db, 'customers'), where('email', '==', email.toLowerCase()));
  const snap = await getDocs(q);
  
  if (snap.empty) {
    throw new Error('Invalid email or password');
  }

  const docData = snap.docs[0].data();
  if (docData.password !== password) {
    throw new Error('Invalid email or password');
  }

  const customerObj = { id: snap.docs[0].id, name: docData.name, email: docData.email, phone: docData.phone };
  return { customer: customerObj, token: `fb_token_${snap.docs[0].id}` };
}

export async function loginAdminFirebase({ email, password }) {
  if (email.toLowerCase() === 'admin@kamalahoney.com' && password === 'KamalaAdmin@2026') {
    const adminObj = { id: 'admin-1', name: 'Kamala Admin', email: 'admin@kamalahoney.com', role: 'super_admin' };
    return { admin: adminObj, token: 'fb_admin_token_2026' };
  } else {
    throw new Error('Invalid admin email or password');
  }
}
