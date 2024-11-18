import React, { useState, useEffect } from "react";
import Axios from "axios";

const CurrentGuests = () => {
  const [guests, setGuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedGuest, setSelectedGuest] = useState(null);
  const [newCheckoutDate, setNewCheckoutDate] = useState("");  
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filters, setFilters] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
    guestID: "",
    fromDate: "",
    toDate: "",
  });


  useEffect(() => {
    fetchGuests();
  }, []);

  const fetchGuests = () => {
    setLoading(true);
    Axios.get("http://localhost:3001/current-guests")
      .then((response) => {
        console.log("Fetched Guests:", response.data); // Add this line
        setGuests(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching current guests:", error);
        setLoading(false);
      });
  };

  
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const applyFilters = () => {
    Axios.post("http://localhost:3001/filter-guests", filters)
      .then((response) => {
        setGuests(response.data);
        setShowFilterModal(false); // Close the modal after applying filters
      })
      .catch((error) => {
        console.error("Error applying filters:", error);
        alert("Failed to apply filters.");
      });
  };

  
  const handleExtendVisit = (guest) => {
    setSelectedGuest(guest);
    setShowPopup(true);
  };

  const handleConfirmExtendVisit = () => {
    if (!newCheckoutDate) {
      alert("Please select a new checkout date.");
      return;
    }
  
    // Convert the date to a UTC date string (yyyy-mm-dd format)
    const formattedDate = new Date(newCheckoutDate).toISOString().split("T")[0];
  
    Axios.post("http://localhost:3001/extend-visit", {
      guestID: selectedGuest.GuestID, // Pass GuestID
      newCheckoutDate: formattedDate,
    })
      .then(() => {
        alert("Checkout date updated successfully.");
        setShowPopup(false);
        fetchGuests(); // Refresh the guest list
      })
      .catch((error) => {
        console.error("Error extending visit:", error);
        alert("Failed to extend visit.");
      });
  };
  

  const handleCheckout = (guestID) => {
    Axios.post("http://localhost:3001/checkout", { guestID }) // Pass GuestID
      .then(() => {
        alert("Guest checked out successfully.");
        fetchGuests(); // Refresh the guest list
      })
      .catch((error) => {
        console.error("Error during checkout:", error);
        alert("Failed to process checkout.");
      });
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (guests.length === 0) {
    return <p>No guests are currently staying at the hotel.</p>;
  }

  return (
    <div>
            <button
        style={{
          position: "absolute",
          top: "20px",
          right: "20px",
          padding: "10px",
          backgroundColor: "blue",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
        onClick={() => setShowFilterModal(true)}
      >
        Filter Guests
      </button>
    <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
      {guests.map((guest, index) => (
        <div
          key={index}
          style={{
            border: "1px solid #ccc",
            borderRadius: "8px",
            padding: "16px",
            width: "300px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          }}
        >
          <h3>
            {guest.FirstName} {guest.LastName}
          </h3>
          <p>
            <strong>Email:</strong> {guest.EmailAddress}
          </p>
          <p>
            <strong>Phone:</strong> {guest.PhoneNumber}
          </p>
          <p>
            <strong>Room Number:</strong> {guest.RoomNumber}
          </p>
          <p>
            <strong>Check-In Date:</strong> {guest.CheckInDate}
          </p>
          <p>
            <strong>Check-Out Date:</strong> {guest.CheckOutDate}
          </p>
          <p>
            <strong>Adults:</strong> {guest.NumAdults}
          </p>
          <p>
            <strong>Children:</strong> {guest.NumChildren}
          </p>
          <button
            style={{ marginRight: "10px" }}
            onClick={() => handleExtendVisit(guest)}
          >
            Extend Visit
          </button>
          <button onClick={() => handleCheckout(guest.GuestID)}>
            Checkout
          </button>
        </div>
      ))}

      {showPopup && (
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "white",
            padding: "20px",
            boxShadow: "0px 0px 10px rgba(0,0,0,0.5)",
            zIndex: 1000,
          }}
        >
          <h2>
            Extend Visit for {selectedGuest?.FirstName}{" "}
            {selectedGuest?.LastName}
          </h2>
          <label>New Checkout Date: </label>
          <input
            type="date"
            value={newCheckoutDate}
            onChange={(e) => setNewCheckoutDate(e.target.value)}
          />
          <div style={{ marginTop: "10px" }}>
            <button onClick={handleConfirmExtendVisit}>Confirm</button>
            <button
              onClick={() => setShowPopup(false)}
              style={{ marginLeft: "10px" }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
       {showFilterModal && (
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "white",
            padding: "20px",
            boxShadow: "0px 0px 10px rgba(0,0,0,0.5)",
            zIndex: 1000,
          }}
        >
          <h2>Filter Guests</h2>
          <label>First Name: </label>
          <input
            type="text"
            name="firstName"
            value={filters.firstName}
            onChange={handleFilterChange}
          />
          <br />
          <label>Last Name: </label>
          <input
            type="text"
            name="lastName"
            value={filters.lastName}
            onChange={handleFilterChange}
          />
          <br />
          <label>Phone Number: </label>
          <input
            type="text"
            name="phoneNumber"
            value={filters.phoneNumber}
            onChange={handleFilterChange}
          />
          <br />
          <label>Email: </label>
          <input
            type="email"
            name="email"
            value={filters.email}
            onChange={handleFilterChange}
          />
          <br />
          <label>Guest ID: </label>
          <input
            type="text"
            name="guestID"
            value={filters.guestID}
            onChange={handleFilterChange}
          />
          <br />
          <label>From Date: </label>
          <input
            type="date"
            name="fromDate"
            value={filters.fromDate}
            onChange={handleFilterChange}
          />
          <br />
          <label>To Date: </label>
          <input
            type="date"
            name="toDate"
            value={filters.toDate}
            onChange={handleFilterChange}
          />
          <br />
          <button onClick={applyFilters}>Apply Filters</button>
          <button onClick={() => setShowFilterModal(false)}>Cancel</button>
        </div>
      )}
    </div>
    </div>
  );
  
};

export default CurrentGuests;
