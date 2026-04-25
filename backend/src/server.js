// MoveSmart — Express Server Entry Point
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import config from './config/index.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';

// Route Imports
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import routeRoutes from './routes/routeRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import safetyRoutes from './routes/safetyRoutes.js';

// Load environment variables
dotenv.config();

// Initialize Express
const app = express();

// ── Middleware ──────────────────────────────────────────
app.use(cors({
  origin: config.clientUrl,
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── API Routes ─────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'MoveSmart API is running 🚀',
    environment: config.nodeEnv,
    timestamp: new Date().toISOString(),
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/routes', routeRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/safety', safetyRoutes);

// ── Error Handling ─────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

// ── Start Server ───────────────────────────────────────
const startServer = async () => {
  try {
    // Attempt to connect to MongoDB, but don't crash if it fails
    try {
      await connectDB();
      console.log('✅ MongoDB Connected');
    } catch (dbErr) {
      console.warn('⚠️  MongoDB connection failed. Running in memory/mock mode.');
      console.warn('   (Install MongoDB or configure MONGODB_URI to use database features)');
    }

    app.listen(config.port, () => {
      console.log(`\n🚀 MoveSmart API Server`);
      console.log(`   Environment : ${config.nodeEnv}`);
      console.log(`   Port        : ${config.port}`);
      console.log(`   Client URL  : ${config.clientUrl}`);
      console.log(`   Health Check: http://localhost:${config.port}/api/health\n`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();
