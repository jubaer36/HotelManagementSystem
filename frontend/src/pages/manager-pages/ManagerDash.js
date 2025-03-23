import React from "react";
import { useNavigate } from "react-router-dom";
import "./ManagerDash.css";

const Dashboard = () => {
    const navigate = useNavigate();

    return (
        <div className="dashboard-container">
            <h1>Manager Dashboard</h1>
            <div className="button-container">
                <button className="dashboard-button" onClick={() => navigate("/employee-info")}>
                    Employee Info
                </button>
                {/* <button className="dashboard-button" onClick={() => navigate("/add-employee")}>
                    Add Employee
                </button>
                <button className="dashboard-button" onClick={() => navigate("/update-employee")}>
                    Update Employee
                </button> */}
                <button className="dashboard-button" onClick={() => navigate("/expenses")}>
                    Expenses
                </button>
                <button className="dashboard-button" onClick={() => navigate("/rooms")}>
                    Rooms
                </button>
            </div>
        </div>
    );
};

export default Dashboard;
