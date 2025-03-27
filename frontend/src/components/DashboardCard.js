import React from 'react';
import { useNavigate } from 'react-router-dom';
import './DashboardCard.css';

const DashboardCard = ({ title, description, color, navigateTo, icon, stat }) => {
    const navigate = useNavigate();

    return (
        <div className="dashboard-card" onClick={() => navigate(navigateTo)}>
            <div className="card-header">
                <div className="icon-container" style={{ backgroundColor: color + '20' }}>
                    {icon}
                </div>
                <h3>{title}</h3>
            </div>
            <p className="card-description">{description}</p>
            <div className="card-footer">
                <span className="stat-text">{stat}</span>
                <div className="color-accent" style={{ backgroundColor: color }}></div>
            </div>
        </div>
    );
};

export default DashboardCard;