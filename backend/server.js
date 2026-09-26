require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');

const seedDatabase = require('./seed/seedData');
const errorHandler = require('./middleware/errorHandler');

// Route imports
const authRoutes = require('./routes/auth');
const kundliRoutes = require('./routes/kundli');
const matchingRoutes = require('./routes/matching');
const horoscopeRoutes = require('./routes/horoscope');
const panchangRoutes = require('./routes/panchang');
const muhuratRoutes = require('./routes/muhurat');
const astrologersRoutes = require('./routes/astrologers');
const consultationsRoutes = require('./routes/consultations');
const aiRoutes = require('./routes/ai');
const articlesRoutes = require('./routes/articles');
const remediesRoutes = require('./routes/remedies');
const ordersRoutes = require('./routes/orders');
const adminRoutes = require('./routes/admin');
const citiesRoutes = require('./routes/cities');
const birthProfilesRoutes = require('./routes/birthProfiles');

const app = express();
const PORT = process.env.PORT || 5000;

// Security and utility middlewares
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting (generous for smooth testing)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 2000,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests, please slow down.' }
});
app.use('/api', limiter);

// Mount API routes
app.use('/api/auth', authRoutes);
app.use('/api/kundli', kundliRoutes);
app.use('/api/matching', matchingRoutes);
app.use('/api/horoscope', horoscopeRoutes);
app.use('/api/panchang', panchangRoutes);
app.use('/api/muhurat', muhuratRoutes);
app.use('/api/astrologers', astrologersRoutes);
app.use('/api/consultations', consultationsRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/articles', articlesRoutes);
app.use('/api/remedies', remediesRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/cities', citiesRoutes);
app.use('/api/birth-profiles', birthProfilesRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    platform: 'JyotirVeda Vedic Astrology Platform',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Centralized error handling
app.use(errorHandler);

/**
 * Connect to MongoDB and seed initial data
 */
async function connectDatabase() {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/jyotirveda';

  try {
    console.log(`Connecting to MongoDB at ${uri}...`);
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 3000 });
    console.log('✅ Connected to MongoDB.');

    // Seed default data
    await seedDatabase();
  } catch (err) {
    console.warn(`⚠️ Local MongoDB connection failed (${err.message}). Starting in-memory MongoDB fallback...`);
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create();
      const memUri = mongod.getUri();
      await mongoose.connect(memUri);
      console.log('✅ Connected to in-memory MongoDB fallback.');
      await seedDatabase();
    } catch (memErr) {
      console.error('❌ Failed to start in-memory MongoDB fallback:', memErr.message);
    }
  }
}

// Start Server
connectDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`\n🪐 JyotirVeda API Server running on port ${PORT}`);
    console.log(`   Health check: http://localhost:${PORT}/api/health\n`);
  });
});

module.exports = app;
