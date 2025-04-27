INSERT INTO Hotel (Name, Description, StarRating, Location, Status)
VALUES 
('Ocean Breeze Resort', 'A luxurious beachfront resort with premium amenities and stunning ocean views.', 5, '{"city": "Miami", "state": "FL", "country": "USA", "zip": "33139"}', "active"),
('Mountain Escape Lodge', 'A cozy lodge nestled in the heart of the mountains, perfect for adventure seekers.', 4, '{"city": "Aspen", "state": "CO", "country": "USA", "zip": "81611"}', "active"),
('Urban Haven Hotel', 'A modern hotel located in the city center, ideal for business and leisure travelers.', 3, '{"city": "Chicago", "state": "IL", "country": "USA", "zip": "60601"}', "active");




INSERT INTO Guest ( HotelID, FirstName, LastName, EmailAddress, PhoneNumber, NID, DateOfBirth)
VALUES 
( 1, 'System', 'Guest', 'system_guest@example.com', '0000000000', 'N/A', '1900-01-01');

INSERT INTO Guest (HotelID, FirstName, LastName, EmailAddress, PhoneNumber, NID, DateOfBirth)
VALUES 
(1, 'John', 'Doe', 'john.doe@example.com', '1234567890', '12345', '1985-07-15'),
(1, 'Alice', 'Johnson', 'alice.johnson@example.com', '1122334455', '67890', '1988-11-10'),
(2, 'Jane', 'Smith', 'jane.smith@example.com', '0987654321', '54321', '1990-03-25');






INSERT INTO Department ( HotelID, DeptName, Description)
VALUES 
( 1, 'System Department', 'This is a placeholder department for system-level operations.');

-- For HotelID = 1
INSERT INTO Department (HotelID, DeptName, Description)
VALUES 
(1, 'Front Desk', 'Handles guest check-ins, check-outs, and inquiries.'),
(1, 'Housekeeping', 'Ensures rooms and common areas are clean and well-maintained.'),
(1, 'Food & Beverage', 'Manages the kitchen, room service, and dining areas.'),
(1, 'Maintenance', 'Responsible for repairs and upkeep of the hotel infrastructure.'),
(1, 'Security', 'Ensures the safety and security of guests and staff.');

-- For HotelID = 2
INSERT INTO Department (HotelID, DeptName, Description)
VALUES 
(2, 'Front Desk', 'Handles guest check-ins, check-outs, and inquiries.'),
(2, 'Housekeeping', 'Ensures rooms and common areas are clean and well-maintained.'),
(2, 'Food & Beverage', 'Manages the kitchen, room service, and dining areas.'),
(2, 'Maintenance', 'Responsible for repairs and upkeep of the hotel infrastructure.'),
(2, 'Security', 'Ensures the safety and security of guests and staff.');

-- For HotelID = 3
INSERT INTO Department (HotelID, DeptName, Description)
VALUES 
(3, 'Front Desk', 'Handles guest check-ins, check-outs, and inquiries.'),
(3, 'Housekeeping', 'Ensures rooms and common areas are clean and well-maintained.'),
(3, 'Food & Beverage', 'Manages the kitchen, room service, and dining areas.'),
(3, 'Maintenance', 'Responsible for repairs and upkeep of the hotel infrastructure.'),
(3, 'Security', 'Ensures the safety and security of guests and staff.');







-- Inserting employees with hourly_pay column
INSERT INTO Employee (DeptID, FirstName, LastName, Phone, Email, hourly_pay, Salary,working_status, Role, HiredDate, Address)
VALUES 
-- System Employee
(1, 'System', 'Employee', '0000000000', 'system_employee@example.com', 1.00, 1.00,'Not Working', 'System Role', '1900-01-01', '{"city": "N/A", "state": "N/A"}'),

-- Employees for DeptID = 2
(2, 'Emily', 'Johnson', '1231231234', 'emily.johnson@example.com', 1.50, 250.00,'Working', 'Housekeeper', '2021-09-10', '{"city": "Los Angeles", "state": "CA"}'),
(2, 'Michael', 'Brown', '4564564567', 'michael.brown@example.com', 2.00, 280.00,'Working',  'Supervisor', '2022-12-01', '{"city": "Los Angeles", "state": "CA"}'),

