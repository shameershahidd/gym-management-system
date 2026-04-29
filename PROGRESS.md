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
0. **SystemUser**: `user_id` (PK), `username`, `password_hash`, `role` (admin/staff/viewer)
1. **Member**: `member_id` (PK), `first_name`, `last_name`, `email`, `phone`, `join_date`
2. **Trainer**: `trainer_id` (PK), `first_name`, `last_name`, `specialty`, `email`, `hire_date`
3. **Class**: `class_id` (PK), `trainer_id` (FK), `class_name`, `schedule`, `capacity`, `room`, `duration_min`
4. **Membership**: `membership_id` (PK), `member_id` (FK), `type` (Basic/Premium/VIP), `start_date`, `end_date`, `fee`
5. **Booking**: `booking_id` (PK), `member_id` (FK), `class_id` (FK), `booking_date`, `status`, `attended`
6. **Payment**: `payment_id` (PK), `member_id` (FK), `amount`, `payment_date`, `method`, `description`

## Database Views & Privileges (Extra Credit)
*   **View_PublicClasses**: Exposes non-sensitive class schedule and availability.
*   **View_PrivateFinances**: Exposes aggregated monthly revenue.
*   **MySQL Users & Roles:**
    *   `gym_admin`: Granted ALL PRIVILEGES.
    *   `gym_staff`: Granted SELECT, INSERT, UPDATE on operational tables, restricted from DELETE.
    *   `gym_viewer`: Strictly read-only (`SELECT`), restricted to non-sensitive views like `View_PublicClasses` and `Trainer` table.

## Required Queries Mapping
1. `GET /api/members` (SELECT + JOIN with Membership)
2. `POST /api/members` (INSERT Registration)
3. `PUT /api/members/:id` (UPDATE Info)
4. `DELETE /api/members/:id` (DELETE Member)
5. `GET /api/classes` (SELECT + JOIN with Trainer)
6. `POST /api/bookings` (INSERT + Capacity Check using Stored Procedure)
7. `GET /api/payments` (SELECT + Aggregate SUM/COUNT)
8. `GET /api/members/:id/bookings` (SELECT + Multi-table JOIN)

## User Authentication & Role Guard System
- Uses JWT (`jsonwebtoken`) and `bcryptjs`.
- Endpoint `POST /api/auth/login` checks DB hash and returns JWT embedded with `role`.
- Frontend passes `Authorization: Bearer <token>` automatically on every request.
- Unauthenticated users are hard-redirected to `/login.html` by client-side scripts.
- Express Middleware `protect` ensures token validity. `restrictTo('admin', 'staff')` blocks `viewer` accounts at the API level (e.g. from seeing Sales dashboards or inserting members).
- Frontend UI explicitly hides controls and renders *"Read-Only"* blocks when the context role is `viewer`.

## Progress Checklist
- [x] Phase 1 & 2: Setup GitHub repo and folder structure.
- [x] Phase 3: Create `schema.sql`, `seed.sql`, and `procedures.sql`.
- [x] Setup `.env` and `config/db.js` for MySQL connection pool.
- [x] Setup Express App Entry Point (`server.js`).
- [x] Phase 4: Implement all required 8 Express API routes (`backend/routes/*`).
- [x] Phase 5: Build User Interface (Frontend Pages & JS).
- [x] Phase 6 (Extra Credit): Implemented JWT User Auth + Hashed Passwords.
- [x] Phase 6 (Extra Credit): Form Validation (Regex email testing & length validations before submit).
- [x] Phase 6 (Extra Credit): Database Privileges + Role Constraints (`permissions.sql`).

## Notes for Next Session
The project is officially 100% complete and matches all original spec requirements plus all extra credit opportunities. To test, open `frontend/pages/login.html` and sign in. MySQL schemas including Views/Users can be rebuilt by running `schema.sql`, `seed.sql`, and `permissions.sql` respectively.

### Recent Quality of Life Improvements
- Validated & fixed the regex validation bug preventing correctly formatted email additions.
- Extended the `add/edit` member modal with a **Membership Type** selector, tied via MySQL Transactions to safely populate the Member and Membership tables synchronously.
- Added a `GET /api/classes/:id/bookings` API endpoint to support a new **Class Attendees** frontend modal, allowing active insight into who successfully booked each class.
- Cleansed hardcoded test credentials from the `login.html` public view to ensure production readiness.
