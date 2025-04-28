import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Navbar.css';
import Axios from 'axios';

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [showResetPopup, setShowResetPopup] = useState(false);
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');

    const handleLogout = () => {
        localStorage.clear(); // Clears all localStorage items (userID, token, etc.)
        navigate('/login');    // Redirect to login page
    };
    

    const getPageTitle = () => {
        switch(location.pathname) {
            case '/employee-info':
                return 'Employee Information';
            case '/expenses':
                return 'Expense Management';
            case '/rooms':
                return 'Room Management';
            case '/inventory':
                return 'Inventory Control';
            case '/ledgerbook':
                return 'Ledger Book';
            case '/profile':
                return 'User Profile';
            case '/settings':
                return 'System Settings';
            case '/update-managers':
                return 'Manager List';
            case '/admin-dashboard':
                return 'Admin Dashboard';
            case '/receptionist':
                return 'Booking';
            case '/checkout':
                return 'Guests';
            case '/real-checkout':
                return 'Billing';
            default:
                return 'Dashboard';
        }
    };

    const handlePasswordReset = () => {
        const userID = localStorage.getItem('userID'); // Assuming userID is stored locally after login

        if (!oldPassword || !newPassword) {
            alert("Please fill in both fields.");
            return;
        }

        Axios.post('http://localhost:3001/reset-password', {
            userID,
            oldPassword,
            newPassword,
        })
        .then(response => {
            alert(response.data.message);
            setShowResetPopup(false);
            setOldPassword('');
            setNewPassword('');
        })
        .catch(error => {
            console.error("Password reset error:", error);
            alert("Failed to reset password. Please check your old password.");
        });
    };

    return (
        <>
        <nav className="navbar">
            <div className="navbar-container">
                <div className="nav-left">
                    <div className="logo" onClick={() => navigate('/')}>
                        Continental
                    </div>
                    <div className="current-page">
                        {getPageTitle()}
                    </div>
                </div>
                <div className="nav-links">
                    {/* <button onClick={() => setShowResetPopup(true)}>Reset Password</button> */}
                    <button onClick={handleLogout}>Logout</button>
                </div>
            </div>
        </nav>

        {showResetPopup && (
            <div className="reset-password-popup">
                <div className="reset-password-content">
                    <h3>Reset Password</h3>
                    <input
                        type="password"
                        placeholder="Old Password"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="New Password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <div className="reset-password-actions">
                        <button className="confirmm-button" onClick={handlePasswordReset}>Confirm</button>
                        <button className="cancell-button" onClick={() => setShowResetPopup(false)}>Cancel</button>
                    </div>
                </div>
            </div>
        )}
        </>
    );
};

export default Navbar;
