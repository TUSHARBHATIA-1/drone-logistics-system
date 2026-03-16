const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { errorHandler } = require('./middlewares/errorMiddleware');

dotenv.config();

// Connect to Database
connectDB();

// Start Background Simulation
const { startSimulation } = require('./services/simulationService');
startSimulation();

const app = express();

// Security Middleware
app.use(helmet()); 
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Too many requests'
});
app.use('/api/', limiter);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Lazy Loaded Routes
app.use('/api/auth', (req, res, next) => require('./routes/authRoutes')(req, res, next));
app.use('/api/drones', (req, res, next) => require('./routes/droneRoutes')(req, res, next));
app.use('/api/assignments', (req, res, next) => require('./routes/assignmentRoutes')(req, res, next));
app.use('/api/warehouses', (req, res, next) => require('./routes/warehouseRoutes')(req, res, next));
app.use('/api/marketplace', (req, res, next) => require('./routes/marketplaceRoutes')(req, res, next));
app.use('/api/notifications', (req, res, next) => require('./routes/notificationRoutes')(req, res, next));
app.use('/api/emergency', (req, res, next) => require('./routes/emergencyRoutes')(req, res, next));
app.use('/api/monitor', (req, res, next) => require('./routes/monitorRoutes')(req, res, next));

app.get('/api/health', (req, res) => {
    res.json({ success: true, message: 'Server Online' });
});

app.use(errorHandler);

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server fully operational on port ${PORT}`);
});
