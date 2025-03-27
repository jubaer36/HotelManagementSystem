// Updated HotelList.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


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
                console.log('Received hotel data:', data); // Add for debugging
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
        <div className="container">
            <h2>Select a Hotel for Financial Report</h2>
            <div className="hotel-grid">
                {hotels.map(hotel => (
                    <div
                        key={hotel.HotelID}
                        className="hotel-card"
                        onClick={() => navigate(`/financial-report/${hotel.HotelID}`)}
                    >
                        <h3>{hotel.Name}</h3>
                        {/* Fixed Location parsing */}
                        <p>Location: {hotel.Location?.address || 'No location available'}</p>
                        <p>Rating: {'★'.repeat(hotel.StarRating)}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HotelList;