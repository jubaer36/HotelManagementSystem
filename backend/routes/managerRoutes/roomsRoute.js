const express = require("express");
const router = express.Router();
const db = require("../../dbconn");

router.get("/get-available-rooms/:hotelID", (req, res) => {
    const hotelID = req.params.hotelID;

    const sql = `
        SELECT Room.RoomID, Room.RoomNumber, Room.BasePrice, Room.MaxOccupancy, 
               Room_Class.ClassType 
        FROM Room 
        JOIN Room_Class ON Room.RoomClassID = Room_Class.RoomClassID
        WHERE Room.HotelID = ?`;

    db.query(sql, [hotelID], (err, result) => {
        if (err) {
            console.error("Error fetching available rooms:", err);
            res.status(500).send("Error fetching available rooms");
        } else {
            console.log("Available rooms with class type:", result);
            res.status(200).json(result);
        }
    });
});


module.exports = router;