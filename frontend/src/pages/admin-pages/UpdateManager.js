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
    const [editingManagerId, setEditingManagerId] = useState(null);
    const [originalManagerData, setOriginalManagerData] = useState(null);

    const handleEditChange = (empID, field, value) => {
        setEmployees(prev =>
            prev.map(emp =>
                emp.EmpID === empID ? { ...emp, [field]: value } : emp
            )
        );
    };
    
    const handleCancelEdit = () => {
        if (originalManagerData) {
            setEmployees(prev =>
                prev.map(emp =>
                    emp.EmpID === originalManagerData.EmpID ? originalManagerData : emp
                )
            );
        }
        setEditingManagerId(null);
        setOriginalManagerData(null);
    };
    
    const handleUpdate = (employee) => {
        const updatedData = {
            empID: employee.EmpID,
            firstName: employee.FullName.split(" ")[0],
            lastName: employee.FullName.split(" ")[1] || "",
            phone: employee.Phone,
            email: employee.Email,
            hourlyPay: parseFloat(employee.hourly_pay),
            hiredDate: new Date(employee.HiredDate).toISOString().split("T")[0]
        };
    
        Axios.post("http://localhost:3001/update-manager", updatedData)
            .then(() => {
                alert("Manager updated successfully.");
                setEditingManagerId(null);
                fetchEmployees();
            })
            .catch((err) => {
                console.error("Update failed:", err);
                alert("Failed to update manager.");
            });
    };
    


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
                        <th>Update</th>
                    </tr>
                    </thead>
                    <tbody>
                {employees.map((employee) => {
                    const isEditing = employee.EmpID === editingManagerId;
                
                    return (
                        <tr key={employee.EmpID}>
                            <td>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={employee.FullName}
                                        onChange={(e) =>
                                            handleEditChange(employee.EmpID, "FullName", e.target.value)
                                        }
                                    />
                                ) : (
                                    employee.FullName
                                )}
                            </td>
                            <td>{employee.DeptName}</td>
                            <td>
                                {isEditing ? (
                                    <input
                                        type="number"
                                        value={employee.hourly_pay}
                                        onChange={(e) =>
                                            handleEditChange(employee.EmpID, "hourly_pay", e.target.value)
                                        }
                                    />
                                ) : (
                                    `$${Number(employee.hourly_pay || 0).toFixed(2)}`
                                )}
                            </td>
                            <td>
                                {isEditing ? (
                                    <input
                                        type="email"
                                        value={employee.Email}
                                        onChange={(e) =>
                                            handleEditChange(employee.EmpID, "Email", e.target.value)
                                        }
                                    />
                                ) : (
                                    employee.Email
                                )}
                            </td>
                            <td>
                                {isEditing ? (
                                    <input
                                        type="tel"
                                        value={employee.Phone}
                                        onChange={(e) =>
                                            handleEditChange(employee.EmpID, "Phone", e.target.value)
                                        }
                                    />
                                ) : (
                                    employee.Phone
                                )}
                            </td>
                            <td>
                                {isEditing ? (
                                    <input
                                        type="date"
                                        value={employee.HiredDate.split("T")[0]}
                                        onChange={(e) =>
                                            handleEditChange(employee.EmpID, "HiredDate", e.target.value)
                                        }
                                    />
                                ) : (
                                    new Date(employee.HiredDate).toLocaleDateString()
                                )}
                            </td>
                            <td>
                            {isEditing ? (
                                <button className="remove-button" disabled>
                                    Remove
                                </button>
                            ) : (
                                <button
                                    className="remove-button"
                                    onClick={() => confirmRemoveEmployee(employee)}
                                >
                                    Remove
                                </button>
                            )}
                        </td>
                        <td>
                            {isEditing ? (
                                <div className="action-buttons">
                                    <button className="save-button" onClick={() => handleUpdate(employee)}>Save</button>
                                    <button className="cancel-button" onClick={handleCancelEdit}>Cancel</button>
                                </div>
                            ) : (
                                <button
                                    className="update-button"
                                    onClick={() => {
                                        setOriginalManagerData({ ...employee });
                                        setEditingManagerId(employee.EmpID);
                                    }}
                                >
                                    Update
                                </button>
                            )}
                        </td>

                        </tr>
                    );
                })}
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