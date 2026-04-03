const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');
const { createTables } = require('./schema');

// Database configuration
const DB_PATH = process.env.DATABASE_PATH || './data/middleware.db';

// Ensure data directory exists
const dataDir = path.dirname(DB_PATH);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
  console.log(`✅ Created data directory: ${dataDir}`);
}

// Initialize database
const db = new Database(DB_PATH, {
  verbose: process.env.NODE_ENV === 'development' ? console.log : null
});

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Enable WAL mode for better concurrency
db.pragma('journal_mode = WAL');

// Create tables if they don't exist
createTables(db);

console.log(`✅ Database initialized: ${DB_PATH}`);

module.exports = db;
