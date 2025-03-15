const express = require("express");
const router = express.Router();
const db = require("../../dbconn");

router.post("/checkout-today", (req, res)=>{
    const hotelID = req.body.hotelID;
    const query = `
        SELECT DISTINCT
            G.GuestID,
            G.FirstName,
            G.LastName,
            G.EmailAddress,
            G.PhoneNumber,
            G.NID,
            G.DateOfBirth,
            B.CheckInDate,
            B.CheckOutDate
            FROM Guest G
            INNER JOIN Booking B ON G.GuestID = B.GuestID
            INNER JOIN Room R ON B.BookingID = R.BookingID
            WHERE DATE(B.CheckOutDate) <= CURDATE()
            AND R.Status = 'Occupied'
            AND G.HotelID = ?;
    `;
    // console.log(query);

    db.query(query, hotelID, (err, results) => {
        if(err) {
            console.error("Error fetching todays checkouts");
            res.status(500).send("Error fetching todays checkouts");
        }
        else{
            res.send(results);
        }
    });
});

router.post("/filter-checkout", (req, res) => {
    const HotelID = req.body.HotelID;
    const FirstName = req.body.FirstName;
    const LastName = req.body.LastName;
    const EmailAddress = req.body.EmailAddress;
    const PhoneNumber = req.body.PhoneNumber;
    const NID = req.body.NID;
    const DateOfBirth = req.body.DateOfBirth;

    let query = `
        SELECT DISTINCT
            G.GuestID,
            G.FirstName,
            G.LastName,
            G.EmailAddress,
            G.PhoneNumber,
            G.NID,
            G.DateOfBirth,
            B.CheckInDate,
            B.CheckOutDate
            FROM Guest G
        INNER JOIN Booking B ON G.GuestID = B.GuestID
        INNER JOIN Room R ON B.BookingID = R.BookingID
        WHERE DATE(B.CheckOutDate) <= CURDATE()
        AND R.Status = 'Occupied'
    `;

    const params = [];

    // Apply filters dynamically based on the provided fields
    if (HotelID) {
        query += " AND G.HotelID = ?";
        params.push(HotelID);
    }
    if (FirstName) {
        query += " AND G.FirstName LIKE ?";
        params.push(`%${FirstName}%`);
    }
    if (LastName) {
        query += " AND G.LastName LIKE ?";
        params.push(`%${LastName}%`);
    }
    if (EmailAddress) {
        query += " AND G.EmailAddress LIKE ?";
        params.push(`%${EmailAddress}%`);
    }
    if (PhoneNumber) {
        query += " AND G.PhoneNumber LIKE ?";
        params.push(`%${PhoneNumber}%`);
    }
    if (NID) {
        query += " AND G.NID LIKE ?";
        params.push(`%${NID}%`);
    }
    if (DateOfBirth) {
        query += " AND G.DateOfBirth = ?";
        params.push(DateOfBirth);
    }
    
    // Execute the query
    db.query(query, params, (err, results) => {
        if (err) {
            console.error("Error filtering checkouts:", err);
            res.status(500).send("Error filtering checkouts.");
        } else {
            res.send(results);
        }
    });
});

router.post("/payment-done",(req,res)=>{
  console.log("ciwB");
  const {guestID, amount} = req.body;
  // console.log(guestID);

  const roomStatusChange = `
    UPDATE ROOM
    SET Status = 'Available'
    WHERE BookingID = (SELECT BookingID
                      FROM Booking B
                      WHERE B.GuestID = ?)`

    db.query(roomStatusChange, [guestID],(err)=>{
      if(err){
        console.error("error while updating room staus");
      }
      else
      {
        console.log("success changing room status");
      }
    })

    const bookingStatusChange = `
    UPDATE Booking
    SET PaymentStatus = 'Paid'
    WHERE GuestID = ?`

    db.query(bookingStatusChange, [guestID],(err)=>{
      if(err){
        console.error("error while updating booking staus");
      }
      else
      {
        console.log("success changing booking status");
      }
    })

    const transactionQuery = `
    INSERT INTO Transactions (BookingID, AmountPaid)
        SELECT BookingID, ?
        FROM Booking
        WHERE GuestID = ?`;
    db.query(transactionQuery, [ amount,guestID],(err)=>{
      if(err){
        console.error("error while inserting into transactions");
      }
      else
      {
        console.log("successfully instered into transactions")
      }
    })
  

  res.send("Done");
});



router.post("/billing-details", (req, res) => {
    const { guestID } = req.body;
  
    if (!guestID) {
      return res.status(400).send("GuestID is required.");
    }
  
    // Query to fetch the paid amount (TotalBooking) and PaymentStatus
    const queryPaid = `
      SELECT TotalBooking, PaymentStatus
      FROM Booking 
      WHERE GuestID = ?;
    `;
  
    // Query to calculate the room charges based on days stayed and room base price
    const queryRoomCharges = `
      SELECT SUM(DATEDIFF(b.CheckOutDate, b.CheckInDate) * r.BasePrice) AS RoomTotal
      FROM Room r
      INNER JOIN Booking b ON r.BookingID = b.BookingID
      WHERE b.GuestID = ?;
    `;
  
    // Query to calculate feature charges
    const queryFeatureCharges = `
      SELECT SUM(f.FeatureAdditionalPrice) AS FeatureTotal
      FROM Feature f
      INNER JOIN Booking b ON f.GuestID = b.GuestID
      WHERE b.GuestID = ?;
    `;
  
    let response = {};
  
    // Execute all queries
    db.query(queryPaid, [guestID], (err, paidResults) => {
      if (err) {
        console.error("Error fetching billing details:", err);
        return res.status(500).send("Error fetching billing details.");
      }
      if (paidResults.length === 0) {
        return res.status(404).send("No billing details found for this GuestID.");
      }
  
      response.TotalBooking = paidResults[0].TotalBooking;
      response.PaymentStatus = paidResults[0].PaymentStatus;
  
      db.query(queryRoomCharges, [guestID], (err, roomResults) => {
        if (err) {
          console.error("Error calculating room charges:", err);
          return res.status(500).send("Error calculating room charges.");
        }
        response.RoomTotal = roomResults[0]?.RoomTotal ? parseFloat(roomResults[0].RoomTotal) : 0;
          
        db.query(queryFeatureCharges, [guestID], (err, featureResults) => {
          if (err) {
            console.error("Error calculating feature charges:", err);
            return res.status(500).send("Error calculating feature charges.");
          }
          response.FeatureTotal = featureResults[0]?.FeatureTotal ? parseFloat(featureResults[0].FeatureTotal) : 0;
  
          // Calculate the total to be paid
          response.AmountToBePaid = response.RoomTotal + response.FeatureTotal;
  
          res.send(response);
        });
      });
    });
  });

module.exports = router;