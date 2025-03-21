import React, { useState, useEffect } from "react";
import Axios from "axios";
import "./AdminHotel.css";

const AdminHotel = () => {
    const [hotels, setHotels] = useState([]);

    useEffect(() => {
        fetchHotels();
    }, []);

    const fetchHotels = () => {
        Axios.get("http://localhost:3001/get-hotels")
            .then((response) => {
                setHotels(response.data);
            })
            .catch((error) => {
                console.error("Error fetching hotels:", error);
                alert("Failed to fetch hotels.");
            });
    };

    return (
        <div className="hotel-container">
            <button className="add-hotel-button">Add Hotels</button>
            <h2>Hotel List</h2>
            <div className="hotel-cards">
                {hotels.map((hotel) => (
                    <div key={hotel.HotelID} className="hotel-card">
                        <h3>{hotel.Name}</h3> {/* Fixed Name */}
                        <p><strong>Address:</strong> {hotel.Location.city}, {hotel.Location.state}, {hotel.Location.zip}, {hotel.Location.country}</p> {/* Fixed Location */}
                        <p><strong>Description:</strong>{hotel.Description}</p>
                        <p><strong>Rating:</strong>{hotel.StarRating}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminHotel;