-- Employees for DeptID = 3
(3, 'William', 'Davis', '7897897890', 'william.davis@example.com', 5.50, 320.00,'Working',  'Chef', '2020-06-15', '{"city": "Chicago", "state": "IL"}'),
(3, 'Sophia', 'Garcia', '3213213210', 'sophia.garcia@example.com', 3.50, 300.00,'Working',  'Kitchen Staff', '2023-03-10', '{"city": "Chicago", "state": "IL"}'),

-- Employees for DeptID = 4
(4, 'James', 'Martinez', '9871234560', 'james.martinez@example.com', 4.25, 270.00,'Working',  'Technician', '2021-08-20', '{"city": "Houston", "state": "TX"}'),
(4, 'Olivia', 'Hernandez', '4569876540', 'olivia.hernandez@example.com', 3.75, 260.00,'Working',  'Maintenance Staff', '2022-11-05', '{"city": "Houston", "state": "TX"}'),

-- Employees for DeptID = 5
(5, 'Benjamin', 'Wilson', '1239876540', 'benjamin.wilson@example.com', 6.00, 330.00,'Working',  'Security Officer', '2023-04-15', '{"city": "Phoenix", "state": "AZ"}'),
(5, 'Emma', 'Moore', '3217894560', 'emma.moore@example.com', 6.50, 340.00,'Working',  'Head of Security', '2021-07-25', '{"city": "Phoenix", "state": "AZ"}'),

-- Employees for DeptID = 6
(6, 'Liam', 'Taylor', '7891234560', 'liam.taylor@example.com', 7.00, 360.00,'Working',  'Receptionist', '2022-01-10', '{"city": "Philadelphia", "state": "PA"}'),
(6, 'Charlotte', 'Anderson', '9874563210', 'charlotte.anderson@example.com', 8.00, 370.00,'Working',  'watchman', '2020-10-15', '{"city": "Philadelphia", "state": "PA"}'),

-- Employees for DeptID = 7
(7, 'Elijah', 'Thomas', '6547891230', 'elijah.thomas@example.com', 2.75, 280.00,'Working',  'Housekeeper', '2023-05-01', '{"city": "San Antonio", "state": "TX"}'),
(7, 'Amelia', 'Jackson', '3216549870', 'amelia.jackson@example.com', 3.25, 300.00,'Working',  'Supervisor', '2021-09-15', '{"city": "San Antonio", "state": "TX"}'),

-- Employees for DeptID = 8
(8, 'Alexander', 'White', '1233217890', 'alexander.white@example.com', 5.25, 310.00,'Working',  'Chef', '2020-06-20', '{"city": "San Diego", "state": "CA"}'),
(8, 'Isabella', 'Harris', '6541239870', 'isabella.harris@example.com', 4.00, 290.00,'Working',  'Kitchen Staff', '2022-08-15', '{"city": "San Diego", "state": "CA"}'),

-- Employees for DeptID = 9
(9, 'Henry', 'Martin', '7896541230', 'henry.martin@example.com', 4.50, 275.00,'Working',  'Technician', '2021-07-10', '{"city": "Dallas", "state": "TX"}'),
(9, 'Mia', 'Thompson', '4567893210', 'mia.thompson@example.com', 4.75, 280.00,'Working',  'Maintenance Staff', '2023-03-05', '{"city": "Dallas", "state": "TX"}'),

-- Employees for DeptID = 10
(10, 'Daniel', 'Martinez', '1237896540', 'daniel.martinez@example.com', 1.50, 350.00,'Working',  'Security Officer', '2021-11-15', '{"city": "San Jose", "state": "CA"}'),
(10, 'Ava', 'Gonzalez', '3216547890', 'ava.gonzalez@example.com', 1.00, 300.00,'Working',  'Head of Security', '2020-09-25', '{"city": "San Jose", "state": "CA"}'),

-- Employees for DeptID = 11
(11, 'Matthew', 'Clark', '9873216540', 'matthew.clark@example.com', 8.00, 360.00,'Working',  'Receptionist', '2022-02-05', '{"city": "Austin", "state": "TX"}'),
(11, 'Harper', 'Lewis', '6549871230', 'harper.lewis@example.com', 9.00, 370.00,'Working',  'Assistant Manager', '2021-08-10', '{"city": "Austin", "state": "TX"}'),

