const express = require("express");
const router = express.Router();
const db = require("../../dbconn");

// Get all hotels
router.get('/get-hotels', async (req, res) => {
    try {
        const [results] = await db.promise().query('SELECT * FROM Hotel');
        res.status(200).json(results);
    } catch (err) {
        console.error('Get Hotels Error:', err);
        res.status(500).json({ error: 'Failed to fetch hotels' });
    }
});

// Get Inventory Cost by Month
router.get('/inventory-summary/:hotelId', async (req, res) => {
    const { hotelId } = req.params;
    const { start, end } = req.query;
    try {
        const [results] = await db.promise().query(
            `SELECT 
                DATE_FORMAT(TransactionDate, '%Y-%m') AS InventoryMonth,
                SUM(Quantity * UnitPrice) AS TotalInventoryCost
             FROM InventoryTransactions
             WHERE HotelID = ? AND TransactionDate BETWEEN ? AND ?
             GROUP BY InventoryMonth
             ORDER BY InventoryMonth`,
            [hotelId, start, end]
        );
        res.json(results);
    } catch (err) {
        console.error('Inventory Summary Error:', err);
        res.status(500).json({ error: 'Failed to fetch inventory summary' });
    }
});

// Get Maintenance Cost by Month
router.get('/maintenance-summary/:hotelId', async (req, res) => {
    const { hotelId } = req.params;
    const { start, end } = req.query;
    try {
        const [results] = await db.promise().query(
            `SELECT 
                DATE_FORMAT(LedgerDate, '%Y-%m') AS MaintenanceMonth,
                SUM(Amount) AS TotalMaintenanceCost
             FROM BillMaintenanceLedger
             WHERE HotelID = ? AND LedgerDate BETWEEN ? AND ?
             GROUP BY MaintenanceMonth
             ORDER BY MaintenanceMonth`,
            [hotelId, start, end]
        );
        res.json(results);
    } catch (err) {
        console.error('Maintenance Summary Error:', err);
        res.status(500).json({ error: 'Failed to fetch maintenance summary' });
    }
});

// Get Salary by Department
router.get('/salary-summary/:hotelId', async (req, res) => {
    const { hotelId } = req.params;
    try {
        const [results] = await db.promise().query(
            `SELECT 
                DeptName,
                SUM(Salary) AS TotalDeptSalary
             FROM Employee e
             JOIN Department d ON e.DeptID = d.DeptID
             WHERE d.HotelID = ?
             GROUP BY DeptName
             ORDER BY DeptName`,
            [hotelId]
        );
        res.json(results);
    } catch (err) {
        console.error('Salary Summary Error:', err);
        res.status(500).json({ error: 'Failed to fetch salary summary' });
    }
});

// Get Monthly Revenue from Transactions
router.get('/transaction-summary-admin/:hotelId', async (req, res) => {
    const { hotelId } = req.params;
    const { start, end } = req.query;
    try {
        const [results] = await db.promise().query(
            `SELECT 
                DATE_FORMAT(t.PaymentDate, '%Y-%m') AS RevenueMonth,
                SUM(t.AmountPaid) AS TotalRevenue
             FROM Transactions t
             JOIN Booking b ON b.BookingID = t.BookingID
             WHERE b.HotelID = ? AND t.PaymentDate BETWEEN ? AND ?
             GROUP BY RevenueMonth
             ORDER BY RevenueMonth`,
            [hotelId, start, end]
        );
        res.json(results);
    } catch (err) {
        console.error('Transaction Revenue Error:', err);
        res.status(500).json({ error: 'Failed to fetch transaction revenue' });
    }
});

// Financial Summary for Totals
// In your backend route (/salary-summary/:hotelId)
router.get('/financial-summary/:hotelId', async (req, res) => {
    const { hotelId } = req.params;
    const { start, end } = req.query;

    try {
        // Calculate number of months in the range
        const startDate = new Date(start);
        const endDate = new Date(end);
        const months = (endDate.getFullYear() - startDate.getFullYear()) * 12 +
            (endDate.getMonth() - startDate.getMonth()) + 1;

        const [[{ inventory }]] = await db.promise().query(
            `SELECT IFNULL(SUM(Quantity * UnitPrice), 0) AS inventory
             FROM InventoryTransactions
             WHERE HotelID = ? AND TransactionDate BETWEEN ? AND ?`,
            [hotelId, start, end]
        );

        const [[{ maintenance }]] = await db.promise().query(
            `SELECT IFNULL(SUM(Amount), 0) AS maintenance
             FROM BillMaintenanceLedger
             WHERE HotelID = ? AND LedgerDate BETWEEN ? AND ?`,
            [hotelId, start, end]
        );

        // Multiply monthly salaries by number of months
        const [[{ monthlySalaries }]] = await db.promise().query(
            `SELECT IFNULL(SUM(Salary), 0) AS monthlySalaries
             FROM Employee e
             JOIN Department d ON e.DeptID = d.DeptID
             WHERE d.HotelID = ?`,
            [hotelId]
        );
        const salaries = monthlySalaries * months;

        const [[{ revenue }]] = await db.promise().query(
            `SELECT IFNULL(SUM(t.AmountPaid), 0) AS revenue
             FROM Transactions t
             JOIN Booking b ON b.BookingID = t.BookingID
             WHERE b.HotelID = ? AND t.PaymentDate BETWEEN ? AND ?`,
            [hotelId, start, end]
        );

        res.json({ inventory, maintenance, salaries, revenue });
    } catch (err) {
        console.error('Summary function error:', err);
        res.status(500).json({ error: 'Failed to load financial summary' });
    }
});

module.exports = router;
