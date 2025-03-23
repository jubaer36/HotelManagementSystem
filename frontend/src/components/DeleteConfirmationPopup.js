import React from "react";
import "./DeleteConfirmationPopup.css";

const DeleteConfirmationPopup = ({ hotelName, onConfirm, onCancel }) => {
    return (
        <div className="popup-overlay">
            <div className="popup-content">
                <h2>Confirm Deactivation</h2>
                <p>Are you sure you want to deactivate <strong>{hotelName}</strong>?</p>
                <div className="popup-buttons">
                    <button className="confirm-button" onClick={onConfirm}>Confirm</button>
                    <button className="cancel-button" onClick={onCancel}>Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default DeleteConfirmationPopup;