-- Employees for DeptID = 12
(12, 'Lucas', 'Walker', '7891239870', 'lucas.walker@example.com', 3.00, 200.00,'Working',  'Housekeeper', '2020-04-10', '{"city": "Jacksonville", "state": "FL"}'),
(12, 'Evelyn', 'Hall', '1236547890', 'evelyn.hall@example.com', 5.00, 310.00,'Working',  'Supervisor', '2023-01-15', '{"city": "Jacksonville", "state": "FL"}'),

-- Employees for DeptID = 13
(13, 'David', 'Allen', '3219876540', 'david.allen@example.com', 1.00, 300.00,'Working',  'Chef', '2022-06-25', '{"city": "Fort Worth", "state": "TX"}'),
(13, 'Ella', 'Young', '9874561230', 'ella.young@example.com', 4.50, 300.00,'Working',  'Kitchen Staff', '2020-03-05', '{"city": "Fort Worth", "state": "TX"}'),

-- Employees for DeptID = 14
(14, 'Joseph', 'King', '6543219870', 'joseph.king@example.com', 3.75, 270.00,'Working',  'Technician', '2021-09-20', '{"city": "Columbus", "state": "OH"}'),
(14, 'Grace', 'Wright', '3217896540', 'grace.wright@example.com', 4.25, 280.00,'Working',  'Maintenance Staff', '2022-07-15', '{"city": "Columbus", "state": "OH"}'),

-- Employees for DeptID = 15
(15, 'Sebastian', 'Scott', '9871236540', 'sebastian.scott@example.com', 7.00, 350.00,'Working',  'Security Officer', '2021-03-20', '{"city": "Charlotte", "state": "NC"}'),
(15, 'Aria', 'Green', '6547893210', 'aria.green@example.com', 6.50, 340.00, 'Working', 'Head of Security', '2020-11-10', '{"city": "Charlotte", "state": "NC"}');


INSERT INTO Employee (DeptID, FirstName, LastName, Phone, Email, hourly_pay, Salary, working_status, Role, HiredDate, Address)  
VALUES  
(5, 'John', 'Doe', '01700000001', 'john.doe@example.com', 5.00, 500.00, 'Working', 'manager', '2023-01-15', '{"street": "123 Main St", "city": "Dhaka", "country": "Bangladesh", "state":"Daka"}'),  

(10, 'Jane', 'Smith', '01700000002', 'jane.smith@example.com', 5.00, 550.00, 'Working', 'manager', '2022-06-20', '{"street": "456 Elm St", "city": "Sylhet", "country": "Bangladesh","state":"Daka"}'),  

(15, 'David', 'Rahman', '01700000003', 'david.rahman@example.com', 6.00, 600.00, 'Working', 'manager', '2021-09-10', '{"street": "789 Oak St", "city": "Chittagong", "country": "Bangladesh","state":"Daka"}');  



INSERT INTO Booking ( GuestID, HotelID, EmpID, CheckInDate, CheckOutDate, NumAdults, NumChildren, TotalBooking, PaymentStatus)
VALUES 
(1, 1, 1, CURDATE() - INTERVAL 7 DAY, CURDATE() - INTERVAL 6 DAY, 1, 0, 100.00, 'Pending');

INSERT INTO Booking (GuestID, HotelID, EmpID, CheckInDate, CheckOutDate, NumAdults, NumChildren, TotalBooking, PaymentStatus)
VALUES
-- Booking for GuestID = 1, HotelID = 1
(2, 1, 2, DATE_SUB(CURDATE(), INTERVAL 5 DAY), DATE_ADD(CURDATE(), INTERVAL 0 DAY), 2, 1, 50, 'Pending'),

-- Booking for GuestID = 2, HotelID = 1
(3, 1, 2, DATE_SUB(CURDATE(), INTERVAL 10 DAY), DATE_ADD(CURDATE(), INTERVAL 0 DAY), 1, 0, 30, 'Pending'),

-- Booking for GuestID = 3, HotelID = 2
(4, 2, 12, DATE_SUB(CURDATE(), INTERVAL 15 DAY), DATE_ADD(CURDATE(), INTERVAL 00 DAY), 3, 2, 70, 'Pending');



INSERT INTO Room_Class (ClassType, Description) VALUES
('Standard', 'Spacious room with a king-sized bed, perfect for couples or solo travelers seeking extra comfort.'),
('Suite', 'Cozy room with a queen-sized bed, ideal for solo travelers or couples.'),
('Single', 'Compact room with a single bed, suitable for solo travelers on a budget.'),
('Double', 'Room with two double beds, great for small families or groups.'),
('Family', 'Room with two twin beds, ideal for friends or colleagues sharing a room.');


