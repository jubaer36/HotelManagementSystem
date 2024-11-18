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
  const [selectedRooms, setSelectedRooms] = useState([]); // Room IDs
  const [availableRooms, setAvailableRooms] = useState([]);
  const [showRooms, setShowRooms] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);

  const [bookingDetails, setBookingDetails] = useState({
    checkInDate: "",
    checkOutDate: "",
    numAdults: 1,
    numChildren: 0,
  });

  const [filters, setFilters] = useState({
    minPrice: 0,
    maxPrice: 0,
    bedType: "Any",
    classType: "Any",
    maxOccupancy: 0,
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
      firstName,
      lastName,
      email,
      phoneNumber,
      dob,
      nid,
      HotelID: filters.hotelID,
      selectedRooms, // Room IDs array
      ...bookingDetails, // Check-in, Check-out, Adults, and Children
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
        <button
          onClick={() => {
            setShowRooms(!showRooms);
            setShowFilterModal(false); // Close filter modal when toggling rooms
          }}
        >
          {showRooms ? "Hide Available Rooms" : "Show Available Rooms"}
        </button>
        <button
          onClick={() => {
            setShowFilterModal(!showFilterModal);
            setShowRooms(false); // Close room list when toggling filter modal
          }}
        >
          {showFilterModal ? "Close Search" : "Search"}
        </button>
      </div>

      {showRooms && (
        <div>
          <h2>Available Rooms</h2>
          {availableRooms.map((room) => (
            <button
              key={room.RoomID}
              onClick={() => handleRoomSelection(room)}
              style={{
                display: "block",
                padding: "10px",
                margin: "5px",
                backgroundColor: selectedRooms.includes(room.RoomID)
                  ? "green"
                  : "lightgray",
              }}
            >
              Room {room.RoomNumber} - {room.ClassType} (${room.BasePrice})
            </button>
          ))}
        </div>
      )}

      {selectedRooms.length > 0 && (
        <div>
          <h2>Booking Details</h2>
          <label>Check-In Date: </label>
          <input
            type="date"
            name="checkInDate"
            value={bookingDetails.checkInDate}
            onChange={handleBookingInputChange}
          />
          <label>Check-Out Date: </label>
          <input
            type="date"
            name="checkOutDate"
            value={bookingDetails.checkOutDate}
            onChange={handleBookingInputChange}
          />
          <label>Number of Adults: </label>
          <input
            type="number"
            name="numAdults"
            value={bookingDetails.numAdults}
            onChange={handleBookingInputChange}
          />
          <label>Number of Children: </label>
          <input
            type="number"
            name="numChildren"
            value={bookingDetails.numChildren}
            onChange={handleBookingInputChange}
          />
          <button onClick={handleConfirmBooking}>Confirm Booking</button>
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
            onChange={(e) =>
              setFilters({ ...filters, minPrice: Number(e.target.value) })
            }
          />
          <label>Max Price: </label>
          <input
            type="number"
            name="maxPrice"
            value={filters.maxPrice}
            onChange={(e) =>
              setFilters({ ...filters, maxPrice: Number(e.target.value) })
            }
          />
          <label>Bed Type: </label>
          <select
            name="bedType"
            value={filters.bedType}
            onChange={(e) => setFilters({ ...filters, bedType: e.target.value })}
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
            onChange={(e) =>
              setFilters({ ...filters, classType: e.target.value })
            }
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
            onChange={(e) =>
              setFilters({ ...filters, maxOccupancy: Number(e.target.value) })
            }
          />
          <div style={{ marginTop: "10px" }}>
            <button onClick={fetchFilteredRooms}>Apply Filters</button>
            <button
              onClick={() => setShowFilterModal(false)}
              style={{ marginLeft: "10px" }}
            >
              Cancel
            </button>
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