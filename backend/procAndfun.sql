DROP PROCEDURE IF EXISTS inventory_summary;

DELIMITER //

CREATE PROCEDURE inventory_summary(
    IN hotelId INT,
    IN startDate DATE,
    IN endDate DATE
)
BEGIN
    SELECT
        DATE_FORMAT(TransactionDate, '%Y-%m') AS InventoryMonth,
        SUM(Quantity * UnitPrice) AS TotalInventoryCost
    FROM InventoryTransactions
    WHERE HotelID = hotelId
      AND TransactionDate BETWEEN startDate AND endDate
    GROUP BY InventoryMonth WITH ROLLUP;
END //

DELIMITER ;


DROP PROCEDURE IF EXISTS transaction_revenue_summary;

DELIMITER //

CREATE PROCEDURE transaction_revenue_summary(
    IN hotelId INT,
    IN startDate DATE,
    IN endDate DATE
)
BEGIN
    SELECT
        DATE_FORMAT(t.PaymentDate, '%Y-%m') AS RevenueMonth,
        SUM(t.AmountPaid) AS TotalRevenue
    FROM Transactions t
    JOIN Booking b ON t.BookingID = b.BookingID
    WHERE b.HotelID = hotelId
      AND t.PaymentDate BETWEEN startDate AND endDate
    GROUP BY RevenueMonth WITH ROLLUP;
END //

DELIMITER ;

DROP PROCEDURE IF EXISTS department_salary_summary;

DELIMITER //

CREATE PROCEDURE department_salary_summary(
    IN hotelId INT
)
BEGIN
    SELECT
        d.DeptName,
        SUM(e.Salary) AS TotalDeptSalary
    FROM Employee e
    JOIN Department d ON e.DeptID = d.DeptID
    WHERE d.HotelID = hotelId
    GROUP BY d.DeptName WITH ROLLUP;
END //

DELIMITER ;

DROP PROCEDURE IF EXISTS maintenance_summary;

DELIMITER //

CREATE PROCEDURE maintenance_summary(
    IN hotelId INT,
    IN startDate DATE,
    IN endDate DATE
)
BEGIN
    SELECT
        DATE_FORMAT(LedgerDate, '%Y-%m') AS MaintenanceMonth,
        SUM(Amount) AS TotalMaintenanceCost
    FROM BillMaintenanceLedger
    WHERE HotelID = hotelId
      AND LedgerDate BETWEEN startDate AND endDate
    GROUP BY MaintenanceMonth WITH ROLLUP;
END //

DELIMITER ;


DROP FUNCTION IF EXISTS inventory_total;
DELIMITER //
CREATE FUNCTION inventory_total(hotelId INT, startDate DATE, endDate DATE)
RETURNS DECIMAL(12, 2)
READS SQL DATA
BEGIN
    DECLARE total DECIMAL(12,2);
    SELECT SUM(Quantity * UnitPrice) INTO total
    FROM InventoryTransactions
    WHERE HotelID = hotelId AND TransactionDate BETWEEN startDate AND endDate;
    RETURN IFNULL(total, 0);
END //
DELIMITER ;

DROP FUNCTION IF EXISTS maintenance_total;
DELIMITER //
CREATE FUNCTION maintenance_total(hotelId INT, startDate DATE, endDate DATE)
RETURNS DECIMAL(12, 2)
READS SQL DATA
BEGIN
    DECLARE total DECIMAL(12,2);
    SELECT SUM(Amount) INTO total
    FROM BillMaintenanceLedger
    WHERE HotelID = hotelId AND LedgerDate BETWEEN startDate AND endDate;
    RETURN IFNULL(total, 0);
END //
DELIMITER ;


DROP FUNCTION IF EXISTS salary_total;
DELIMITER //
CREATE FUNCTION salary_total(hotelId INT)
RETURNS DECIMAL(12, 2)
READS SQL DATA
BEGIN
    DECLARE total DECIMAL(12,2);
    SELECT SUM(e.Salary) INTO total
    FROM Employee e
    JOIN Department d ON e.DeptID = d.DeptID
    WHERE d.HotelID = hotelId;
    RETURN IFNULL(total, 0);
END //
DELIMITER ;


DROP FUNCTION IF EXISTS revenue_total;
DELIMITER //
CREATE FUNCTION revenue_total(hotelId INT, startDate DATE, endDate DATE)
RETURNS DECIMAL(12, 2)
READS SQL DATA
BEGIN
    DECLARE total DECIMAL(12,2);
    SELECT SUM(t.AmountPaid) INTO total
    FROM Transactions t
    JOIN Booking b ON b.BookingID = t.BookingID
    WHERE b.HotelID = hotelId AND t.PaymentDate BETWEEN startDate AND endDate;
    RETURN IFNULL(total, 0);
END //
DELIMITER ;
