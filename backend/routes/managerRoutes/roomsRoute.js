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


router.get("/get-room-classes", (req, res) => {
    const sql = "SELECT * FROM Room_Class";

    db.query(sql, (err, result) => {
        if (err) {
            console.error("Error fetching room classes:", err);
            res.status(500).send("Error fetching room classes");
        } else {
            res.status(200).json(result);
        }
    });
});

router.put("/update-room/:roomID", (req, res) => {
    const { classTypeID, basePrice, maxOccupancy } = req.body;
    const roomID = req.params.roomID;

    const sql = `
        UPDATE Room 
        SET RoomClassID = ?, BasePrice = ?, MaxOccupancy = ? 
        WHERE RoomID = ?`;

    db.query(sql, [classTypeID, basePrice, maxOccupancy, roomID], (err, result) => {
        if (err) {
            console.error("Error updating room:", err);
            res.status(500).send("Error updating room details");
        } else {
            res.status(200).send("Room updated successfully");
        }
    });
});



module.exports = router;