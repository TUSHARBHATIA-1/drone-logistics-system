'use strict';

// ── 1. Load environment FIRST ─────────────────────────────
require('dotenv').config();

// ── 2. Debug logs ─────────────────────────────────────────
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('  Drone Logistics API — Boot Sequence');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log(`  NODE_ENV    : ${process.env.NODE_ENV || 'development'}`);
console.log(`  PORT        : ${process.env.PORT || 5000}`);
console.log(`  FRONTEND_URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
console.log(`  MONGO_URI   : ${process.env.MONGO_URI ? '✅ set' : '❌ missing'}`);
console.log(`  JWT_SECRET  : ${process.env.JWT_SECRET ? '✅ set' : '❌ missing'}`);
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const connectDB = require('./config/db');
const { startSimulation } = require('./services/simulationService');
const { errorHandler } = require('./middlewares/errorMiddleware');

// ── 3. Connect DB ─────────────────────────────────────────
connectDB();

// ── 4. Simulation (dev only) ──────────────────────────────
if (process.env.NODE_ENV !== 'production') {
    console.log('[SIM] Starting drone telemetry simulation (dev only)');
    startSimulation();
} else {
    console.log('[SIM] Simulation disabled in production');
}

// ── 5. App init ───────────────────────────────────────────
const app = express();

// ── 6. Security ───────────────────────────────────────────
app.use(helmet());

// ── 7. CORS ───────────────────────────────────────────────
const allowedOrigins = [
    process.env.FRONTEND_URL || 'http://localhost:3000',
    'http://localhost:5173',
];

app.use(cors({
    origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) return callback(null, true);

        if (process.env.NODE_ENV !== 'production') return callback(null, true);

        return callback(new Error(`CORS blocked: ${origin}`));
    },
    credentials: true,
}));

// ── 8. Rate Limiter (FIXED) ───────────────────────────────
if (process.env.NODE_ENV === 'production') {
    const apiLimiter = rateLimit({
        windowMs: 15 * 60 * 1000,
        max: 100,
        standardHeaders: true,
        legacyHeaders: false,
        message: {
            success: false,
            message: 'Too many requests — please try again later.'
        },
    });

    app.use('/api/', apiLimiter);
} else {
    console.log('⚠️ Rate limiter disabled in development');
}

// ── 9. Body parser ────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── 10. Routes ────────────────────────────────────────────
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/drones', require('./routes/droneRoutes'));
app.use('/api/assignments', require('./routes/assignmentRoutes'));
app.use('/api/marketplace', require('./routes/marketplaceRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/emergency', require('./routes/emergencyRoutes'));
app.use('/api/monitor', require('./routes/monitorRoutes'));
app.use('/api', require('./routes/companyRoutes'));

// ── 11. Health check ──────────────────────────────────────
app.get('/api/health', (_req, res) => {
    res.json({
        success: true,
        status: 'online',
        env: process.env.NODE_ENV || 'development',
        timestamp: new Date().toISOString(),
    });
});

// ── 12. 404 handler removed ─────────────────────────────────

// ── 13. Error handler ─────────────────────────────────────
app.use(errorHandler);

// ── 14. Start server ──────────────────────────────────────
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
    console.log(`\n🚀 Server running on port ${PORT} [${process.env.NODE_ENV || 'development'}]\n`);
});

// ── 15. Error handling ────────────────────────────────────
server.on('error', (err) => {
    console.error('❌ Server startup error:', err.message);
    process.exit(1);
});

// ── 16. Graceful shutdown ─────────────────────────────────
process.on('SIGTERM', () => {
    console.log('📴 SIGTERM received — shutting down');
    server.close(() => {
        console.log('✅ Server closed');
        process.exit(0);
    });
});