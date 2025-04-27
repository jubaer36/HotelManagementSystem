import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Axios from "axios";
import "./RealCheckout.css"
import BillingPopup from "../../components/BillingPopup";
import Navbar from "../../components/Navbar.js";


const CurrentGuests = () =>{

    const dummyHID = localStorage.getItem("hotelID");   
    const navigate = useNavigate();

    const [guests, setGuests] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const [showPopupEX, setShowPopupEX] = useState(false);
    const [selectedGuest, setSelectedGuest] = useState(null);
    const [showFilterModal, setShowFilterModal] = useState(false);
    const [newCheckoutDate, setNewCheckoutDate] = useState("");
    const [minCheckOut, setMinCheckOut] = useState("");

    const [filters, setFilters] = useState({
        FirstName: "",
        LastName: "",
        EmailAddress: "",
        PhoneNumber: "",
        NID: "",
        DateOfBirth: "",
    });
    
    useEffect(()=>{
        fetchGuests();
    }, []);

    const fetchGuests = () => {
        Axios.post("http://localhost:3001/checkout-today",{
            hotelID: dummyHID,
        })
            .then((response)=>{
                setGuests(response.data);
            })
            .catch((error)=>{
                console.error("Error fetching current checkout");
            })
    };

    const applyFilters = () =>{
        Axios.post("http://localhost:3001/filter-checkout",{
            FirstName: filters.FirstName,
            LastName: filters.LastName,
            PhoneNumber: filters.PhoneNumber,
            EmailAddress: filters.EmailAddress,
            NID: filters.NID,
            DateOfBirth: filters.DateOfBirth,
            HotelID: dummyHID, 
        })
            .then((response)=>{
                setGuests(response.data);
                setShowFilterModal(false);
            })
            .catch((error)=>{
                console.error("Error while filtering checkout: ", error);
                alert("Failed to apply filters");
            });
    };

    const handleFilterChange = (e) =>{
        const {name, value} = e.target;
        setFilters((prevFilter)=>({
            ...prevFilter,
            [name]: value,
        }));
    };

    const handleExtendVisit = (guest) => {
        const formattedDate = new Date(guest.CheckOutDate).toISOString().split("T")[0];
        setSelectedGuest(guest);
        setMinCheckOut(formattedDate);
        setShowPopupEX(true);
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

    const openBillingPopup = (guest) => {
        setSelectedGuest(guest);
        setShowPopup(true);
      };
    
      const closeBillingPopup = () => {
        setShowPopup(false);
        setSelectedGuest(null);
      };


   

    return (
        <div className="realcheckout-container">
          <Navbar />
          <div className="realcheckout-content-wrapper">
            <h1>Guests Checking Out Today</h1>
      
            <div className="realcheckout-header-section">
              <button className="realcheckout-add-button" onClick={() => setShowFilterModal(true)}>
                Filter Guests
              </button>
            </div>
      
            <div className="realcheckout-table-container">
              <table>
                <thead>
                  <tr>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>NID</th>
                    <th>Date of Birth</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {guests.map((guest, index) => (
                    <tr key={index}>
                      <td>{guest.FirstName}</td>
                      <td>{guest.LastName}</td>
                      <td>{guest.EmailAddress}</td>
                      <td>{guest.PhoneNumber}</td>
                      <td>{guest.NID}</td>
                      <td>{new Date(guest.DateOfBirth).toISOString().split("T")[0]}</td>
                      <td className="realcheckout-action-buttons">
                        <button
                          className="realcheckout-billing-button"
                          onClick={() => openBillingPopup(guest)}
                        >
                          Billing
                        </button>
                        {/* <button
                          className="realcheckout-extend-button"
                          onClick={() => handleExtendVisit(guest)}
                        >
                          Extend
                        </button> */}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
      
            {showPopupEX && (
              <div className="realcheckout-popup">
                <h2>
                  Extend Visit for {selectedGuest?.FirstName} {selectedGuest?.LastName}
                </h2>
                <label>New Checkout Date:</label>
                <input
                  type="date"
                  value={newCheckoutDate}
                  onChange={(e) => setNewCheckoutDate(e.target.value)}
                  min={minCheckOut}
                />
                <div className="realcheckout-popup-actions">
                  <button onClick={handleConfirmExtendVisit}>Confirm</button>
                  <button onClick={() => setShowPopupEX(false)}>Cancel</button>
                </div>
              </div>
            )}
      
            {showFilterModal && (
              <div className="realcheckout-filter-modal">
                {/* <h3>Filter Guests</h3> */}
                <label>First Name:</label>
                <input
                  type="text"
                  name="FirstName"
                  value={filters.FirstName}
                  onChange={handleFilterChange}
                />
                <label>Last Name:</label>
                <input
                  type="text"
                  name="LastName"
                  value={filters.LastName}
                  onChange={handleFilterChange}
                />
                <label>Email:</label>
                <input
                  type="text"
                  name="EmailAddress"
                  value={filters.EmailAddress}
                  onChange={handleFilterChange}
                />
                <label>Phone:</label>
                <input
                  type="text"
                  name="PhoneNumber"
                  value={filters.PhoneNumber}
                  onChange={handleFilterChange}
                />
                <label>NID:</label>
                <input
                  type="text"
                  name="NID"
                  value={filters.NID}
                  onChange={handleFilterChange}
                />
                <label>Date Of Birth:</label>
                <input
                  type="date"
                  name="DateOfBirth"
                  value={filters.DateOfBirth}
                  onChange={handleFilterChange}
                />
                <div className="realcheckout-filter-actions">
                  <button onClick={applyFilters}>Apply</button>
                  <button onClick={() => setShowFilterModal(false)}>Cancel</button>
                </div>
              </div>
            )}
      
            {showPopup && selectedGuest && (
              <BillingPopup guest={selectedGuest} onClose={closeBillingPopup} />
            )}
          </div>
        </div>
      );      
      
};

export default CurrentGuests;

