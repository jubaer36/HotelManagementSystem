DELIMITER $$

CREATE PROCEDURE GenerateFullFinancialReport(IN inputHotelId INT)
BEGIN
    -- 1. Revenue Summary
    SELECT
        h.HotelID,
        h.Name AS HotelName,
        SUM(t.AmountPaid) AS TotalRevenue
    FROM Transactions t
    JOIN Booking b ON t.BookingID = b.BookingID
    JOIN Hotel h ON b.HotelID = h.HotelID
    WHERE h.HotelID = inputHotelId
    GROUP BY h.HotelID;

    -- 2. Expenses by Category
    SELECT
        Category,
        SUM(Amount) AS TotalExpenses
    FROM (
        -- Salaries (simple SUM by hotel ID)
        SELECT
            'Salaries' AS Category,
            IFNULL(SUM(Salary), 0) AS Amount
        FROM Employee
        WHERE HotelID = inputHotelId AND LOWER(working_status) = 'active'

        UNION ALL

        -- Bills & Maintenance
        SELECT
            'Bills & Maintenance' AS Category,
            Amount
        FROM BillMaintenanceLedger
        WHERE HotelID = inputHotelId

        UNION ALL

        -- Inventory
        SELECT
            'Inventory Purchases' AS Category,
            Quantity * UnitPrice
        FROM InventoryTransactions
        WHERE HotelID = inputHotelId AND Status = 'Completed'
    ) AS CombinedExpenses
    GROUP BY Category WITH ROLLUP;

    -- 3. Net Summary
    SELECT
        r.TotalRevenue,
        e.TotalExpenses,
        (r.TotalRevenue - e.TotalExpenses) AS NetProfitLoss,
        CASE
            WHEN (r.TotalRevenue - e.TotalExpenses) >= 0 THEN 'Profit'
            ELSE 'Loss'
        END AS Status
    FROM (
        SELECT SUM(t.AmountPaid) AS TotalRevenue
        FROM Transactions t
        JOIN Booking b ON t.BookingID = b.BookingID
        WHERE b.HotelID = inputHotelId
    ) AS r,
    (
        SELECT SUM(Amount) AS TotalExpenses FROM (
            SELECT IFNULL(SUM(Salary), 0) AS Amount
            FROM Employee
            WHERE HotelID = inputHotelId AND LOWER(working_status) = 'active'

            UNION ALL

            SELECT Amount FROM BillMaintenanceLedger
            WHERE HotelID = inputHotelId

            UNION ALL

            SELECT Quantity * UnitPrice
            FROM InventoryTransactions
            WHERE HotelID = inputHotelId AND Status = 'Completed'
        ) AS AllExpenses
    ) AS e;
END $$
DELIMITER ;
