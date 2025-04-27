const express = require("express");
const router = express.Router();
const db = require("../../dbconn");

/* ✅ Fetch Inventory List based on HotelID */
router.get("/inventory/:hotelID", (req, res) => {
    const hotelID = req.params.hotelID;

    if (!hotelID) {
        return res.status(400).send("Hotel ID is required");
    }

    const query = `
    SELECT InventoryID, ItemName, Quantity, LastUpdated
    FROM Inventory
    WHERE HotelID = ?
  `;

    db.query(query, [hotelID], (err, results) => {
        if (err) {
            console.error("Error fetching inventory:", err);
            return res.status(500).send("Error fetching inventory");
        }
        res.status(200).json(results);
    });
});

/* ✅ Add New Item */
router.post("/add-item", (req, res) => {
    const { hotelID, itemName } = req.body;

    if (!hotelID || !itemName) {
        return res.status(400).send("Hotel ID and Item Name are required");
    }

    const query = `
    INSERT INTO Inventory (HotelID, ItemName, Quantity)
    VALUES (?, ?, 0)
  `;

    db.query(query, [hotelID, itemName], (err, result) => {
        if (err) {
            console.error("Error adding item:", err);
            return res.status(500).send("Error adding item");
        }
        res.status(201).json({ message: "Item added successfully", InventoryID: result.insertId });
    });
});

/* ✅ Place an Order */
router.post("/order-item", (req, res) => {
    const { hotelID, inventoryID, quantity, unitPrice } = req.body;

    if (!hotelID || !inventoryID || !quantity || quantity <= 0 || unitPrice == null) {
        return res.status(400).send("Hotel ID, Inventory ID, valid quantity, and unit price are required");
    }

    const insertTransactionQuery = `
    INSERT INTO InventoryTransactions (InventoryID, HotelID, TransactionType, Quantity, Status, UnitPrice)
    VALUES (?, ?, 'Order', ?, 'Pending', ?)
  `;

    db.query(insertTransactionQuery, [inventoryID, hotelID, quantity, unitPrice], (err, result) => {
        if (err) {
            console.error("Error placing order:", err);
            return res.status(500).send("Error placing order");
        }
        res.status(200).json({ message: "Order placed successfully" });
    });
});

/* ✅ Fetch Transactions for Specific Hotel */
router.get("/transactions/:hotelID", (req, res) => {
    const hotelID = req.params.hotelID;

    if (!hotelID) {
        return res.status(400).send("Hotel ID is required");
    }

    const query = `
    SELECT TransactionID, InventoryID, HotelID, TransactionType, Quantity, UnitPrice, Status, TransactionDate, ReceiveDate
    FROM InventoryTransactions
    WHERE HotelID = ?
  `;

    db.query(query, [hotelID], (err, results) => {
        if (err) {
            console.error("Error fetching transactions:", err);
            return res.status(500).send("Error fetching transactions");
        }
        res.status(200).json(results);
    });
});

/* ✅ Receive an Order */
router.post("/receive-order", (req, res) => {
    const { transactionID } = req.body;

    if (!transactionID) {
        return res.status(400).send("Transaction ID is required");
    }

    db.beginTransaction(err => {
        if (err) {
            console.error("Transaction start error:", err);
            return res.status(500).send("Error starting transaction");
        }

        db.query(`
      SELECT InventoryID, Quantity
      FROM InventoryTransactions
      WHERE TransactionID = ? AND Status = 'Pending'
      FOR UPDATE
    `, [transactionID], (err, results) => {
            if (err) return rollback(res, err);

            if (results.length === 0) {
                return rollback(res, "Transaction not found or already completed");
            }

            const { InventoryID, Quantity } = results[0];

            db.query(`
        UPDATE Inventory
        SET Quantity = Quantity + ?
        WHERE InventoryID = ?
      `, [Quantity, InventoryID], (err, updateResult) => {
                if (err) return rollback(res, err);

                if (updateResult.affectedRows === 0) {
                    return rollback(res, "Inventory item not found");
                }

                db.query(`
          UPDATE InventoryTransactions
          SET Status = 'Completed', ReceiveDate = NOW()
          WHERE TransactionID = ?
        `, [transactionID], (err) => {
                    if (err) return rollback(res, err);

                    db.commit(err => {
                        if (err) return rollback(res, err);
                        res.status(200).json({ message: "Order received and inventory updated" });
                    });
                });
            });
        });
    });
});

/* Helper for rollback */
function rollback(res, error) {
    db.rollback(() => {
        console.error("Transaction rollback:", error);
        res.status(500).send(typeof error === "string" ? error : "Database error");
    });
}

/* ✅ Update Transaction Manually */
router.post("/update-transaction", (req, res) => {
    const { transactionID } = req.body;

    if (!transactionID) {
        return res.status(400).send("Transaction ID is required");
    }

    const query = `
    UPDATE InventoryTransactions
    SET Status = 'Completed'
    WHERE TransactionID = ? AND Status = 'Pending'
  `;

    db.query(query, [transactionID], (err, result) => {
        if (err) {
            console.error("Error updating transaction:", err);
            return res.status(500).send("Error updating transaction");
        }

        if (result.affectedRows === 0) {
            return res.status(404).send("Transaction not found or already completed");
        }

        res.status(200).json({ message: "Transaction updated successfully" });
    });
});

// ✅ Fetch Transaction Summary using ROLLUP
// 🛠️ Fetch Monthly Transaction Summary (ROLLUP)
router.get("/transaction-summary/:hotelID", (req, res) => {
    const hotelID = req.params.hotelID;

    if (!hotelID) {
        return res.status(400).send("Hotel ID is required");
    }

    const currentMonthStart = new Date();
    currentMonthStart.setDate(1); // Set to 1st day
    const startDate = currentMonthStart.toISOString().split('T')[0]; // yyyy-mm-01

    const nextMonth = new Date(currentMonthStart);
    nextMonth.setMonth(currentMonthStart.getMonth() + 1);
    const endDate = nextMonth.toISOString().split('T')[0]; // yyyy-nextmonth-01

    const query = `
        SELECT 
            Status,
            SUM(Quantity * UnitPrice) AS TotalValue
        FROM InventoryTransactions
        WHERE HotelID = ?
          AND TransactionDate >= ?
          AND TransactionDate < ?
        GROUP BY Status WITH ROLLUP
    `;

    db.query(query, [hotelID, startDate, endDate], (err, results) => {
        if (err) {
            console.error("Error fetching transaction summary:", err);
            return res.status(500).send("Error fetching transaction summary");
        }
        res.status(200).json(results);
    });
});



module.exports = router;
