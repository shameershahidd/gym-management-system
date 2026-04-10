# Gym Management System - Project Context & Progress

## Project Overview
A 3-tier online enterprise information system for gym management built for COP 4710 Database Management. Features a MySQL relational database, RESTful Express.js API, and a multi-page HTML/CSS/JS frontend.

## Team
- Lovesh Kumar (U61547146)
- Shameer Sheikh (U66127678)
- Sujith Palanivasagam (U76394602)

## Tech Stack
- **Database**: MySQL Server
- **Backend**: Node.js, Express.js, `mysql2`
- **Frontend**: Vanilla HTML / CSS / JS (migration to React planned for later)

## Database Schema (gym_management)
1. **Member**: `member_id` (PK), `first_name`, `last_name`, `email`, `phone`, `join_date`
2. **Trainer**: `trainer_id` (PK), `first_name`, `last_name`, `specialty`, `email`, `hire_date`
3. **Class**: `class_id` (PK), `trainer_id` (FK), `class_name`, `schedule`, `capacity`, `room`, `duration_min`
4. **Membership**: `membership_id` (PK), `member_id` (FK), `type` (Basic/Premium/VIP), `start_date`, `end_date`, `fee`
5. **Booking**: `booking_id` (PK), `member_id` (FK), `class_id` (FK), `booking_date`, `status`, `attended`
6. **Payment**: `payment_id` (PK), `member_id` (FK), `amount`, `payment_date`, `method`, `description`

## Required Queries Mapping
1. `GET /api/members` (SELECT + JOIN with Membership)
2. `POST /api/members` (INSERT Registration)
3. `PUT /api/members/:id` (UPDATE Info)
4. `DELETE /api/members/:id` (DELETE Member)
5. `GET /api/classes` (SELECT + JOIN with Trainer)
6. `POST /api/bookings` (INSERT + Capacity Check using Stored Procedure)
7. `GET /api/payments` (SELECT + Aggregate SUM/COUNT)
8. `GET /api/members/:id/bookings` (SELECT + Multi-table JOIN)

## Progress Checklist
- [x] Phase 1 & 2: Setup GitHub repo and folder structure.
- [x] Phase 3: Create `schema.sql`, `seed.sql`, and `procedures.sql`.
- [x] Create `PROGRESS.md` for AI context sharing.
- [x] Setup `.env` and `config/db.js` for MySQL connection pool.
- [x] Setup Express App Entry Point (`server.js`).
- [ ] Phase 4: Implement all required 8 Express API routes (`backend/routes/*`).
- [ ] Phase 5: Build User Interface (Frontend Pages & JS).
- [ ] Add Form Validation & DOM manipulation.

## Notes for Next Session
If continuing in a new session, review this `PROGRESS.md` file, then check the `package.json` scripts, the DB connection settings in `backend/config/db.js`, and the routes defined in `backend/routes/`.
