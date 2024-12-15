const express = require("express");
const router = express.Router();
const db = require("../dbconn");

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


module.exports = router;