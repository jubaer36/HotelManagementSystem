const express = require("express");
const router = express.Router();
const db = require("../dbconn");


router.post("/features",(req,res)=>{

    const roomID = req.body.roomID;
    const guestID = req.body.guestID;

    let query = `SELECT * FROM hotelmanagementsystem.Feature WHERE RoomID = ? AND GuestID = ?;`;

    db.query(query , [roomID, guestID], (err, result) => {
        if (err) {
            console.error("Error fetching features:", err);
            return res.status(500).send("Error fetching available features.");
        }
        res.send(result);
        // console.log(result);
    }
    );
});

module.exports = router;