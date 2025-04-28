const express = require("express");
const router = express.Router();
const db = require("../../dbconn");

const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });


router.get("/get-hotels", (req, res) => {
    const query = "SELECT * FROM Hotel WHERE Status = 'active';";

    db.query(query, (err, results) => {
        if (err) {
            console.error("Error fetching hotels:", err);
            return res.status(500).send("Error fetching hotels.");
        }

        // 🛠️ Properly parse Location and HotelImage if needed
        const parsedResults = results.map(hotel => ({
            ...hotel,
            Location: typeof hotel.Location === "string" ? JSON.parse(hotel.Location) : hotel.Location,
            HotelImage: hotel.HotelImage ? hotel.HotelImage.toString('base64') : null
        }));

        console.log("Parsed Hotels:", parsedResults);

        res.json(parsedResults);
    });
});



router.post("/add-hotel", upload.single('hotelImage'), (req, res) => {
    const { name, description, starRating, location, status } = req.body;
    const hotelImage = req.file ? req.file.buffer : null;

    if (!name || !description || !starRating || !location || !status || !hotelImage) {
        return res.status(400).send("All fields including image are required.");
    }

    const sql = "INSERT INTO Hotel (Name, Description, StarRating, Location, Status, HotelImage) VALUES (?, ?, ?, ?, ?, ?)";

    db.query(sql, [name, description, starRating, JSON.stringify(location), status, hotelImage], (err, result) => {
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



// 👇 Use this router in your main router file
router.put("/update-hotel/:id", upload.single('hotelImage'), (req, res) => {
    const hotelId = req.params.id;
    const { Name, Description, StarRating, Location } = req.body;
    const hotelImage = req.file ? req.file.buffer : null; // 🛠️ Handle image upload

    if (!Name || !Description || !StarRating || !Location) {
        return res.status(400).send("All hotel details are required");
    }

    let sql;
    let params;

    if (hotelImage) {
        // ✅ If image provided, update everything including the blob
        sql = `
            UPDATE Hotel 
            SET Name = ?, Description = ?, StarRating = ?, Location = ?, HotelImage = ?
            WHERE HotelID = ?
        `;
        params = [Name, Description, StarRating, JSON.stringify(JSON.parse(Location)), hotelImage, hotelId];
    } else {
        // ✅ If NO new image uploaded, just update other fields
        sql = `
            UPDATE Hotel 
            SET Name = ?, Description = ?, StarRating = ?, Location = ?
            WHERE HotelID = ?
        `;
        params = [Name, Description, StarRating, JSON.stringify(JSON.parse(Location)), hotelId];
    }

    db.query(sql, params, (err, result) => {
        if (err) {
            console.error("Error updating hotel:", err);
            return res.status(500).send("Error updating hotel");
        }
        res.status(200).send("Hotel updated successfully");
    });
});




module.exports = router;