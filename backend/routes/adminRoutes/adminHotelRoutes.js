const express = require("express");
const router = express.Router();
const db = require("../../dbconn");

router.get("/get-hotels", (req, res) => {
    const query = "SELECT * FROM Hotel";

    db.query(query, (err, results) => {
        if (err) {
            console.error("Error fetching hotels:", err);
            return res.status(500).send("Error fetching hotels.");
        }
        console.log("Fetched hotels:", results);

        res.json(results);
    });
});


module.exports = router;