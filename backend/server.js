'use strict';

// ── 1. Load environment FIRST — before any other require ─────────
require('dotenv').config();

// ── 2. Debug log: confirm env is loaded (visible in Render logs) ──
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('  Drone Logistics API — Boot Sequence');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log(`  NODE_ENV    : ${process.env.NODE_ENV    || 'development'}`);
console.log(`  PORT        : ${process.env.PORT        || 5000}`);
console.log(`  FRONTEND_URL: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
console.log(`  MONGO_URI   : ${process.env.MONGO_URI ? '✅ set' : '❌ missing'}`);
console.log(`  JWT_SECRET  : ${process.env.JWT_SECRET  ? '✅ set' : '❌ missing'}`);
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

const express    = require('express');
const cors       = require('cors');
const helmet     = require('helmet');
const rateLimit  = require('express-rate-limit');

const connectDB               = require('./config/db');
const { startSimulation }     = require('./services/simulationService');
const { errorHandler }        = require('./middlewares/errorMiddleware');

// ── 3. Connect to MongoDB ─────────────────────────────────────────
connectDB();

// ── 4. Only run simulation in development ─────────────────────────
//    On Render (production), this would burn CPU and skew demo data.
if (process.env.NODE_ENV !== 'production') {
  console.log('[SIM] Starting drone telemetry simulation (dev only)');
  startSimulation();
} else {
  console.log('[SIM] Simulation disabled in production');
}

// ── 5. Express app ────────────────────────────────────────────────
const app = express();

// ── 6. Security headers ───────────────────────────────────────────
app.use(helmet());

// ── 7. CORS — restrict to known frontend origin in production ─────
//    "origin: true" mirrors the request origin back, effectively
//    allowing ANY domain — insecure for a production API.
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:5173',
  'http://localhost:3000', // common alternative dev port
];

app.use(cors({
  origin: (requestOrigin, callback) => {
    // Allow requests with no origin (Postman, server-to-server, curl)
    if (!requestOrigin) return callback(null, true);
    if (allowedOrigins.includes(requestOrigin)) return callback(null, true);
    // In development allow all; in production block unknown origins
    if (process.env.NODE_ENV !== 'production') return callback(null, true);
    callback(new Error(`CORS blocked: ${requestOrigin} is not an allowed origin`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// ── 8. Rate limiting — protect /api/* from abuse ──────────────────
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,       // 15-minute window
  max: 100,                        // max 100 requests per window per IP
  standardHeaders: true,           // include RateLimit-* headers
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests — please try again later.' },
});
app.use('/api/', apiLimiter);

// ── 9. Body parsing ───────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ── 10. Routes ────────────────────────────────────────────────────
app.use('/api/auth',          require('./routes/authRoutes'));
app.use('/api/drones',        require('./routes/droneRoutes'));
app.use('/api/assignments',   require('./routes/assignmentRoutes'));
app.use('/api/marketplace',   require('./routes/marketplaceRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/emergency',     require('./routes/emergencyRoutes'));
app.use('/api/monitor',       require('./routes/monitorRoutes'));
app.use('/api/company',       require('./routes/companyRoutes'));

// ── 11. Health check ──────────────────────────────────────────────
//    Render pings this to verify the service is alive.
app.get('/api/health', (_req, res) => {
  res.json({
    success:   true,
    status:    'online',
    env:       process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
  });
});

// ── 12. 404 handler — catches unmatched routes ────────────────────
app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// ── 13. Global error handler ──────────────────────────────────────
//    Must be registered AFTER all routes; Express recognises it by
//    the 4-param signature (err, req, res, next).
app.use(errorHandler);

// ── 14. Start server ──────────────────────────────────────────────
const PORT = process.env.PORT || 5000;   // Render injects PORT automatically

const server = app.listen(PORT, () => {
  console.log(`\n🚀 Server running on port ${PORT} [${process.env.NODE_ENV || 'development'}]\n`);
});

// Catch port-binding errors (e.g. EADDRINUSE on local restart)
server.on('error', (err) => {
  console.error('❌ Server startup error:', err.message);
  process.exit(1);
});

// Graceful shutdown — lets in-flight requests finish before Render restarts
process.on('SIGTERM', () => {
  console.log('📴 SIGTERM received — shutting down gracefully');
  server.close(() => {
    console.log('✅ HTTP server closed');
    process.exit(0);
  });
});