const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { protect, restrictTo } = require('../middleware/auth');

// @route   GET /api/payments
// @desc    7. Total revenue report using SUM/COUNT (SELECT + aggregate)
router.get('/', protect, restrictTo('admin', 'staff'), async (req, res) => {
    try {
        const query = `
            SELECT 
                COUNT(*) AS total_transactions,
                SUM(amount) AS total_revenue,
                method,
                DATE_FORMAT(payment_date, '%Y-%m') AS month
            FROM Payment
            GROUP BY method, month
            ORDER BY month DESC, total_revenue DESC
        `;
        const [rows] = await db.query(query);
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
