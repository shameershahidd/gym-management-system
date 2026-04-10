const express = require('express');
const cors = require('cors');
require('dotenv').config();

const membersRoutes = require('./routes/members');
const classesRoutes = require('./routes/classes');
const bookingsRoutes = require('./routes/bookings');
const paymentsRoutes = require('./routes/payments');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Main App Routes
app.use('/api/members', membersRoutes);
app.use('/api/classes', classesRoutes);
app.use('/api/bookings', bookingsRoutes);
app.use('/api/payments', paymentsRoutes);

// Optional future routes
// app.use('/api/trainers', require('./routes/trainers'));
// app.use('/api/memberships', require('./routes/memberships'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
