import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import Favorite from './models/Favorite.js';
import SearchLog from './models/SearchLog.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/weather_app';

app.use(cors());
app.use(express.json());

// MongoDB Connection
let isDbConnected = false;

mongoose.connect(MONGODB_URI, {
  serverSelectionTimeoutMS: 5000 // Fast fail for offline MongoDB
})
.then(() => {
  isDbConnected = true;
  console.log('MongoDB successfully connected to:', MONGODB_URI);
})
.catch((err) => {
  isDbConnected = false;
  console.warn('MongoDB Connection Notice: Local database server not active.', err.message);
});

mongoose.connection.on('disconnected', () => {
  isDbConnected = false;
});
mongoose.connection.on('connected', () => {
  isDbConnected = true;
});

// Middleware to check DB connectivity
const checkDbConnection = (req, res, next) => {
  if (!isDbConnected && mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      error: 'MongoDB is currently disconnected. Features operating in offline/fallback mode.',
      connected: false
    });
  }
  next();
};

// --- API ROUTES ---

// Health & DB Status
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    dbConnected: mongoose.connection.readyState === 1,
    dbState: mongoose.connection.readyState === 1 ? 'connected' : 'offline',
    mongodbUri: MONGODB_URI
  });
});

// Get Favorite Cities
app.get('/api/favorites', checkDbConnection, async (req, res) => {
  try {
    const favorites = await Favorite.find().sort({ addedAt: -1 });
    res.json(favorites);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add Favorite City
app.post('/api/favorites', checkDbConnection, async (req, res) => {
  const { cityName, country, lastTemp, condition, icon } = req.body;
  if (!cityName) {
    return res.status(400).json({ error: 'cityName is required' });
  }

  try {
    const existing = await Favorite.findOne({ cityName: new RegExp(`^${cityName}$`, 'i') });
    if (existing) {
      existing.lastTemp = lastTemp ?? existing.lastTemp;
      existing.condition = condition ?? existing.condition;
      existing.icon = icon ?? existing.icon;
      await existing.save();
      return res.json(existing);
    }

    const fav = new Favorite({ cityName, country, lastTemp, condition, icon });
    await fav.save();
    res.status(201).json(fav);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete Favorite City
app.delete('/api/favorites/:cityName', checkDbConnection, async (req, res) => {
  const { cityName } = req.params;
  try {
    const result = await Favorite.deleteOne({ cityName: new RegExp(`^${cityName}$`, 'i') });
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Favorite not found' });
    }
    res.json({ message: 'Favorite deleted successfully', cityName });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get Search History from MongoDB
app.get('/api/history', checkDbConnection, async (req, res) => {
  try {
    const history = await SearchLog.find().sort({ searchedAt: -1 }).limit(15);
    res.json(history);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Log Search Query to MongoDB
app.post('/api/history', checkDbConnection, async (req, res) => {
  const { query, cityName, country, temp, condition } = req.body;
  if (!cityName) {
    return res.status(400).json({ error: 'cityName is required' });
  }

  try {
    const log = new SearchLog({ query: query || cityName, cityName, country, temp, condition });
    await log.save();
    res.status(201).json(log);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Clear Search History
app.delete('/api/history', checkDbConnection, async (req, res) => {
  try {
    await SearchLog.deleteMany({});
    res.json({ message: 'Search history cleared successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`SkyPulse MongoDB Backend Server running on http://localhost:${PORT}`);
});
