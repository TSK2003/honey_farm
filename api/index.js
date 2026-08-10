const path = require('path');
const fs = require('fs');

// Ensure database file exists in /tmp on Vercel environment
const sourceDb = path.join(__dirname, '..', 'server', 'db', 'honey.db');
const targetDb = path.join('/tmp', 'honey.db');

if (!fs.existsSync(targetDb) && fs.existsSync(sourceDb)) {
  try {
    fs.copyFileSync(sourceDb, targetDb);
  } catch (e) {
    console.error('Error copying DB to /tmp:', e);
  }
}

const app = require('../server/server.js');
module.exports = app;
