import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Axios from "axios";


const Receptionist = () => {
  const dummyHID = localStorage.getItem("hotelID");
  const dummyEID = localStorage.getItem("userID");
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [nid, setNid] = useState("");
  const [dob, setDob] = useState("");
  const [selectedRooms, setSelectedRooms] = useState([]); // Room IDs
  const [availableRooms, setAvailableRooms] = useState([]);
  const [showRooms, setShowRooms] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);

  const [bookingDetails, setBookingDetails] = useState({
    checkInDate: "",
    checkOutDate: "",
    numAdults: 1,
    numChildren: 0,
    deposite: 0,
  });

  const [filters, setFilters] = useState({
    minPrice: 0,
    maxPrice: 0,
    bedType: "Any",
    classType: "Any",
    maxOccupancy: 0,
  });

  useEffect(() => {
    if (showRooms) {
      Axios.post("http://localhost:3001/available-rooms",{
        hotelID: dummyHID,
      })
        .then((response) => {
          setAvailableRooms(response.data);
        })
        .catch((error) => {
          console.error("Error fetching available rooms:", error);
          alert("Failed to fetch available rooms.");
        });
    }
  }, [showRooms]);

  const fetchFilteredRooms = () => {
    Axios.post("http://localhost:3001/filter-rooms", {
      minPrice: filters.minPrice, // Default value
      maxPrice: filters.maxPrice, // Default value
      bedType: filters.bedType, // Default value
      classType: filters.classType, // Default value
      maxOccupancy: filters.maxOccupancy, // Default value
      hotelID: dummyHID,
    })
      .then((response) => {
        setAvailableRooms(response.data);
        setShowFilterModal(false); // Close modal after fetching
      })
      .catch((error) => {
        console.error("Error fetching filtered rooms:", error);
        alert("Failed to fetch filtered rooms.");
      });
  };

  const handleRoomSelection = (room) => {
    setSelectedRooms((prevSelected) =>
      prevSelected.includes(room.RoomID)
        ? prevSelected.filter((id) => id !== room.RoomID) // Unselect room
        : [...prevSelected, room.RoomID] // Add room
    );
  };

  const handleBookingInputChange = (e) => {
    const { name, value } = e.target;
    setBookingDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleConfirmBooking = () => {
    if (selectedRooms.length === 0) {
      alert("Please select at least one room.");
      return;
    }
    if (!firstName || !lastName || !email || !phoneNumber || !dob || !nid) {
      alert("All guest fields are required.");
      return;
    }

    Axios.post("http://localhost:3001/add-guest", {
      firstName: firstName,
      lastName: lastName,
      email: email,
      phoneNumber: phoneNumber,
      dob: dob,
      nid: nid,
      hotelID: dummyHID,
      empID: dummyEID,
      selectedRooms: selectedRooms, // Room IDs array
      checkInDate: bookingDetails.checkInDate,
      checkOutDate: bookingDetails.checkOutDate,
      numAdults: bookingDetails.numAdults,
      numChildren: bookingDetails.numChildren,
      deposite: bookingDetails.deposite,
      })
      .then(() => {
        alert("Booking confirmed successfully!");
        setSelectedRooms([]);
        setBookingDetails({
          checkInDate: "",
          checkOutDate: "",
          numAdults: 1,
          numChildren: 0,
        });
      })
      .catch((error) => {
        console.error("Error confirming booking:", error);
        alert("Failed to confirm booking.");
      });
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <div style={{ marginBottom: "20px" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "15px" }}>
          <div>
            <label style={{ display: "block", fontWeight: "bold", marginBottom: "5px" }}>First Name:</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              style={{ padding: "10px", width: "200px", border: "1px solid #ccc", borderRadius: "4px" }}
            />
          </div>
          <div>
            <label style={{ display: "block", fontWeight: "bold", marginBottom: "5px" }}>Last Name:</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              style={{ padding: "10px", width: "200px", border: "1px solid #ccc", borderRadius: "4px" }}
            />
          </div>
          <div>
            <label style={{ display: "block", fontWeight: "bold", marginBottom: "5px" }}>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ padding: "10px", width: "250px", border: "1px solid #ccc", borderRadius: "4px" }}
            />
          </div>
          <div>
            <label style={{ display: "block", fontWeight: "bold", marginBottom: "5px" }}>Phone:</label>
            <input
              type="text"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              style={{ padding: "10px", width: "200px", border: "1px solid #ccc", borderRadius: "4px" }}
            />
          </div>
          <div>
            <label style={{ display: "block", fontWeight: "bold", marginBottom: "5px" }}>Date of Birth:</label>
            <input
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              style={{ padding: "10px", width: "200px", border: "1px solid #ccc", borderRadius: "4px" }}
            />
          </div>
          <div>
            <label style={{ display: "block", fontWeight: "bold", marginBottom: "5px" }}>NID:</label>
            <input
              type="text"
              value={nid}
              onChange={(e) => setNid(e.target.value)}
              style={{ padding: "10px", width: "200px", border: "1px solid #ccc", borderRadius: "4px" }}
            />
          </div>
        </div>

        <div style={{ marginTop: "20px" }}>
          <button
            onClick={() => {
              setShowRooms(!showRooms);
              setShowFilterModal(false);
            }}
            style={{
              padding: "10px 15px",
              backgroundColor: showRooms ? "#f44336" : "#4CAF50",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              marginRight: "10px",
            }}
          >
            {showRooms ? "Hide Available Rooms" : "Show Available Rooms"}
          </button>
          <button
            onClick={() => {
              setShowFilterModal(!showFilterModal);
              setShowRooms(true);
            }}
            style={{
              padding: "10px 15px",
              backgroundColor: showFilterModal ? "#f44336" : "#2196F3",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            {showFilterModal ? "Close Search" : "Search"}
          </button>
        </div>
      </div>

      {showRooms && (
        <div style={{ marginTop: "20px" }}>
          <h2>Available Rooms</h2>
          <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "10px" }}>
            <thead>
              <tr style={{ backgroundColor: "#f2f2f2" }}>
                <th style={{ border: "1px solid #ccc", padding: "10px", textAlign: "left" }}>Room Number</th>
                <th style={{ border: "1px solid #ccc", padding: "10px", textAlign: "left" }}>Class Type</th>
                <th style={{ border: "1px solid #ccc", padding: "10px", textAlign: "left" }}>Base Price</th>
                <th style={{ border: "1px solid #ccc", padding: "10px", textAlign: "left" }}>Max Occupancy</th>
                <th style={{ border: "1px solid #ccc", padding: "10px", textAlign: "left" }}>Select</th>
              </tr>
            </thead>
            <tbody>
              {availableRooms.map((room) => (
                <tr
                  key={room.RoomID}
                  style={{
                    backgroundColor: selectedRooms.includes(room.RoomID) ? "lightgreen" : "white",
                  }}
                >
                  <td style={{ border: "1px solid #ccc", padding: "10px" }}>{room.RoomNumber}</td>
                  <td style={{ border: "1px solid #ccc", padding: "10px" }}>{room.RoomClassID}</td>
                  <td style={{ border: "1px solid #ccc", padding: "10px" }}>${room.BasePrice}</td>
                  <td style={{ border: "1px solid #ccc", padding: "10px" }}>{room.MaxOccupancy}</td>
                  <td style={{ border: "1px solid #ccc", padding: "10px" }}>
                    <button
                      onClick={() => handleRoomSelection(room)}
                      style={{
                        padding: "5px 10px",
                        backgroundColor: selectedRooms.includes(room.RoomID) ? "green" : "#e0e0e0",
                        color: selectedRooms.includes(room.RoomID) ? "white" : "black",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                      }}
                    >
                      {selectedRooms.includes(room.RoomID) ? "Deselect" : "Select"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedRooms.length > 0 && (
        <div
          style={{
            backgroundColor: "#ffffff",
            padding: "30px",
            boxShadow: "0px 0px 20px rgba(0, 0, 0, 0.2)",
            borderRadius: "10px",
            width: "500px",
            maxWidth: "90%",
            fontFamily: "'Arial', sans-serif",
            margin: "20px auto",
          }}
        >
          <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Booking Details</h2>

          <div style={{ marginBottom: "15px" }}>
            <label style={{ fontSize: "14px", fontWeight: "600", marginBottom: "5px" }}>
              Check-In Date:
            </label>
            <input
              type="date"
              name="checkInDate"
              value={bookingDetails.checkInDate}
              onChange={handleBookingInputChange}
              style={{
                width: "100%",
                padding: "10px",
                border: "1px solid #ccc",
                borderRadius: "5px",
                fontSize: "14px",
                marginBottom: "10px",
              }}
            />
          </div>

          <div style={{ marginBottom: "15px" }}>
            <label style={{ fontSize: "14px", fontWeight: "600", marginBottom: "5px" }}>
              Check-Out Date:
            </label>
            <input
              type="date"
              name="checkOutDate"
              value={bookingDetails.checkOutDate}
              onChange={handleBookingInputChange}
              style={{
                width: "100%",
                padding: "10px",
                border: "1px solid #ccc",
                borderRadius: "5px",
                fontSize: "14px",
                marginBottom: "10px",
              }}
            />
          </div>

          <div style={{ marginBottom: "15px" }}>
            <label style={{ fontSize: "14px", fontWeight: "600", marginBottom: "5px" }}>
              Number of Adults:
            </label>
            <input
              type="number"
              name="numAdults"
              value={bookingDetails.numAdults}
              onChange={handleBookingInputChange}
              style={{
                width: "100%",
                padding: "10px",
                border: "1px solid #ccc",
                borderRadius: "5px",
                fontSize: "14px",
                marginBottom: "10px",
              }}
            />
          </div>

          <div style={{ marginBottom: "15px" }}>
            <label style={{ fontSize: "14px", fontWeight: "600", marginBottom: "5px" }}>
              Number of Children:
            </label>
            <input
              type="number"
              name="numChildren"
              value={bookingDetails.numChildren}
              onChange={handleBookingInputChange}
              style={{
                width: "100%",
                padding: "10px",
                border: "1px solid #ccc",
                borderRadius: "5px",
                fontSize: "14px",
                marginBottom: "20px",
              }}
            />
          </div>


          <div style={{ marginBottom: "15px" }}>
            <label style={{ fontSize: "14px", fontWeight: "600", marginBottom: "5px" }}>
              Deposite
            </label>
            <input
              type="number"
              name="deposite"
              value={bookingDetails.deposite}
              onChange={handleBookingInputChange}
              style={{
                width: "100%",
                padding: "10px",
                border: "1px solid #ccc",
                borderRadius: "5px",
                fontSize: "14px",
                marginBottom: "20px",
              }}
            />
          </div>

          <div style={{ textAlign: "center" }}>
            <button
              onClick={handleConfirmBooking}
              style={{
                backgroundColor: "#4CAF50",
                color: "white",
                padding: "12px 20px",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                fontSize: "16px",
                width: "100%",
              }}
            >
              Confirm Booking
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
            backgroundColor: "#ffffff",
            padding: "30px",
            boxShadow: "0px 0px 20px rgba(0, 0, 0, 0.3)",
            zIndex: 1000,
            borderRadius: "10px",
            width: "400px",
            maxWidth: "90%",
            fontFamily: "'Arial', sans-serif",
          }}
        >
          <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Filter Rooms</h2>
          <div style={{ marginBottom: "15px" }}>
            <label style={{ fontSize: "14px", fontWeight: "600", marginBottom: "5px" }}>
              Min Price:
            </label>
            <input
              type="number"
              name="minPrice"
              value={filters.minPrice}
              onChange={(e) =>
                setFilters({ ...filters, minPrice: Number(e.target.value) })
              }
              style={{
                width: "100%",
                padding: "10px",
                border: "1px solid #ccc",
                borderRadius: "5px",
                fontSize: "14px",
                marginBottom: "10px",
              }}
            />
          </div>
          <div style={{ marginBottom: "15px" }}>
            <label style={{ fontSize: "14px", fontWeight: "600", marginBottom: "5px" }}>
              Max Price:
            </label>
            <input
              type="number"
              name="maxPrice"
              value={filters.maxPrice}
              onChange={(e) =>
                setFilters({ ...filters, maxPrice: Number(e.target.value) })
              }
              style={{
                width: "100%",
                padding: "10px",
                border: "1px solid #ccc",
                borderRadius: "5px",
                fontSize: "14px",
                marginBottom: "10px",
              }}
            />
          </div>
          <div style={{ marginBottom: "15px" }}>
            <label style={{ fontSize: "14px", fontWeight: "600", marginBottom: "5px" }}>
              Bed Type:
            </label>
            <select
              name="bedType"
              value={filters.bedType}
              onChange={(e) => setFilters({ ...filters, bedType: e.target.value })}
              style={{
                width: "100%",
                padding: "10px",
                border: "1px solid #ccc",
                borderRadius: "5px",
                fontSize: "14px",
              }}
            >
              <option value="Any">Any</option>
              <option value="King">King</option>
              <option value="Queen">Queen</option>
              <option value="Single">Single</option>
              <option value="Double">Double</option>
              <option value="Twin">Twin</option>
            </select>
          </div>
          <div style={{ marginBottom: "15px" }}>
            <label style={{ fontSize: "14px", fontWeight: "600", marginBottom: "5px" }}>
              Class Type:
            </label>
            <select
              name="classType"
              value={filters.classType}
              onChange={(e) =>
                setFilters({ ...filters, classType: e.target.value })
              }
              style={{
                width: "100%",
                padding: "10px",
                border: "1px solid #ccc",
                borderRadius: "5px",
                fontSize: "14px",
              }}
            >
              <option value="Any">Any</option>
              <option value="Standard">Standard</option>
              <option value="Suite">Suite</option>
              <option value="Single">Single</option>
              <option value="Double">Double</option>
              <option value="Family">Family</option>
            </select>
          </div>
          <div style={{ marginBottom: "15px" }}>
            <label style={{ fontSize: "14px", fontWeight: "600", marginBottom: "5px" }}>
              Max Occupancy:
            </label>
            <input
              type="number"
              name="maxOccupancy"
              value={filters.maxOccupancy}
              onChange={(e) =>
                setFilters({ ...filters, maxOccupancy: Number(e.target.value) })
              }
              style={{
                width: "100%",
                padding: "10px",
                border: "1px solid #ccc",
                borderRadius: "5px",
                fontSize: "14px",
              }}
            />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "20px" }}>
            <button
              onClick={fetchFilteredRooms}
              style={{
                backgroundColor: "#4CAF50",
                color: "white",
                padding: "10px 20px",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                fontSize: "14px",
              }}
            >
              Apply Filters
            </button>
            <button
              onClick={() => setShowFilterModal(false)}
              style={{
                backgroundColor: "#f44336",
                color: "white",
                padding: "10px 20px",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                fontSize: "14px",
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}


      {/* <div style={{ marginTop: "20px" }}>
        <h2>Manual Checkout</h2>
        <button
          onClick={() => navigate("/checkout")}
          style={{
            padding: "10px 15px",
            backgroundColor: "#FF9800",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Checkout
        </button>
        <button
          onClick={() => navigate("/real-checkout")}
          style={{
            padding: "10px 15px",
            marginLeft: "5px",
            backgroundColor: "#FF9800",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
         Real Checkout
        </button>
      </div> */}
    </div>

  );
};

export default Receptionist;