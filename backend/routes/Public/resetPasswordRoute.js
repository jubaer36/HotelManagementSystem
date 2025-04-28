const express = require("express");
const router = express.Router();
const db = require("../../dbconn.js");
const bcrypt = require("bcryptjs"); // bcrypt for hashing passwords

// Reset Password Route (fixed to match username-based frontend)
router.post("/reset-password", (req, res) => {
    const { username, oldPassword, newPassword } = req.body;

    if (!username || !oldPassword || !newPassword) {
        return res.status(400).json({ message: "Missing required fields." });
    }

    // Step 1: Fetch existing hashed password
    const fetchQuery = "SELECT Password FROM Users WHERE Username = ?";
    db.query(fetchQuery, [username], (err, results) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ message: "Server error." });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: "User not found." });
        }

        const hashedPassword = results[0].Password;

        // Step 2: Compare old password with stored hash
        bcrypt.compare(oldPassword, hashedPassword, (compareErr, isMatch) => {
            if (compareErr) {
                console.error("Bcrypt compare error:", compareErr);
                return res.status(500).json({ message: "Server error." });
            }

            if (!isMatch) {
                return res.status(401).json({ message: "Old password is incorrect." });
            }

            // Step 3: Hash the new password
            bcrypt.hash(newPassword, 10, (hashErr, newHashedPassword) => {
                if (hashErr) {
                    console.error("Bcrypt hash error:", hashErr);
                    return res.status(500).json({ message: "Server error." });
                }

                // Step 4: Update password in database
                const updateQuery = "UPDATE Users SET Password = ? WHERE Username = ?";
                db.query(updateQuery, [newHashedPassword, username], (updateErr, updateResult) => {
                    if (updateErr) {
                        console.error("Database update error:", updateErr);
                        return res.status(500).json({ message: "Server error." });
                    }

                    return res.status(200).json({ message: "Password reset successfully." });
                });
            });
        });
    });
});

module.exports = router;
