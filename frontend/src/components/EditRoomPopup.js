import React, { useState, useEffect } from "react";
import Axios from "axios";
import "./EditRoomPopup.css";

const EditRoomPopup = ({ room, closePopup, refreshRooms }) => {
    const [roomClasses, setRoomClasses] = useState([]);
    const [selectedClass, setSelectedClass] = useState(room.RoomClassID);
    const [basePrice, setBasePrice] = useState(room.BasePrice);
    const [maxOccupancy, setMaxOccupancy] = useState(room.MaxOccupancy);

    useEffect(() => {
        Axios.get("http://localhost:3001/get-room-classes")
            .then((response) => setRoomClasses(response.data))
            .catch((error) => console.error("Error fetching room classes:", error));
    }, []);

    const handleUpdateRoom = () => {
        Axios.put(`http://localhost:3001/update-room/${room.RoomID}`, {
            classTypeID: selectedClass,
            basePrice,
            maxOccupancy
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

                <button onClick={handleUpdateRoom}>Save Changes</button>
                <button onClick={closePopup}>Cancel</button>
            </div>
        </div>
    );
};

export default EditRoomPopup;
