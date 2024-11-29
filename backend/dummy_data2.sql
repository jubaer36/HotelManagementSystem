INSERT INTO Hotel (Name, Description, StarRating, Location) VALUES
('Grand Central Hotel', 'A luxury 5-star hotel in the heart of the city.', 5, '{"city": "New York", "state": "NY", "country": "USA"}'),
('Sunrise Inn', 'A cozy boutique hotel offering stunning sunrise views.', 4, '{"city": "San Francisco", "state": "CA", "country": "USA"}'),
('Ocean Breeze Resort', 'A beachfront resort with exceptional amenities.', 4, '{"city": "Miami", "state": "FL", "country": "USA"}'),
('Mountain View Lodge', 'A serene lodge with panoramic mountain views.', 3, '{"city": "Denver", "state": "CO", "country": "USA"}'),
('Urban Escape Hotel', 'A modern, minimalist hotel for urban explorers.', 5, '{"city": "Chicago", "state": "IL", "country": "USA"}');


-- Insert departments for HotelID = 1
INSERT INTO Department (HotelID, DeptName, Description) VALUES
(1, 'Front Desk', 'Handles guest check-ins, check-outs, and inquiries.'),
(1, 'Housekeeping', 'Ensures rooms and common areas are clean and well-maintained.'),
(1, 'Food & Beverage', 'Manages the hotel restaurant and room service.'),
(1, 'Maintenance', 'Takes care of the hotel’s facilities and equipment.'),
(1, 'Security', 'Responsible for guest and property safety.');

-- Insert departments for HotelID = 2
INSERT INTO Department (HotelID, DeptName, Description) VALUES
(2, 'Front Desk', 'Handles guest check-ins, check-outs, and inquiries.'),
(2, 'Housekeeping', 'Ensures rooms and common areas are clean and well-maintained.'),
(2, 'Food & Beverage', 'Manages the hotel restaurant and room service.'),
(2, 'Maintenance', 'Takes care of the hotel’s facilities and equipment.'),
(2, 'Event Management', 'Organizes and oversees events hosted at the hotel.');


-- Insert employees for Department IDs 1 to 10
INSERT INTO Employee (DeptID, FirstName, LastName, Phone, Email, Salary, Role, HiredDate, Address) VALUES
(1, 'John', 'Doe', '1234567890', 'john.doe@example.com', 3500.00, 'Front Desk Manager', '2023-01-15', JSON_OBJECT('Street', '123 Main St', 'City', 'New York', 'State', 'NY')),
(2, 'Jane', 'Smith', '2345678901', 'jane.smith@example.com', 2800.00, 'Housekeeping Supervisor', '2022-03-10', JSON_OBJECT('Street', '456 Elm St', 'City', 'Los Angeles', 'State', 'CA')),
(3, 'Michael', 'Brown', '3456789012', 'michael.brown@example.com', 3200.00, 'F&B Manager', '2021-06-05', JSON_OBJECT('Street', '789 Oak St', 'City', 'Chicago', 'State', 'IL')),
(4, 'Sarah', 'Johnson', '4567890123', 'sarah.johnson@example.com', 3100.00, 'Maintenance Lead', '2020-08-20', JSON_OBJECT('Street', '321 Pine St', 'City', 'Houston', 'State', 'TX')),
(5, 'David', 'Wilson', '5678901234', 'david.wilson@example.com', 3000.00, 'Security Head', '2019-11-15', JSON_OBJECT('Street', '654 Maple St', 'City', 'Phoenix', 'State', 'AZ')),
(6, 'Emily', 'Davis', '6789012345', 'emily.davis@example.com', 3400.00, 'Front Desk Agent', '2023-02-01', JSON_OBJECT('Street', '987 Birch St', 'City', 'San Diego', 'State', 'CA')),
(7, 'Daniel', 'Garcia', '7890123456', 'daniel.garcia@example.com', 2700.00, 'Housekeeper', '2022-05-30', JSON_OBJECT('Street', '543 Cedar St', 'City', 'Dallas', 'State', 'TX')),
(8, 'Sophia', 'Martinez', '8901234567', 'sophia.martinez@example.com', 2900.00, 'Chef', '2021-09-15', JSON_OBJECT('Street', '678 Spruce St', 'City', 'San Jose', 'State', 'CA')),
(9, 'James', 'Hernandez', '9012345678', 'james.hernandez@example.com', 3100.00, 'Technician', '2020-12-20', JSON_OBJECT('Street', '432 Fir St', 'City', 'Austin', 'State', 'TX')),
(10, 'Isabella', 'Lopez', '0123456789', 'isabella.lopez@example.com', 3300.00, 'Event Planner', '2019-07-10', JSON_OBJECT('Street', '210 Walnut St', 'City', 'Seattle', 'State', 'WA'));