INSERT INTO Available_Rooms (RoomNumber, RoomClassID, HotelID, MaxOccupancy, BasePrice)
VALUES
(101, 1, 1, 2, 100.00),
(102, 2, 1, 3, 150.00),
(103, 3, 1, 4, 200.00),
(104, 4, 1, 2, 120.00),
(105, 5, 1, 5, 250.00),
(106, 1, 1, 2, 100.00),
(107, 2, 1, 3, 150.00),
(108, 3, 1, 4, 200.00),
(109, 4, 1, 2, 120.00),
(110, 5, 1, 5, 250.00),
(201, 1, 2, 2, 110.00),
(202, 2, 2, 3, 160.00),
(203, 3, 2, 4, 210.00),
(204, 4, 2, 2, 130.00),
(205, 5, 2, 5, 260.00),
(206, 1, 2, 2, 110.00),
(207, 2, 2, 3, 160.00),
(208, 3, 2, 4, 210.00),
(209, 4, 2, 2, 130.00),
(210, 5, 2, 5, 260.00),
(301, 1, 3, 2, 120.00),
(302, 2, 3, 3, 170.00),
(303, 3, 3, 4, 220.00),
(304, 4, 3, 2, 140.00),
(305, 5, 3, 5, 270.00),
(306, 1, 3, 2, 120.00),
(307, 2, 3, 3, 170.00),
(308, 3, 3, 4, 220.00),
(309, 4, 3, 2, 140.00),
(310, 5, 3, 5, 270.00);


INSERT INTO Room (RoomNumber, RoomClassID, HotelID, BookingID, MaxOccupancy, BasePrice)
VALUES
(101, 1, 1, 1, 2, 100.00),
(102, 2, 1, 2, 3, 150.00),
(103, 3, 1, 1, 4, 200.00),
(104, 4, 1, 1, 2, 120.00),
(105, 5, 1, 1, 5, 250.00),
(106, 1, 1, 1, 2, 100.00),
(107, 2, 1, 3, 3, 150.00),
(108, 3, 1, 3, 4, 200.00),
(109, 4, 1, 1, 2, 120.00),
(110, 5, 1, 1, 5, 250.00),

(201, 1, 2, 1, 2, 110.00),
(202, 2, 2, 4, 3, 160.00),
(203, 3, 2, 1, 4, 210.00),
(204, 4, 2, 1, 2, 130.00),
(205, 5, 2, 1, 5, 260.00),
(206, 1, 2, 1, 2, 110.00),
(207, 2, 2, 1, 3, 160.00),
(208, 3, 2, 1, 4, 210.00),
(209, 4, 2, 1, 2, 130.00),
(210, 5, 2, 1, 5, 260.00),

(301, 1, 3, 1, 2, 120.00),
(302, 2, 3, 1, 3, 170.00),
(303, 3, 3, 1, 4, 220.00),
(304, 4, 3, 1, 2, 140.00),
(305, 5, 3, 1, 5, 270.00),
(306, 1, 3, 1, 2, 120.00),
(307, 2, 3, 1, 3, 170.00),
(308, 3, 3, 1, 4, 220.00),
(309, 4, 3, 1, 2, 140.00),
(310, 5, 3, 1, 5, 270.00);



INSERT INTO Bed_Type (RoomID, BedType, Size) VALUES
(1, 'King', 'Large'),
(2, 'Queen', 'Medium'),
(3, 'Single', 'Small'),
(4, 'Double', 'Medium'),
(5, 'Twin', 'Small');
INSERT INTO Bed_Type (RoomID, BedType, Size) VALUES
(6, 'King', 'Large'),
(7, 'Queen', 'Medium'),
(8, 'Single', 'Small'),
(9, 'Double', 'Medium'),
(10, 'Twin', 'Small');
INSERT INTO Bed_Type (RoomID, BedType, Size) VALUES
(11, 'King', 'Large'),
(12, 'Queen', 'Medium'),
(13, 'Single', 'Small'),
(14, 'Double', 'Medium'),
(15, 'Twin', 'Small');
INSERT INTO Bed_Type (RoomID, BedType, Size) VALUES
(16, 'King', 'Large'),
(17, 'Queen', 'Medium'),
(18, 'Single', 'Small'),
(19, 'Double', 'Medium'),
(20, 'Twin', 'Small');
INSERT INTO Bed_Type (RoomID, BedType, Size) VALUES
(21, 'King', 'Large'),
(22, 'Queen', 'Medium'),
(23, 'Single', 'Small'),
(24, 'Double', 'Medium'),
(25, 'Twin', 'Small');
INSERT INTO Bed_Type (RoomID, BedType, Size) VALUES
(26, 'King', 'Large'),
(27, 'Queen', 'Medium'),
(28, 'Single', 'Small'),
(29, 'Double', 'Medium'),
(30, 'Twin', 'Small');



