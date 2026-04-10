USE gym_management;

-- Clear previous data
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE Payment;
TRUNCATE TABLE Booking;
TRUNCATE TABLE Membership;
TRUNCATE TABLE Class;
TRUNCATE TABLE Trainer;
TRUNCATE TABLE Member;
SET FOREIGN_KEY_CHECKS = 1;

-- 1. Insert Members (10 rows)
INSERT INTO Member (first_name, last_name, email, phone, join_date) VALUES
('John', 'Doe', 'john.doe@email.com', '555-0101', '2023-01-15'),
('Jane', 'Smith', 'jane.smith@email.com', '555-0102', '2023-02-20'),
('Robert', 'Johnson', 'r.johnson@email.com', '555-0103', '2023-03-05'),
('Emily', 'Davis', 'emily.d@email.com', '555-0104', '2023-04-10'),
('Michael', 'Wilson', 'mike.wilson@email.com', '555-0105', '2023-05-12'),
('Sarah', 'Brown', 'sbrown@email.com', '555-0106', '2023-06-18'),
('William', 'Jones', 'wjones@email.com', '555-0107', '2023-07-22'),
('Jessica', 'Garcia', 'jgarcia@email.com', '555-0108', '2023-08-30'),
('David', 'Martinez', 'davidm@email.com', '555-0109', '2023-09-05'),
('Amanda', 'Rodriguez', 'amanda.r@email.com', '555-0110', '2023-10-15');

-- 2. Insert Trainers (5 rows)
INSERT INTO Trainer (first_name, last_name, specialty, email, hire_date) VALUES
('Chris', 'Bumstead', 'Bodybuilding', 'chris.b@gym.com', '2022-01-10'),
('Anna', 'Victoria', 'HIIT', 'anna.v@gym.com', '2022-03-15'),
('Joe', 'Wicks', 'Cardio', 'joe.w@gym.com', '2022-06-20'),
('Chloe', 'Ting', 'Pilates', 'chloe.t@gym.com', '2022-08-05'),
('Jeff', 'Cavaliere', 'Strength Training', 'jeff.c@gym.com', '2021-11-20');

-- 3. Insert Classes (10 rows)
INSERT INTO Class (trainer_id, class_name, schedule, capacity, room, duration_min) VALUES
(2, 'Morning HIIT', '2026-05-10 08:00:00', 15, 'Studio A', 45),
(4, 'Pilates Core', '2026-05-10 09:00:00', 20, 'Studio B', 60),
(1, 'Heavy Lifting 101', '2026-05-10 10:30:00', 10, 'Main Floor', 60),
(3, 'Cardio Blast', '2026-05-10 17:00:00', 25, 'Studio A', 45),
(5, 'Functional Strength', '2026-05-11 18:00:00', 15, 'Studio C', 60),
(2, 'Evening HIIT', '2026-05-11 19:00:00', 20, 'Studio A', 45),
(4, 'Advanced Pilates', '2026-05-12 08:00:00', 15, 'Studio B', 60),
(1, 'Pro Bodybuilding', '2026-05-12 16:00:00', 10, 'Main Floor', 90),
(3, 'Weekend Warrior', '2026-05-16 10:00:00', 30, 'Studio A', 60),
(5, 'Core Crusher', '2026-05-16 11:30:00', 20, 'Studio C', 45);

-- 4. Insert Memberships (10 rows)
INSERT INTO Membership (member_id, type, start_date, end_date, fee) VALUES
(1, 'VIP', '2026-01-15', '2027-01-15', 1200.00),
(2, 'Premium', '2026-02-20', '2027-02-20', 800.00),
(3, 'Basic', '2026-03-05', '2027-03-05', 400.00),
(4, 'Premium', '2026-04-10', '2027-04-10', 800.00),
(5, 'Basic', '2025-05-12', '2026-05-12', 400.00),
(6, 'VIP', '2026-06-18', '2027-06-18', 1200.00),
(7, 'Basic', '2025-07-22', '2026-07-22', 400.00),
(8, 'Premium', '2025-08-30', '2026-08-30', 800.00),
(9, 'VIP', '2025-09-05', '2026-09-05', 1200.00),
(10, 'Basic', '2025-10-15', '2026-10-15', 400.00);

-- 5. Insert Bookings (15 rows)
INSERT INTO Booking (member_id, class_id, status, attended) VALUES
(1, 1, 'Confirmed', TRUE),
(2, 1, 'Confirmed', TRUE),
(3, 2, 'Confirmed', FALSE),
(4, 3, 'Confirmed', TRUE),
(5, 4, 'Confirmed', TRUE),
(6, 4, 'Waitlisted', FALSE),
(7, 5, 'Confirmed', TRUE),
(8, 6, 'Cancelled', FALSE),
(9, 7, 'Confirmed', TRUE),
(10, 8, 'Confirmed', FALSE),
(1, 9, 'Confirmed', TRUE),
(2, 9, 'Confirmed', TRUE),
(3, 10, 'Waitlisted', FALSE),
(4, 5, 'Confirmed', TRUE),
(5, 6, 'Confirmed', FALSE);

-- 6. Insert Payments (12 rows)
INSERT INTO Payment (member_id, amount, payment_date, method, description) VALUES
(1, 100.00, '2026-01-15 10:00:00', 'Credit Card', 'Monthly VIP Fee'),
(2, 66.67, '2026-02-20 11:30:00', 'Debit Card', 'Monthly Premium Fee'),
(3, 33.33, '2026-03-05 09:15:00', 'Cash', 'Monthly Basic Fee'),
(4, 800.00, '2026-04-10 14:20:00', 'Credit Card', 'Annual Premium Paid in Full'),
(5, 33.33, '2026-04-12 16:45:00', 'Credit Card', 'Monthly Basic Fee'),
(6, 100.00, '2026-04-18 13:10:00', 'Debit Card', 'Monthly VIP Fee'),
(7, 400.00, '2026-01-22 10:05:00', 'Credit Card', 'Annual Basic Paid in Full'),
(8, 66.67, '2026-04-30 08:50:00', 'Cash', 'Monthly Premium Fee'),
(9, 100.00, '2026-04-05 12:30:00', 'Credit Card', 'Monthly VIP Fee'),
(10, 33.33, '2026-04-15 15:40:00', 'Debit Card', 'Monthly Basic Fee'),
(1, 20.00, '2026-04-10 09:00:00', 'Credit Card', 'Merchandise Purchase - T-shirt'),
(2, 5.00, '2026-04-12 11:00:00', 'Cash', 'Water Bottle');