const express = require("express");
const app = express();
const mysql = require("mysql2");
const cors = require("cors");

app.use(cors());
app.use(express.json());

// Database connection
const db = mysql.createConnection({
    user: "root",
    host: "localhost",
    password: "Pi@31416",
    database: "hotelmanagementsystem",
});

// Endpoint to fetch all employees
app.get("/employees", (req, res) => {
    db.query("SELECT * FROM hotelmanagementsystem.employee;", (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send("Error fetching employees.");
        } else {
            res.send(result);
        }
    });
});

// Add a new guest and create booking
app.post("/add-guest", (req, res) => {
    const {
        firstName,
        lastName,
        phoneNumber,
        email,
        dob,
        nid,
        HotelID,
        selectedRoom,
    } = req.body;

    console.log("Request Body:", req.body);

    // Insert guest into the Guest table
    const sqlInsertIntoGuest = `
        INSERT INTO Guest (FirstName, LastName, EmailAddress, PhoneNumber, NID, DateOfBirth, HotelID)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
        sqlInsertIntoGuest,
        [firstName, lastName, email, phoneNumber, nid, dob, HotelID],
        (err, result) => {
            if (err) {
                console.error("Error inserting guest:", err);
                return res.status(500).send({ message: "Error adding guest", error: err });
            }

            const GuestID = result.insertId; // Get the last inserted GuestID
            console.log("Inserted GuestID:", GuestID);

            // Insert booking into the Booking table
            const sqlInsertIntoBooking = `
                INSERT INTO Booking (
                    GuestID,
                    HotelID,
                    EmpID,
                    CheckInDate,
                    CheckOutDate,
                    NumAdults,
                    NumChildren,
                    TotalBooking,
                    PaymentStatus,
                    BookingDate
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;

            const EmpID = 1; // Example EmpID, replace as necessary
            const CheckInDate = "2024-11-16"; // Use actual check-in date from input
            const CheckOutDate = "2024-11-18"; // Use actual check-out date from input
            const NumAdults = 2; // Example value
            const NumChildren = 1; // Example value
            const TotalBooking = 200.0; // Example value, replace with actual calculation
            const PaymentStatus = "Pending"; // Example value
            const BookingDate = new Date().toISOString().split("T")[0]; // Current date

            db.query(
                sqlInsertIntoBooking,
                [
                    GuestID,
                    HotelID,
                    EmpID,
                    CheckInDate,
                    CheckOutDate,
                    NumAdults,
                    NumChildren,
                    TotalBooking,
                    PaymentStatus,
                    BookingDate,
                ],
                (err, result) => {
                    if (err) {
                        console.error("Error inserting booking:", err);
                        return res
                            .status(500)
                            .send({ message: "Error adding booking", error: err });
                    }

                    // Update room status
                    const updateRoomStatus = `
                        UPDATE Room
                        SET Status = 'Booked'
                        WHERE RoomNumber = ?
                    `;

                    db.query(updateRoomStatus, [selectedRoom], (err, result) => {
                        if (err) {
                            console.error("Error updating room status:", err);
                            return res.status(500).send({
                                message: "Error updating room status",
                                error: err,
                            });
                        }

                        res.send({ message: "Guest and booking added successfully!" });
                    });
                }
            );
        }
    );
});

// Fetch available rooms
app.get("/available-rooms", (req, res) => {
    db.query(
        "SELECT * FROM hotelmanagementsystem.room WHERE status = 'Available';",
        (err, result) => {
            if (err) {
                console.error("Error fetching rooms:", err);
                return res.status(500).send("Error fetching available rooms.");
            }
            res.send(result);
        }
    );
});

app.post("/filter-rooms", (req, res) => {
    // const { minPrice, maxPrice, bedType, classType, maxOccupancy } = req.body;
    const minPrice = req.body.minPrice;
    const maxPrice = req.body.maxPrice;
    const bedType= req.body.bedType;
    const classType = req.body.classType;
    const maxOccupancy  = req.body.maxOccupancy;
    const hotelID = req.body.hotelID;

    let query = `
        SELECT r.RoomID, r.RoomNumber, r.Status, r.MaxOccupancy, r.BasePrice, rc.ClassType, bt.BedType
        FROM Room r
        INNER JOIN Room_Class rc ON r.RoomClassID = rc.RoomClassID
        LEFT JOIN Bed_Type bt ON r.RoomID = bt.RoomID
        WHERE r.Status = 'Available'
    `;

    let conditions = [];
    let params = [];

    // Add conditions dynamically based on filters
    if (minPrice && minPrice > 0) {
        conditions.push("r.BasePrice >= ?");
        params.push(minPrice);
    }
    if (maxPrice && maxPrice > 0) {
        conditions.push("r.BasePrice <= ?");
        params.push(maxPrice);
    }
    if (bedType && bedType !== "Any") {
        conditions.push("bt.BedType = ?");
        params.push(bedType);
    }
    if (classType && classType !== "Any") {
        conditions.push("rc.ClassType = ?");
        params.push(classType);
    }
    if (maxOccupancy && maxOccupancy > 0) {
        conditions.push("r.MaxOccupancy <= ?");
        params.push(maxOccupancy);
    }

    if (hotelID && hotelID > 0) {
        conditions.push("r.HotelID = ?");
        params.push(hotelID);
    }

    // Append conditions to the query
    if (conditions.length > 0) {
        query += " AND " + conditions.join(" AND ");
    }


    console.log("Generated Query:", query);
    console.log("Query Parameters:", params);





    // Execute the query
    db.query(query, params, (err, result) => {
        if (err) {
            console.error("Error filtering rooms:", err);
            res.status(500).send({ message: "Error filtering rooms.", error: err });
        } else {
            res.send(result); // Return the filtered rooms
        }
    });
});

// Start the server
app.listen(3001, () => {
    console.log("Server is running on port 3001");
});
