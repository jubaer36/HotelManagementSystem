import React, { useState, useEffect } from "react";
import Axios from "axios";
import "./BillingPopup.css";

const BillingPopup = ({ guest, onClose }) => {
  const [billingDetails, setBillingDetails] = useState({
    TotalBooking: 0,
    PaymentStatus: "",
    RoomTotal: 0,
    FeatureTotal: 0,
    AmountToBePaid: 0,
  });
  const [loading, setLoading] = useState(true);
  const [isPaid, setIsPaid] = useState(false);

  useEffect(() => {
    fetchBillingDetails();
  }, []);

  const fetchBillingDetails = () => {
    Axios.post("http://localhost:3001/billing-details", { guestID: guest.GuestID })
      .then((response) => {
        setBillingDetails(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching billing details:", error);
        setLoading(false);
      });
  };

  const changePaymentStatus = () =>{
    Axios.post("http://localhost:3001/payment-done",{guestID: guest.GuestID, amount: billingDetails.AmountToBePaid})
    .then((response)=>{
      console.log(response.data);
      setLoading(false);

      setBillingDetails((prevDetails)=>({
        ...prevDetails,
        PaymentStatus : 'Paid',
      }));
      setIsPaid (true);

    })
    .catch((error)=>{
      setLoading(false);

    });
  };

  const handleClose = () =>{
    window.location.reload();
  }

  return (
    <div className="popup-overlay">
      <div className="popup-container">
        <h2>Billing Details</h2>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            <p>
              <strong>Guest Name:</strong> {guest.FirstName} {guest.LastName}
            </p>
            <p>
              <strong>Paid Amount:</strong> ${billingDetails.TotalBooking.toFixed(2)}
            </p>
            <p>
              <strong>Room Charges:</strong> ${billingDetails.RoomTotal.toFixed(2)}
            </p>
            <p>
              <strong>Feature Charges:</strong> ${billingDetails.FeatureTotal.toFixed(2)}
            </p>
            <p>
              <strong>Amount To Be Paid:</strong> ${billingDetails.AmountToBePaid.toFixed(2)}
            </p>
            <p>
              <strong>Payment Status:</strong> {billingDetails.PaymentStatus}
            </p>
          </>
        )}
        {!isPaid && (<button className="close-popup-button" onClick={changePaymentStatus}>
          Paid
        </button>)}
        <button className="close-popup-button" onClick={handleClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default BillingPopup;
