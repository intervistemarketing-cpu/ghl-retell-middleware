// Database Schema for Enterprise Middleware
// SQLite3 tables

const createTables = (db) => {
  // Table 1: Call History
  db.exec(`
    CREATE TABLE IF NOT EXISTS call_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      call_id TEXT UNIQUE NOT NULL,
      contact_id TEXT NOT NULL,
      phone TEXT NOT NULL,
      disposition TEXT,
      duration INTEGER,
      cost REAL,
      transcript TEXT,
      summary TEXT,
      sentiment TEXT,
      recording_url TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_contact_id (contact_id),
      INDEX idx_phone (phone),
      INDEX idx_created_at (created_at)
    )
  `);

  // Table 2: Retry Queue
  db.exec(`
    CREATE TABLE IF NOT EXISTS retry_queue (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      contact_id TEXT NOT NULL,
      phone TEXT NOT NULL,
      attempt INTEGER DEFAULT 1,
      max_attempts INTEGER DEFAULT 3,
      next_retry_at DATETIME NOT NULL,
      last_call_id TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_next_retry (next_retry_at),
      INDEX idx_contact_id (contact_id)
    )
  `);

  // Table 3: DNC List
  db.exec(`
    CREATE TABLE IF NOT EXISTS dnc_list (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      phone TEXT UNIQUE NOT NULL,
      reason TEXT,
      source TEXT DEFAULT 'manual',
      expires_at DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_phone (phone)
    )
  `);

  // Table 4: Escalation Queue
  db.exec(`
    CREATE TABLE IF NOT EXISTS escalation_queue (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      contact_id TEXT NOT NULL,
      phone TEXT,
      priority TEXT DEFAULT 'medium',
      reason TEXT,
      assigned_to TEXT,
      due_date DATETIME,
      resolved_at DATETIME,
      resolution TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_priority (priority),
      INDEX idx_assigned_to (assigned_to),
      INDEX idx_resolved (resolved_at)
    )
  `);

  // Table 5: Metrics
  db.exec(`
    CREATE TABLE IF NOT EXISTS metrics (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date DATE UNIQUE NOT NULL,
      total_calls INTEGER DEFAULT 0,
      successful_calls INTEGER DEFAULT 0,
      failed_calls INTEGER DEFAULT 0,
      total_cost REAL DEFAULT 0,
      avg_duration REAL DEFAULT 0,
      appointments_booked INTEGER DEFAULT 0,
      dnc_requests INTEGER DEFAULT 0,
      INDEX idx_date (date)
    )
  `);

  console.log('✅ Database tables created successfully');
};

module.exports = { createTables };
