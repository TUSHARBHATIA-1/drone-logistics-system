const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { errorHandler } = require('./middlewares/errorMiddleware');

// Load env
dotenv.config();

// Connect DB
connectDB();

// Start Simulation
const { startSimulation } = require('./services/simulationService');
startSimulation();

const app = express();

// Security Middleware
app.use(helmet());

app.use(cors({
    origin: true,
    credentials: true
}));

// Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Too many requests'
});
app.use('/api/', limiter);

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// ✅ PROPER ROUTES (FIXED)
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/drones', require('./routes/droneRoutes'));
app.use('/api/assignments', require('./routes/assignmentRoutes'));
// app.use('/api/warehouses', require('./routes/warehouseRoutes'));
app.use('/api/marketplace', require('./routes/marketplaceRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/emergency', require('./routes/emergencyRoutes'));
app.use('/api/monitor', require('./routes/monitorRoutes'));
app.use('/api/company', require('./routes/companyRoutes'));

// Health check
app.get('/api/health', (req, res) => {
    res.json({ success: true, message: 'Server Online' });
});

// ✅ DUMMY DATA ROUTE (for demo)
app.get('/add-dummy', async (req, res) => {
    const Drone = require('./models/Drone');

    await Drone.insertMany([
        { name: "Drone A", status: "Active", battery: 80 },
        { name: "Drone B", status: "Idle", battery: 65 }
    ]);

    res.send("Dummy data added");
});

// Error handler
app.use(errorHandler);

// ✅ FIXED PORT (IMPORTANT)
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server fully operational on port ${PORT}`);
});