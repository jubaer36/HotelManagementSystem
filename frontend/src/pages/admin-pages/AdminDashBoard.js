import React from "react";
import "./AdminDashBoard.css";
import {useNavigate} from "react-router-dom";

const AdminDashBoard = () => {
    const navigate = useNavigate();

    return (
        <>
        <div className="dashboard-container">
            <h1>Admin Dashboard</h1>
            <div className="dashboard-buttons">
                <button className="dashboard-button" onClick={() => navigate("/update-managers")}>Managers</button>
                <button className="dashboard-button" onClick={() => navigate("/all-expenses")}>Expenses</button>
                <button className="dashboard-button" onClick={() => navigate("/update-hotels")}>Hotels</button>
            </div>
        </div>
        </>
    );
};

export default AdminDashBoard;