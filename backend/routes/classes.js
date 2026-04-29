const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { protect } = require('../middleware/auth');

// @route   GET /api/classes
// @desc    5. List all classes with trainer names (SELECT + JOIN)
router.get('/', protect, async (req, res) => {
    try {
        const query = `
            SELECT c.class_id, c.class_name, c.schedule, c.capacity, c.room, c.duration_min,
                   t.first_name AS trainer_first, t.last_name AS trainer_last, t.specialty
            FROM Class c
            JOIN Trainer t ON c.trainer_id = t.trainer_id
            ORDER BY c.schedule ASC
        `;
        const [rows] = await db.query(query);
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// @route   GET /api/classes/:id/bookings
// @desc    Get all members booked for a specific class
router.get('/:id/bookings', protect, async (req, res) => {
    try {
        const { id } = req.params;
        const query = `
            SELECT b.booking_id, b.status, b.attended, b.booking_date,
                   m.member_id, m.first_name, m.last_name, m.email
            FROM Booking b
            JOIN Member m ON b.member_id = m.member_id
            WHERE b.class_id = ?
            ORDER BY b.booking_date ASC
        `;
        const [rows] = await db.query(query, [id]);
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
