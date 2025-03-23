import React, { useState, useEffect } from "react";
import Axios from "axios";
import "./Inventory.css";

const Inventory = () => {
  const [inventory, setInventory] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [newItem, setNewItem] = useState({ name: "" }); // Only item name for adding new item
  const [order, setOrder] = useState({
    inventoryID: "",
    quantity: 0,
    unitPrice: 0, // Added unit price for placing orders
  });
  const [transactionID, setTransactionID] = useState("");

  // Fetch inventory and transactions on component mount
  useEffect(() => {
    fetchInventory();
    fetchTransactions();
  }, []);

  /* --------------------------------------------
     Fetch Inventory List
  -------------------------------------------- */
  const fetchInventory = async () => {
    try {
      const response = await Axios.get("http://localhost:3001/inventory");
      setInventory(response.data);
    } catch (error) {
      console.error("Error fetching inventory:", error);
      alert("Failed to fetch inventory. Please try again.");
    }
  };

  /* --------------------------------------------
     Fetch Transactions List
  -------------------------------------------- */
  const fetchTransactions = async () => {
    try {
      const response = await Axios.get("http://localhost:3001/transactions");
      setTransactions(response.data);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      alert("Failed to fetch transactions. Please try again.");
    }
  };

  /* --------------------------------------------
     Add a New Item
  -------------------------------------------- */
  const addItem = async (e) => {
    e.preventDefault();
    try {
      await Axios.post("http://localhost:3001/add-item", {
        itemName: newItem.name,
      });
      fetchInventory(); // Refresh inventory list
      setNewItem({ name: "" }); // Reset form
      alert("Item added successfully!");
    } catch (error) {
      console.error("Error adding item:", error);
      alert("Failed to add item. Please try again.");
    }
  };

  /* --------------------------------------------
     Place an Order
  -------------------------------------------- */
  const orderItem = async (e) => {
    e.preventDefault();
    try {
      await Axios.post("http://localhost:3001/order-item", {
        inventoryID: order.inventoryID,
        quantity: order.quantity,
        unitPrice: order.unitPrice, // Include unit price in the order
      });
      fetchTransactions(); // Refresh transactions list
      setOrder({ inventoryID: "", quantity: 0, unitPrice: 0 }); // Reset form
      alert("Order placed successfully!");
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Failed to place order. Please try again.");
    }
  };

  /* --------------------------------------------
     Mark Order as Received
  -------------------------------------------- */
  const markAsReceived = async (e) => {
    e.preventDefault();
    try {
      await Axios.post("http://localhost:3001/receive-order", {
        transactionID,
      });
      fetchTransactions(); // Refresh transactions list
      fetchInventory(); // Refresh inventory list
      setTransactionID(""); // Reset form
      alert("Order marked as received successfully!");
    } catch (error) {
      console.error("Error receiving order:", error);
      alert("Failed to mark order as received. Please try again.");
    }
  };

  return (
      <div className="container">
        <h1>Inventory Management System</h1>

        {/* Inventory List */}
        <section className="section">
          <h2>Inventory List</h2>
          <table className="table">
            <thead>
            <tr>
              <th>ID</th>
              <th>Item Name</th>
              <th>Quantity</th>
              <th>Last Updated</th>
            </tr>
            </thead>
            <tbody>
            {inventory.map((item) => (
                <tr key={item.InventoryID}>
                  <td>{item.InventoryID}</td>
                  <td>{item.ItemName}</td>
                  <td>{item.Quantity}</td>
                  <td>{new Date(item.LastUpdated).toLocaleString()}</td>
                </tr>
            ))}
            </tbody>
          </table>
        </section>

        {/* Add New Item */}
        <section className="section">
          <h2>Add New Item</h2>
          <form onSubmit={addItem} className="form">
            <div className="form-group">
              <label>
                Item Name:
                <input
                    type="text"
                    value={newItem.name}
                    onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                    required
                />
              </label>
            </div>
            <button type="submit" className="button">
              Add Item
            </button>
          </form>
        </section>

        {/* Place Order */}
        <section className="section">
          <h2>Place Order</h2>
          <form onSubmit={orderItem} className="form">
            <div className="form-group">
              <label>
                Inventory ID:
                <input
                    type="number"
                    value={order.inventoryID}
                    onChange={(e) =>
                        setOrder({ ...order, inventoryID: e.target.value })
                    }
                    required
                />
              </label>
            </div>
            <div className="form-group">
              <label>
                Quantity:
                <input
                    type="number"
                    value={order.quantity}
                    onChange={(e) =>
                        setOrder({ ...order, quantity: e.target.value })
                    }
                    required
                />
              </label>
            </div>
            <div className="form-group">
              <label>
                Unit Price:
                <input
                    type="number"
                    value={order.unitPrice}
                    onChange={(e) =>
                        setOrder({ ...order, unitPrice: parseFloat(e.target.value) })
                    }
                    step="0.01"
                    required
                />
              </label>
            </div>
            <button type="submit" className="button">
              Place Order
            </button>
          </form>
        </section>

        {/* Mark Order as Received */}
        <section className="section">
          <h2>Mark Order as Received</h2>
          <form onSubmit={markAsReceived} className="form">
            <div className="form-group">
              <label>
                Transaction ID:
                <input
                    type="number"
                    value={transactionID}
                    onChange={(e) => setTransactionID(e.target.value)}
                    required
                />
              </label>
            </div>
            <button type="submit" className="button">
              Mark as Received
            </button>
          </form>
        </section>

        {/* Transactions List */}
        <section className="section">
          <h2>Transactions</h2>
          <table className="table">
            <thead>
            <tr>
              <th>ID</th>
              <th>Inventory ID</th>
              <th>Type</th>
              <th>Qty</th>
              <th>Unit Price</th>
              <th>Status</th>
              <th>Order Date</th>
              <th>Receive Date</th>
            </tr>
            </thead>
            <tbody>
            {transactions.map((transaction) => (
                <tr key={transaction.TransactionID}>
                  <td>{transaction.TransactionID}</td>
                  <td>{transaction.InventoryID}</td>
                  <td>{transaction.TransactionType}</td>
                  <td>{transaction.Quantity}</td>
                  <td>${transaction.UnitPrice}</td>
                  <td>{transaction.Status}</td>
                  <td>{new Date(transaction.TransactionDate).toLocaleString()}</td>
                  <td>
                    {transaction.ReceiveDate
                        ? new Date(transaction.ReceiveDate).toLocaleString()
                        : "Pending"}
                  </td>
                </tr>
            ))}
            </tbody>
          </table>
        </section>
      </div>
  );
};

export default Inventory;