INSERT INTO Guest (FirstName, LastName, EmailAddress, PhoneNumber, NID, DateOfBirth, HotelID) VALUES
('John', 'Doe', 'john.doe@example.com', '1234567890', 'NID123456', '1985-06-15', 1);

INSERT INTO Guest (FirstName, LastName, EmailAddress, PhoneNumber, NID, DateOfBirth, HotelID) VALUES
('John', 'Doe', 'john.doe@example.com', '1234567890', 'NID123456', '1985-06-15', 2);

INSERT INTO Booking (GuestID, HotelID, EmpID, CheckInDate, CheckOutDate, NumAdults, NumChildren, TotalBooking, PaymentStatus, BookingDate) VALUES
(1, 1, 1, '2024-11-20', '2024-11-25', 2, 1, 500, 'Confirmed', NOW());

INSERT INTO Booking (GuestID, HotelID, EmpID, CheckInDate, CheckOutDate, NumAdults, NumChildren, TotalBooking, PaymentStatus, BookingDate) VALUES
(2, 2, 6, '2024-11-20', '2024-11-25', 2, 1, 500, 'Confirmed', NOW());

-- Insert dummy data into Room_Class table
INSERT INTO Room_Class (ClassType, Description) VALUES
('Standard', 'Spacious room with a king-sized bed, perfect for couples or solo travelers seeking extra comfort.'),
('Suite', 'Cozy room with a queen-sized bed, ideal for solo travelers or couples.'),
('Single', 'Compact room with a single bed, suitable for solo travelers on a budget.'),
('Double', 'Room with two double beds, great for small families or groups.'),
('Family', 'Room with two twin beds, ideal for friends or colleagues sharing a room.');


INSERT INTO Room (RoomNumber, RoomClassID, HotelID, BookingID, Status, MaxOccupancy, BasePrice) VALUES
(101, 1, 1, 1, 'Available', 2, 150.00),
(102, 2, 1, 1, 'Available', 3, 120.00),
(103, 3, 1, 1, 'Available', 1, 100.00),
(104, 4, 1, 1, 'Available', 4, 200.00),
(105, 5, 1, 1, 'Occupied', 2, 180.00);


INSERT INTO Room (RoomNumber, RoomClassID, HotelID, BookingID, Status, MaxOccupancy, BasePrice) VALUES
(201, 1, 2, 2, 'Available', 2, 150.00),
(202, 2, 2, 2, 'Available', 3, 120.00),
(203, 3, 2, 2, 'Available', 1, 100.00),
(204, 4, 2, 2, 'Occupied', 4, 200.00),
(205, 5, 2, 2, 'Available', 2, 180.00);

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


INSERT INTO Feature (RoomID, GuestID, FeatureName, Description, FeatureAdditionalPrice)
VALUES  
(9, 2, 'High-Speed WiFi', 'Unlimited high-speed internet access', 10.00), 
(9, 2, 'Complimentary Breakfast', 'A delicious breakfast included with the room', 15.00), 
(9, 2, 'Balcony with View', 'Private balcony with a scenic city view', 20.00);

