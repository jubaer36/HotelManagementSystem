import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import "./Receptionist.css"; // Import your CSS file for styling
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
  const [showRooms, setShowRooms] = useState(true);
  const [showGuestAndBooking, setShowGuestAndBooking] = useState(false);

  const [showFilterModal, setShowFilterModal] = useState(false);

  const [bookingDetails, setBookingDetails] = useState({
    checkInDate: "",
    checkOutDate: "",
    numAdults: 1,
    numChildren: 0,
    deposite: 0,
  });

  const today = new Date();

  const formatDate = (date) => date.toISOString().split("T")[0];

  const [filters, setFilters] = useState({
    minPrice: 0,
    maxPrice: 0,
    bedType: "Any",
    classType: "Any",
    maxOccupancy: 0,
    checkInDate: formatDate(today),     // ✅ today's date
    checkOutDate: formatDate(today), // ✅ tomorrow's date
  });
  const inputStyle = {
    width: "100%",
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "5px",
    fontSize: "14px",
    marginBottom: "10px",
  };

  const handleProceed = () => {
    if (selectedRooms.length === 0) {
      alert("Please select at least one room.");
      return;
    }
    setShowRooms(false); // Hide room table
    setShowGuestAndBooking(true);
  };
  
  

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

  const defaultDate = () =>{
    filters.checkInDate = formatDate(today);
    filters.checkOutDate = formatDate(today);
  }

  const fetchFilteredRooms = () => {
    if(filters.checkInDate === "" || filters.checkOutDate === ""){
    defaultDate();
    }
    console.log("Filters:", filters);
    Axios.post("http://localhost:3001/filter-rooms", {
      minPrice: filters.minPrice, // Default value
      maxPrice: filters.maxPrice, // Default value
      bedType: filters.bedType, // Default value
      classType: filters.classType, // Default value
      maxOccupancy: filters.maxOccupancy, // Default value
      checkInDate: filters.checkInDate,  // ✅ new
      checkOutDate: filters.checkOutDate, // ✅ new
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
        window.location.reload();
      })
      .catch((error) => {
        console.error("Error confirming booking:", error);
        alert("Failed to confirm booking.");
      });
  };

  return (
    <>
      <Navbar />
      <div className="receptionist-container">
  
        <div className="button-group">
          {!showGuestAndBooking && selectedRooms.length > 0 && (
            <button onClick={handleProceed} className="proceed-button">
              Proceed
            </button>
          )}
          <button
            onClick={() => setShowFilterModal(!showFilterModal)}
            className="search-button"
          >
            Search
          </button>
        </div>
  
        {showRooms && (
          <div className="rooms-section">
            <h2>Available Rooms</h2>
            <table className="rooms-table">
              <thead>
                <tr>
                  <th>Room Number</th>
                  <th>Class Type</th>
                  <th>Bed Type</th>
                  <th>Base Price</th>
                  <th>Max Occupancy</th>
                  <th>Select</th>
                </tr>
              </thead>
              <tbody>
                {availableRooms.map((room) => (
                  <tr
                    key={room.RoomID}
                    style={{
                      backgroundColor: selectedRooms.includes(room.RoomID)
                        ? "lightgreen"
                        : "white",
                    }}
                  >
                    <td>{room.RoomNumber}</td>
                    <td>{room.ClassType}</td>
                    <td>{room.BedType}</td>
                    <td>${room.BasePrice}</td>
                    <td>{room.MaxOccupancy}</td>
                    <td>
                      <button
                        onClick={() => handleRoomSelection(room)}
                        className={
                          selectedRooms.includes(room.RoomID)
                            ? "select-button-selected"
                            : "select-button"
                        }
                      >
                        {selectedRooms.includes(room.RoomID)
                          ? "Deselect"
                          : "Select"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
  
        {showGuestAndBooking && (
          <div className="details-section">
  
            {/* Guest Details */}
            <div className="guest-details-card">
              <h2>Guest Details</h2>
  
              <div className="input-group">
                <label>First Name:</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
  
              <div className="input-group">
                <label>Last Name:</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
  
              <div className="input-group">
                <label>Email:</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
  
              <div className="input-group">
                <label>Phone:</label>
                <input
                  type="text"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </div>
  
              <div className="input-group">
                <label>Date of Birth:</label>
                <input
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                />
              </div>
  
              <div className="input-group">
                <label>NID:</label>
                <input
                  type="text"
                  value={nid}
                  onChange={(e) => setNid(e.target.value)}
                />
              </div>
            </div>
  
            {/* Booking Details */}
            <div className="booking-details-card">
              <h2>Booking Details</h2>
  
              <div className="input-group">
                <label>Check-In Date:</label>
                <input
                  type="date"
                  name="checkInDate"
                  value={bookingDetails.checkInDate}
                  onChange={handleBookingInputChange}
                />
              </div>
  
              <div className="input-group">
                <label>Check-Out Date:</label>
                <input
                  type="date"
                  name="checkOutDate"
                  value={bookingDetails.checkOutDate}
                  onChange={handleBookingInputChange}
                />
              </div>
  
              <div className="input-group">
                <label>Number of Adults:</label>
                <input
                  type="number"
                  name="numAdults"
                  value={bookingDetails.numAdults}
                  onChange={handleBookingInputChange}
                />
              </div>
  
              <div className="input-group">
                <label>Number of Children:</label>
                <input
                  type="number"
                  name="numChildren"
                  value={bookingDetails.numChildren}
                  onChange={handleBookingInputChange}
                />
              </div>
  
              <div className="input-group">
                <label>Deposit:</label>
                <input
                  type="number"
                  name="deposite"
                  value={bookingDetails.deposite}
                  onChange={handleBookingInputChange}
                />
              </div>
  
              <div className="confirm-cancel-buttons">
                <button onClick={handleConfirmBooking} className="confirm-button">
                  Confirm Booking
                </button>
                <button
                  onClick={() => {
                    setSelectedRooms([]);
                    setShowRooms(true);
                    setShowGuestAndBooking(false);
                  }}
                  className="cancel-button"
                >
                  Cancel
                </button>
              </div>
            </div>
  
          </div>
        )}
  
        {/* Filter Modal */}
        {showFilterModal && (
          <div className="filter-modal">
            <p>Filter Rooms</p>
  
            <div className="input-group">
              <label>Min Price:</label>
              <input
                type="number"
                name="minPrice"
                value={filters.minPrice}
                onChange={(e) =>
                  setFilters({ ...filters, minPrice: Number(e.target.value) })
                }
              />
            </div>
  
            <div className="input-group">
              <label>Max Price:</label>
              <input
                type="number"
                name="maxPrice"
                value={filters.maxPrice}
                onChange={(e) =>
                  setFilters({ ...filters, maxPrice: Number(e.target.value) })
                }
              />
            </div>
  
            <div className="input-group">
              <label>Bed Type:</label>
              <select
                name="bedType"
                value={filters.bedType}
                onChange={(e) =>
                  setFilters({ ...filters, bedType: e.target.value })
                }
              >
                <option value="Any">Any</option>
                <option value="King">King</option>
                <option value="Queen">Queen</option>
                <option value="Single">Single</option>
                <option value="Double">Double</option>
                <option value="Twin">Twin</option>
              </select>
            </div>
  
            <div className="input-group">
              <label>Class Type:</label>
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
            </div>
  
            <div className="input-group">
              <label>Max Occupancy:</label>
              <input
                type="number"
                name="maxOccupancy"
                value={filters.maxOccupancy}
                onChange={(e) =>
                  setFilters({ ...filters, maxOccupancy: Number(e.target.value) })
                }
              />
            </div>
  
            <div className="input-group">
              <label>Check-In Date:</label>
              <input
                type="date"
                name="checkInDate"
                value={filters.checkInDate}
                onChange={(e) =>
                  setFilters({ ...filters, checkInDate: e.target.value })
                }
              />
            </div>
  
            <div className="input-group">
              <label>Check-Out Date:</label>
              <input
                type="date"
                name="checkOutDate"
                value={filters.checkOutDate}
                min={filters.checkInDate}
                onChange={(e) =>
                  setFilters({ ...filters, checkOutDate: e.target.value })
                }
              />
            </div>
  
            <div className="modal-buttons">
              <button onClick={fetchFilteredRooms} className="confirm-button">
                Apply Filters
              </button>
              <button
                onClick={() => setShowFilterModal(false)}
                className="cancel-button"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
  
      </div>
    </>
  );
  
};

export default Receptionist;