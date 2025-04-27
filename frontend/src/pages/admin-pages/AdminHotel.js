import React, { useState, useEffect } from "react";
import Axios from "axios";
import Navbar from "../../components/Navbar"; // ✅ Add your Navbar
import AddHotelPopup from "../../components/AddHotelPopup";
import DeleteConfirmationPopup from "../../components/DeleteConfirmationPopup";
import EditHotelPopup from "../../components/EditHotelPopup";
import "./AdminHotel.css";

const AdminHotel = () => {
    const [hotels, setHotels] = useState([]);
    const [showAddPopup, setShowAddPopup] = useState(false);
    const [showDeletePopup, setShowDeletePopup] = useState(false);
    const [showEditPopup, setShowEditPopup] = useState(false);
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

    const handleEditClick = (hotel) => {
        setSelectedHotel(hotel);
        setShowEditPopup(true);
    };

    return (
        <div className="hotel-container">
            <Navbar /> {/* ✅ Navbar at the very top */}

            <div className="hotel-header">
                <h2>Hotel List</h2>
                <button className="add-hotel-button" onClick={() => setShowAddPopup(true)}>➕ Add Hotel</button>
            </div>

            <div className="hotel-cards">
                {hotels.map((hotel) => (
                    <div key={hotel.HotelID} className={`hotel-card ${hotel.Status === 'inactive' ? 'inactive' : ''}`}>
                        <div className="hotel-image">
                            {hotel.HotelImage ? (
                                <img
                                    src={`data:image/jpeg;base64,${hotel.HotelImage}`}
                                    alt="Hotel"
                                    className="hotel-image-preview"
                                />
                            ) : (
                                <div className="no-image">No Image</div>
                            )}
                        </div>

                        <div className="hotel-info">
                            <h3>{hotel.Name}</h3>
                            <p><strong>Location:</strong> {hotel.Location?.city}, {hotel.Location?.country}</p>
                            <p><strong>Description:</strong> {hotel.Description}</p>
                            <p><strong>Rating:</strong> {"★".repeat(hotel.StarRating)}</p>
                            <p><strong>Status:</strong> {hotel.Status}</p>

                            <button className="edit-hotel-button" onClick={() => handleEditClick(hotel)}>Edit</button>
                            {hotel.Status === "active" && (
                                <button className="delete-hotel-button" onClick={() => handleDeleteClick(hotel)}>Delete</button>
                            )}
                        </div>
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
            {showEditPopup && selectedHotel && (
                <EditHotelPopup
                    hotel={selectedHotel}
                    closePopup={() => setShowEditPopup(false)}
                    refreshHotels={fetchHotels}
                />
            )}
        </div>
    );
};

export default AdminHotel;
