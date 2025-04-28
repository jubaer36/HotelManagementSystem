import React from "react";
import { FiBookOpen, FiUserCheck, FiFileText } from "react-icons/fi";
import DashboardCard from "../../components/DashboardCard";
import Navbar from "../../components/Navbar";
import "./ReceptionistDB.css";

const ReceptionistDashboard = () => {
  const cards = [
    {
      title: "Room Booking",
      description: "Book rooms for guests",
      color: "#3B82F6",
      path: "/receptionist",
      icon: <FiBookOpen className="card-icon" />,
      // stat: "Live Bookings Available"
    },
    {
      title: "Guest Info",
      description: "Manage guest check-ins and data",
      color: "#10B981",
      path: "/checkout",
      icon: <FiUserCheck className="card-icon" />,
      // stat: "32 Guests Checked In"
    },
    {
      title: "Billing",
      description: "Generate invoices and process payments",
      color: "#F59E0B",
      path: "/real-checkout",
      icon: <FiFileText className="card-icon" />,
      // stat: "5 Pending Payments"
    }
  ];

  return (
    <div className="receptionist-dashboard-wrapper">
      <Navbar />
      <div className="receptionist-dashboard-container">
        {/* If you want, you can add a title like Admin */}
        {/* <header className="dashboard-header">
            <h1 className="dashboard-title">Receptionist Dashboard</h1>
            <div className="header-accent"></div>
          </header> */}

        <div className="receptionist-grid-container">
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

export default ReceptionistDashboard;
