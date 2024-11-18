import React from "react";
import { useState } from "react";
import Axios from "axios";

function Checkout(){
    const [bookingID, setBookingID] = useState("");
    const handleCheckout = () => {
        if (!bookingID) {
          alert("Please enter a BookingID.");
          return;
        }
    
        Axios.post("http://localhost:3001/manual-checkout", {bookingID})
            .then((response) => {
              alert(response.data); 
              setBookingID(""); 
            })
            .catch((error) => {
              console.error("Error during manual checkout:", error);
              const errorMessage =
                  error.response && error.response.data
                      ? error.response.data
                      : "Failed to process manual checkout. Please try again.";
              alert(errorMessage);
            });
      }
    
    return(
        <div>
          <h2>Manual Checkout</h2>
          <input
              type="text"
              placeholder="Enter BookingID"
              value={bookingID}
              onChange={(e) => setBookingID(e.target.value)}
          />
          <button onClick={handleCheckout}>Checkout</button>
        </div>
      
    );
}
export default Checkout;