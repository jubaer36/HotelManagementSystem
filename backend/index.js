const express = require("express");
const app = express();
const mysql = require("mysql2");
const cors = require("cors");
const cron = require("node-cron");

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




const addGuest = (guestData) => {
    const sqlInsertGuest = `
      INSERT INTO Guest (FirstName, LastName, EmailAddress, PhoneNumber, NID, DateOfBirth, HotelID)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    return new Promise((resolve, reject) => {
      db.query(
        sqlInsertGuest,
        [
          guestData.firstName,
          guestData.lastName,
          guestData.email,
          guestData.phoneNumber,
          guestData.nid,
          guestData.dob,
          guestData.hotelID,
        ],
        (err, result) => {
          if (err) return reject(err);
          resolve(result.insertId); // Return the newly created GuestID
        }
      );
    });
  };
  
  // Helper function to create a booking
  const createBooking = (bookingData) => {
    const sqlInsertBooking = `
      INSERT INTO Booking (GuestID, HotelID, EmpID, CheckInDate, CheckOutDate, NumAdults, NumChildren, TotalBooking, PaymentStatus)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    return new Promise((resolve, reject) => {
      db.query(
        sqlInsertBooking,
        [
          bookingData.guestID,
          bookingData.hotelID,
          bookingData.empID,
          bookingData.checkInDate,
          bookingData.checkOutDate,
          bookingData.numAdults,
          bookingData.numChildren,
          bookingData.totalBooking,
          bookingData.paymentStatus,
        ],
        (err, result) => {
          if (err) return reject(err);
          resolve(result.insertId); // Return the newly created BookingID
        }
      );
    });
  };
  
  // Helper function to update room status
  const updateRoomStatus = (bookingID, roomID) => {
    const sqlUpdateRoom = `
      UPDATE Room SET Status = 'Occupied', BookingID = ? WHERE RoomID = ?
    `;
    return new Promise((resolve, reject) => {
      db.query(sqlUpdateRoom, [bookingID, roomID], (err, result) => {
        if (err) return reject(err);
        resolve();
      });
    });
  };
  
  // Endpoint to add a guest and book rooms
  app.post("/add-guest", async (req, res) => {
    try {
      const {
        firstName,
        lastName,
        email,
        phoneNumber,
        dob,
        nid,
        hotelID,
        selectedRooms,
        checkInDate,
        checkOutDate,
        numAdults,
        numChildren,
      } = req.body;


  
      // Add guest
      const guestID = await addGuest({
        firstName,
        lastName,
        email,
        phoneNumber,
        nid,
        dob,
        hotelID,
      });

      const bookingID = await createBooking({
        guestID,
        hotelID: 1,
        empID: 1, // Static Employee ID (replace as needed)
        checkInDate,
        checkOutDate,
        numAdults,
        numChildren,
        totalBooking: 200.0, // Placeholder for total booking cost
        paymentStatus: "Pending",
      });
      // Process bookings for selected rooms
      for (const roomID of selectedRooms) {
        await updateRoomStatus(bookingID, roomID);
      }
  
      res.send("Guest and bookings added successfully.");
    } catch (error) {
      console.error("Error processing booking:", error);
      res.status(500).send("Error processing booking.");
    }
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
    const hotelID = 1;

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
        conditions.push("r.MaxOccupancy >= ?");
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


// Cron job to run every day at 12:00 PM
app.post("/manual-checkout", async (req, res) => {
    const { bookingID } = req.body; // Get BookingID from the request body

    if (!bookingID) {
        return res.status(400).send("BookingID is required.");
    }

    console.log("Processing manual checkout for BookingID:", bookingID);

    try {
        // Step 1: Find all rooms associated with the BookingID
        const queryRooms = `
      SELECT RoomID FROM Room WHERE BookingID = ? AND Status = 'Occupied';
    `;

        db.query(queryRooms, [bookingID], (err, results) => {
            if (err) {
                console.error("SQL Query Error (Fetching Rooms):", err);
                return res.status(500).send("Error fetching rooms for checkout.");
            }

            if (results.length === 0) {
                console.log("No occupied rooms found for this BookingID.");
                return res.status(404).send("No occupied rooms found for this BookingID.");
            }

            const roomIDs = results.map((row) => row.RoomID); // Extract all RoomIDs

            // Step 2: Update all rooms to make them available
            const updateRoomQuery = `
        UPDATE Room SET Status = 'Available' WHERE RoomID IN (?);
      `;

            db.query(updateRoomQuery, [roomIDs], (err) => {
                if (err) {
                    console.error("SQL Query Error (Updating Room Statuses):", err);
                    return res.status(500).send("Error updating room statuses.");
                }

                console.log(`Rooms with BookingID ${bookingID} are now available.`);
                res.send(`Rooms with BookingID ${bookingID} are now available.`);
            });
        });
    } catch (error) {
        console.error("Unexpected Error (Manual Checkout):", error);
        res.status(500).send("Unexpected error during manual checkout.");
    }
});



app.get("/current-guests", (req, res) => {
  const query = `
    SELECT
      g.GuestID,
      g.FirstName,
      g.LastName,
      g.EmailAddress,
      g.PhoneNumber,
      b.CheckInDate,
      b.CheckOutDate,
      b.NumAdults,
      b.NumChildren,
      r.RoomNumber
    FROM Guest g
    INNER JOIN Booking b ON g.GuestID = b.GuestID
    INNER JOIN Room r ON b.BookingID = r.BookingID
    WHERE r.Status = 'Occupied';
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching current guests:", err);
      res.status(500).send("Error fetching current guests.");
    } else {
      res.send(results);
    }
  });
});



app.post("/extend-visit", (req, res) => {
  const { guestID, newCheckoutDate } = req.body;
  if (!guestID || !newCheckoutDate) {
      return res.status(400).send("GuestID and newCheckoutDate are required.");
  }

  // Query to find the BookingID associated with the GuestID
  const fetchBookingQuery = `SELECT BookingID FROM Booking WHERE GuestID = ?`;

  db.query(fetchBookingQuery, [guestID], (err, results) => {
      if (err) {
          console.error("Error fetching BookingID:", err);
          return res.status(500).send("Error fetching BookingID.");
      }

      if (results.length === 0) {
          return res.status(404).send("No booking found for this GuestID.");
      }

      const bookingID = results[0].BookingID;

      // Update the CheckOutDate for the booking
      const updateCheckoutQuery = `
          UPDATE Booking 
          SET CheckOutDate = ? 
          WHERE BookingID = ?;
      `;

      db.query(updateCheckoutQuery, [newCheckoutDate, bookingID], (err) => {
          if (err) {
              console.error("Error extending visit:", err);
              return res.status(500).send("Error extending visit.");
          }
          res.send("Checkout date updated successfully.");
      });
  });
});


app.post("/checkout", (req, res) => {
  const { guestID } = req.body;

  if (!guestID) {
      return res.status(400).send("GuestID is required.");
  }

  // Query to find the BookingID associated with the GuestID
  const fetchBookingQuery = `SELECT BookingID FROM Booking WHERE GuestID = ?`;

  db.query(fetchBookingQuery, [guestID], (err, results) => {
      if (err) {
          console.error("Error fetching BookingID:", err);
          return res.status(500).send("Error fetching BookingID.");
      }

      if (results.length === 0) {
          return res.status(404).send("No booking found for this GuestID.");
      }

      const bookingID = results[0].BookingID;

      // Update the Room table to make rooms available
      const updateRoomQuery = `
          UPDATE Room 
          SET Status = 'Available', BookingID = 1 
          WHERE BookingID = ?;
      `;

      db.query(updateRoomQuery, [bookingID], (err) => {
          if (err) {
              console.error("Error during checkout:", err);
              return res.status(500).send("Error during checkout.");
          }
          res.send("Guest checked out successfully.");
      });
  });
});


app.post("/filter-guests", (req, res) => {
  const {
    firstName,
    lastName,
    phoneNumber,
    email,
    guestID,
    fromDate,
    toDate,
  } = req.body;

  let query = `
    SELECT
      g.GuestID,
      g.FirstName,
      g.LastName,
      g.EmailAddress,
      g.PhoneNumber,
      b.CheckInDate,
      b.CheckOutDate,
      b.NumAdults,
      b.NumChildren,
      r.RoomNumber
    FROM Guest g
    INNER JOIN Booking b ON g.GuestID = b.GuestID
    INNER JOIN Room r ON b.BookingID = r.BookingID
    WHERE 1=1
  `;

  const params = [];

  if (firstName) {
    query += " AND g.FirstName LIKE ?";
    params.push(`%${firstName}%`);
  }
  if (lastName) {
    query += " AND g.LastName LIKE ?";
    params.push(`%${lastName}%`);
  }
  if (phoneNumber) {
    query += " AND g.PhoneNumber LIKE ?";
    params.push(`%${phoneNumber}%`);
  }
  if (email) {
    query += " AND g.EmailAddress LIKE ?";
    params.push(`%${email}%`);
  }
  if (guestID) {
    query += " AND g.GuestID = ?";
    params.push(guestID);
  }
  if (fromDate) {
    query += " AND b.CheckInDate >= ?";
    params.push(fromDate);
  }
  if (toDate) {
    query += " AND b.CheckOutDate <= ?";
    params.push(toDate);
  }

  db.query(query, params, (err, results) => {
    if (err) {
      console.error("Error filtering guests:", err);
      res.status(500).send("Error filtering guests.");
    } else {
      res.send(results);
    }
  });
});




// Start the server
app.listen(3001, () => {
    console.log("Server is running on port 3001");
});
