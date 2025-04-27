import React, { useState } from "react";
import Axios from "axios";
import "./Popup.css"; // Reuse popup style

const AddHotelPopup = ({ closePopup, refreshHotels }) => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [starRating, setStarRating] = useState(3);
    const [location, setLocation] = useState({ city: "", state: "", zip: "", country: "" });
    const [hotelImage, setHotelImage] = useState(null);

    const handleFileChange = (e) => {
        setHotelImage(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('name', name);
        formData.append('description', description);
        formData.append('starRating', starRating);
        formData.append('location', JSON.stringify(location));
        formData.append('status', 'active');
        formData.append('hotelImage', hotelImage); // Image included

        try {
            await Axios.post("http://localhost:3001/add-hotel", formData);
            alert("Hotel added successfully!");
            closePopup();
            refreshHotels();
        } catch (err) {
            console.error(err);
            alert("Failed to add hotel.");
        }
    };

    return (
        <div className="popup-overlay">
            <div className="popup-content">
                <h2>Add New Hotel</h2>
                <form onSubmit={handleSubmit} className="popup-form">
                    <input type="text" placeholder="Hotel Name" value={name} onChange={(e) => setName(e.target.value)} required />
                    <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} required />
                    <input type="number" placeholder="Star Rating (1-5)" value={starRating} min="1" max="5" onChange={(e) => setStarRating(e.target.value)} required />

                    <input type="text" placeholder="City" value={location.city} onChange={(e) => setLocation({ ...location, city: e.target.value })} required />
                    <input type="text" placeholder="State" value={location.state} onChange={(e) => setLocation({ ...location, state: e.target.value })} required />
                    <input type="text" placeholder="ZIP Code" value={location.zip} onChange={(e) => setLocation({ ...location, zip: e.target.value })} required />
                    <input type="text" placeholder="Country" value={location.country} onChange={(e) => setLocation({ ...location, country: e.target.value })} required />

                    <input type="file" accept="image/*" onChange={handleFileChange} required />

                    {hotelImage && (
                        <img
                            src={URL.createObjectURL(hotelImage)}
                            alt="Preview"
                            className="hotel-image-preview"
                        />
                    )}

                    <div className="popup-buttons">
                        <button type="submit" className="save-button">Add Hotel</button>
                        <button type="button" className="cancel-button" onClick={closePopup}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddHotelPopup;
