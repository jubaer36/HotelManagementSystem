import React, { useState, useEffect } from "react";
import Axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Employee.css";
import EmpPopUP from "../components/EmpPopup";

const Employee = () => {
    const navigate = useNavigate();
    const hotelID = 1; // Change based on requirement
    const [showPopup, setShowPopup] = useState(false);
    const [selectedemp, setSelectedemp] = useState(null);
    const [employees, setEmployees] = useState([]);

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = () => {
        Axios.post("http://localhost:3001/employees", { hotelID })
            .then((response) => {
                setEmployees(response.data);
            })
            .catch((error) => {
                console.error("Error fetching employees:", error);
                alert("Failed to fetch employees.");
            });
    };

    const openEmpPopup = (employee) => {
        setSelectedemp(employee);
        setShowPopup(true);
      };

    return (
        <div className="employee-container">
            <h2>Employee List</h2>
            <div className="employee-cards">
                {employees.map((employee) => (
                    <div key={employee.EmpID} className="employee-card">
                        <h3>{employee.FullName}</h3>
                        <p><strong>Department:</strong> {employee.DeptName}</p>
                        <p><strong>Salary:</strong> ${Number(employee.hourly_pay || 0).toFixed(2)}</p>
                        <button 
                        className="expand-button"
                        onClick={() => openEmpPopup(employee)}  
                        >
                        Expand
                        </button>

                        
                    </div>
                ))}
            </div>

        {showPopup && selectedemp && (
        <EmpPopUP empID={selectedemp.EmpID} onClose={() => setShowPopup(false)}/>
        )}

        </div>
    );
}

export default Employee;
