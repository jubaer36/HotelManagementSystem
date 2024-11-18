import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Axios from "axios";
import "./Receptionist.css";

const Receptionist = () => {
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [nid, setNid] = useState("");
  const [dob, setDob] = useState("");
  const [selectedRoom, setSelectedRoom] = useState(null); // Single room object
  const [availableRooms, setAvailableRooms] = useState([]);
  const [showRooms, setShowRooms] = useState(false);
  const [selectedRooms, setSelectedRooms] = useState([]);
  const [bookingDetails, setBookingDetails] = useState({
    checkInDate: "",
    checkOutDate: "",
    numAdults: 1,
    numChildren: 0,
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

  const handleRoomSelection = (room) => {
    setSelectedRoom(room); // Set selected room details
    setSelectedRooms([room.RoomID]); // Add room ID to selectedRooms for booking
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
          setSelectedRoom(null);
        })
        .catch((error) => {
          console.error("Error confirming booking:", error);
          alert("Failed to confirm booking.");
        });
  };

  return (
      <div className="receptionist-container">
        <header className="receptionist-header">
          <h1>Receptionist Dashboard</h1>
        </header>

        {/* Guest Information Form */}
        <div className="form-container">
          <div className="form-section">
            <label>First Name:</label>
            <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
            />
            <label>Last Name:</label>
            <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
            />
            <label>Email:</label>
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <label>Phone:</label>
            <input
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
            />
            <label>Date of Birth:</label>
            <input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
            />
            <label>NID:</label>
            <input
                type="text"
                value={nid}
                onChange={(e) => setNid(e.target.value)}
            />
          </div>
        </div>

        {/* Available Rooms Section */}
        <div className="available-rooms-section">
          <div className="rooms-container">
            <div className="rooms-header">
              <h2>Available Rooms</h2>
              <button
                  onClick={() => setShowRooms(!showRooms)}
                  className="toggle-rooms-button"
              >
                {showRooms ? "Hide Rooms" : "Show Rooms"}
              </button>
            </div>
            <div className="rooms-list">
              {showRooms &&
                  availableRooms.map((room) => (
                      <button
                          key={room.RoomID}
                          onClick={() => handleRoomSelection(room)}
                          className={`room-button ${
                              selectedRoom?.RoomID === room.RoomID ? "selected" : ""
                          }`}
                      >
                        Room {room.RoomNumber} - {room.ClassType} (${room.BasePrice})
                      </button>
                  ))}
            </div>
          </div>

          {/* Room Details Section */}
          <div className="room-details">
            {selectedRoom ? (
                <>
                  <h2>Room Details</h2>
                  <p>
                    <strong>Room Number:</strong> {selectedRoom.RoomNumber}
                  </p>
                  <p>
                    <strong>Class Type:</strong> {selectedRoom.ClassType}
                  </p>
                  <p>
                    <strong>Price:</strong> ${selectedRoom.BasePrice}
                  </p>
                  <p>
                    <strong>Bed Type:</strong> {selectedRoom.BedType}
                  </p>
                  <p>
                    <strong>Occupancy:</strong> {selectedRoom.MaxOccupancy} People
                  </p>
                </>
            ) : (
                <p>Select a room to view details.</p>
            )}
          </div>
        </div>

        {/* Booking Details Section */}
        {selectedRooms.length > 0 && (
            <div className="booking-details">
              <h2>Booking Details</h2>
              <div className="booking-form">
                <div className="form-group">
                  <label>Check-In Date:</label>
                  <input
                      type="date"
                      name="checkInDate"
                      value={bookingDetails.checkInDate}
                      onChange={handleBookingInputChange}
                  />
                </div>
                <div className="form-group">
                  <label>Check-Out Date:</label>
                  <input
                      type="date"
                      name="checkOutDate"
                      value={bookingDetails.checkOutDate}
                      onChange={handleBookingInputChange}
                  />
                </div>
                <div className="form-group">
                  <label>Number of Adults:</label>
                  <input
                      type="number"
                      name="numAdults"
                      value={bookingDetails.numAdults}
                      onChange={handleBookingInputChange}
                      min="1"
                  />
                </div>
                <div className="form-group">
                  <label>Number of Children:</label>
                  <input
                      type="number"
                      name="numChildren"
                      value={bookingDetails.numChildren}
                      onChange={handleBookingInputChange}
                      min="0"
                  />
                </div>
                <button
                    className="confirm-booking-button"
                    onClick={handleConfirmBooking}
                >
                  Confirm Booking
                </button>
              </div>
            </div>
        )}

        {/* Manual Checkout Section */}
        <div className="manual-checkout">
          <h2>Manual Checkout</h2>
          <button className="checkout-button" onClick={() => navigate("/checkout")}>
            Checkout
          </button>
        </div>
      </div>
  );
};

export default Receptionist;
