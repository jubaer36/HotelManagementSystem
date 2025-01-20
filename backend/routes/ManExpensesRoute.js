const express = require("express");
const router = express.Router();
const db = require("../dbconn");

// Fetch total salary cost and total earnings
router.post("/hotel-expenses", (req, res) => {
    const { hotelID } = req.body;

    const query = `
        SELECT 
            COALESCE(SUM(E.Salary), 0) AS TotalSalary,
            COALESCE(SUM(T.AmountPaid), 0) AS TotalEarnings
        FROM Employee E
        JOIN Department D ON E.DeptID = D.DeptID
        LEFT JOIN Booking B ON D.HotelID = B.HotelID
        LEFT JOIN Transactions T ON B.BookingID = T.BookingID
        WHERE D.HotelID = ?
    `;

    db.query(query, [hotelID], (err, results) => {
        if (err) {
            console.error("Error fetching expenses:", err);
            return res.status(500).send("Error fetching expenses data.");
        }
        res.json(results[0]);
    });
});

// Fetch total transaction earnings for the last 5 years
router.post("/transaction-earnings", (req, res) => {
    const { hotelID } = req.body;

    const query = `
        SELECT YEAR(T.PaymentDate) AS Year, COALESCE(SUM(T.AmountPaid), 0) AS TotalAmount
        FROM Transactions T
        JOIN Booking B ON T.BookingID = B.BookingID
        WHERE B.HotelID = ?
        AND T.PaymentDate >= DATE_SUB(CURDATE(), INTERVAL 5 YEAR)
        GROUP BY YEAR(T.PaymentDate)
        ORDER BY Year ASC;
    `;

    db.query(query, [hotelID], (err, results) => {
        if (err) {
            console.error("Error fetching yearly transaction earnings:", err);
            return res.status(500).send("Error fetching yearly transaction earnings.");
        }
        res.json(results);
    });
});

module.exports = router;
