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
router.get('/financial-report/:hotelId', async (req, res) => {
    const { hotelId } = req.params;

    try {
        const [revenueResult] = await db.promise().query(
            'CALL GenerateFullFinancialReport(?)',
            [hotelId]
        );

        // revenueResult = [revenues, expenseSummary, netSummary]
        const data = {
            revenue: revenueResult[0],        // First SELECT result: revenue summary
            expenses: revenueResult[1],       // Second SELECT result: expenses with ROLLUP
            summary: revenueResult[2][0]      // Third SELECT result: net profit/loss
        };

        res.status(200).json(data);
    } catch (err) {
        console.error('SQL Error:', err);
        res.status(500).json({
            error: 'Failed to generate financial report',
            details: err.message
        });
    }
});




module.exports = router;