INSERT INTO Feature (RoomID, GuestID, FeatureName, Description, FeatureAdditionalPrice)
VALUES  
(7, 3, 'High-Speed WiFi', 'Unlimited high-speed internet access', 10.00), 
(7, 3, 'Complimentary Breakfast', 'A delicious breakfast included with the room', 15.00), 
(2, 2, 'Balcony with View', 'Private balcony with a scenic city view', 20.00);



INSERT INTO Transactions (BookingID, AmountPaid, PaymentDate) VALUES
    (3, 120.50, '2020-02-15 10:30:00'),
    (3, 89.99, '2020-05-10 14:15:00'),
    (3, 75.75, '2020-07-20 08:45:00'),
    (3, 99.50, '2020-09-05 16:25:00'),
    (3, 110.00, '2020-11-18 12:10:00'),
    (3, 135.25, '2020-12-22 19:40:00'),

    (3, 140.00, '2021-01-14 11:20:00'),
    (3, 95.75, '2021-03-23 09:50:00'),
    (3, 85.00, '2021-06-11 15:35:00'),
    (3, 78.99, '2021-08-30 18:05:00'),
    (3, 102.25, '2021-10-12 07:25:00'),
    (3, 120.00, '2021-12-28 22:10:00'),

    (3, 130.50, '2022-02-05 08:15:00'),
    (3, 99.99, '2022-04-15 13:50:00'),
    (3, 110.75, '2022-06-22 17:20:00'),
    (3, 115.25, '2022-08-18 20:40:00'),
    (3, 125.00, '2022-10-25 09:30:00'),
    (3, 135.75, '2022-12-19 21:15:00'),

    (3, 150.00, '2023-01-10 14:50:00'),
    (3, 88.25, '2023-03-28 06:35:00'),
    (3, 105.50, '2023-06-05 19:10:00'),
    (3, 115.00, '2023-08-24 08:25:00'),
    (3, 132.25, '2023-10-19 11:45:00'),
    (3, 145.00, '2023-12-29 23:20:00'),

    (3, 160.50, '2024-01-15 07:45:00'),
    (3, 99.99, '2024-03-12 10:55:00'),
    (3, 112.75, '2024-05-28 18:05:00'),
    (3, 123.50, '2024-08-07 20:30:00'),
    (3, 135.00, '2024-10-14 09:15:00'),
    (3, 145.25, '2024-12-21 22:50:00');



INSERT INTO Transactions (BookingID, AmountPaid, PaymentDate)
VALUES
(3, 200.00, '2025-01-15 10:30:00'),
(3, 150.50, '2025-02-20 14:45:00'),
(3, 300.75, '2025-03-10 08:20:00'),
(3, 400.00, '2025-04-05 12:10:00'),
(3, 275.90, '2025-05-25 16:30:00'),
(3, 500.00, '2025-06-18 09:50:00'),
(3, 350.25, '2025-07-22 18:40:00'),
(3, 425.60, '2025-08-09 11:25:00'),
(3, 600.80, '2025-09-30 20:15:00'),
(3, 320.45, '2025-10-14 07:55:00');


INSERT INTO Users (Username, Password, HotelID, Role)
VALUES 
('receptionist1', '$2b$10$q9Oa2VY17WMwMkFjtej8ve7Ur/bgOpoLelpY2t5IG9z3KQ6CRICl2', 1, 'receptionist'),
('manager1', '$2b$10$q9Oa2VY17WMwMkFjtej8ve7Ur/bgOpoLelpY2t5IG9z3KQ6CRICl2', 1, 'manager'),
('admin1', '$2b$10$q9Oa2VY17WMwMkFjtej8ve7Ur/bgOpoLelpY2t5IG9z3KQ6CRICl2', 1, 'admin');

