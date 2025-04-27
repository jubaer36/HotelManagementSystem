import React, { useState, useEffect } from "react";
import Axios from "axios";
import EditRoomPopup from "../../components/EditRoomPopup";
import AddRoomPopup from "../../components/AddRoomPopUp";
import Navbar from "../../components/Navbar"; // ✅ IMPORT NAVBAR
import "./Rooms.css";

const Rooms = () => {
    const [rooms, setRooms] = useState([]);
    const [showEditPopup, setShowEditPopup] = useState(false);
    const [showAddPopup, setShowAddPopup] = useState(false);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const hotelID = localStorage.getItem("hotelID");

    useEffect(() => {
        if (!hotelID) {
            console.error("No hotelID found in localStorage");
            return;
        }
        fetchRooms();
    }, [hotelID]);

    const fetchRooms = () => {
        Axios.get(`http://localhost:3001/get-available-rooms/${hotelID}`)
            .then((response) => {
                setRooms(response.data);
            })
            .catch((error) => {
                console.error("Error fetching rooms:", error);
                alert("Failed to fetch available rooms.");
            });
    };

    const handleEditClick = (room) => {
        setSelectedRoom(room);
        setShowEditPopup(true);
    };

    const handleAddRoomClick = () => {
        setShowAddPopup(true);
    };

    return (
        <div className="rooms-page">

            <div className="roomnav">
            <Navbar /> {/* ✅ NAVBAR placed at the very top */}
            </div>

            <div className="rooms-container">
                <h2>Available Rooms</h2>

                <button className="add-room-button" onClick={handleAddRoomClick}>➕ Add Room</button>

                {rooms.length > 0 ? (
                    <div className="room-cards">
                        {rooms.map((room) => (
                            <div key={room.RoomID} className="room-card">
                                <div className="room-details">
                                    <h3>Room {room.RoomNumber}</h3>
                                    <p><strong>Class Type:</strong> {room.ClassType}</p>
                                    <p><strong>Price:</strong> ${room.BasePrice} per night</p>
                                    <p><strong>Capacity:</strong> {room.MaxOccupancy} guests</p>
                                    <button className="edit-room-button" onClick={() => handleEditClick(room)}>Edit</button>
                                </div>

                                <div className="room-image">
                                    {room.RoomImage ? (
                                        <img
                                            src={`data:image/jpeg;base64,${room.RoomImage}`}
                                            alt="Room"
                                            className="room-image-preview"
                                        />
                                    ) : (
                                        <div className="no-image">No Image</div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>No available rooms at the moment.</p>
                )}

                {showEditPopup && selectedRoom && (
                    <EditRoomPopup
                        room={selectedRoom}
                        closePopup={() => setShowEditPopup(false)}
                        refreshRooms={fetchRooms}
                    />
                )}

                {showAddPopup && (
                    <AddRoomPopup
                        closePopup={() => setShowAddPopup(false)}
                        refreshRooms={fetchRooms}
                    />
                )}
            </div>
        </div>
    );
};

export default Rooms;
