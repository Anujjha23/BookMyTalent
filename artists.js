// routes/artists.js
const express = require('express');
const router = express.Router();
const { artists } = require('../data/store');
const { authMiddleware } = require('../middleware/auth');

// GET /api/artists — list with filters
router.get('/', (req, res) => {
  const { type, city, minFee, maxFee, availability, search, sort } = req.query;
  let results = [...artists];

  if (type && type !== 'All') {
    results = results.filter(a => a.type.toLowerCase() === type.toLowerCase());
  }
  if (city) {
    results = results.filter(a =>
      a.city.toLowerCase().includes(city.toLowerCase()) ||
      a.travelZones.some(z => z.toLowerCase().includes(city.toLowerCase()))
    );
  }
  if (minFee) {
    results = results.filter(a => a.fee.amount >= parseInt(minFee));
  }
  if (maxFee) {
    results = results.filter(a => a.fee.amount <= parseInt(maxFee));
  }
  if (search) {
    const q = search.toLowerCase();
    results = results.filter(a =>
      a.name.toLowerCase().includes(q) ||
      a.genre.toLowerCase().includes(q) ||
      a.type.toLowerCase().includes(q) ||
      a.tags.some(t => t.toLowerCase().includes(q))
    );
  }
  if (sort === 'rating') results.sort((a, b) => b.rating - a.rating);
  if (sort === 'fee_asc') results.sort((a, b) => a.fee.amount - b.fee.amount);
  if (sort === 'fee_desc') results.sort((a, b) => b.fee.amount - a.fee.amount);
  if (sort === 'bookings') results.sort((a, b) => b.bookingCount - a.bookingCount);

  res.json({
    total: results.length,
    artists: results.map(a => ({
      id: a.id, name: a.name, slug: a.slug, type: a.type, genre: a.genre,
      emoji: a.emoji, city: a.city, state: a.state, fee: a.fee,
      duration: a.duration, rating: a.rating, reviewCount: a.reviewCount,
      bookingCount: a.bookingCount, badge: a.badge, tags: a.tags,
      availability: a.availability, verified: a.verified
    }))
  });
});

// GET /api/artists/:slug — single artist full profile
router.get('/:slug', (req, res) => {
  const artist = artists.find(a => a.slug === req.params.slug);
  if (!artist) return res.status(404).json({ error: 'Artist not found' });
  res.json(artist);
});

// GET /api/artists/types/list — distinct types
router.get('/types/list', (req, res) => {
  const types = [...new Set(artists.map(a => a.type))];
  res.json(types);
});

// GET /api/artists/cities/list — distinct cities
router.get('/cities/list', (req, res) => {
  const cities = [...new Set(artists.map(a => a.city))];
  res.json(cities);
});

// POST /api/artists — register as artist (protected)
router.post('/', authMiddleware, (req, res) => {
  const { v4: uuidv4 } = require('uuid');
  const newArtist = {
    id: uuidv4(),
    slug: req.body.name.toLowerCase().replace(/\s+/g, '-'),
    verified: false,
    rating: 0,
    reviewCount: 0,
    bookingCount: 0,
    badge: null,
    createdAt: new Date().toISOString(),
    ...req.body
  };
  artists.push(newArtist);
  res.status(201).json(newArtist);
});

module.exports = router;
