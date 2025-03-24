import React, { useState, useEffect } from "react";
import Axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Employee.css";
import EmpPopUP from "../../components/EmpPopup";
import AddEmpPopUp from "../../components/AddEmpPopUp";

const Employee = () => {
    const navigate = useNavigate();
    const hotelID = localStorage.getItem("hotelID"); // Change based on requirement
    const [showPopup, setShowPopup] = useState(false);
    const [selectedemp, setSelectedemp] = useState(null);
    const [employees, setEmployees] = useState([]);
    const [showPopupAdd, setShowPopupAdd] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [employeeToRemove, setEmployeeToRemove] = useState(null);
        
    useEffect(() => {
        fetchEmployees();
    }, []);

    const confirmRemoveEmployee = (employee) => {
        setEmployeeToRemove(employee);
        setShowConfirmation(true);
    };

    const removeEmployee = () => {
        if (employeeToRemove) {
            Axios.post("http://localhost:3001/remove-employee", { empID: employeeToRemove.EmpID })
                .then(() => {
                    alert("Employee removed successfully.");
                    fetchEmployees(); // Refresh the list
                })
                .catch((error) => {
                    console.error("Error removing employee:", error);
                    alert("Failed to remove employee.");
                })
                .finally(() => {
                    setShowConfirmation(false);
                    setEmployeeToRemove(null);
                });
        }
    };  

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

    

    const openEmpPopUpAdd = () =>{
        setShowPopupAdd(true);
    }
    return (
        <div className="employee-container">
            <button className="addEmp" onClick={openEmpPopUpAdd}>Add Employee</button>
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
                        <button className="remove-button" 
                        onClick={() => confirmRemoveEmployee(employee)}>
                        Remove
                        </button>  

                        
                    </div>
                ))}
            </div>

        {showPopup && selectedemp && (
        <EmpPopUP empID={selectedemp.EmpID} onClose={() => setShowPopup(false)}/>
        )}
        {
            showPopupAdd && (
                <AddEmpPopUp onClose = {() => setShowPopupAdd(false)}/>
            )
        }

        {showConfirmation && employeeToRemove && (
            <div className="confirmation-popup">
                <div className="confirmation-content">
                    <p>Are you sure you want to remove {employeeToRemove.FullName}?</p>
                    <button className="confirm-button" onClick={removeEmployee}>Yes</button>
                    <button className="cancel-button" onClick={() => setShowConfirmation(false)}>No</button>
                </div>
            </div>
        )}

        </div>
    );
}

export default Employee;
