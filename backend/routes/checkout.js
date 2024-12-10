const express = require("express");
const router = express.Router();
const db = require("../dbconn");



router.post("/current-guests", (req, res) => {
    const hotelID  = req.body.hotelID;
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
        r.RoomNumber,
        r.RoomID
      FROM Guest g
      INNER JOIN Booking b ON g.GuestID = b.GuestID
      INNER JOIN Room r ON b.BookingID = r.BookingID
      WHERE r.Status = 'Occupied'
      AND r.HotelID = ?;
    `;
  
    db.query(query, hotelID  , (err, results) => {
      if (err) {
        console.error("Error fetching current guests:", err);
        res.status(500).send("Error fetching current guests.");
      } else {
        res.send(results);
      }
    });
});
  
  
  
router.post("/extend-visit", (req, res) => {
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
  
  
router.post("/checkout", (req, res) => {
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

// router.post("/features",(req,res)=>{
//           console.log(req.body.roomID);
// });
  
router.post("/filter-guests", (req, res) => {
           const firstName= req.body.firstName;
           const lastName= req.body.lastName;
           const phoneNumber= req.body.phoneNumber;
           const email= req.body.email;
           const guestID= req.body.guestID;
           const fromDate= req.body.fromDate;
           const toDate= req.body.toDate;
           const hotelID= req.body.hotelID;

    
  
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
        r.RoomNumber,
        r.RoomID
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

    if(hotelID) {
        query += "AND g.HotelID = ?";
        params.push(hotelID);
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


  
module.exports = router;
  