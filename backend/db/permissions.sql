-- Extra Credit: MySQL privileges assigned per role & Views

USE gym_management;

-- -----------------------------------------------------
-- 1. Create Views for role-based data exposure
-- -----------------------------------------------------
DROP VIEW IF EXISTS View_PublicClasses;
DROP VIEW IF EXISTS View_PrivateFinances;

-- View_PublicClasses: Only shows non-sensitive class information (no IDs or duration, just schedule & availability)
CREATE VIEW View_PublicClasses AS
SELECT 
    c.class_name, 
    c.schedule, 
    c.room, 
    c.capacity - (SELECT COUNT(*) FROM Booking b WHERE b.class_id = c.class_id AND status = 'Confirmed') AS available_spots,
    CONCAT(t.first_name, ' ', t.last_name) AS trainer_name
FROM Class c
JOIN Trainer t ON c.trainer_id = t.trainer_id;

-- View_PrivateFinances: Exposes aggregate totals for admins only, hides individual transactions
CREATE VIEW View_PrivateFinances AS
SELECT 
    DATE_FORMAT(payment_date, '%Y-%m') AS payment_month,
    method,
    SUM(amount) AS monthly_revenue
FROM Payment
GROUP BY method, payment_month;


-- -----------------------------------------------------
-- 2. Create Roles / Users in MySQL Server 
--    (These map to the roles in the SystemUser table)
-- -----------------------------------------------------

-- Drop users if they already exist
DROP USER IF EXISTS 'gym_admin'@'localhost';
DROP USER IF EXISTS 'gym_staff'@'localhost';
DROP USER IF EXISTS 'gym_viewer'@'localhost';

-- Create the Database Users
CREATE USER 'gym_admin'@'localhost' IDENTIFIED BY 'adminPass123';
CREATE USER 'gym_staff'@'localhost' IDENTIFIED BY 'staffPass123';
CREATE USER 'gym_viewer'@'localhost' IDENTIFIED BY 'viewerPass123';


-- -----------------------------------------------------
-- 3. Assign Privileges per role (GRANT)
-- -----------------------------------------------------

-- Admins get full control over the database
GRANT ALL PRIVILEGES ON gym_management.* TO 'gym_admin'@'localhost';

-- Staff can SELECT, INSERT, UPDATE on the operational tables, but cannot DELETE records or view Private Finances
GRANT SELECT, INSERT, UPDATE ON gym_management.Member TO 'gym_staff'@'localhost';
GRANT SELECT, INSERT, UPDATE ON gym_management.Booking TO 'gym_staff'@'localhost';
GRANT SELECT, INSERT, UPDATE ON gym_management.Class TO 'gym_staff'@'localhost';
GRANT SELECT, INSERT, UPDATE ON gym_management.Payment TO 'gym_staff'@'localhost';
-- Staff can see public classes view
GRANT SELECT ON gym_management.View_PublicClasses TO 'gym_staff'@'localhost';

-- Viewers are strictly read-only, and only on non-sensitive data/views
GRANT SELECT ON gym_management.View_PublicClasses TO 'gym_viewer'@'localhost';
GRANT SELECT ON gym_management.Trainer TO 'gym_viewer'@'localhost';

-- Apply the privilege changes
FLUSH PRIVILEGES;