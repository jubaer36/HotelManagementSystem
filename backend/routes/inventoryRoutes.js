const express = require("express");
const router = express.Router();
const db = require("../dbconn");

// HotelID is fixed as 1 for simplicity
const HOTEL_ID = 1;

/* --------------------------------------------
   Fetch Inventory List
-------------------------------------------- */
router.get("/inventory", (req, res) => {
  const query = `SELECT InventoryID, ItemName, Quantity, UnitPrice, LastUpdated
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

/* --------------------------------------------
   Add a New Item (Quantity Default is 0)
-------------------------------------------- */
router.post("/add-item", (req, res) => {
  const { itemName, unitPrice } = req.body;

  if (!itemName || unitPrice === undefined) {
    return res.status(400).send("Item name and unit price are required");
  }

  const query = `INSERT INTO Inventory (HotelID, ItemName, Quantity, UnitPrice)
                 VALUES (?, ?, 0, ?)`;

  db.query(query, [HOTEL_ID, itemName, unitPrice], (err, result) => {
    if (err) {
      console.error("Error adding item:", err);
      return res.status(500).send("Error adding item");
    }
    res.status(201).json({ message: "Item added successfully", InventoryID: result.insertId });
  });
});

/* --------------------------------------------
   Order Item (Reduce Quantity and Log Transaction)
-------------------------------------------- */
router.post("/order-item", (req, res) => {
  const { inventoryID, quantity } = req.body;

  if (!inventoryID || !quantity || quantity <= 0) {
    return res.status(400).send("Inventory ID and valid quantity are required");
  }

  const query = `
    UPDATE Inventory 
    SET Quantity = Quantity - ? 
    WHERE InventoryID = ?
  `;

  db.query(query, [quantity, inventoryID], (err, result) => {
    if (err) {
      console.error("Error placing order:", err);
      return res.status(500).send("Error placing order");
    }

    if (result.affectedRows === 0) {
      return res.status(404).send("Inventory item not found");
    }

    // Log transaction
    const insertTransactionQuery = `
      INSERT INTO InventoryTransactions (InventoryID, HotelID, TransactionType, Quantity, Status)
      VALUES (?, 1, 'Order', ?, 'Pending')
    `;

    db.query(insertTransactionQuery, [inventoryID, quantity], (transactionErr) => {
      if (transactionErr) {
        console.error("Error inserting transaction:", transactionErr);
        return res.status(500).send("Error inserting transaction");
      }
      res.status(200).json({ message: "Order placed successfully" });
    });
  });
});


/* --------------------------------------------
   Fetch Inventory Transactions
-------------------------------------------- */
router.get("/transactions", (req, res) => {
  const query = `
    SELECT TransactionID, InventoryID, TransactionType, Quantity, Status, TransactionDate, ReceiveDate
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

// Mark Order as Received
router.post("/receive-order", (req, res) => {
  const { transactionID } = req.body;

  if (!transactionID) {
    return res.status(400).send("Transaction ID is required");
  }

  const query = `UPDATE InventoryTransactions 
                 SET Status = 'Completed', TransactionType = 'Received'
                 WHERE TransactionID = ? AND Status = 'Pending'`;

  db.query(query, [transactionID], (err, result) => {
    if (err) {
      console.error("Error updating transaction:", err);
      return res.status(500).send("Error updating transaction");
    }

    if (result.affectedRows === 0) {
      return res.status(404).send("Transaction not found or already completed");
    }

    res.status(200).json({ message: "Order marked as received successfully" });
  });
});


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
