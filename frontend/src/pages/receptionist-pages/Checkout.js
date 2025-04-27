import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Axios from "axios";
import "./Checkout.css";
import Navbar from "../../components/Navbar.js";


const CurrentGuests = () => {
    const dummyHID = localStorage.getItem("hotelID");
    const navigate = useNavigate();


    const [guests, setGuests] = useState([]);
    const [loading, setLoading] = useState(true);
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

    const toggleDetails = (index) => {
        setGuests(prevGuests =>
          prevGuests.map((guest, idx) =>
            idx === index ? { ...guest, showDetails: !guest.showDetails } : guest
          )
        );
      };
      

    const fetchGuests = () => {
        setLoading(true);
        Axios.post("http://localhost:3001/current-guests",{
            hotelID : dummyHID,
        })
            .then((response) => {
                const sortedGuests = response.data.map(g => ({ ...g, showDetails: false })).sort((a, b) => {
                    const roomA = a.RoomNumber.toString().toLowerCase();
                    const roomB = b.RoomNumber.toString().toLowerCase();
                    return roomA.localeCompare(roomB, undefined, { numeric: true });
                  });                  
                setGuests(sortedGuests);
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
        Axios.post("http://localhost:3001/filter-guests",{
            firstName: filters.firstName,
            lastName: filters.lastName,
            phoneNumber: filters.phoneNumber,
            email: filters.email,
            guestID: filters.guestID,
            fromDate: filters.fromDate,
            toDate: filters.toDate,
            hotelID: dummyHID,
        })
            .then((response) => {
                const sortedGuests = response.data.map(g => ({ ...g, showDetails: false })).sort((a, b) => {
                    const roomA = a.RoomNumber.toString().toLowerCase();
                    const roomB = b.RoomNumber.toString().toLowerCase();
                    return roomA.localeCompare(roomB, undefined, { numeric: true });
                  });                  
                setGuests(sortedGuests);
                setShowFilterModal(false); 
            })
            .catch((error) => {
                console.error("Error applying filters:", error);
                alert("Failed to apply filters.");
            });
    };





    if (loading) {
        return <p>Loading...</p>;
    }

    if (guests.length === 0) {
        return(
          <><Navbar/>
            <div className="current-guests-container">
            <div className="current-guests-header">
            <button className="filter-guests-button" onClick={() => setShowFilterModal(true)}>
                Filter Guests
            </button>
          <button className="show-current-guest-button" onClick={fetchGuests}>
            Current Guests
        </button>
            </div>
            <div className="no-guests-found">
        <h2>No Guests Found</h2>
        <p>There are currently no guests to show. Please try filtering or refreshing.</p>
      </div>
            {showFilterModal && (
        <div className="filter-modal">
            <h2>Filter Guests</h2>
            <label>First Name:</label>
            <input
                type="text"
                name="firstName"
                value={filters.firstName}
                onChange={handleFilterChange}
            />
            <label>Last Name:</label>
            <input
                type="text"
                name="lastName"
                value={filters.lastName}
                onChange={handleFilterChange}
            />
            <label>Phone Number:</label>
            <input
                type="text"
                name="phoneNumber"
                value={filters.phoneNumber}
                onChange={handleFilterChange}
            />
            <label>Email:</label>
            <input
                type="email"
                name="email"
                value={filters.email}
                onChange={handleFilterChange}
            />
            <label>Guest ID:</label>
            <input
                type="text"
                name="guestID"
                value={filters.guestID}
                onChange={handleFilterChange}
            />
            <label>From Date:</label>
            <input
                type="date"
                name="fromDate"
                value={filters.fromDate}
                onChange={handleFilterChange}
            />
            <label>To Date:</label>
            <input
                type="date"
                name="toDate"
                value={filters.toDate}
                onChange={handleFilterChange}
            />
            <div className="filter-actions">
                <button onClick={applyFilters}>Apply Filters</button>
                <button onClick={() => setShowFilterModal(false)}>Cancel</button>
            </div>
        </div>
    )}
            </div>
            </>
        ) 
    }

    return (
        <>
<Navbar/>
<div className="current-guests-container">
    <div className="current-guests-header">
        <button className="filter-guests-button" onClick={() => setShowFilterModal(true)}>
            Filter Guests
        </button>
        <button className="show-current-guest-button" onClick={fetchGuests}>
            Current Guests
        </button>
    </div>

    <div className="guest-cards">
  {guests.map((guest, index) => (
    <div className="guest-card-row" key={index}>
      <div className="guest-image-container">
        {guest.RoomImage ? (
          <img
            src={`data:image/jpeg;base64,${guest.RoomImage}`}
            alt="Room"
            className="guest-room-image"
          />
        ) : (
          <div className="guest-no-image">No Image</div>
        )}
      </div>

      <div className="guest-info-container">
        <div className="guest-header">
          <div>
            <h3><strong>Room:</strong> {guest.RoomNumber}</h3>
            <h4>{guest.FirstName} {guest.LastName}</h4>
          </div>
          <div>
            <button
              className="details-toggle-button"
              onClick={() => toggleDetails(index)}
            >
              {guest.showDetails ? "Hide Details" : "Show Details"}
            </button>
          </div>
        </div>

        {guest.showDetails && (
          <div className="guest-expanded-info">
            <p><strong>Email:</strong> {guest.EmailAddress}</p>
            <p><strong>Phone:</strong> {guest.PhoneNumber}</p>
            <p><strong>Check-In Date:</strong> {guest.CheckInDate}</p>
            <p><strong>Check-Out Date:</strong> {guest.CheckOutDate}</p>
            <p><strong>Adults:</strong> {guest.NumAdults}</p>
            <p><strong>Children:</strong> {guest.NumChildren}</p>

            <div className="guest-actions">
              <button
                className="features-button"
                onClick={() => navigate("/feature", { state: { roomID: guest.RoomID, guestID: guest.GuestID } })}
              >
                Features
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  ))}
</div>


    {showFilterModal && (
        <div className="filter-modal">
            <h2>Filter Guests</h2>
            <label>First Name:</label>
            <input
                type="text"
                name="firstName"
                value={filters.firstName}
                onChange={handleFilterChange}
            />
            <label>Last Name:</label>
            <input
                type="text"
                name="lastName"
                value={filters.lastName}
                onChange={handleFilterChange}
            />
            <label>Phone Number:</label>
            <input
                type="text"
                name="phoneNumber"
                value={filters.phoneNumber}
                onChange={handleFilterChange}
            />
            <label>Email:</label>
            <input
                type="email"
                name="email"
                value={filters.email}
                onChange={handleFilterChange}
            />
            <label>Guest ID:</label>
            <input
                type="text"
                name="guestID"
                value={filters.guestID}
                onChange={handleFilterChange}
            />
            <label>From Date:</label>
            <input
                type="date"
                name="fromDate"
                value={filters.fromDate}
                onChange={handleFilterChange}
            />
            <label>To Date:</label>
            <input
                type="date"
                name="toDate"
                value={filters.toDate}
                onChange={handleFilterChange}
            />
            <div className="filter-actions">
                <button onClick={applyFilters}>Apply Filters</button>
                <button onClick={() => setShowFilterModal(false)}>Cancel</button>
            </div>
        </div>
    )}
</div>
</>

    );
};

export default CurrentGuests;

