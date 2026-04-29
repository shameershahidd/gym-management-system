const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

// In reality, this should be in .env. We use a fallback so it works locally by default
const { JWT_SECRET } = require('../middleware/auth');

// @route   POST /api/auth/register
// @desc    Register a new system user
router.post('/register', async (req, res) => {
    try {
        const { username, password, role } = req.body;

        // Hash the password with bcrypt (10 rounds)
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Store into SystemUser (Extra Credit for Users table + hashing)
        const query = `
            INSERT INTO SystemUser (username, password_hash, role)
            VALUES (?, ?, ?)
        `;
        const [result] = await db.query(query, [username, hashedPassword, role || 'viewer']);
        res.status(201).json({ message: 'User registered successfully. You can now login.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to register or username already exists' });
    }
});

// @route   POST /api/auth/login
// @desc    Validate login credentials and return signed JWT Token with Role
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Find user by username
        const query = `SELECT * FROM SystemUser WHERE username = ?`;
        const [rows] = await db.query(query, [username]);

        const user = rows[0];

        // Ensure user exists and password is correct via bcrypt compare
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        // Generate JSON Web Token embedding the user's role from MySQL database
        const tokenPayload = {
            user_id: user.user_id,
            role: user.role
        };

        const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '48h' });

        res.json({ token, role: user.role, username: user.username });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;