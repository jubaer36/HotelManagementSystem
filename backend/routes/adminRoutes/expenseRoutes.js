// routes/financial.js
const express = require("express");
const router = express.Router();
const db = require("../../dbconn");

router.get('/get-hotels', async (req, res) => {
    try {
        const [results] = await db.query('SELECT * FROM Hotel');
        res.status(200).json(results);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch hotels' });
    }
});

// Get financial report
// router.get('/financial-report/:hotelId', async (req, res) => {
//     const { hotelId } = req.params;
//
//     try {
//         const [revenueResult] = await db.promise().query(
//             'CALL GenerateFullFinancialReport(?)',
//             [hotelId]
//         );
//
//         // revenueResult = [revenues, expenseSummary, netSummary]
//         const data = {
//             revenue: revenueResult[0],        // First SELECT result: revenue summary
//             expenses: revenueResult[1],       // Second SELECT result: expenses with ROLLUP
//             summary: revenueResult[2][0]      // Third SELECT result: net profit/loss
//         };
//
//         res.status(200).json(data);
//     } catch (err) {
//         console.error('SQL Error:', err);
//         res.status(500).json({
//             error: 'Failed to generate financial report',
//             details: err.message
//         });
//         }
// });



router.get('/inventory-summary/:hotelId', async (req, res) => {
    const { hotelId } = req.params;
    const { start, end } = req.query;

    try {
        const [results] = await db.promise().query(
            'CALL inventory_summary(?, ?, ?)',
            [hotelId, start, end]
        );

        // Separate monthly data and grand total
        const chartData = results[0].map(row => ({
            InventoryMonth: row.InventoryMonth || 'TOTAL',
            TotalInventoryCost: row.TotalInventoryCost
        }));

        res.json(chartData);
    } catch (err) {
        console.error('Inventory Summary Error:', err);
        res.status(500).json({ error: 'Failed to fetch inventory summary' });
    }
});
router.get('/maintenance-summary/:hotelId', async (req, res) => {
    const { hotelId } = req.params;
    const { start, end } = req.query;

    try {
        const [results] = await db.promise().query(
            'CALL maintenance_summary(?, ?, ?)',
            [hotelId, start, end]
        );

        const chartData = results[0].map(row => ({
            MaintenanceMonth: row.MaintenanceMonth || 'TOTAL',
            TotalMaintenanceCost: row.TotalMaintenanceCost
        }));

        res.json(chartData);
    } catch (err) {
        console.error('Maintenance Summary Error:', err);
        res.status(500).json({ error: 'Failed to fetch maintenance summary' });
    }
});
router.get('/salary-summary/:hotelId', async (req, res) => {
    const { hotelId } = req.params;

    try {
        const [results] = await db.promise().query(
            'CALL department_salary_summary(?)',
            [hotelId]
        );

        const formatted = results[0].map(row => ({
            DeptName: row.DeptName || 'TOTAL',
            TotalDeptSalary: row.TotalDeptSalary
        }));

        res.status(200).json(formatted);
    } catch (err) {
        console.error('Salary Summary Error:', err);
        res.status(500).json({ error: 'Failed to fetch salary summary' });
    }
});
router.get('/transaction-summary/:hotelId', async (req, res) => {
    const { hotelId } = req.params;
    const { start, end } = req.query;

    try {
        const [results] = await db.promise().query(
            'CALL transaction_revenue_summary(?, ?, ?)',
            [hotelId, start, end]
        );

        const formatted = results[0].map(row => ({
            RevenueMonth: row.RevenueMonth || 'TOTAL',
            TotalRevenue: row.TotalRevenue
        }));

        res.status(200).json(formatted);
    } catch (err) {
        console.error('Transaction Summary Error:', err);
        res.status(500).json({ error: 'Failed to fetch transaction revenue' });
    }
});






module.exports = router;