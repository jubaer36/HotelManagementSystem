import React, { useState, useEffect } from "react";
import Axios from "axios";
import "./Inventory.css"

const Inventory = () => {
  const [inventory, setInventory] = useState([]); // State for inventory list
  const [transactions, setTransactions] = useState([]); // State for transaction list
  const [newItem, setNewItem] = useState({ name: "", unitPrice: 0 }); // State for adding new item
  const [order, setOrder] = useState({ inventoryID: "", quantity: 0 }); // State for placing order
  const [transactionID, setTransactionID] = useState("");
  // Fetch inventory and transactions on load
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
        unitPrice: newItem.unitPrice,
      });
      fetchInventory();
      setNewItem({ name: "", unitPrice: 0 }); // Reset form
    } catch (error) {
      console.error("Error adding item:", error);
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
      });
      fetchInventory();
      fetchTransactions();
      setOrder({ inventoryID: "", quantity: 0 }); // Reset form
    } catch (error) {
      console.error("Error placing order:", error);
    }
  };

  const markAsReceived = async (e) => {
    e.preventDefault();
    try {
      await Axios.post("http://localhost:3001/update-transaction", {
        transactionID,
      });
      fetchTransactions(); // Refresh transactions list
      setTransactionID(""); // Reset input
    } catch (error) {
      console.error("Error marking transaction as received:", error);
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
              <th>Inventory ID</th>
              <th>Item Name</th>
              <th>Quantity</th>
              <th>Unit Price</th>
              <th>Last Updated</th>
            </tr>
            </thead>
            <tbody>
            {inventory.map((item) => (
                <tr key={item.InventoryID}>
                  <td>{item.InventoryID}</td>
                  <td>{item.ItemName}</td>
                  <td>{item.Quantity}</td>
                  <td>
                    {Number(item.UnitPrice)
                        ? `$${Number(item.UnitPrice).toFixed(2)}`
                        : "N/A"}
                  </td>
                  <td>{new Date(item.LastUpdated).toLocaleString()}</td>
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
                  onChange={(e) =>
                      setNewItem({ ...newItem, name: e.target.value })
                  }
                  required
              />
            </label>
            <br />
            <label>
              Unit Price:
              <input
                  type="number"
                  value={newItem.unitPrice}
                  onChange={(e) =>
                      setNewItem({
                        ...newItem,
                        unitPrice: parseFloat(e.target.value),
                      })
                  }
                  step="0.01"
                  required
              />
            </label>
            <br />
            <button type="submit">Add Item</button>
          </form>
        </section>

        {/* Order Item */}
        <section>
          <h2>Order Item</h2>
          <form onSubmit={orderItem}>
            <label>
              Inventory ID:
              <input
                  type="number"
                  value={order.inventoryID}
                  onChange={(e) =>
                      setOrder({
                        ...order,
                        inventoryID: parseInt(e.target.value),
                      })
                  }
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
                      setOrder({
                        ...order,
                        quantity: parseInt(e.target.value),
                      })
                  }
                  required
              />
            </label>
            <br />
            <button type="submit">Place Order</button>
          </form>
        </section>


        {/* Mark Transaction as Received */}
        <section>
          <h2>Mark Transaction as Received</h2>
          <form onSubmit={markAsReceived}>
            <label>
              Transaction ID:
              <input
                  type="number"
                  value={transactionID}
                  onChange={(e) => setTransactionID(e.target.value)}
                  required
              />
            </label>
            <br />
            <button type="submit">Update Status</button>
          </form>
        </section>

        {/* Transactions List */}
        <section>
          <h2>Inventory Transactions</h2>
          <table border="1">
            <thead>
            <tr>
              <th>Transaction ID</th>
              <th>Inventory ID</th>
              <th>Transaction Type</th>
              <th>Quantity</th>
              <th>Status</th>
              <th>Transaction Date</th>
            </tr>
            </thead>
            <tbody>
            {transactions.map((transaction) => (
                <tr key={transaction.TransactionID}>
                  <td>{transaction.TransactionID}</td>
                  <td>{transaction.InventoryID}</td>
                  <td>{transaction.TransactionType}</td>
                  <td>{transaction.Quantity}</td>
                  <td>{transaction.Status}</td>
                  <td>
                    {new Date(transaction.TransactionDate).toLocaleString()}
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
