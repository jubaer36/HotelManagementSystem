import React, { useState } from 'react';
import Axios from 'axios';
import "./Popup.css"
const AddRoomPopup = ({ closePopup, refreshRooms }) => {
    const hotelID = localStorage.getItem('hotelID');

    const [formData, setFormData] = useState({
        roomNumber: '',
        roomClassID: '', // will store id like 1, 2, 3
        maxOccupancy: '',
        basePrice: '',
        roomImage: null,
    });

    const [previewImage, setPreviewImage] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({ ...formData, roomImage: file });
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const handleClassChange = (e) => {
        const selectedClass = e.target.value;
        let classID = '';

        switch (selectedClass) {
            case 'Standard':
                classID = 1;
                break;
            case 'Suite':
                classID = 2;
                break;
            case 'Single':
                classID = 3;
                break;
            case 'Double':
                classID = 4;
                break;
            case 'Family':
                classID = 5;
                break;
            default:
                classID = '';
        }

        setFormData({ ...formData, roomClassID: classID });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const formPayload = new FormData();
            formPayload.append('hotelID', hotelID);
            formPayload.append('roomNumber', formData.roomNumber);
            formPayload.append('roomClassID', formData.roomClassID);
            formPayload.append('maxOccupancy', formData.maxOccupancy);
            formPayload.append('basePrice', formData.basePrice);
            formPayload.append('roomImage', formData.roomImage);

            await Axios.post('http://localhost:3001/add-room', formPayload, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            refreshRooms();
            closePopup();
        } catch (err) {
            console.error('Add Room Error:', err);
            alert('Failed to add room');
        }
    };

    return (
        <div className="popup-overlay">
            <div className="popup-content">
                <h2>Add New Room</h2>
                <form onSubmit={handleSubmit} className="popup-form">

                    <input
                        type="number"
                        name="roomNumber"
                        placeholder="Room Number"
                        value={formData.roomNumber}
                        onChange={handleChange}
                        required
                    />

                    {/* Class Type Dropdown */}
                    <select onChange={handleClassChange} required defaultValue="">
                        <option value="" disabled>Select Room Class</option>
                        <option value="Standard">Standard</option>
                        <option value="Suite">Suite</option>
                        <option value="Single">Single</option>
                        <option value="Double">Double</option>
                        <option value="Family">Family</option>
                    </select>

                    <input
                        type="number"
                        name="maxOccupancy"
                        placeholder="Max Occupancy"
                        value={formData.maxOccupancy}
                        onChange={handleChange}
                        required
                    />

                    <input
                        type="number"
                        step="0.01"
                        name="basePrice"
                        placeholder="Base Price"
                        value={formData.basePrice}
                        onChange={handleChange}
                        required
                    />

                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        required
                    />

                    {previewImage && (
                        <img
                            src={previewImage}
                            alt="Room Preview"
                            className="popup-preview-image"
                        />
                    )}

                    <div className="popup-buttons">
                        <button type="submit" className="submit-button">Add Room</button>
                        <button type="button" className="cancel-button" onClick={closePopup}>Cancel</button>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default AddRoomPopup;
