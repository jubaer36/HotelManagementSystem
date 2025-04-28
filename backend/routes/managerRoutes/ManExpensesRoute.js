const express = require("express");
const router = express.Router();
const db = require("../../dbconn");

// Fetch total salary cost and earnings (only for the current year)
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
        AND YEAR(T.PaymentDate) = YEAR(CURDATE())  -- Only for current year
    `;

    db.query(query, [hotelID], (err, results) => {
        if (err) {
            console.error("Error fetching expenses:", err);
            return res.status(500).send("Error fetching expenses data.");
        }
        res.json(results[0]);
    });
});

// Fetch yearly transaction earnings for the last 5 years
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

// Get Monthly Transactions for the Current Year
router.post("/monthly-transactions", (req, res) => {
    // console.log("monthly working");
    const { hotelID } = req.body;
    const currentYear = new Date().getFullYear(); // Get current year dynamically

    const query = `
        SELECT 
            MONTH(PaymentDate) AS Month, 
            SUM(AmountPaid) AS TotalEarnings 
        FROM Transactions 
        WHERE YEAR(PaymentDate) = ? 
        GROUP BY MONTH(PaymentDate)
        ORDER BY MONTH(PaymentDate);
    `;

    db.query(query, [currentYear], (err, results) => {
        if (err) {
            console.error("Error fetching monthly transactions:", err);
            res.status(500).send("Error fetching monthly transactions.");
        } else {
            res.send(results);
        }
    });
});
// Fetch all maintenance ledger entries for a hotel
// Add a new maintenance ledger entry
router.post('/maintenance-ledger', (req, res) => {
    const { hotelId, serviceType, amount, ledgerDate } = req.body;

    if (!hotelId || !serviceType || !amount || !ledgerDate) {
        return res.status(400).send("All fields are required");
    }

    const query = `
        INSERT INTO BillMaintenanceLedger (HotelID, ServiceType, Amount, LedgerDate)
        VALUES (?, ?, ?, ?)
    `;

    db.query(query, [hotelId, serviceType, amount, ledgerDate], (err, result) => {
        if (err) {
            console.error("Error adding maintenance ledger:", err);
            return res.status(500).send("Error adding maintenance ledger");
        }
        res.status(201).json({ message: "Entry added successfully", LedgerID: result.insertId });
    });
});

// Fetch all maintenance ledger entries for a hotel
router.get('/maintenance-ledger', (req, res) => {
    const { hotelId } = req.query;

    if (!hotelId) {
        return res.status(400).send("Hotel ID is required");
    }

    const query = `SELECT * FROM BillMaintenanceLedger WHERE HotelID = ?`;

    db.query(query, [hotelId], (err, results) => {
        if (err) {
            console.error("Error fetching maintenance ledger:", err);
            return res.status(500).send("Error fetching maintenance ledger");
        }
        res.status(200).json(results);
    });
});

module.exports = router;




