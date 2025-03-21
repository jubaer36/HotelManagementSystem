CREATE TRIGGER before_hourly_pay_update
BEFORE UPDATE ON Employee
FOR EACH ROW
SET NEW.Salary = (NEW.hourly_pay * 2080);

CREATE TRIGGER before_add_employee
BEFORE INSERT ON Employee
FOR EACH ROW
SET NEW.Salary = (NEW.hourly_pay * 2080);



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
