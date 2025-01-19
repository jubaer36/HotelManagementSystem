INSERT INTO Hotel (Name, Description, StarRating, Location)
VALUES 
('Ocean Breeze Resort', 'A luxurious beachfront resort with premium amenities and stunning ocean views.', 5, '{"city": "Miami", "state": "FL", "country": "USA", "zip": "33139"}'),
('Mountain Escape Lodge', 'A cozy lodge nestled in the heart of the mountains, perfect for adventure seekers.', 4, '{"city": "Aspen", "state": "CO", "country": "USA", "zip": "81611"}'),
('Urban Haven Hotel', 'A modern hotel located in the city center, ideal for business and leisure travelers.', 3, '{"city": "Chicago", "state": "IL", "country": "USA", "zip": "60601"}');





INSERT INTO Guest ( HotelID, FirstName, LastName, EmailAddress, PhoneNumber, NID, DateOfBirth)
VALUES 
( 1, 'System', 'Guest', 'system_guest@example.com', '0000000000', 'N/A', '1900-01-01');

INSERT INTO Guest (HotelID, FirstName, LastName, EmailAddress, PhoneNumber, NID, DateOfBirth)
VALUES 
(1, 'John', 'Doe', 'john.doe@example.com', '1234567890', 'NID12345', '1985-07-15'),
(1, 'Alice', 'Johnson', 'alice.johnson@example.com', '1122334455', 'NID67890', '1988-11-10'),
(2, 'Jane', 'Smith', 'jane.smith@example.com', '0987654321', 'NID54321', '1990-03-25');






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
(1, 'System', 'Employee', '0000000000', 'system_employee@example.com', 15.00, 1.00,'Not Working', 'System Role', '1900-01-01', '{"city": "N/A", "state": "N/A"}'),

-- Employees for DeptID = 2
(2, 'Emily', 'Johnson', '1231231234', 'emily.johnson@example.com', 12.50, 2500.00,'Working', 'Housekeeper', '2021-09-10', '{"city": "Los Angeles", "state": "CA"}'),
(2, 'Michael', 'Brown', '4564564567', 'michael.brown@example.com', 14.00, 2800.00,'Working',  'Supervisor', '2022-12-01', '{"city": "Los Angeles", "state": "CA"}'),

-- Employees for DeptID = 3
(3, 'William', 'Davis', '7897897890', 'william.davis@example.com', 15.50, 3200.00,'Working',  'Chef', '2020-06-15', '{"city": "Chicago", "state": "IL"}'),
(3, 'Sophia', 'Garcia', '3213213210', 'sophia.garcia@example.com', 13.50, 3000.00,'Working',  'Kitchen Staff', '2023-03-10', '{"city": "Chicago", "state": "IL"}'),

-- Employees for DeptID = 4
(4, 'James', 'Martinez', '9871234560', 'james.martinez@example.com', 14.25, 2700.00,'Working',  'Technician', '2021-08-20', '{"city": "Houston", "state": "TX"}'),
(4, 'Olivia', 'Hernandez', '4569876540', 'olivia.hernandez@example.com', 13.75, 2600.00,'Working',  'Maintenance Staff', '2022-11-05', '{"city": "Houston", "state": "TX"}'),

-- Employees for DeptID = 5
(5, 'Benjamin', 'Wilson', '1239876540', 'benjamin.wilson@example.com', 16.00, 3300.00,'Working',  'Security Officer', '2023-04-15', '{"city": "Phoenix", "state": "AZ"}'),
(5, 'Emma', 'Moore', '3217894560', 'emma.moore@example.com', 16.50, 3400.00,'Working',  'Head of Security', '2021-07-25', '{"city": "Phoenix", "state": "AZ"}'),

-- Employees for DeptID = 6
(6, 'Liam', 'Taylor', '7891234560', 'liam.taylor@example.com', 17.00, 3600.00,'Working',  'Receptionist', '2022-01-10', '{"city": "Philadelphia", "state": "PA"}'),
(6, 'Charlotte', 'Anderson', '9874563210', 'charlotte.anderson@example.com', 18.00, 3700.00,'Working',  'Manager', '2020-10-15', '{"city": "Philadelphia", "state": "PA"}'),

-- Employees for DeptID = 7
(7, 'Elijah', 'Thomas', '6547891230', 'elijah.thomas@example.com', 12.75, 2800.00,'Working',  'Housekeeper', '2023-05-01', '{"city": "San Antonio", "state": "TX"}'),
(7, 'Amelia', 'Jackson', '3216549870', 'amelia.jackson@example.com', 13.25, 3000.00,'Working',  'Supervisor', '2021-09-15', '{"city": "San Antonio", "state": "TX"}'),

-- Employees for DeptID = 8
(8, 'Alexander', 'White', '1233217890', 'alexander.white@example.com', 15.25, 3100.00,'Working',  'Chef', '2020-06-20', '{"city": "San Diego", "state": "CA"}'),
(8, 'Isabella', 'Harris', '6541239870', 'isabella.harris@example.com', 14.00, 2900.00,'Working',  'Kitchen Staff', '2022-08-15', '{"city": "San Diego", "state": "CA"}'),

-- Employees for DeptID = 9
(9, 'Henry', 'Martin', '7896541230', 'henry.martin@example.com', 14.50, 2750.00,'Working',  'Technician', '2021-07-10', '{"city": "Dallas", "state": "TX"}'),
(9, 'Mia', 'Thompson', '4567893210', 'mia.thompson@example.com', 14.75, 2800.00,'Working',  'Maintenance Staff', '2023-03-05', '{"city": "Dallas", "state": "TX"}'),

