require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');

// Import modular routes
const authRoutes = require('./src/routes/auth');
const schoolsRoutes = require('./src/routes/schools');
const teachersRoutes = require('./src/routes/teachers');
const suppliersRoutes = require('./src/routes/suppliers');
const rfqsRoutes = require('./src/routes/rfqs');
const parentsRoutes = require('./src/routes/parents');
const adminRoutes = require('./src/routes/admin');
const paymentsRoutes = require('./src/routes/payments');
const inquiriesRoutes = require('./src/routes/inquiries');
const admissionsRoutes = require('./src/routes/admissions');

const app = express();
const PORT = process.env.PORT || 3000;

// Security & Parsing Middleware
app.use(helmet({
  contentSecurityPolicy: false // Allow inline scripts and external fonts/styles used by frontend
}));
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(morgan('dev'));

// Static files (Vanilla JS SPA)
app.use(express.static(path.join(__dirname, 'public')));

// Mount API routes
app.use('/api/auth', authRoutes);
app.use('/api/schools', schoolsRoutes);
app.use('/api/teachers', teachersRoutes);
app.use('/api/suppliers', suppliersRoutes);
app.use('/api/parents', parentsRoutes);
app.use('/api/parent', parentsRoutes); // Alias for singular endpoints
app.use('/api/inquiries', inquiriesRoutes);
app.use('/api/admissions', admissionsRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/payments', paymentsRoutes);
app.use('/api', rfqsRoutes);

// Helpful reviews upvote and reply
app.post('/api/reviews/:id/helpful', (req, res) => {
  res.json({ success: true, helpfulCount: 15 });
});
app.post('/api/reviews/:id/reply', (req, res) => {
  res.json({ success: true, message: 'Official reply recorded' });
});

// Global Stats & Telemetry
app.get('/api/stats', (req, res) => {
  res.json({
    schoolsCount: 65,
    teachersCount: 28,
    suppliersCount: 19,
    regionsCovered: 16,
    verifiedEntities: 54
  });
});

app.get('/api/saas/status', (req, res) => {
  res.json({
    status: 'operational',
    version: '2.0.0',
    database: 'Supabase PostgreSQL',
    auth: 'Supabase Auth + JWT',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Single Page Application (SPA) fallback:
// Any non-API request routes to index.html for client-side routing
app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ error: `API route ${req.method} ${req.path} not found` });
  }
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🚀 SkoolFinder Server running on port ${PORT}`);
  console.log(`🌐 Local URL: http://localhost:${PORT}`);
  console.log(`📡 Supabase: ${process.env.SUPABASE_URL}`);
  console.log(`====================================================`);
});

