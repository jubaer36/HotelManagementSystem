import React, { useState, useEffect } from "react";
import Axios from "axios";
import "./Rooms.css";

const Rooms = () => {
    const [rooms, setRooms] = useState([]);
    const hotelID = localStorage.getItem("hotelID");

    useEffect(() => {
        if (!hotelID) {
            console.error("No hotelID found in localStorage");
            return;
        }

        Axios.get(`http://localhost:3001/get-available-rooms/${hotelID}`)
            .then((response) => {
                setRooms(response.data);
            })
            .catch((error) => {
                console.error("Error fetching rooms:", error);
                alert("Failed to fetch available rooms.");
            });
    }, [hotelID]);

    return (
        <div className="rooms-container">
            <h2>Available Rooms</h2>
            {rooms.length > 0 ? (
                <div className="room-cards">
                    {rooms.map((room) => (
                        <div key={room.RoomID} className="room-card">
                            <h3>Room {room.RoomNumber}</h3>
                            <p><strong>Class Type:</strong> {room.ClassType}</p>
                            <p><strong>Price:</strong> ${room.BasePrice} per night</p>
                            <p><strong>Capacity:</strong> {room.MaxOccupancy} guests</p>
                        </div>
                    ))}
                </div>
            ) : (
                <p>No available rooms at the moment.</p>
            )}
        </div>
    );
};

export default Rooms;
