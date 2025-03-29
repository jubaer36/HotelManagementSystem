import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Get current page title based on route
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
            default:
                return 'Dashboard';
        }
    };

    return (
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
                    <button onClick={() => navigate('/profile')}>Profile</button>
                    <button onClick={() => navigate('/settings')}>Settings</button>
                    <button onClick={() => navigate('/logout')}>Logout</button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;