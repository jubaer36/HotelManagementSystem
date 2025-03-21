-- drop database hotelmanagementsystem;
create database hotelmanagementsystem;
use hotelmanagementsystem;
-- Create Hotel Table

CREATE TABLE Users (
    UserID INT PRIMARY KEY AUTO_INCREMENT,
    Username VARCHAR(255) UNIQUE NOT NULL,
    Password VARCHAR(255) NOT NULL,
    HotelID INT NOT NULL,
    Role ENUM('receptionist', 'manager', 'admin') NOT NULL
);

CREATE TABLE Hotel (
    HotelID INT PRIMARY KEY AUTO_INCREMENT,
    Name VARCHAR(255) NOT NULL,
    Description TEXT, -- Added description for hotel details
    StarRating INT CHECK (StarRating BETWEEN 1 AND 5), -- Added a star rating
    Location JSON NOT NULL, -- Storing location as a JSON object
    Status ENUM('active', 'inactive') DEFAULT 'active' -- Added status field for hotel
);

-- Create Guest Table
CREATE TABLE Guest (
    GuestID INT PRIMARY KEY AUTO_INCREMENT,
    HotelID INT,
    FirstName VARCHAR(255) NOT NULL,
    LastName VARCHAR(255) NOT NULL,
    EmailAddress VARCHAR(255),
    PhoneNumber VARCHAR(15) NOT NULL,
    NID VARCHAR(20) NOT NULL,
    DateOfBirth DATE, -- Added date of birth for more guest details
    FOREIGN KEY (HotelID) REFERENCES Hotel(HotelID) ON DELETE CASCADE
);

-- Create Department Table
CREATE TABLE Department (
    DeptID INT PRIMARY KEY AUTO_INCREMENT,
    HotelID INT NOT NULL,
    DeptName VARCHAR(255) NOT NULL,
    Description TEXT,
    FOREIGN KEY (HotelID) REFERENCES Hotel(HotelID) ON DELETE CASCADE
);

-- Create Employee Table
CREATE TABLE Employee (
    EmpID INT PRIMARY KEY AUTO_INCREMENT,
    DeptID INT NOT NULL,
    FirstName VARCHAR(255) NOT NULL,
    LastName VARCHAR(255) NOT NULL,
    Phone VARCHAR(15) NOT NULL,
    Email VARCHAR(255),
    hourly_pay DECIMAL(10, 2) NOT NULL CHECK(hourly_pay > 0),
    Salary DECIMAL(10, 2) ,
    working_status VARCHAR(255) NOT NULL,
    Role VARCHAR(255) NOT NULL,
    HiredDate DATE, 
    Address JSON, -- Added JSON address for employee details
    FOREIGN KEY (DeptID) REFERENCES Department(DeptID) ON DELETE CASCADE
);

-- Create Booking Table
CREATE TABLE Booking (
    BookingID INT PRIMARY KEY AUTO_INCREMENT,
    GuestID INT NOT NULL,
    HotelID INT NOT NULL,
    EmpID INT NOT NULL,
    CheckInDate DATE NOT NULL,
    CheckOutDate DATE NOT NULL,
    NumAdults INT CHECK (NumAdults >= 0),
    NumChildren INT CHECK (NumChildren >= 0),
    TotalBooking INT CHECK (TotalBooking >= 0),
    PaymentStatus VARCHAR(50) DEFAULT 'Pending', -- Added payment status
    BookingDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Tracks when the booking was made
    FOREIGN KEY (GuestID) REFERENCES Guest(GuestID) ON DELETE CASCADE,
    FOREIGN KEY (HotelID) REFERENCES Hotel(HotelID) ON DELETE CASCADE,
    FOREIGN KEY (EmpID) REFERENCES Employee(EmpID) ON DELETE CASCADE
);

-- Create Room_Class Table
CREATE TABLE Room_Class (
    RoomClassID INT PRIMARY KEY AUTO_INCREMENT,
    ClassType VARCHAR(255) NOT NULL,
    Description TEXT-- Added description for room class details

);

-- Create Room Table
CREATE TABLE Room (
    RoomID INT PRIMARY KEY AUTO_INCREMENT,
    RoomNumber INT NOT NULL,
    RoomClassID INT NOT NULL,
    HotelID INT NOT NULL,
    BookingID INT NOT NULL,
    Status VARCHAR(20) NOT NULL,
    MaxOccupancy INT NOT NULL CHECK (MaxOccupancy <= 20), -- Added maximum occupancy
    BasePrice DECIMAL(10, 2) NOT NULL,-- Added daily rate for room pricing
    FOREIGN KEY (RoomClassID) REFERENCES Room_Class(RoomClassID) ON DELETE CASCADE,
    FOREIGN KEY (BookingID) REFERENCES Booking(BookingID) ON DELETE CASCADE,
    FOREIGN KEY (HotelID) REFERENCES Hotel(HotelID) ON DELETE CASCADE


);

-- Create Bed_Type Table
CREATE TABLE Bed_Type (
    BedTypeID INT PRIMARY KEY AUTO_INCREMENT,
    RoomID INT,
    BedType VARCHAR(255) NOT NULL,
    Size VARCHAR(50), -- Added size of the bed (e.g., King, Queen)
    FOREIGN KEY (RoomID) REFERENCES Room(RoomID) ON DELETE CASCADE
);

-- Create Feature Table
CREATE TABLE Feature (
    FeatureID INT PRIMARY KEY AUTO_INCREMENT,
    RoomID INT,
    GuestID INT,
    FeatureName VARCHAR(255) NOT NULL,
    Description TEXT, -- Added description for features
    FeatureAdditionalPrice DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (RoomID) REFERENCES Room(RoomID) ON DELETE CASCADE,
    FOREIGN KEY (GuestID) REFERENCES Guest(GuestID) ON DELETE CASCADE
);


CREATE TABLE Transactions (
    TransactionID INT PRIMARY KEY AUTO_INCREMENT,
    BookingID INT NOT NULL,
    AmountPaid DECIMAL(10, 2) NOT NULL,
    PaymentDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (BookingID) REFERENCES Booking(BookingID) ON DELETE CASCADE
)


