import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "./HotelList.css"
import Navbar from "../../components/Navbar";
const HotelList = () => {
    const [hotels, setHotels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();



    useEffect(() => {
        const fetchHotels = async () => {
            try {
                const response = await fetch('http://localhost:3001/get-hotels', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch hotels');
                }

                const data = await response.json();
                setHotels(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchHotels();
    }, []);

    if (loading) return <div className="loading">Loading hotels...</div>;
    if (error) return <div className="error">Error: {error}</div>;

    return (
        <div className="hotel-list-container">
            <Navbar/>
            <h2 className="hotel-list-title">Select a Hotel</h2>
            <div className="hotel-cards-grid">
                {hotels.map((hotel) => (
                    <div
                        key={hotel.HotelID}
                        className="hotel-card"
                        onClick={() => navigate(`/financial-report/${hotel.HotelID}`)}
                    >
                        {hotel.HotelImage ? (
                            <img
                                src={`data:image/jpeg;base64,${hotel.HotelImage}`}
                                alt={hotel.Name}
                                className="hotel-card-image"
                            />
                        ) : (
                            <div className="hotel-card-noimage">No Image</div>
                        )}
                        <h3 className="hotel-card-name">{hotel.Name}</h3>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HotelList;
