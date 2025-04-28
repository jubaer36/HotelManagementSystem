import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './BillLedger.css';
import Navbar from "../../components/Navbar";

const MaintenanceLedgerPage = () => {
    const hotelId = localStorage.getItem("hotelID"); // Fetch hotel ID from local storage
    const [maintenanceLedger, setMaintenanceLedger] = useState([]);
    const [newMaintenance, setNewMaintenance] = useState({
        serviceType: '',
        amount: 0,
        ledgerDate: ''
    });

    // Fetch the existing maintenance ledger entries from the backend
    useEffect(() => {
        const fetchMaintenanceLedger = async () => {
            try {
                const res = await axios.get(`http://localhost:3001/maintenance-ledger?hotelId=${hotelId}`);
                setMaintenanceLedger(res.data);
            } catch (error) {
                console.error("Error fetching maintenance ledger:", error);
            }
        };

        fetchMaintenanceLedger();
    }, [hotelId]);

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewMaintenance({ ...newMaintenance, [name]: value });
    };

    // Handle form submission to add a new maintenance entry
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:3001/maintenance-ledger', { ...newMaintenance, hotelId });
            setNewMaintenance({ serviceType: '', amount: 0, ledgerDate: '' }); // Reset form
            // Re-fetch ledger after submitting a new entry
            const res = await axios.get(`http://localhost:3001/maintenance-ledger?hotelId=${hotelId}`);
            setMaintenanceLedger(res.data);
        } catch (error) {
            console.error("Error adding maintenance entry:", error);
        }
    };

    return (
        <div className="maintenance-ledger-page">
            <Navbar/>
            <h2>Maintenance Ledger</h2>
            <div className="ledger-form">
                <h3>Add New Maintenance Entry</h3>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="serviceType"
                        value={newMaintenance.serviceType}
                        onChange={handleInputChange}
                        placeholder="Service Type"
                        required
                    />
                    <input
                        type="number"
                        name="amount"
                        value={newMaintenance.amount}
                        onChange={handleInputChange}
                        placeholder="Amount"
                        required
                    />
                    <input
                        type="date"
                        name="ledgerDate"
                        value={newMaintenance.ledgerDate}
                        onChange={handleInputChange}
                        required
                    />
                    <button type="submit">Add Entry</button>
                </form>
            </div>

            <h3>Current Ledger</h3>
            <table>
                <thead>
                <tr>
                    <th>Service Type</th>
                    <th>Amount</th>
                    <th>Ledger Date</th>
                </tr>
                </thead>
                <tbody>
                {maintenanceLedger.map((entry, index) => (
                    <tr key={index}>
                        <td>{entry.ServiceType}</td>
                        <td>${entry.Amount}</td>
                        <td>{entry.LedgerDate}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default MaintenanceLedgerPage;
