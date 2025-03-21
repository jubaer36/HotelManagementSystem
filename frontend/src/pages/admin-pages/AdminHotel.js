import React, { useState, useEffect } from "react";
import Axios from "axios";
import AddHotelPopup from "../../components/AddHotelPopup";
import "./AdminHotel.css";

const AdminHotel = () => {
    const [hotels, setHotels] = useState([]);
    const [showPopup, setShowPopup] = useState(false);

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
            <button className="add-hotel-button" onClick={() => setShowPopup(true)}>Add Hotels</button>
            <h2>Hotel List</h2>
            <div className="hotel-cards">
                {hotels.map((hotel) => (
                    <div key={hotel.HotelID} className="hotel-card">
                        <h3>{hotel.Name}</h3> 
                        <p><strong>Address:</strong> {hotel.Location.city}, {hotel.Location.state}, {hotel.Location.zip}, {hotel.Location.country}</p>
                        <p><strong>Description:</strong> {hotel.Description}</p>
                        <p><strong>Rating:</strong> {hotel.StarRating}</p>
                        <button className="edit-hotel-button">Edit</button>
                        <button className="delete-hotel-button">Delete</button>
                    </div>
                ))}
            </div>
            
            {showPopup && <AddHotelPopup closePopup={() => setShowPopup(false)} refreshHotels={fetchHotels} />}
        </div>
    );
};

export default AdminHotel;
