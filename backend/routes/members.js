const express = require('express');
const router = express.Router();
const db = require('../config/db');

// @route   GET /api/members
// @desc    1. List all members with their membership type (SELECT + JOIN)
router.get('/', async (req, res) => {
    try {
        const query = `
            SELECT m.member_id, m.first_name, m.last_name, m.email, m.phone, m.join_date, 
                   ms.type AS membership_type, ms.fee, ms.end_date
            FROM Member m
            LEFT JOIN Membership ms ON m.member_id = ms.member_id
            ORDER BY m.join_date DESC
        `;
        const [rows] = await db.query(query);
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// @route   POST /api/members
// @desc    2. Register a new member (INSERT)
router.post('/', async (req, res) => {
    try {
        const { first_name, last_name, email, phone, join_date } = req.body;
        const query = `
            INSERT INTO Member (first_name, last_name, email, phone, join_date)
            VALUES (?, ?, ?, ?, ?)
        `;
        const [result] = await db.query(query, [first_name, last_name, email, phone, join_date || new Date()]);
        res.status(201).json({ id: result.insertId, message: 'Member created successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// @route   PUT /api/members/:id
// @desc    3. Update member contact info (UPDATE)
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { first_name, last_name, email, phone } = req.body;
        const query = `
            UPDATE Member 
            SET first_name = ?, last_name = ?, email = ?, phone = ? 
            WHERE member_id = ?
        `;
        await db.query(query, [first_name, last_name, email, phone, id]);
        res.json({ message: 'Member updated successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// @route   DELETE /api/members/:id
// @desc    4. Remove a member (DELETE)
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const query = `DELETE FROM Member WHERE member_id = ?`;
        await db.query(query, [id]);
        res.json({ message: 'Member deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// @route   GET /api/members/:id/bookings
// @desc    8. All bookings for a specific member (SELECT + multi-table JOIN)
router.get('/:id/bookings', async (req, res) => {
    try {
        const { id } = req.params;
        const query = `
            SELECT b.booking_date, b.status, b.attended, 
                   c.class_name, c.schedule, c.room, 
                   t.first_name AS trainer_first, t.last_name AS trainer_last
            FROM Booking b
            JOIN Class c ON b.class_id = c.class_id
            JOIN Trainer t ON c.trainer_id = t.trainer_id
            WHERE b.member_id = ?
            ORDER BY c.schedule ASC
        `;
        const [rows] = await db.query(query, [id]);
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
