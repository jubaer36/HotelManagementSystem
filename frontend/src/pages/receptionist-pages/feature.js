import React, { useState, useEffect } from "react";
import Axios from "axios";
import "./feature.css";
import { useLocation } from "react-router-dom";
import Navbar from "../../components/Navbar.js";

const Features = () => {
    const location = useLocation();
    const roomID = location.state?.roomID; // Access the roomID passed via state
    const guestID = location.state?.guestID;
    const [features, setFeatures] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showNewFeatureForm, setShowNewFeatureForm] = useState(false);
    const [newFeature, setNewFeature] = useState({
        featureName: "",
        description: "",
        additionalPrice: "",
    });

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


    const handleNewFeatureChange = (e) => {
        const { name, value } = e.target;
        setNewFeature((prevFeature) => ({
            ...prevFeature,
            [name]: value,
        }));
    };


    const handleAddNewFeature = () => {
        Axios.post("http://localhost:3001/add-feature", {
            roomID,
            guestID,
            ...newFeature,
        })
            .then(() => {
                alert("Feature added successfully!");
                setShowNewFeatureForm(false);
                fetchFeatures(); // Refresh features list
            })
            .catch((error) => {
                console.error("Error adding new feature:", error);
                alert("Failed to add feature.");
            });
    };

    if (loading) {
        return <p>Loading features...</p>;
    }

    if (features.length === 0) {
        return(
            <>
            <Navbar/>
            <div className="features-container">
                <div className="no-features-message">
                <h1>No Features Available</h1>
                <p>There are no features available for this room.</p>
                </div>

                <button
                className="new-feature-button"
                onClick={() => setShowNewFeatureForm(true)}
            >
                New Feature
            </button>
            {showNewFeatureForm && (
                <div className="new-feature-form">
                    <h2>Add New Feature</h2>
                    <label>Feature Name:</label>
                    <input
                        type="text"
                        name="featureName"
                        value={newFeature.featureName}
                        onChange={handleNewFeatureChange}
                    />
                    <label>Description:</label>
                    <textarea
                        name="description"
                        value={newFeature.description}
                        onChange={handleNewFeatureChange}
                    />
                    <label>Additional Price:</label>
                    <input
                        type="number"
                        name="additionalPrice"
                        value={newFeature.additionalPrice}
                        onChange={handleNewFeatureChange}
                    />
                    <div className="form-actions">
                        <button onClick={handleAddNewFeature}>Add Feature</button>
                        <button onClick={() => setShowNewFeatureForm(false)}>Cancel</button>
                    </div>
                </div>
            )}
            </div>
            </>
        )
    }

    return (
        <>
        <Navbar/>
        <div className="features-container">
            <h1>Room Features</h1>
            {/* <p>Features for Room ID: {roomID}</p> */}
            <button
                className="new-feature-button"
                onClick={() => setShowNewFeatureForm(true)}
            >
                New Feature
            </button>
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
            {showNewFeatureForm && (
                <div className="new-feature-form">
                    <h2>Add New Feature</h2>
                    <label>Feature Name:</label>
                    <input
                        type="text"
                        name="featureName"
                        value={newFeature.featureName}
                        onChange={handleNewFeatureChange}
                    />
                    <label>Description:</label>
                    <textarea
                        name="description"
                        value={newFeature.description}
                        onChange={handleNewFeatureChange}
                    />
                    <label>Additional Price:</label>
                    <input
                        type="number"
                        name="additionalPrice"
                        value={newFeature.additionalPrice}
                        onChange={handleNewFeatureChange}
                    />
                    <div className="form-actions">
                        <button onClick={handleAddNewFeature}>Add Feature</button>
                        <button onClick={() => setShowNewFeatureForm(false)}>Cancel</button>
                    </div>
                </div>
            )}
        </div>
        </>
    );
};

export default Features;
