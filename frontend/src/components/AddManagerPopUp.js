import React, { useState, useEffect } from "react";
import Axios from "axios";
import "./AddEmpPopUp.css";
import { FaTimes, FaSpinner } from "react-icons/fa";

const AddEmpPopUp = ({ onClose }) => {
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [hotels, setHotels] = useState([]);
    const [employee, setEmployee] = useState({
        hotelID: "",
        firstName: "",
        lastName: "",
        phone: "",
        email: "",
        hourlyPay: "",
        workingStatus: "Working",
        role: "manager",
        hiredDate: new Date().toISOString().split('T')[0],
        address: { city: "", state: "" }
    });

    useEffect(() => {
        fetchHotels();
    }, []);

    const fetchHotels = () => {
        Axios.post("http://localhost:3001/all-hotels")
            .then((response) => setHotels(response.data))
            .catch((error) => {
                console.error("Error fetching hotels:", error);
                alert("Failed to load hotel list");
            });
    };

    const validateForm = () => {
        const newErrors = {};
        const requiredFields = ['hotelID', 'firstName', 'lastName', 'phone', 'hourlyPay'];

        requiredFields.forEach(field => {
            if (!employee[field]) newErrors[field] = "This field is required";
        });

        if (employee.phone && !/^\d{10}$/.test(employee.phone)) {
            newErrors.phone = "Invalid phone number (10 digits required)";
        }

        if (employee.email && !/\S+@\S+\.\S+/.test(employee.email)) {
            newErrors.email = "Invalid email format";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        try {
            // Get maintenance department for selected hotel
            const deptResponse = await Axios.post("http://localhost:3001/find-departments", {
                hotelID: employee.hotelID
            });

            if (!deptResponse.data.length) {
                throw new Error("No maintenance department found for selected hotel");
            }

            const employeeData = {
                ...employee,
                deptID: deptResponse.data[0].DeptID,
                address: JSON.stringify(employee.address)
            };

            await Axios.post("http://localhost:3001/add-employee", employeeData);
            alert("Manager added successfully!");
            onClose();
        } catch (error) {
            console.error("Error adding manager:", error);
            alert(error.response?.data?.message || error.message || "Failed to add manager");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEmployee(prev => ({ ...prev, [name]: value }));
    };

    const handleAddressChange = (e) => {
        const { name, value } = e.target;
        setEmployee(prev => ({
            ...prev,
            address: { ...prev.address, [name]: value }
        }));
    };

    return (
        <div className="popup-overlay">
            <div className="popup-container">
                <div className="popup-header">
                    <h2>Add New Manager</h2>
                    <button className="close-button" onClick={onClose}>
                        <FaTimes />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Hotel<span className="required">*</span></label>
                        <select
                            name="hotelID"
                            value={employee.hotelID}
                            onChange={handleChange}
                            className={errors.hotelID ? 'error' : ''}
                        >
                            <option value="">Select Hotel</option>
                            {hotels.map(hotel => (
                                <option key={hotel.HotelID} value={hotel.HotelID}>
                                    {hotel.Name}
                                </option>
                            ))}
                        </select>
                        {errors.hotelID && <span className="error-message">{errors.hotelID}</span>}
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>First Name<span className="required">*</span></label>
                            <input
                                type="text"
                                name="firstName"
                                value={employee.firstName}
                                onChange={handleChange}
                                className={errors.firstName ? 'error' : ''}
                                placeholder="John"
                            />
                            {errors.firstName && <span className="error-message">{errors.firstName}</span>}
                        </div>

                        <div className="form-group">
                            <label>Last Name<span className="required">*</span></label>
                            <input
                                type="text"
                                name="lastName"
                                value={employee.lastName}
                                onChange={handleChange}
                                className={errors.lastName ? 'error' : ''}
                                placeholder="Doe"
                            />
                            {errors.lastName && <span className="error-message">{errors.lastName}</span>}
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Phone<span className="required">*</span></label>
                            <input
                                type="tel"
                                name="phone"
                                value={employee.phone}
                                onChange={handleChange}
                                className={errors.phone ? 'error' : ''}
                                placeholder="1234567890"
                            />
                            {errors.phone && <span className="error-message">{errors.phone}</span>}
                        </div>

                        <div className="form-group">
                            <label>Email</label>
                            <input
                                type="email"
                                name="email"
                                value={employee.email}
                                onChange={handleChange}
                                className={errors.email ? 'error' : ''}
                                placeholder="john.doe@example.com"
                            />
                            {errors.email && <span className="error-message">{errors.email}</span>}
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Hourly Pay<span className="required">*</span></label>
                            <input
                                type="number"
                                name="hourlyPay"
                                value={employee.hourlyPay}
                                onChange={handleChange}
                                className={errors.hourlyPay ? 'error' : ''}
                                step="0.01"
                                min="0"
                                placeholder="0.00"
                            />
                            {errors.hourlyPay && <span className="error-message">{errors.hourlyPay}</span>}
                        </div>

                        <div className="form-group">
                            <label>Hire Date</label>
                            <input
                                type="date"
                                name="hiredDate"
                                value={employee.hiredDate}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>City</label>
                            <input
                                type="text"
                                name="city"
                                value={employee.address.city}
                                onChange={handleAddressChange}
                                placeholder="New York"
                            />
                        </div>

                        <div className="form-group">
                            <label>State</label>
                            <input
                                type="text"
                                name="state"
                                value={employee.address.state}
                                onChange={handleAddressChange}
                                placeholder="NY"
                            />
                        </div>
                    </div>

                    <div className="form-actions">
                        <button
                            type="submit"
                            className="submit-button"
                            disabled={loading}
                        >
                            {loading ? <FaSpinner className="spinner" /> : 'Add Manager'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddEmpPopUp;