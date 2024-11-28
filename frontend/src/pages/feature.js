import React, { useState, useEffect } from "react";
import Axios from "axios";
import "./feature.css";

import { useLocation } from "react-router-dom";

const Features = () => {
    const location = useLocation();
    const roomID = location.state?.roomID; // Access the roomID passed via state
    const guestID = location.state?.guestID;

    useEffect(() => {
        if (roomID) {
            console.log("Room ID received:", roomID);
            console.log("guestID is :", guestID);
            // You can now use roomID to fetch or display features
        } else {
            console.log("No Room ID provided");
        }
        handleFeatures();
    }, []);


    
    const handleFeatures = () => {
        Axios.post("http://localhost:3001/features", { 
            roomID: roomID, 
        })
            .then(() => {
                // alert("Guest checked out successfully.");
                // fetchGuests();
            })
            .catch((error) => {
                // console.error("Error during checkout:", error);
                // alert("Failed to process checkout.");
            });
    }

    return (
        <div>
            <h1>Room Features</h1>
            {roomID ? <p>Features for Room ID: {roomID}</p> : <p>No Room ID provided</p>}
        </div>
    );
};

export default Features;