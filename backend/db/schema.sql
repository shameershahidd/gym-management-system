CREATE DATABASE IF NOT EXISTS gym_management;
USE gym_management;

-- Drop tables if they already exist (in reverse dependency order to avoid FK errors)
DROP TABLE IF EXISTS Payment;
DROP TABLE IF EXISTS Booking;
DROP TABLE IF EXISTS Membership;
DROP TABLE IF EXISTS Class;
DROP TABLE IF EXISTS Trainer;
DROP TABLE IF EXISTS Member;
DROP TABLE IF EXISTS SystemUser;

-- 0. System User Table (Authentication & Roles)
CREATE TABLE SystemUser (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('admin', 'staff', 'viewer') NOT NULL DEFAULT 'viewer',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 1. Member Table
CREATE TABLE Member (
    member_id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(15),
    join_date DATE NOT NULL
);

-- 2. Trainer Table
CREATE TABLE Trainer (
    trainer_id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    specialty VARCHAR(100),
    email VARCHAR(100) UNIQUE NOT NULL,
    hire_date DATE NOT NULL
);

-- 3. Class Table
CREATE TABLE Class (
    class_id INT AUTO_INCREMENT PRIMARY KEY,
    trainer_id INT NOT NULL,
    class_name VARCHAR(100) NOT NULL,
    schedule DATETIME NOT NULL,
    capacity INT NOT NULL,
    room VARCHAR(50),
    duration_min INT NOT NULL,
    FOREIGN KEY (trainer_id) REFERENCES Trainer(trainer_id) ON DELETE CASCADE
);

-- 4. Membership Table
CREATE TABLE Membership (
    membership_id INT AUTO_INCREMENT PRIMARY KEY,
    member_id INT NOT NULL,
    type ENUM('Basic', 'Premium', 'VIP') NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    fee DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (member_id) REFERENCES Member(member_id) ON DELETE CASCADE
);

-- 5. Booking Table
CREATE TABLE Booking (
    booking_id INT AUTO_INCREMENT PRIMARY KEY,
    member_id INT NOT NULL,
    class_id INT NOT NULL,
    booking_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status ENUM('Confirmed', 'Cancelled', 'Waitlisted') NOT NULL DEFAULT 'Confirmed',
    attended BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (member_id) REFERENCES Member(member_id) ON DELETE CASCADE,
    FOREIGN KEY (class_id) REFERENCES Class(class_id) ON DELETE CASCADE
);

-- 6. Payment Table
CREATE TABLE Payment (
    payment_id INT AUTO_INCREMENT PRIMARY KEY,
    member_id INT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    payment_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    method ENUM('Credit Card', 'Debit Card', 'Cash') NOT NULL,
    description VARCHAR(255),
    FOREIGN KEY (member_id) REFERENCES Member(member_id) ON DELETE CASCADE
);