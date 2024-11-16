-- Insert into Hotel Table
INSERT INTO Hotel (Name, Description, StarRating, Location) VALUES
('Ocean View Hotel', 'Luxury seaside hotel.', 5, '{"Country": "USA", "City": "Miami", "Street": "123 Beach Blvd"}'),
('Mountain Retreat', 'Cozy mountain resort.', 4, '{"Country": "USA", "City": "Denver", "Street": "456 Alpine Way"}'),
('City Lights Hotel', 'Modern hotel in the city center.', 3, '{"Country": "USA", "City": "New York", "Street": "789 Broadway"}'),
('Desert Oasis', 'Exclusive desert getaway.', 5, '{"Country": "UAE", "City": "Dubai", "Street": "101 Sand Dunes"}'),
('Countryside Inn', 'Relaxing countryside inn.', 4, '{"Country": "UK", "City": "Oxford", "Street": "12 Meadow Lane"}');

-- Insert into Guest Table
INSERT INTO Guest (HotelID, FirstName, LastName, EmailAddress, PhoneNumber, NID, DateOfBirth) VALUES
(1, 'John', 'Doe', 'john.doe@example.com', '1234567890', 'NID001', '1980-05-15'),
(2, 'Jane', 'Smith', 'jane.smith@example.com', '2345678901', 'NID002', '1990-03-20'),
(3, 'Mike', 'Johnson', 'mike.johnson@example.com', '3456789012', 'NID003', '1985-08-10'),
(4, 'Emily', 'Brown', 'emily.brown@example.com', '4567890123', 'NID004', '1992-11-05'),
(5, 'Chris', 'Taylor', 'chris.taylor@example.com', '5678901234', 'NID005', '1995-09-30');

-- Insert into Department Table
INSERT INTO Department (HotelID, DeptName, Description) VALUES
(1, 'Housekeeping', 'Maintains room cleanliness.'),
(2, 'Reception', 'Handles check-ins and check-outs.'),
(3, 'F&B', 'Provides meals and refreshments.'),
(4, 'Security', 'Ensures hotel safety.'),
(5, 'Maintenance', 'Repairs and manages facilities.');

-- Insert into Employee Table
INSERT INTO Employee (DeptID, FirstName, LastName, Phone, Email, Salary, Role, HiredDate, Address) VALUES
(1, 'Alice', 'Williams', '1231231230', 'alice.williams@example.com', 40000.00, 'Manager', '2018-01-15', '{"City": "Miami", "Street": "456 Hotel St"}'),
(2, 'Bob', 'Jones', '2342342341', 'bob.jones@example.com', 35000.00, 'Receptionist', '2019-04-20', '{"City": "Denver", "Street": "789 Hotel St"}'),
(3, 'Charlie', 'Smith', '3453453452', 'charlie.smith@example.com', 30000.00, 'Chef', '2020-06-10', '{"City": "New York", "Street": "123 NYC St"}'),
(4, 'David', 'Johnson', '4564564563', 'david.johnson@example.com', 45000.00, 'Technician', '2017-08-05', '{"City": "Dubai", "Street": "101 Desert St"}'),
(5, 'Ella', 'Brown', '5675675674', 'ella.brown@example.com', 32000.00, 'Cleaner', '2021-02-25', '{"City": "Oxford", "Street": "12 Inn St"}');

-- Insert into Booking Table
INSERT INTO Booking (GuestID, HotelID, EmpID, CheckInDate, CheckOutDate, NumAdults, NumChildren, TotalBooking, PaymentStatus) VALUES
(1, 1, 1, '2024-12-01', '2024-12-05', 2, 1, 1200, 'Pending'),
(2, 2, 2, '2024-12-10', '2024-12-15', 1, 0, 800, 'Completed'),
(3, 3, 3, '2024-12-20', '2024-12-25', 3, 2, 2500, 'Pending'),
(4, 4, 4, '2024-11-05', '2024-11-10', 2, 2, 2000, 'Completed'),
(5, 5, 5, '2024-11-15', '2024-11-20', 1, 0, 1500, 'Pending');

-- Insert into Room_Class Table
INSERT INTO Room_Class (ClassType, Description) VALUES
('Deluxe', 'Spacious room with premium amenities.'),
('Standard', 'Basic room with essential facilities.'),
('Suite', 'Luxury suite with additional space.'),
('Single', 'Single-bed room for solo travelers.'),
('Double', 'Double-bed room for couples.');

-- Insert into Room Table
INSERT INTO Room (RoomNumber, RoomClassID, BookingID, Status, MaxOccupancy, BasePrice) VALUES
(101, 1, 1, 'Available', 4, 200.00),
(102, 2, 2, 'Occupied', 2, 150.00),
(201, 3, 3, 'Available', 6, 400.00),
(301, 4, 4, 'Occupied', 1, 100.00),
(302, 5, 5, 'Available', 2, 180.00);

-- Insert into Bed_Type Table
INSERT INTO Bed_Type (RoomID, BedType, Size) VALUES
(1 ,'King', 'Large'),
(2, 'Queen', 'Medium'),
(3, 'Twin', 'Small'),
(4, 'Single', 'Small'),
(5, 'Double', 'Large');

-- Insert into Feature Table
INSERT INTO Feature (RoomID, FeatureName, Description, FeatureAdditionalPrice) VALUES
(1, 'Ocean View', 'Room with a scenic ocean view.', 50.00),
(2, 'Balcony', 'Room with a private balcony.', 30.00),
(3, 'Jacuzzi', 'Room with a private Jacuzzi.', 100.00),
(4, 'Mini Bar', 'Room with an included mini bar.', 25.00),
(5, 'Breakfast Included', 'Room price includes breakfast.', 20.00);
select * from Guest;