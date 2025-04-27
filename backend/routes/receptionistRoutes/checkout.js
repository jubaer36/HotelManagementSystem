const express = require("express");
const router = express.Router();
const db = require("../../dbconn");



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
      r.RoomID,
      r.RoomImage
    FROM Guest g
    INNER JOIN Booking b ON g.GuestID = b.GuestID
    INNER JOIN Room r ON b.BookingID = r.BookingID
    WHERE b.HotelID = ?
    AND CURDATE() BETWEEN b.CheckInDate AND b.CheckOutDate
    `;
  
    db.query(query, hotelID  , (err, results) => {
      if (err) {
        console.error("Error fetching current guests:", err);
        res.status(500).send("Error fetching current guests.");
      } else {
        results = results.map(guest => {
          guest.CheckInDate = adjustDate(guest.CheckInDate);
          guest.CheckOutDate = adjustDate(guest.CheckOutDate);
          if (guest.RoomImage) {
              guest.RoomImage = Buffer.from(guest.RoomImage).toString('base64');
          }
          return guest;
      });
      res.send(results);
      }
    });
});
  


  
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
        r.RoomID,
        r.RoomImage
      FROM Guest g
      INNER JOIN Booking b ON g.GuestID = b.GuestID
      INNER JOIN Room r ON b.BookingID = r.BookingID
      WHERE g.FirstName <> 'System'
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
        results = results.map(guest => {
          guest.CheckInDate = adjustDate(guest.CheckInDate);
          guest.CheckOutDate = adjustDate(guest.CheckOutDate);
          if (guest.RoomImage) {
              guest.RoomImage = Buffer.from(guest.RoomImage).toString('base64');
          }
          return guest;
      });
  
      res.send(results);
      }
    });
});


function adjustDate(date) {
  if (!date) return null;
  let d = new Date(date);
  d.setDate(d.getDate() + 1); // Add 1 day
  return d.toISOString().split("T")[0]; // Return only the date part
}

  
module.exports = router;
  