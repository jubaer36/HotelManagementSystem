import React from "react";
import { FiUsers, FiDollarSign, FiHome } from "react-icons/fi";
import DashboardCard from "../../components/DashboardCard";
import Navbar from "../../components/Navbar";
import "./AdminDashBoard.css";

const AdminDashBoard = () => {
    const cards = [
        {
            title: "Manage Managers",
            description: "Update and configure manager accounts",
            color: "#3B82F6",
            path: "/update-managers",
            icon: <FiUsers className="card-icon" />,
            // stat: "5 Manager Accounts"
        },
        {
            title: "Expense Tracking",
            description: "View and manage all financial expenses",
            color: "#10B981",
            path: "/all-expenses",
            icon: <FiDollarSign className="card-icon" />,
            // stat: "$12,450 Total"
        },
        {
            title: "Hotel Management",
            description: "Configure hotel properties and settings",
            color: "#F59E0B",
            path: "/admin-hotels",
            icon: <FiHome className="card-icon" />,
            // stat: "3 Active Hotels"
        }
    ];

    return (
        <div className="admin-dashboard-wrapper">
            <Navbar />
            <div className="admin-dashboard-container">
                {/* <header className="dashboard-header">
                    <h1 className="dashboard-title">Admin Dashboard</h1>
                    <div className="header-accent"></div>
                </header> */}

                <div className="admin-grid-container">
                    {cards.map((card, index) => (
                        <DashboardCard
                            key={index}
                            title={card.title}
                            description={card.description}
                            color={card.color}
                            navigateTo={card.path}
                            icon={card.icon}
                            stat={card.stat}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AdminDashBoard;