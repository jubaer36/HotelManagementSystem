import React, { useState, useEffect } from "react";
import Axios from "axios";
import "./feature.css";
import { useLocation } from "react-router-dom";

const Features = () => {
    const location = useLocation();
    const roomID = location.state?.roomID; // Access the roomID passed via state
    const guestID = location.state?.guestID;
    const [features, setFeatures] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (roomID && guestID) {
            fetchFeatures();
        }
    }, [roomID, guestID]);

    const fetchFeatures = () => {
        Axios.post("http://localhost:3001/features", {
            roomID,
            guestID,
        })
            .then((response) => {
                setFeatures(response.data); // Set all fetched features
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching features:", error);
                alert("Failed to fetch features.");
                setLoading(false);
            });
    };

    if (loading) {
        return <p>Loading features...</p>;
    }

    if (features.length === 0) {
        return <p>No features available for this room and guest.</p>;
    }

    return (
        <div className="features-container">
            <h1>Room Features</h1>
            {/* <p>Features for Room ID: {roomID}</p> */}
            <div className="features-cards">
                {features.map((feature) => (
                    <div className="feature-card" key={feature.FeatureID}>
                        <h3>{feature.FeatureName}</h3>
                        <p>{feature.Description}</p>
                        <p>
                            <strong>Additional Price:</strong> $
                            {feature.FeatureAdditionalPrice}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Features;
