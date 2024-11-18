-- Insert into Hotel Table
INSERT INTO Hotel (Name, Description, StarRating, Location) VALUES
('Ocean View Hotel', 'Luxury seaside hotel', 5, '{"Country": "USA", "City": "Miami", "Street": "123 Beach Blvd"}'),
('Mountain Retreat', 'Cozy mountain getaway', 4, '{"Country": "USA", "City": "Denver", "Street": "456 Mountain Rd"}'),
('City Center Inn', 'Convenient city hotel', 3, '{"Country": "USA", "City": "New York", "Street": "789 City Ave"}'),
('Desert Oasis', 'Relaxing desert resort', 4, '{"Country": "USA", "City": "Phoenix", "Street": "101 Desert Blvd"}'),
('Lakeside Lodge', 'Serene lakeside lodging', 5, '{"Country": "USA", "City": "Seattle", "Street": "202 Lake Shore Dr"}');

-- Insert into Guest Table
INSERT INTO Guest (HotelID, FirstName, LastName, EmailAddress, PhoneNumber, NID, DateOfBirth) VALUES
(1, 'John', 'Doe', 'john.doe@example.com', '1234567890', 'A123456', '1990-01-01'),
(2, 'Jane', 'Smith', 'jane.smith@example.com', '1234567891', 'B123456', '1985-05-15'),
(3, 'Alice', 'Brown', 'alice.brown@example.com', '1234567892', 'C123456', '1992-09-21'),
(4, 'Bob', 'Johnson', 'bob.johnson@example.com', '1234567893', 'D123456', '1988-12-12'),
(5, 'Eve', 'Davis', 'eve.davis@example.com', '1234567894', 'E123456', '1995-07-07');

-- Insert into Department Table
INSERT INTO Department (HotelID, DeptName, Description) VALUES
(1, 'Front Desk', 'Handles check-ins and guest inquiries'),
(2, 'Housekeeping', 'Responsible for cleaning and maintaining rooms'),
(3, 'Food and Beverage', 'Manages restaurant and bar operations'),
(4, 'Maintenance', 'Oversees building repairs and upkeep'),
(5, 'Security', 'Ensures guest and staff safety');

-- Insert into Employee Table
INSERT INTO Employee (DeptID, FirstName, LastName, Phone, Email, Salary, Role, HiredDate, Address) VALUES
(1, 'Sam', 'Taylor', '1234567895', 'sam.taylor@example.com', 40000.00, 'Receptionist', '2020-03-01', '{"City": "Miami", "Street": "Beach Blvd"}'),
(2, 'Laura', 'Miller', '1234567896', 'laura.miller@example.com', 30000.00, 'Housekeeper', '2019-07-15', '{"City": "Denver", "Street": "Mountain Rd"}'),
(3, 'Mark', 'Wilson', '1234567897', 'mark.wilson@example.com', 45000.00, 'Chef', '2021-02-10', '{"City": "New York", "Street": "City Ave"}'),
(4, 'Anna', 'White', '1234567898', 'anna.white@example.com', 35000.00, 'Technician', '2022-08-20', '{"City": "Phoenix", "Street": "Desert Blvd"}'),
(5, 'David', 'Brown', '1234567899', 'david.brown@example.com', 50000.00, 'Security Officer', '2018-11-11', '{"City": "Seattle", "Street": "Lake Shore Dr"}');

-- Insert into Booking Table
INSERT INTO Booking (GuestID, HotelID, EmpID, CheckInDate, CheckOutDate, NumAdults, NumChildren, TotalBooking, PaymentStatus, BookingDate) VALUES
(1, 1, 1, '2024-11-20', '2024-11-25', 2, 1, 1000, 'Confirmed', '2024-11-15'),
(2, 2, 2, '2024-11-18', '2024-11-22', 1, 0, 600, 'Pending', '2024-11-14'),
(3, 3, 3, '2024-11-15', '2024-11-20', 2, 2, 1200, 'Confirmed', '2024-11-13'),
(4, 4, 4, '2024-11-10', '2024-11-15', 1, 1, 800, 'Cancelled', '2024-11-12'),
(5, 5, 5, '2024-11-25', '2024-11-30', 3, 1, 1500, 'Confirmed', '2024-11-15');

-- Insert into Room_Class Table
INSERT INTO Room_Class (ClassType, Description) VALUES
('Standard', 'Basic amenities'),
('Suite', 'Luxury suite with extra space'),
('Single', 'Single bed, ideal for one person'),
('Double', 'Double bed, ideal for couples'),
('Family', 'Large room for families');

-- Insert into Room Table
INSERT INTO Room (RoomNumber, RoomClassID, HotelID, BookingID, Status, MaxOccupancy, BasePrice) VALUES
(101, 1, 1, 1, 'Available', 2, 150.00),
(102, 2, 2, 2, 'Available', 4, 300.00),
(103, 3, 3, 3, 'Occupied', 1, 100.00),
(104, 4, 4, 4, 'Available', 2, 200.00),
(105, 5, 5, 5, 'Available', 6, 500.00);

-- Insert into Bed_Type Table
INSERT INTO Bed_Type (RoomID, BedType, Size) VALUES
(1, 'King', 'Large'),
(2, 'Queen', 'Medium'),
(3, 'Single', 'Small'),
(4, 'Double', 'Large'),
(5, 'Twin', 'Medium');

-- Insert into Feature Table
INSERT INTO Feature (RoomID, FeatureName, Description, FeatureAdditionalPrice) VALUES
(1, 'Ocean View', 'Room with a balcony and ocean view', 50.00),
(2, 'Mountain View', 'Room with a scenic mountain view', 30.00),
(3, 'WiFi', 'High-speed internet access', 10.00),
(4, 'Breakfast Included', 'Complimentary breakfast for guests', 20.00),
(5, 'Hot Tub', 'Room with a private hot tub', 100.00);
