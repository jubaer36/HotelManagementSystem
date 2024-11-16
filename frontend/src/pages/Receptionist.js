import React, { useState } from "react";
import Axios from "axios";

const Receptionist = () => {
  // State variables for form data
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [nid, setNid] = useState("");
  const [dob, setDob] = useState("");
  const [selectedRoom, setSelectedRoom] = useState(null); // For storing the selected room
  const [availableRooms, setAvailableRooms] = useState([]);
  const [showRooms, setShowRooms] = useState(false);

  // Format the date of birth to the correct format (YYYY-MM-DD)
  const formattedDOB = (dob) => {
    if (!dob) return "";
    const date = new Date(dob);
    return date.toISOString().split("T")[0];
  };

  // Handle booking submission
  const handleBookButtonClicked = () => {
    if (!firstName || !lastName || !email || !phoneNumber || !dob || !nid) {
      alert("All fields are required!");
      return;
    }
    if (!selectedRoom) {
      alert("Please select a room to book!");
      return;
    }

    const updatedDob = formattedDOB(dob);

    Axios.post("http://localhost:3001/add-guest", {
      firstName: firstName,
      lastName: lastName,
      email: email,
      phoneNumber: phoneNumber,
      dob: updatedDob,
      nid: nid,
      HotelID: 1,
      selectedRoom: selectedRoom, // Include selected room in the request
    })
      .then(() => {
        alert("Booking successful!");
        setSelectedRoom(null); // Reset selected room after booking
      })
      .catch((error) => {
        console.error("Error sending data:", error);
        alert("Error occurred while booking.");
      });
  };

  const showAvailableRooms = () => {
    Axios.get("http://localhost:3001/available-rooms")
      .then((response) => {
        setAvailableRooms(response.data);
        setShowRooms(true);
      })
      .catch((error) => {
        console.log("Error Fetching Room", error);
        alert("Failed to Fetch");
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
        <button onClick={showAvailableRooms}>Show Available Rooms</button>
        <button onClick={handleBookButtonClicked}>Book</button>
      </div>

      {/* Conditionally render available rooms */}
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
                  Room {room.RoomNumber} - {room.RoomClassID} (${room.BasePrice}{ room.MaxOccupancy})
                </button>
              ))}
            </div>
          ) : (
            <p>No rooms available.</p>
          )}
        </div>
      )}

      {/* Display selected room */}
      {selectedRoom && (
        <div>
          <h3>Selected Room: {selectedRoom}</h3>
        </div>
      )}
    </div>
  );
};

export default Receptionist;
