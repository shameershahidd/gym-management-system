const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { protect, restrictTo } = require('../middleware/auth');

router.get('/', protect, async (req, res) => {
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

router.post('/', protect, restrictTo('admin', 'staff'), async (req, res) => {
    try {
        const { first_name, last_name, email, phone, join_date, membership_type } = req.body;
        
        // Use a transaction since we are inserting into two tables
        await db.query('START TRANSACTION');
        
        const query = `
            INSERT INTO Member (first_name, last_name, email, phone, join_date)
            VALUES (?, ?, ?, ?, ?)
        `;
        const dateToUse = join_date || new Date();
        const [result] = await db.query(query, [first_name, last_name, email, phone, dateToUse]);
        const newMemberId = result.insertId;

        // Insert membership tier if provided
        if (membership_type) {
            let fee = 30.00;
            if (membership_type === 'Premium') fee = 50.00;
            if (membership_type === 'VIP') fee = 100.00;
            
            // Default 1 month from join_date
            const startDateStr = typeof dateToUse === 'string' ? dateToUse : dateToUse.toISOString().split('T')[0];
            const startDate = new Date(startDateStr);
            const endDate = new Date(startDate);
            endDate.setMonth(endDate.getMonth() + 1);

            const membershipQuery = `
                INSERT INTO Membership (member_id, type, start_date, end_date, fee)
                VALUES (?, ?, ?, ?, ?)
            `;
            await db.query(membershipQuery, [newMemberId, membership_type, startDateStr, endDate.toISOString().split('T')[0], fee]);
        }

        await db.query('COMMIT');
        
        res.status(201).json({ id: newMemberId, message: 'Member created successfully' });
    } catch (err) {
        await db.query('ROLLBACK');
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

router.put('/:id', protect, restrictTo('admin', 'staff'), async (req, res) => {
    try {
        const { id } = req.params;
        const { first_name, last_name, email, phone, membership_type } = req.body;
        
        await db.query('START TRANSACTION');
        
        const query = `
            UPDATE Member 
            SET first_name = ?, last_name = ?, email = ?, phone = ? 
            WHERE member_id = ?
        `;
        await db.query(query, [first_name, last_name, email, phone, id]);
        
        // Update or insert membership
        if (membership_type) {
            let fee = 30.00;
            if (membership_type === 'Premium') fee = 50.00;
            if (membership_type === 'VIP') fee = 100.00;
            
            const checkQuery = `SELECT * FROM Membership WHERE member_id = ?`;
            const [existing] = await db.query(checkQuery, [id]);
            
            if (existing.length > 0) {
                await db.query(`UPDATE Membership SET type = ?, fee = ? WHERE member_id = ?`, [membership_type, fee, id]);
            } else {
                const start = new Date();
                const end = new Date();
                end.setMonth(end.getMonth() + 1);
                
                await db.query(`
                    INSERT INTO Membership (member_id, type, start_date, end_date, fee)
                    VALUES (?, ?, ?, ?, ?)
                `, [id, membership_type, start.toISOString().split('T')[0], end.toISOString().split('T')[0], fee]);
            }
        }
        
        await db.query('COMMIT');
        res.json({ message: 'Member updated successfully' });
    } catch (err) {
        await db.query('ROLLBACK');
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

router.delete('/:id', protect, restrictTo('admin'), async (req, res) => {
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

router.get('/:id/bookings', protect, restrictTo('admin', 'staff'), async (req, res) => {
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
