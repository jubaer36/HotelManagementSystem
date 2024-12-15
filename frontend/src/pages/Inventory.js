import React, { useState, useEffect } from "react";
import Axios from "axios";

const Inventory = () => {
  const [inventory, setInventory] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [newItem, setNewItem] = useState({ name: "" });
  const [order, setOrder] = useState({ name: "", quantity: 0 });

  // Fetch inventory and transaction data
  useEffect(() => {
    fetchInventory();
    fetchTransactions();
  }, []);

  const fetchInventory = async () => {
    try {
      const response = await Axios.get("http://localhost:5000/api/inventory");
      setInventory(response.data);
    } catch (error) {
      console.error("Error fetching inventory:", error);
    }
  };

  const fetchTransactions = async () => {
    try {
      const response = await Axios.get(
        "http://localhost:5000/api/transactions"
      );
      setTransactions(response.data);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  // Add a new item (quantity is 0 by default)
  const addItem = async (e) => {
    e.preventDefault();
    try {
      await Axios.post("http://localhost:5000/api/inventory", {
        name: newItem.name,
        quantity: 0,
      });
      fetchInventory(); // Refresh inventory list
      setNewItem({ name: "" }); // Reset form
    } catch (error) {
      console.error("Error adding item:", error);
    }
  };

  // Order an item
  const orderItem = async (e) => {
    e.preventDefault();
    try {
      await Axios.post("http://localhost:5000/api/order", {
        name: order.name,
        quantity: order.quantity,
      });
      fetchInventory(); // Refresh inventory list
      fetchTransactions(); // Refresh transaction list
      setOrder({ name: "", quantity: 0 }); // Reset form
    } catch (error) {
      console.error("Error ordering item:", error);
    }
  };

  return (
    <div>
      <h1>Inventory Management System</h1>

      {/* Inventory List */}
      <section>
        <h2>Inventory List</h2>
        <table border="1">
          <thead>
            <tr>
              <th>Item Name</th>
              <th>Quantity</th>
            </tr>
          </thead>
          <tbody>
            {inventory.map((item, index) => (
              <tr key={index}>
                <td>{item.name}</td>
                <td>{item.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Add Item */}
      <section>
        <h2>Add New Item</h2>
        <form onSubmit={addItem}>
          <label>
            Item Name:
            <input
              type="text"
              value={newItem.name}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
              required
            />
          </label>
          <br />
          <button type="submit">Add Item</button>
        </form>
      </section>

      {/* Order Item */}
      <section>
        <h2>Order Items</h2>
        <form onSubmit={orderItem}>
          <label>
            Item Name:
            <input
              type="text"
              value={order.name}
              onChange={(e) => setOrder({ ...order, name: e.target.value })}
              required
            />
          </label>
          <br />
          <label>
            Quantity:
            <input
              type="number"
              value={order.quantity}
              onChange={(e) =>
                setOrder({ ...order, quantity: parseInt(e.target.value) })
              }
              required
            />
          </label>
          <br />
          <button type="submit">Order Item</button>
        </form>
      </section>

      {/* Transactions List */}
      <section>
        <h2>Inventory Transactions</h2>
        <table border="1">
          <thead>
            <tr>
              <th>Transaction ID</th>
              <th>Item Name</th>
              <th>Quantity</th>
              <th>Transaction Type</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction, index) => (
              <tr key={index}>
                <td>{transaction.transactionId}</td>
                <td>{transaction.itemName}</td>
                <td>{transaction.quantity}</td>
                <td>{transaction.transactionType}</td>
                <td>{transaction.status}</td>
                <td>{new Date(transaction.date).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default Inventory;
