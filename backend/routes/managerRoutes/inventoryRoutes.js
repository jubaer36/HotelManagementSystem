const express = require("express");
const router = express.Router();
const db = require("../../dbconn");

const HOTEL_ID = 1;

// Fetch Inventory List (Unchanged)
router.get("/inventory", (req, res) => {
  const query = `SELECT InventoryID, ItemName, Quantity, LastUpdated
                 FROM Inventory
                 WHERE HotelID = ?`;

  db.query(query, [HOTEL_ID], (err, results) => {
    if (err) {
      console.error("Error fetching inventory:", err);
      return res.status(500).send("Error fetching inventory");
    }
    res.status(200).json(results);
  });
});

// Add New Item (Unchanged)
router.post("/add-item", (req, res) => {
  const {itemName} = req.body;

  if (!itemName) {
    return res.status(400).send("Item name and unit price are required");
  }

  const query = `INSERT INTO Inventory (HotelID, ItemName, Quantity)
                 VALUES (?, ?, 0)`;

  db.query(query, [HOTEL_ID, itemName], (err, result) => {
    if (err) {
      console.error("Error adding item:", err);
      return res.status(500).send("Error adding item");
    }
    res.status(201).json({ message: "Item added successfully", InventoryID: result.insertId });
  });
});

// Order Item - Now only logs transaction
router.post("/order-item", (req, res) => {
  const { inventoryID, quantity, unitPrice } = req.body; // Ensure variable matches request

  if (!inventoryID || !quantity || quantity <= 0 || !unitPrice) {
    return res.status(400).send("Inventory ID, valid quantity, and unit price are required");
  }

  const insertTransactionQuery = `
  INSERT INTO InventoryTransactions (InventoryID, HotelID, TransactionType, Quantity, Status, UnitPrice)
  VALUES (?, ?, 'Order', ?, 'Pending', ?)
`;

  db.query(insertTransactionQuery, [inventoryID, HOTEL_ID, quantity, unitPrice], (err, result) => {
    if (err) {
      console.error("Error placing order:", err);
      return res.status(500).send("Error placing order");
    }
    res.status(200).json({ message: "Order placed successfully" });
  });

});

// Fetch Transactions (Unchanged)
// Fetch Transactions - Include UnitPrice
router.get("/transactions", (req, res) => {
  const query = `
    SELECT TransactionID, InventoryID, TransactionType, Quantity, 
           UnitPrice, Status, TransactionDate, ReceiveDate
    FROM InventoryTransactions
  `;
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching transactions:", err);
      return res.status(500).send("Error fetching transactions");
    }
    res.status(200).json(results);
  });
});

// Receive Order - Now updates inventory
// Receive Order - PROPERLY Update Inventory
router.post("/receive-order", (req, res) => {
  const { transactionID } = req.body;

  if (!transactionID) {
    return res.status(400).send("Transaction ID is required");
  }

  // Start database transaction
  db.beginTransaction(err => {
    if (err) {
      console.error("Transaction error:", err);
      return res.status(500).send("Error starting transaction");
    }

    // 1. Get transaction details
    db.query(
        `SELECT InventoryID, Quantity 
       FROM InventoryTransactions 
       WHERE TransactionID = ? 
       AND Status = 'Pending' 
       FOR UPDATE`,
        [transactionID],
        (err, results) => {
          if (err) return rollback(res, err);

          if (results.length === 0) {
            return rollback(res, "Transaction not found or already completed");
          }

          const { InventoryID, Quantity } = results[0];

          // 2. Update inventory
          db.query(
              `UPDATE Inventory 
           SET Quantity = Quantity + ? 
           WHERE InventoryID = ?`,
              [Quantity, InventoryID],
              (err, updateResult) => {
                if (err) return rollback(res, err);

                if (updateResult.affectedRows === 0) {
                  return rollback(res, "Inventory item not found");
                }

                // 3. Update transaction status
                db.query(
                    `UPDATE InventoryTransactions 
               SET Status = 'Completed', 
                   ReceiveDate = NOW() 
               WHERE TransactionID = ?`,
                    [transactionID],
                    (err) => {
                      if (err) return rollback(res, err);

                      // Commit transaction
                      db.commit(err => {
                        if (err) return rollback(res, err);
                        res.status(200).json({ message: "Order received and inventory updated" });
                      });
                    }
                );
              }
          );
        }
    );
  });
});

// Helper function for transaction rollback
function rollback(res, error) {
  db.rollback(() => {
    console.error("Transaction rolled back:", error);
    res.status(500).send(typeof error === "string" ? error : "Database error");
  });
}

// Update Transaction (Unchanged, but ensure it doesn't affect inventory unless intended)
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

module.exports = router;
