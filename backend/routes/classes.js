const express = require('express');
const router = express.Router();
const db = require('../config/db');

// @route   GET /api/classes
// @desc    5. List all classes with trainer names (SELECT + JOIN)
router.get('/', async (req, res) => {
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

module.exports = router;
