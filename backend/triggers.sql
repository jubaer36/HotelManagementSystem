CREATE TRIGGER before_hourly_pay_update
BEFORE UPDATE ON Employee
FOR EACH ROW
SET NEW.Salary = (NEW.hourly_pay * 2080);

CREATE TRIGGER before_add_employee
BEFORE INSERT ON Employee
FOR EACH ROW
SET NEW.Salary = (NEW.hourly_pay * 2080);


DELIMITER //

CREATE TRIGGER after_transaction_status_update
BEFORE UPDATE ON InventoryTransactions
FOR EACH ROW
BEGIN
  IF NEW.Status = 'Completed' AND OLD.Status = 'Pending' THEN
    SET NEW.TransactionType = 'Received';
    SET NEW.ReceiveDate = CURRENT_TIMESTAMP;
  END IF;
END;
//

DELIMITER ;

DELIMITER //
CREATE TRIGGER after_employee_insert
AFTER INSERT ON Employee
FOR EACH ROW
BEGIN
    DECLARE hotel_id INT;
    DECLARE username VARCHAR(255);
    IF NEW.Role IN ('manager', 'receptionist') THEN
        

        SELECT HotelID INTO hotel_id 
        FROM Department 
        WHERE DeptID = NEW.DeptID;
        
        SET username = CONCAT(NEW.FirstName, NEW.LastName);
        
        INSERT INTO Users (Username, Password, HotelID, Role)
        VALUES (username, '$2b$10$q9Oa2VY17WMwMkFjtej8ve7Ur/bgOpoLelpY2t5IG9z3KQ6CRICl2', hotel_id, NEW.Role);
    END IF;
END;
//
DELIMITER ;

DELIMITER //

CREATE TRIGGER after_employee_removed
AFTER UPDATE ON Employee
FOR EACH ROW
BEGIN
    -- Check if the working status is changed to 'Not Working' and role is 'manager' or 'receptionist'
    IF NEW.working_status = 'Not Working' AND OLD.working_status != 'Not Working' 
       AND OLD.Role IN ('manager', 'receptionist') THEN
       
        -- Remove the user from the Users table based on FirstName + LastName
        DELETE FROM Users 
        WHERE Username = CONCAT(OLD.FirstName, OLD.LastName);
    END IF;
END;

//

DELIMITER ;



DELIMITER //
CREATE TRIGGER after_employee_update
AFTER UPDATE ON Employee
FOR EACH ROW
BEGIN
    DECLARE hotel_id INT;
    DECLARE username VARCHAR(255);

    IF NEW.Role IN ('manager', 'receptionist') AND NEW.working_status != 'Not Working' THEN
        SELECT HotelID INTO hotel_id 
        FROM Department 
        WHERE DeptID = NEW.DeptID;
        
        SET username = CONCAT(NEW.FirstName, NEW.LastName);
        
        INSERT INTO Users (Username, Password, HotelID, Role)
        VALUES (username, '$2b$10$q9Oa2VY17WMwMkFjtej8ve7Ur/bgOpoLelpY2t5IG9z3KQ6CRICl2', hotel_id, NEW.Role);
    END IF;
END;
//
DELIMITER ;

DELIMITER //

CREATE TRIGGER after_insert_hotel_create_departments
AFTER INSERT ON Hotel
FOR EACH ROW
BEGIN
    INSERT INTO Department (HotelID, DeptName, Description) VALUES
    (NEW.HotelID, 'Front Desk', 'Handles guest check-ins, check-outs, and inquiries.'),
    (NEW.HotelID, 'Housekeeping', 'Ensures rooms and common areas are clean and well-maintained.'),
    (NEW.HotelID, 'Food & Beverage', 'Manages the kitchen, room service, and dining areas.'),
    (NEW.HotelID, 'Maintenance', 'Responsible for repairs and upkeep of the hotel infrastructure.'),
    (NEW.HotelID, 'Security', 'Ensures the safety and security of guests and staff.');
END//

DELIMITER ;


