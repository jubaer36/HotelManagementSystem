const express = require("express");
const router = express.Router();
const db = require("../../dbconn");


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


router.post("/add-feature", (req, res) => {
    const { roomID, guestID, featureName, description, additionalPrice } = req.body;

    const query = `
        INSERT INTO Feature (RoomID, GuestID, FeatureName, Description, FeatureAdditionalPrice)
        VALUES (?, ?, ?, ?, ?);
    `;

    db.query(
        query,
        [roomID, guestID, featureName, description, additionalPrice],
        (err) => {
            if (err) {
                console.error("Error adding new feature:", err);
                return res.status(500).send("Failed to add feature.");
            }
            res.send("Feature added successfully!");
        }
    );
});


module.exports = router;