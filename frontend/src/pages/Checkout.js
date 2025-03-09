import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Axios from "axios";
import "./Checkout.css";


const CurrentGuests = () => {
    const dummyHID = 1;
    const navigate = useNavigate();


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
        Axios.post("http://localhost:3001/current-guests",{
            hotelID : dummyHID,
        })
            .then((response) => {
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

        Axios.post("http://localhost:3001/extend-visit", {
            guestID: selectedGuest.GuestID,
            newCheckoutDate,
        })
            .then(() => {
                alert("Checkout date updated successfully.");
                setShowPopup(false);
                fetchGuests();
            })
            .catch((error) => {
                console.error("Error extending visit:", error);
                alert("Failed to extend visit.");
            });
    };

    // const handleCheckout = (guestID) => {
    //     Axios.post("http://localhost:3001/checkout", { guestID })
    //         .then(() => {
    //             alert("Guest checked out successfully.");
    //             fetchGuests();
    //         })
    //         .catch((error) => {
    //             console.error("Error during checkout:", error);
    //             alert("Failed to process checkout.");
    //         });
    // };

    // const handleFeatures = (roomID) => {
    //     Axios.post("http://localhost:3001/features", { 
    //         roomID: roomID, 
    //     })
    //         .then(() => {
    //             // alert("Guest checked out successfully.");
    //             // fetchGuests();
    //         })
    //         .catch((error) => {
    //             // console.error("Error during checkout:", error);
    //             // alert("Failed to process checkout.");
    //         });
    // }

    if (loading) {
        return <p>Loading...</p>;
    }

    if (guests.length === 0) {
        return(
            <div className="current-guests-container">
            <button className="filter-guests-button" onClick={() => setShowFilterModal(true)}>
                Filter Guests
            </button>
            <button className="show-current-guest-button" onClick={()=>fetchGuests()}>
                Current Guests
            </button>
            <p>No Guests Found</p>;
            </div>
        ) 
    }

    return (
        <div className="current-guests-container">
            <button className="filter-guests-button" onClick={() => setShowFilterModal(true)}>
                Filter Guests
            </button>
            <button className="show-current-guest-button" onClick={()=>fetchGuests()}>
                Current Guests
            </button>
            <div className="guest-cards">
                {guests.map((guest, index) => (
                    <div className="guest-card" key={index}>
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
                        <div className="guest-actions">
                            {/* <button className="extend-visit-button" onClick={() => handleExtendVisit(guest)}>
                                Extend Visit
                            </button> */}
                            <button
                               className="features-button"
                                   onClick={() => navigate("/feature", { state: { roomID: guest.RoomID, guestID: guest.GuestID } })}>
                                    Features
                            </button>

                        </div>
                    </div>
                ))}
            </div>

            {showPopup && (
                <div className="popup">
                    <h2>
                        Extend Visit for {selectedGuest?.FirstName} {selectedGuest?.LastName}
                    </h2>
                    <label>New Checkout Date:</label>
                    <input
                        type="date"
                        value={newCheckoutDate}
                        onChange={(e) => setNewCheckoutDate(e.target.value)}
                    />
                    <div className="popup-actions">
                        <button onClick={handleConfirmExtendVisit}>Confirm</button>
                        <button onClick={() => setShowPopup(false)}>Cancel</button>
                    </div>
                </div>
            )}

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
    );
};

export default CurrentGuests;

