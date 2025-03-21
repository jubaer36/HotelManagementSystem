import React, { useState, useEffect } from "react";
import Axios from "axios";
import AddHotelPopup from "../../components/AddHotelPopup";
import DeleteConfirmationPopup from "../../components/DeleteConfirmationPopup";
import "./AdminHotel.css";

const AdminHotel = () => {
    const [hotels, setHotels] = useState([]);
    const [showAddPopup, setShowAddPopup] = useState(false);
    const [showDeletePopup, setShowDeletePopup] = useState(false);
    const [selectedHotel, setSelectedHotel] = useState(null);

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

    const handleDeleteClick = (hotel) => {
        setSelectedHotel(hotel);
        setShowDeletePopup(true);
    };

    const confirmDeleteHotel = () => {
        if (!selectedHotel) return;

        Axios.put(`http://localhost:3001/deactivate-hotel/${selectedHotel.HotelID}`)
            .then(() => {
                alert(`${selectedHotel.Name} has been deactivated.`);
                setShowDeletePopup(false);
                fetchHotels(); // Refresh hotel list
            })
            .catch((error) => {
                console.error("Error deactivating hotel:", error);
                alert("Failed to deactivate hotel.");
            });
    };

    return (
        <div className="hotel-container">
            <button className="add-hotel-button" onClick={() => setShowAddPopup(true)}>Add Hotels</button>
            <h2>Hotel List</h2>
            <div className="hotel-cards">
                {hotels.map((hotel) => (
                    <div key={hotel.HotelID} className={`hotel-card ${hotel.Status === 'inactive' ? 'inactive' : ''}`}>
                        <h3>{hotel.Name}</h3> 
                        <p><strong>Address:</strong> {hotel.Location.city}, {hotel.Location.state}, {hotel.Location.zip}, {hotel.Location.country}</p>
                        <p><strong>Description:</strong> {hotel.Description}</p>
                        <p><strong>Rating:</strong> {hotel.StarRating}</p>
                        <p><strong>Status:</strong> {hotel.Status}</p>
                        <button className="edit-hotel-button">Edit</button>
                        {hotel.Status === "active" && (
                            <button className="delete-hotel-button" onClick={() => handleDeleteClick(hotel)}>Delete</button>
                        )}
                    </div>
                ))}
            </div>
            
            {showAddPopup && <AddHotelPopup closePopup={() => setShowAddPopup(false)} refreshHotels={fetchHotels} />}
            {showDeletePopup && selectedHotel && (
                <DeleteConfirmationPopup 
                    hotelName={selectedHotel.Name}
                    onConfirm={confirmDeleteHotel}
                    onCancel={() => setShowDeletePopup(false)}
                />
            )}
        </div>
    );
};

export default AdminHotel;
