import React from "react";
import "./BillingPopup.css";

const BillingPopup = ({ guest, onClose }) => {
  return (
    <div className="popup-overlay">
      <div className="popup-container">
        <h2>Billing Details</h2>
        <p><strong>Guest Name:</strong> {guest.FirstName} {guest.LastName}</p>
        <p><strong>Email:</strong> {guest.EmailAddress}</p>
        <p><strong>Phone Number:</strong> {guest.PhoneNumber}</p>
        <p><strong>NID:</strong> {guest.NID}</p>
        <p><strong>Date of Birth:</strong> {new Date(guest.DateOfBirth).toISOString().split("T")[0]}</p>
        <button className="close-popup-button" onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default BillingPopup;
