import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Axios from "axios";

const Receptionist = () => {

  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [nid, setNid] = useState("");
  const [dob, setDob] = useState("");
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [availableRooms, setAvailableRooms] = useState([]);
  const [showRooms, setShowRooms] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);

  // Default filter state
  const [filters, setFilters] = useState({
    minPrice: 0, // Default value
    maxPrice: 0, // Default value
    bedType: "Any", // Default value
    classType: "Any", // Default value
    maxOccupancy: 0, // Default value
    hotelID: 1,
  });

  useEffect(() => {
    if (showRooms) {
      Axios.get("http://localhost:3001/available-rooms")
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
      hotelID: filters.hotelID,
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

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const toggleAvailableRooms = () => {
    setShowRooms((prev) => !prev);
  };

  const toggleFilterModal = () => {
    setShowFilterModal((prev) => !prev); // Toggle modal visibility
  };

  return (
    <div>
      <header>Receptionist Dashboard</header>
      <div>
        <label>First Name: </label>
        <input
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
        <label>Last Name: </label>
        <input
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
        <label>Email: </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <label>Phone: </label>
        <input
          type="text"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
        />
        <label>Date of Birth: </label>
        <input
          type="date"
          value={dob}
          onChange={(e) => setDob(e.target.value)}
        />
        <label>NID: </label>
        <input
          type="text"
          value={nid}
          onChange={(e) => setNid(e.target.value)}
        />
        <button onClick={toggleAvailableRooms}>
          {showRooms ? "Hide Available Rooms" : "Show Available Rooms"}
        </button>
        <button onClick={toggleFilterModal}>
          {showFilterModal ? "Close Search" : "Search"}
        </button>
      </div>

      {showRooms && (
        <div>
          <h2>Available Rooms</h2>
          {availableRooms.length > 0 ? (
            <div>
              {availableRooms.map((room, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedRoom(room.RoomNumber)}
                  style={{
                    display: "block",
                    padding: "10px",
                    margin: "5px",
                    backgroundColor:
                      selectedRoom === room.RoomNumber ? "green" : "lightgray",
                  }}
                >
                  Room {room.RoomNumber} - {room.ClassType} (${room.BasePrice}, Max:{" "}
                  {room.MaxOccupancy})
                </button>
              ))}
            </div>
          ) : (
            <p>No rooms available.</p>
          )}
        </div>
      )}

      {selectedRoom && (
        <div>
          <h3>Selected Room: {selectedRoom}</h3>
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
          <h2>Filter Rooms</h2>
          <label>Min Price: </label>
          <input
            type="number"
            name="minPrice"
            value={filters.minPrice}
            onChange={handleFilterChange}
          />
          <label>Max Price: </label>
          <input
            type="number"
            name="maxPrice"
            value={filters.maxPrice}
            onChange={handleFilterChange}
          />
          <label>Bed Type: </label>
          <select
            name="bedType"
            value={filters.bedType}
            onChange={handleFilterChange}
          >
            <option value="Any">Any</option>
            <option value="King">King</option>
            <option value="Queen">Queen</option>
            <option value="Single">Single</option>
            <option value="Double">Double</option>
            <option value="Twin">Twin</option>
          </select>
          <label>Class Type: </label>
          <select
            name="classType"
            value={filters.classType}
            onChange={handleFilterChange}
          >
            <option value="Any">Any</option>
            <option value="Standard">Standard</option>
            <option value="Suite">Suite</option>
            <option value="Single">Single</option>
            <option value="Double">Double</option>
            <option value="Family">Family</option>
          </select>
          <label>Max Occupancy: </label>
          <input
            type="number"
            name="maxOccupancy"
            value={filters.maxOccupancy}
            onChange={handleFilterChange}
          />
          <div style={{ marginTop: "10px" }}>
            <button onClick={fetchFilteredRooms}>Apply Filters</button>
            <button onClick={toggleFilterModal}>Cancel</button>
          </div>
        </div>
      )}

        <div>
          <h2>Manual Checkout</h2>
          
          <button onClick={() => navigate("/checkout")}>Checkout</button>
        </div>
    </div>
  );
};

export default Receptionist;