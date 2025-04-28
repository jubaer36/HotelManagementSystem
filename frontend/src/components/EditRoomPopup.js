import React, { useState, useEffect } from "react";
import Axios from "axios";
import "./EditRoomPopup.css";

const EditRoomPopup = ({ room, closePopup, refreshRooms }) => {
    const [roomClasses, setRoomClasses] = useState([]);
    const [selectedClass, setSelectedClass] = useState(room.RoomClassID);
    const [basePrice, setBasePrice] = useState(room.BasePrice);
    const [maxOccupancy, setMaxOccupancy] = useState(room.MaxOccupancy);
    const [roomImage, setRoomImage] = useState(null); // State to hold the room image

    useEffect(() => {
        Axios.get("http://localhost:3001/get-room-classes")
            .then((response) => setRoomClasses(response.data))
            .catch((error) => console.error("Error fetching room classes:", error));
    }, []);

    const handleImageChange = (e) => {
        const file = e.target.files[0]; // Get the selected image file
        if (file) {
            setRoomImage(file); // Store the selected image
        }
    };

    const handleUpdateRoom = () => {
        const formData = new FormData();
        formData.append("classTypeID", selectedClass);
        formData.append("basePrice", basePrice);
        formData.append("maxOccupancy", maxOccupancy);
        if (roomImage) {
            formData.append("roomImage", roomImage); // Append the room image
        }

        Axios.put(`http://localhost:3001/update-room/${room.RoomID}`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        })
            .then(() => {
                alert("Room updated successfully!");
                closePopup();
                refreshRooms();
            })
            .catch((error) => {
                console.error("Error updating room:", error);
                alert("Failed to update room.");
            });
    };

    return (
        <div className="popup-overlay">
            <div className="popup-content">
                <h2>Edit Room {room.RoomNumber}</h2>
                <label>Room Class:</label>
                <select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)}>
                    {roomClasses.map((roomClass) => (
                        <option key={roomClass.RoomClassID} value={roomClass.RoomClassID}>
                            {roomClass.ClassType}
                        </option>
                    ))}
                </select>

                <label>Base Price:</label>
                <input type="number" value={basePrice} onChange={(e) => setBasePrice(e.target.value)} />

                <label>Max Occupancy:</label>
                <input type="number" value={maxOccupancy} onChange={(e) => setMaxOccupancy(e.target.value)} />

                {/* Image input field */}
                <label>Room Image:</label>
                <input type="file" onChange={handleImageChange} />

                <button onClick={handleUpdateRoom}>Save Changes</button>
                <button onClick={closePopup}>Cancel</button>
            </div>
        </div>
    );
};

export default EditRoomPopup;
