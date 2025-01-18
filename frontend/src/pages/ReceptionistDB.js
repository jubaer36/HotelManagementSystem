import React from "react";
import "./ReceptionistDB.css";
import {useNavigate} from "react-router-dom";

const DashBoard = () => {
    const navigate = useNavigate();

  return (
    <div className="dashboard-container">
      <h1>Receptionist Dashboard</h1>
      <div className="dashboard-buttons">
        <button className="dashboard-button" onClick={() => navigate("/receptionist")}>Book Rooms</button>
        <button className="dashboard-button" onClick={() => navigate("/checkout")}>Guest Info</button>
        <button className="dashboard-button" onClick={() => navigate("/real-checkout")}>Billing</button>
      </div>
    </div>
  );
};

export default DashBoard;
