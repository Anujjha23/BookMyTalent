// routes/bookings.js
const express = require('express');
const router = express.Router();
const { bookings, artists } = require('../data/store');
const { authMiddleware } = require('../middleware/auth');
const { v4: uuidv4 } = require('uuid');

// POST /api/bookings — create booking
router.post('/', (req, res) => {
  const { artistId, clientName, clientEmail, clientPhone, eventDate, eventTime, eventType, eventLocation, durationHours, guestCount, specialRequests } = req.body;

  if (!artistId || !clientName || !clientEmail || !eventDate || !eventTime || !eventType) {
    return res.status(400).json({ error: 'Missing required booking fields' });
  }

  const artist = artists.find(a => a.id === artistId);
  if (!artist) return res.status(404).json({ error: 'Artist not found' });

  // Check for conflicts (same artist, same date+time)
  const conflict = bookings.find(b =>
    b.artistId === artistId &&
    b.eventDate === eventDate &&
    b.eventTime === eventTime &&
    b.status !== 'cancelled'
  );
  if (conflict) {
    return res.status(409).json({ error: 'Artist is already booked for that date and time slot' });
  }

  const totalFee = artist.fee.unit === 'hr'
    ? artist.fee.amount * (durationHours || 1)
    : artist.fee.amount;

  const booking = {
    id: uuidv4(),
    artistId,
    artistName: artist.name,
    artistEmoji: artist.emoji,
    clientName,
    clientEmail,
    clientPhone,
    eventDate,
    eventTime,
    eventType,
    eventLocation,
    durationHours: durationHours || 1,
    guestCount,
    specialRequests,
    totalFee,
    depositAmount: Math.round(totalFee * 0.3),
    status: 'pending',
    createdAt: new Date().toISOString()
  };

  bookings.push(booking);
  artist.bookingCount = (artist.bookingCount || 0) + 1;

  res.status(201).json({
    message: 'Booking created successfully',
    booking,
    confirmationId: booking.id.slice(0, 8).toUpperCase()
  });
});

// GET /api/bookings — get all bookings (admin)
router.get('/', authMiddleware, (req, res) => {
  res.json({ total: bookings.length, bookings });
});

// GET /api/bookings/:id — get single booking
router.get('/:id', (req, res) => {
  const booking = bookings.find(b => b.id === req.params.id);
  if (!booking) return res.status(404).json({ error: 'Booking not found' });
  res.json(booking);
});

// PATCH /api/bookings/:id/status — update status
router.patch('/:id/status', authMiddleware, (req, res) => {
  const booking = bookings.find(b => b.id === req.params.id);
  if (!booking) return res.status(404).json({ error: 'Booking not found' });
  booking.status = req.body.status;
  res.json(booking);
});

// POST /api/bookings/:id/review — add review
router.post('/:id/review', (req, res) => {
  const booking = bookings.find(b => b.id === req.params.id);
  if (!booking) return res.status(404).json({ error: 'Booking not found' });

  const artist = artists.find(a => a.id === booking.artistId);
  if (!artist) return res.status(404).json({ error: 'Artist not found' });

  const { rating, comment } = req.body;
  if (!rating || rating < 1 || rating > 5) return res.status(400).json({ error: 'Rating must be 1–5' });

  // Recalculate artist rating
  const newTotal = artist.rating * artist.reviewCount + rating;
  artist.reviewCount += 1;
  artist.rating = Math.round((newTotal / artist.reviewCount) * 10) / 10;

  booking.review = { rating, comment, createdAt: new Date().toISOString() };
  res.json({ message: 'Review submitted', artistRating: artist.rating });
});

module.exports = router;
