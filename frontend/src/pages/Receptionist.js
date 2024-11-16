// Receptionist.js (Frontend)

import React, { useState } from "react";
import Axios from 'axios';

const Receptionist = () => {
  // State variables for form data
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [nid, setNid] = useState("");
  const [dob, setDob] = useState("");
  const [selectedRooms , setSelectedRooms] = ([]);
  const [availableRooms , setAvailableRooms] = ([]);

  // Format the date of birth to the correct format (YYYY-MM-DD)
  const formattedDOB = (dob) => {
    if (!dob) return "";
    const date = new Date(dob);
    return date.toISOString().split("T")[0];
    console.log(date);
  };

  // Handle booking submission
  const handleBookButtonClicked = () => {
    console.log("handle butoon clicked");
    // Validate required fields
    if (!firstName || !lastName || !email || !phoneNumber || !dob || !nid) {
      alert("All fields are required!");
      return;
    }

    const updatedDob = formattedDOB(dob);
    console.log(firstName,lastName,dob);

    Axios.post("http://localhost:3001/add-guest", {
      firstName:firstName,
      lastName:lastName,
      email:email,
      phoneNumber:phoneNumber,
      dob: updatedDob,
      nid:nid,
      HotelID: 1,
      
    })
      .then(() => {
        alert("Booking successful!");
      })
      .catch((error) => {
        console.error("Error sending data:", error);
        alert("Error occurred while booking.");
      });
  };

  const showAvailableRooms = ()=>{
    console.log('pressing available rooms');
    Axios.get("http://localhost:3001/available-rooms").then((response) =>{
      console.log(response.data);
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
        <button onClick={showAvailableRooms}>Available Rooms</button>
        <button onClick={handleBookButtonClicked}>Book</button>
      </div>
    </div>
  );
};

export default Receptionist;