import React, { useState, useEffect } from "react";
import Axios from "axios";
import { useNavigate } from "react-router-dom";
import "./UpdateManager.css";
import AddEmpPopUp from "../../components/AddManagerPopUp";
import Navbar from "../../components/Navbar";

const UpdateManager = () => {
    const navigate = useNavigate();
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
                    fetchEmployees();
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
        Axios.post("http://localhost:3001/show-managers")
            .then((response) => {
                setEmployees(response.data);
            })
            .catch((error) => {
                console.error("Error fetching employees:", error);
                alert("Failed to fetch employees.");
            });
    };

    const openEmpPopUpAdd = () => {
        setShowPopupAdd(true);
    }

    return(
        <div>
        <Navbar/>
        <div className="update-manager-container">
            <div className="header-section">

                <button className="add-button" onClick={openEmpPopUpAdd}>
                    + Add New Manager
                </button>
            </div>

            <div className="table-container">
                <table>
                    <thead>
                    <tr>
                        <th>Full Name</th>
                        <th>Department</th>
                        <th>Salary</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Hired Date</th>
                        <th>Remove</th>
                    </tr>
                    </thead>
                    <tbody>
                    {employees.map((employee) => (
                        <tr key={employee.EmpID}>
                            <td>{employee.FullName}</td>
                            <td>{employee.DeptName}</td>
                            <td>${Number(employee.hourly_pay || 0).toFixed(2)}</td>
                            <td>{employee.Email}</td>
                            <td>{employee.Phone}</td>
                            <td>{new Date(employee.HiredDate).toLocaleDateString()}</td>
                            <td>
                                <button
                                    className="remove-button"
                                    onClick={() => confirmRemoveEmployee(employee)}
                                >
                                    Remove
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {showPopupAdd && (
                <AddEmpPopUp onClose={() => setShowPopupAdd(false)} />
            )}

            {showConfirmation && employeeToRemove && (
                <div className="confirmation-popup">
                    <div className="confirmation-content">
                        <p>Are you sure you want to remove {employeeToRemove.FullName}?</p>
                        <div className="confirmation-buttons">
                            <button className="confirm-button" onClick={removeEmployee}>Yes</button>
                            <button className="cancel-button" onClick={() => setShowConfirmation(false)}>No</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
        </div>
    );
}

export default UpdateManager;