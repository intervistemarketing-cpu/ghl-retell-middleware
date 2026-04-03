require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');

// Initialize database
require('./database/db');

// Import routes
const webhookRoutes = require('./routes/webhooks');
const adminRoutes = require('./routes/admin');
const healthRoutes = require('./routes/health');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/health', healthRoutes);
app.use('/webhooks', webhookRoutes);
app.use('/admin', adminRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    service: 'GHL + Retell AI Enterprise Middleware',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      health: '/health',
      webhooks: '/webhooks/*',
      admin: '/admin/*'
    }
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error('❌ Server error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🗄️  Database: ${process.env.DATABASE_PATH || './data/middleware.db'}`);
});

// Start cron jobs
require('./cron/scheduler');

module.exports = app;