-- Employees for DeptID = 10
(10, 'Daniel', 'Martinez', '1237896540', 'daniel.martinez@example.com', 17.50, 3500.00,'Working',  'Security Officer', '2021-11-15', '{"city": "San Jose", "state": "CA"}'),
(10, 'Ava', 'Gonzalez', '3216547890', 'ava.gonzalez@example.com', 17.00, 3400.00,'Working',  'Head of Security', '2020-09-25', '{"city": "San Jose", "state": "CA"}'),

-- Employees for DeptID = 11
(11, 'Matthew', 'Clark', '9873216540', 'matthew.clark@example.com', 18.00, 3600.00,'Working',  'Receptionist', '2022-02-05', '{"city": "Austin", "state": "TX"}'),
(11, 'Harper', 'Lewis', '6549871230', 'harper.lewis@example.com', 19.00, 3700.00,'Working',  'Assistant Manager', '2021-08-10', '{"city": "Austin", "state": "TX"}'),

-- Employees for DeptID = 12
(12, 'Lucas', 'Walker', '7891239870', 'lucas.walker@example.com', 13.00, 2900.00,'Working',  'Housekeeper', '2020-04-10', '{"city": "Jacksonville", "state": "FL"}'),
(12, 'Evelyn', 'Hall', '1236547890', 'evelyn.hall@example.com', 15.00, 3100.00,'Working',  'Supervisor', '2023-01-15', '{"city": "Jacksonville", "state": "FL"}'),

-- Employees for DeptID = 13
(13, 'David', 'Allen', '3219876540', 'david.allen@example.com', 16.00, 3200.00,'Working',  'Chef', '2022-06-25', '{"city": "Fort Worth", "state": "TX"}'),
(13, 'Ella', 'Young', '9874561230', 'ella.young@example.com', 14.50, 3000.00,'Working',  'Kitchen Staff', '2020-03-05', '{"city": "Fort Worth", "state": "TX"}'),

-- Employees for DeptID = 14
(14, 'Joseph', 'King', '6543219870', 'joseph.king@example.com', 13.75, 2700.00,'Working',  'Technician', '2021-09-20', '{"city": "Columbus", "state": "OH"}'),
(14, 'Grace', 'Wright', '3217896540', 'grace.wright@example.com', 14.25, 2800.00,'Working',  'Maintenance Staff', '2022-07-15', '{"city": "Columbus", "state": "OH"}'),

-- Employees for DeptID = 15
(15, 'Sebastian', 'Scott', '9871236540', 'sebastian.scott@example.com', 17.00, 3500.00,'Working',  'Security Officer', '2021-03-20', '{"city": "Charlotte", "state": "NC"}'),
(15, 'Aria', 'Green', '6547893210', 'aria.green@example.com', 16.50, 3400.00, 'Working', 'Head of Security', '2020-11-10', '{"city": "Charlotte", "state": "NC"}');





INSERT INTO Booking ( GuestID, HotelID, EmpID, CheckInDate, CheckOutDate, NumAdults, NumChildren, TotalBooking, PaymentStatus)
VALUES 
(1, 1, 1, CURDATE() - INTERVAL 7 DAY, CURDATE() + INTERVAL 7 DAY, 1, 0, 100.00, 'Pending');

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





INSERT INTO Room (RoomNumber, RoomClassID, HotelID, BookingID, Status, MaxOccupancy, BasePrice)
VALUES
(101, 1, 1, 1, 'Available', 2, 100.00),
(102, 2, 1, 2, 'Occupied', 3, 150.00),
(103, 3, 1, 1, 'Available', 4, 200.00),
(104, 4, 1, 1, 'Available', 2, 120.00),
(105, 5, 1, 1, 'Available', 5, 250.00),
(106, 1, 1, 1, 'Available', 2, 100.00),
(107, 2, 1, 3, 'Occupied', 3, 150.00),
(108, 3, 1, 3, 'Occupied', 4, 200.00),
(109, 4, 1, 1, 'Available', 2, 120.00),
(110, 5, 1, 1, 'Available', 5, 250.00),

(201, 1, 2, 1, 'Available', 2, 110.00),
(202, 2, 2, 4, 'Occupied', 3, 160.00),
(203, 3, 2, 1, 'Available', 4, 210.00),
(204, 4, 2, 1, 'Available', 2, 130.00),
(205, 5, 2, 1, 'Available', 5, 260.00),
(206, 1, 2, 1, 'Available', 2, 110.00),
(207, 2, 2, 1, 'Available', 3, 160.00),
(208, 3, 2, 1, 'Available', 4, 210.00),
(209, 4, 2, 1, 'Available', 2, 130.00),
(210, 5, 2, 1, 'Available', 5, 260.00),
(301, 1, 3, 1, 'Available', 2, 120.00),
(302, 2, 3, 1, 'Available', 3, 170.00),
(303, 3, 3, 1, 'Available', 4, 220.00),
(304, 4, 3, 1, 'Available', 2, 140.00),
(305, 5, 3, 1, 'Available', 5, 270.00),
(306, 1, 3, 1, 'Available', 2, 120.00),
(307, 2, 3, 1, 'Available', 3, 170.00),
(308, 3, 3, 1, 'Available', 4, 220.00),
(309, 4, 3, 1, 'Available', 2, 140.00),
(310, 5, 3, 1, 'Available', 5, 270.00);



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
