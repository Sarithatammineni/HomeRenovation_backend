// backend/server.js
const path = require('path');

// Load .env using __dirname so it always finds backend/.env
// regardless of which directory you run `node` from
require('dotenv').config({ path: path.join(__dirname, '.env') });

// ── Startup env check ──────────────────────────────────────────────────────
console.log('\n🔍  Environment check:');
console.log('   SUPABASE_URL        :', process.env.SUPABASE_URL         ? '✅ loaded' : '❌ MISSING');
console.log('   SUPABASE_SERVICE_KEY:', process.env.SUPABASE_SERVICE_KEY ? '✅ loaded' : '❌ MISSING');
console.log('   PORT                :', process.env.PORT || '4000 (default)');
console.log('   FRONTEND_URL        :', process.env.FRONTEND_URL || 'http://localhost:5173 (default)');
console.log('');

const express    = require('express');
const cors       = require('cors');
const helmet     = require('helmet');
const rateLimit  = require('express-rate-limit');

// ── Route imports ──────────────────────────────────────────────────────────
const projectRoutes     = require('./routes/projects');
const taskRoutes        = require('./routes/tasks');
const expenseRoutes     = require('./routes/expenses');
const shoppingRoutes    = require('./routes/shopping');
const contractorRoutes  = require('./routes/contractors');
const inventoryRoutes   = require('./routes/inventory');
const permitRoutes      = require('./routes/permits');
const maintenanceRoutes = require('./routes/maintenance');
const templateRoutes    = require('./routes/templates');

const app = express();

// ── Security & middleware ──────────────────────────────────────────────────
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ── Rate limiting ──────────────────────────────────────────────────────────
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' },
});
app.use('/api', limiter);

// ── API routes ─────────────────────────────────────────────────────────────
app.use('/api/projects',    projectRoutes);
app.use('/api/tasks',       taskRoutes);
app.use('/api/expenses',    expenseRoutes);
app.use('/api/shopping',    shoppingRoutes);
app.use('/api/contractors', contractorRoutes);
app.use('/api/inventory',   inventoryRoutes);
app.use('/api/permits',     permitRoutes);
app.use('/api/maintenance', maintenanceRoutes);
app.use('/api/templates',   templateRoutes);

// ── Health check ───────────────────────────────────────────────────────────
app.get('/api/health', (req, res) =>
  res.json({
    status: 'ok',
    service: 'RenovateIQ API',
    version: '2.0.0',
    timestamp: new Date().toISOString(),
  })
);

// ── 404 handler ────────────────────────────────────────────────────────────
app.use((req, res) =>
  res.status(404).json({ error: `Route ${req.method} ${req.path} not found` })
);

// ── Global error handler ───────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.stack);
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
});

// ── Start server ───────────────────────────────────────────────────────────
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🏗️  RenovateIQ API running at: http://localhost:${PORT}/api/health`);
  console.log(`   CORS allowed for:          ${process.env.FRONTEND_URL || 'http://localhost:5173'}\n`);
});
