import React, { useState } from "react";
import Axios from "axios";
import "./AddHotelPopup.css";

const AddHotelPopup = ({ closePopup, refreshHotels }) => {
    const [hotelData, setHotelData] = useState({
        name: "",
        description: "",
        starRating: 1,
        location: { city: "", state: "", zip: "", country: "" },
        status: "active", // Default value
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.startsWith("location.")) {
            const locationField = name.split(".")[1];
            setHotelData((prevData) => ({
                ...prevData,
                location: { ...prevData.location, [locationField]: value },
            }));
        } else {
            setHotelData({ ...hotelData, [name]: value });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        Axios.post("http://localhost:3001/add-hotel", hotelData)
            .then(() => {
                alert("Hotel added successfully!");
                refreshHotels();
                closePopup();
            })
            .catch((error) => {
                console.error("Error adding hotel:", error);
                alert("Failed to add hotel.");
            });
    };

    return (
        <div className="popup-overlay">
            <div className="popup-content">
                <h2>Add New Hotel</h2>
                <form onSubmit={handleSubmit}>
                    <input type="text" name="name" placeholder="Hotel Name" value={hotelData.name} onChange={handleChange} required />
                    <textarea name="description" placeholder="Description" value={hotelData.description} onChange={handleChange} required />
                    <input type="number" name="starRating" min="1" max="5" placeholder="Star Rating" value={hotelData.starRating} onChange={handleChange} required />
                    
                    <h4>Location</h4>
                    <input type="text" name="location.city" placeholder="City" value={hotelData.location.city} onChange={handleChange} required />
                    <input type="text" name="location.state" placeholder="State" value={hotelData.location.state} onChange={handleChange} required />
                    <input type="text" name="location.zip" placeholder="ZIP Code" value={hotelData.location.zip} onChange={handleChange} required />
                    <input type="text" name="location.country" placeholder="Country" value={hotelData.location.country} onChange={handleChange} required />

                    {/* <h4>Status</h4>
                    <select name="status" value={hotelData.status} onChange={handleChange}>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select> */}

                    <button type="submit" className="submit-button">Add Hotel</button>
                    <button type="button" className="cancel-button" onClick={closePopup}>Cancel</button>
                </form>
            </div>
        </div>
    );
};

export default AddHotelPopup;
