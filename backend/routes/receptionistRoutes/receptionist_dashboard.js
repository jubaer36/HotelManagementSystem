const express = require("express");
const router = express.Router();
const db = require("../../dbconn");





// Fetch available rooms
router.post("/available-rooms", (req, res) => {
  const hotelID = req.body.hotelID;

  const query = `
      SELECT AR.RoomID, AR.RoomNumber, RC.ClassType, BT.BedType, AR.MaxOccupancy, AR.BasePrice
      FROM Available_Rooms AR
      INNER JOIN Room_Class RC ON AR.RoomClassID = RC.RoomClassID
      INNER JOIN Bed_Type BT ON AR.RoomID = BT.RoomID
      WHERE AR.HotelID = ?
      AND AR.RoomNumber NOT IN (
          SELECT R.RoomNumber
          FROM Room R
          INNER JOIN Booking B ON R.BookingID = B.BookingID
          WHERE CURDATE() BETWEEN B.CheckInDate AND B.CheckOutDate
          AND R.HotelID = ?
      );
  `;

  db.query(query, [hotelID, hotelID], (err, result) => {
      if (err) {
          console.error("Error fetching available rooms:", err);
          return res.status(500).send("Error fetching available rooms.");
      }
      console.log("Available Rooms:", result);
      res.send(result);
  });
});




router.post("/filter-rooms", (req, res) => {
  const {
    minPrice,
    maxPrice,
    bedType,
    classType,
    maxOccupancy,
    hotelID,
    checkInDate,
    checkOutDate,
  } = req.body;

  let query = `
    SELECT r.RoomID, r.RoomNumber, r.MaxOccupancy, r.BasePrice, rc.ClassType, bt.BedType
    FROM Available_Rooms r
    INNER JOIN Room_Class rc ON r.RoomClassID = rc.RoomClassID
    LEFT JOIN Bed_Type bt ON r.RoomID = bt.RoomID
    WHERE 1=1
  `;

  const conditions = [];
  const params = [];

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

  // ✅ Correct booking conflict filter (CheckIn inclusive, CheckOut exclusive)
  if (checkInDate && checkOutDate) {
    conditions.push(`
      r.RoomNumber NOT IN (
        SELECT ro.RoomNumber
        FROM Room ro
        INNER JOIN Booking b ON ro.BookingID = b.BookingID
        WHERE
          ro.HotelID = ?
          AND (
            b.CheckInDate < ?
            AND b.CheckOutDate > ?
          )
      )
    `);
    params.push(hotelID, checkOutDate, checkInDate);
  }

  if (conditions.length > 0) {
    query += " AND " + conditions.join(" AND ");
  }

  console.log("Generated Query:", query);
  console.log("Query Parameters:", params);

  db.query(query, params, (err, result) => {
    if (err) {
      console.error("Error filtering rooms:", err);
      res.status(500).send({ message: "Error filtering rooms.", error: err });
    } else {
      console.log("Filtered Rooms:", result);
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
  
// Helper function to book a room (insert new Room record with BookingID)
const bookRoom = (bookingID, roomID) => {
  const sqlInsertRoom = `
    INSERT INTO Room (RoomNumber, RoomClassID, HotelID, BookingID, MaxOccupancy, BasePrice)
    SELECT RoomNumber, RoomClassID, HotelID, ?, MaxOccupancy, BasePrice
    FROM Available_Rooms
    WHERE RoomID = ?
  `;
  return new Promise((resolve, reject) => {
    db.query(sqlInsertRoom, [bookingID, roomID], (err, result) => {
      if (err) return reject(err);
      resolve(result.insertId); // Return the new Room record ID (optional)
    });
  });
};

  
  // Endpoint to add a guest and book rooms
router.post("/add-guest", async (req, res) => {
    try{

        const firstName = req.body.firstName;
        const lastName = req.body.lastName;
        const email = req.body.email;
        const phoneNumber = req.body.phoneNumber;
        const dob = req.body.dob;
        const nid = req.body.nid;
        const hotelID = req.body.hotelID;
        const selectedRooms = req.body.selectedRooms;
        const checkInDate = req.body.checkInDate;
        const checkOutDate = req.body.checkOutDate;
        const numAdults = req.body.numAdults;
        const numChildren = req.body.numChildren;
        const empID = req.body.empID;
        const deposite = req.body.deposite;

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
        hotelID,
        empID, // Static Employee ID (replace as needed)
        checkInDate,
        checkOutDate,
        numAdults,
        numChildren,
        totalBooking: deposite, // Placeholder for total booking cost *************************************
        paymentStatus: "Pending",
      });
      // Process bookings for selected rooms
      for (const roomID of selectedRooms) {
        await bookRoom(bookingID, roomID);
      }
  
      res.send("Guest and bookings added successfully.");
    }
      catch (error) {
        console.error("Error processing booking:", error);
        res.status(500).send("Error processing booking.");
      }
    
});



module.exports = router;
