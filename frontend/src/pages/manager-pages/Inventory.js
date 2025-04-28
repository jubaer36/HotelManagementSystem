import React, { useState, useEffect } from "react";
import Axios from "axios";
import Navbar from "../../components/Navbar";
import "./Inventory.css";

const Inventory = () => {
  const hotelID = localStorage.getItem("hotelID"); // ✅ Always use hotelID from localStorage

  const [inventory, setInventory] = useState([]);
  const [order, setOrder] = useState({
    itemName: "",
    quantity: "1",
    unitPrice: "0",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!hotelID) {
      alert("Hotel ID missing. Please login again.");
      return;
    }
    fetchInventory();
  }, [hotelID]);

  const fetchInventory = async () => {
    try {
      setIsLoading(true);
      const response = await Axios.get(`http://localhost:3001/inventory/${hotelID}`);
      setInventory(response.data);
      setError(null);
    } catch (error) {
      console.error("Error fetching inventory:", error);
      setError("Failed to fetch inventory. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "quantity" || name === "unitPrice") {
      if (value === "" || /^[0-9]*\.?[0-9]*$/.test(value)) {
        setOrder(prev => ({ ...prev, [name]: value }));
      }
    } else {
      setOrder(prev => ({ ...prev, [name]: value }));
    }
  };

  const orderItem = async (e) => {
    e.preventDefault();

    try {
      const quantity = parseFloat(order.quantity) || 1;
      const unitPrice = parseFloat(order.unitPrice) || 0;

      if (quantity <= 0) {
        alert("Quantity must be greater than 0");
        return;
      }
      if (unitPrice < 0) {
        alert("Unit price cannot be negative");
        return;
      }

      let inventoryID;

      // 🔎 Find if the item already exists
      const existingItem = inventory.find(
          item => item.ItemName.toLowerCase() === order.itemName.toLowerCase()
      );

      if (existingItem) {
        inventoryID = existingItem.InventoryID;
      } else {
        // Add new item if it doesn't exist
        const addResponse = await Axios.post("http://localhost:3001/add-item", {
          hotelID,
          itemName: order.itemName,
        });
        inventoryID = addResponse.data.InventoryID;
        await fetchInventory();
      }

      // 🔥 Place the order
      await Axios.post("http://localhost:3001/order-item", {
        hotelID,
        inventoryID,
        quantity,
        unitPrice,
      });

      setOrder({ itemName: "", quantity: "1", unitPrice: "0" });
      await fetchInventory();
      alert("Order placed successfully!");
    } catch (error) {
      console.error("Error processing order:", error);
      alert("Failed to process order. Please try again.");
    }
  };

  const filteredInventory = inventory.filter(item =>
      item.ItemName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString) => {
    const options = {
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
      <div className="inventory-app">
        <Navbar />
        <div className="inventory-container">
          <header className="inventory-header">
            <h1>Inventory Management</h1>
            <div className="header-actions">
              <button
                  onClick={fetchInventory}
                  className="refresh-btn"
                  disabled={isLoading}
              >
                {isLoading ? "Refreshing..." : "Refresh Inventory"}
              </button>
              <div className="search-box">
                <input
                    type="text"
                    placeholder="Search items..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <i className="search-icon">🔍</i>
              </div>
            </div>
          </header>

          <div className="inventory-content">
            <section className="inventory-list-section">
              <div className="section-header">
                <h2>Current Inventory</h2>
                <span className="item-count">{filteredInventory.length} items</span>
              </div>

              {isLoading ? (
                  <div className="loading-spinner">Loading inventory...</div>
              ) : error ? (
                  <div className="error-message">{error}</div>
              ) : (
                  <div className="table-container">
                    <table className="inventory-table">
                      <thead>
                      <tr>
                        <th>ID</th>
                        <th>Item Name</th>
                        <th>Quantity</th>
                        <th>Last Updated</th>
                      </tr>
                      </thead>
                      <tbody>
                      {filteredInventory.length > 0 ? (
                          filteredInventory.map(item => (
                              <tr key={item.InventoryID}>
                                <td className="id-cell">{item.InventoryID}</td>
                                <td className="name-cell">{item.ItemName}</td>
                                <td className={`quantity-cell ${item.Quantity < 10 ? 'low-stock' : ''}`}>
                                  {item.Quantity}
                                </td>
                                <td className="date-cell">{formatDate(item.LastUpdated)}</td>
                              </tr>
                          ))
                      ) : (
                          <tr>
                            <td colSpan="4" className="no-items">
                              {searchTerm ? "No matching items found" : "No items in inventory"}
                            </td>
                          </tr>
                      )}
                      </tbody>
                    </table>
                  </div>
              )}
            </section>

            <section className="order-section">
              <div className="section-header">
                <h2>Place New Order</h2>
              </div>
              <form onSubmit={orderItem} className="order-form">
                <div className="form-group">
                  <label htmlFor="itemName">Item Name</label>
                  <input
                      id="itemName"
                      type="text"
                      name="itemName"
                      placeholder="Enter item name"
                      value={order.itemName}
                      onChange={handleInputChange}
                      required
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="quantity">Quantity</label>
                    <input
                        id="quantity"
                        type="text"
                        name="quantity"
                        placeholder="1"
                        value={order.quantity}
                        onChange={handleInputChange}
                        required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="unitPrice">Unit Price ($)</label>
                    <input
                        id="unitPrice"
                        type="text"
                        name="unitPrice"
                        placeholder="0.00"
                        value={order.unitPrice}
                        onChange={handleInputChange}
                        required
                    />
                  </div>
                </div>
                <button type="submit" className="submit-order-btn">
                  Place Order
                </button>
              </form>
            </section>
          </div>
        </div>
      </div>
  );
};

export default Inventory;
