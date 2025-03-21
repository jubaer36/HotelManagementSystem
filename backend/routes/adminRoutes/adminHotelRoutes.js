const express = require("express");
const router = express.Router();
const db = require("../../dbconn");

router.get("/get-hotels", (req, res) => {
    const query = "SELECT * FROM Hotel WHERE Status = 'active';";

    db.query(query, (err, results) => {
        if (err) {
            console.error("Error fetching hotels:", err);
            return res.status(500).send("Error fetching hotels.");
        }
        console.log("Fetched hotels:", results);

        res.json(results);
    });
});

router.post("/add-hotel", (req, res) => {
    const { name, description, starRating, location, status } = req.body;

    if (!name || !description || !starRating || !location || !status) {
        return res.status(400).send("All fields are required.");
    }

    const sql = "INSERT INTO Hotel (Name, Description, StarRating, Location, Status) VALUES (?, ?, ?, ?, ?)";
    
    db.query(sql, [name, description, starRating, JSON.stringify(location), status], (err, result) => {
        if (err) {
            console.error("Error adding hotel:", err);
            res.status(500).send("Error adding hotel");
        } else {
            res.status(201).send("Hotel added successfully");
        }
    });
});

router.put("/deactivate-hotel/:id", (req, res) => {
    const hotelId = req.params.id;
    const sql = "UPDATE Hotel SET Status = 'inactive' WHERE HotelID = ?";

    db.query(sql, [hotelId], (err, result) => {
        if (err) {
            console.error("Error deactivating hotel:", err);
            res.status(500).send("Error deactivating hotel");
        } else {
            res.status(200).send("Hotel deactivated successfully");
        }
    });
});


module.exports = router;