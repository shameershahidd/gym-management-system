USE gym_management;

DROP PROCEDURE IF EXISTS BookClass;
DROP PROCEDURE IF EXISTS CancelBooking;
DROP PROCEDURE IF EXISTS GetMemberSummary;

DELIMITER //

-- Procedure to safely book a class (checking capacity)
CREATE PROCEDURE BookClass (IN p_member_id INT, IN p_class_id INT)
BEGIN
    DECLARE v_current_bookings INT;
    DECLARE v_capacity INT;

    -- Get current confirmed bookings and class capacity
    SELECT COUNT(*) INTO v_current_bookings
    FROM Booking 
    WHERE class_id = p_class_id AND status = 'Confirmed';

    SELECT capacity INTO v_capacity
    FROM Class
    WHERE class_id = p_class_id;

    -- Check if there is space
    IF v_current_bookings < v_capacity THEN
        -- Insert a confirmed booking
        INSERT INTO Booking (member_id, class_id, status)
        VALUES (p_member_id, p_class_id, 'Confirmed');
        SELECT 'Successfully booked the class.' AS Message;
    ELSE
        -- Class is full, waitlist the member
        INSERT INTO Booking (member_id, class_id, status)
        VALUES (p_member_id, p_class_id, 'Waitlisted');
        SELECT 'Class is full. You have been added to the waitlist.' AS Message;
    END IF;
END //

-- Procedure to cancel a booking and handle waitlists (optional logic)
CREATE PROCEDURE CancelBooking (IN p_booking_id INT)
BEGIN
    UPDATE Booking
    SET status = 'Cancelled'
    WHERE booking_id = p_booking_id;
    
    SELECT 'Booking successfully cancelled.' AS Message;
END //

-- Procedure to get a summary of a member's account
CREATE PROCEDURE GetMemberSummary (IN p_member_id INT)
BEGIN
    -- 1. Get Member details
    SELECT first_name, last_name, email, phone, join_date 
    FROM Member 
    WHERE member_id = p_member_id;

    -- 2. Get Membership details
    SELECT type AS membership_type, start_date, end_date, fee 
    FROM Membership 
    WHERE member_id = p_member_id;

    -- 3. Get total amount paid
    SELECT SUM(amount) AS total_payments 
    FROM Payment 
    WHERE member_id = p_member_id;
    
    -- 4. Get total classes attended
    SELECT COUNT(*) AS classes_attended
    FROM Booking
    WHERE member_id = p_member_id AND attended = TRUE;
END //

DELIMITER ;