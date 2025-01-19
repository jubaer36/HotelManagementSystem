import React, { useEffect, useState } from "react";
import Axios from "axios";
import "./EmpPopup.css";

const EmpPopUP = ({ empID, onClose }) => {
    const [EmpDetails, setEmpDetails] = useState({
        EmpID: 0,
        DeptID: 0,
        FirstName: "",
        LastName: "",
        Phone: "",
        Email: "",
        hourly_pay: 0.0,
        Salary: 0.0,
        Role: "",
        HiredDate: "",
        Address: { city: "", state: "" },
        DeptName: "",
    });

    useEffect(() => {
        if (empID) {
            fetchEmployeeDetails(empID);
        }
    }, [empID]);

    const fetchEmployeeDetails = (empID) => {
        console.log(empID);
        Axios.post("http://localhost:3001/employee-details", { empID })
            .then((response) => {
                setEmpDetails({
                    ...EmpDetails,
                    ...response.data,
                });
            })
            .catch((error) => {
                console.error("Error fetching employee details:", error);
            });
    };

    return (
        <div className="popup-overlay">
            <div className="popup-container">
                <h2>Employee Details</h2>
                <p><strong>Full Name:</strong> {EmpDetails.FirstName} {EmpDetails.LastName}</p>
                <p><strong>Department:</strong> {EmpDetails.DeptName}</p>
                <p><strong>Salary:</strong> ${Number(EmpDetails.Salary || 0).toFixed(2)}</p>
                <p><strong>Hourly Pay:</strong> ${Number(EmpDetails.hourly_pay || 0).toFixed(2)}</p>
                <p><strong>Role:</strong> {EmpDetails.Role}</p>
                <p><strong>Phone:</strong> {EmpDetails.Phone}</p>
                <p><strong>Email:</strong> {EmpDetails.Email}</p>
                <p><strong>Hired Date:</strong> {EmpDetails.HiredDate ? new Date(EmpDetails.HiredDate).toISOString().split("T")[0] : "N/A"}</p>
                <p><strong>Address:</strong> {EmpDetails.Address ? `${EmpDetails.Address.city}, ${EmpDetails.Address.state}` : "N/A"}</p>
                <button className="close-popup-button" onClick={onClose}>Close</button>
            </div>
        </div>
    );
};

export default EmpPopUP;
