const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const Database = require('better-sqlite3');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = process.env.PORT || 5000;

// Database setup
let dbPath = path.join(__dirname, 'db', 'honey.db');

// Handle Vercel serverless read-only filesystem
if (process.env.VERCEL) {
  const tmpDbPath = path.join('/tmp', 'honey.db');
  if (!fs.existsSync(tmpDbPath)) {
    if (fs.existsSync(dbPath)) {
      fs.copyFileSync(dbPath, tmpDbPath);
    }
  }
  dbPath = tmpDbPath;
}

const db = new Database(dbPath);

// Enable WAL mode and foreign keys
try {
  db.pragma('journal_mode = WAL');
} catch (e) {
  db.pragma('journal_mode = DELETE');
}
db.pragma('foreign_keys = ON');

// Initialize database
const schema = fs.readFileSync(path.join(__dirname, 'db', 'schema.sql'), 'utf8');
db.exec(schema);

// Seed data
const seedData = fs.readFileSync(path.join(__dirname, 'db', 'seed.sql'), 'utf8');
try {
  // Check if admin exists
  const admin = db.prepare('SELECT id FROM admins LIMIT 1').get();
  if (!admin) {
    // Hash admin password before seeding
    const hashedPassword = bcrypt.hashSync('KamalaAdmin@2026', 10);
    const modifiedSeed = seedData.replace('$2b$10$placeholder_will_be_set_by_server', hashedPassword);
    db.exec(modifiedSeed);
    console.log('Database seeded successfully');
  }
} catch (err) {
  console.log('Seed note:', err.message);
}

// Make db available to routes
app.locals.db = db;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5000'],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Ensure uploads directories exist
const uploadDirs = ['products', 'banners', 'gallery', 'categories', 'general'];
uploadDirs.forEach(dir => {
  const dirPath = path.join(__dirname, 'uploads', dir);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
});

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/customers', require('./routes/customers'));
app.use('/api/coupons', require('./routes/coupons'));
app.use('/api/reviews', require('./routes/reviews'));
app.use('/api/banners', require('./routes/banners'));
app.use('/api/gallery', require('./routes/gallery'));
app.use('/api/content', require('./routes/content'));
app.use('/api/settings', require('./routes/settings'));
app.use('/api/messages', require('./routes/messages'));
app.use('/api/reports', require('./routes/reports'));
app.use('/api/wishlist', require('./routes/wishlist'));
app.use('/api/inventory', require('./routes/inventory'));
app.use('/api/upload', require('./routes/upload'));

// Serve React build if dist folder exists
const clientDistPath = path.join(__dirname, '..', 'client', 'dist');
if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));
  app.use((req, res, next) => {
    if (!req.path.startsWith('/api') && req.method === 'GET') {
      res.sendFile(path.join(clientDistPath, 'index.html'));
    } else {
      next();
    }
  });
}

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong', message: err.message });
});

// Graceful shutdown
process.on('SIGINT', () => {
  db.close();
  process.exit(0);
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log('\n============================================================');
    console.log('🐝 KAMALA HONEY FARM - ECOMMERCE SERVER STARTED');
    console.log('============================================================');
    console.log(`🌐 Customer Website : http://localhost:${PORT}`);
    console.log(`🔐 Admin Panel Login: http://localhost:${PORT}/admin/login`);
    console.log('------------------------------------------------------------');
    console.log('Admin Email   : admin@kamalahoney.com');
    console.log('Admin Password: KamalaAdmin@2026');
    console.log('============================================================\n');
  });
}

module.exports = app;
