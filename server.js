// ─────────────────────────────────────────────────────────────
//  ARTWAVE — Express API Server
//  Serves both the REST API (/api/*) and the frontend (/)
// ─────────────────────────────────────────────────────────────
require('dotenv').config();

const express = require('express');
const cors    = require('cors');
const path    = require('path');

const app  = express();
const PORT = process.env.PORT || 5000;
const isProd = process.env.NODE_ENV === 'production';

// ── CORS ──────────────────────────────────────────────────────
const allowedOrigins = (process.env.FRONTEND_URL || '*').split(',').map(s => s.trim());
app.use(cors({
  origin: isProd ? allowedOrigins : '*',
  credentials: true,
}));

// ── Body Parsers ──────────────────────────────────────────────
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));

// ── Static uploads ────────────────────────────────────────────
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ── API Routes ────────────────────────────────────────────────
app.use('/api/artists',  require('./routes/artists'));
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/auth',     require('./routes/auth'));

// ── Health & Stats ────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({
    status:    'ok',
    service:   'ARTWAVE API',
    version:   '1.0.0',
    env:       process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
  });
});

app.get('/api/stats', (req, res) => {
  const { artists, bookings } = require('./data/store');
  res.json({
    totalArtists:  artists.length,
    totalBookings: bookings.length,
    cities:        [...new Set(artists.map(a => a.city))].length,
    types:         [...new Set(artists.map(a => a.type))],
  });
});

// ── Serve Frontend (production / same-origin hosting) ────────
const frontendPath = path.join(__dirname, '..', 'frontend');
app.use(express.static(frontendPath));

// SPA fallback
app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ error: 'API route not found' });
  }
  res.sendFile(path.join(frontendPath, 'index.html'));
});

// ── Global Error Handler ──────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.message);
  res.status(500).json({ error: 'Internal server error' });
});

// ── Start ─────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🎸  ARTWAVE running → http://localhost:${PORT}`);
  console.log(`    Mode    : ${process.env.NODE_ENV || 'development'}`);
  console.log(`    Health  : http://localhost:${PORT}/api/health\n`);
});

module.exports = app;
