const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { protect, restrictTo } = require('../middleware/auth');

// @route   POST /api/bookings
// @desc    6. Book a class (INSERT + capacity check via stored procedure)
router.post('/', protect, restrictTo('admin', 'staff'), async (req, res) => {
    try {
        const { member_id, class_id } = req.body;
        
        // Calling the stored procedure created in procedures.sql
        const query = `CALL BookClass(?, ?)`;
        const [result] = await db.query(query, [member_id, class_id]);
        
        // Result gives back the rows selected inside the procedure indicating success or waitlist
        const message = result[0][0].Message;
        
        res.status(201).json({ message });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
