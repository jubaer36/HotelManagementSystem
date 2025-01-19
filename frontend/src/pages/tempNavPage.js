import React from "react";
import "./tempNavPage.css";
import {useNavigate} from "react-router-dom";

const TempPage = () => {
const navigate = useNavigate();

  return (
    <div className="container">
      <h1>Welcome</h1>
      <div className="button-container">
        <button className="role-button" onClick={() => navigate("/rp-dashboard")}>Receptionist</button>
        <button className="role-button" onClick={() => navigate("/manager-dashboard")}>Manager</button>
      </div>
    </div>
  );
};

export default TempPage;
