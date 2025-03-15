const express = require("express");
const router = express.Router();
const db = require("../../dbconn");





// Fetch available rooms
router.post("/available-rooms", (req, res) => {

    const hotelID = req.body.hotelID;

    let query = `SELECT * FROM hotelmanagementsystem.room WHERE status = 'Available' AND HotelID = ?;`;


    db.query(query , hotelID, (err, result) => {
            if (err) {
                console.error("Error fetching rooms:", err);
                return res.status(500).send("Error fetching available rooms.");
            }
            res.send(result);
        }
    );
});




router.post("/filter-rooms", (req, res) => {
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
        await updateRoomStatus(bookingID, roomID);
      }
  
      res.send("Guest and bookings added successfully.");
    }
      catch (error) {
        console.error("Error processing booking:", error);
        res.status(500).send("Error processing booking.");
      }
    
});



module.exports = router;
