import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Receptionist from "./pages/Receptionist";
import Login from "./pages/Login";
import Checkout from "./pages/Checkout";
import Features from "./pages/feature";
import RealCheckout from "./pages/RealCheckout";
import RPDash from "./pages/ReceptionistDB.js";
import ManDash from "./pages/ManagerDash.js";
import Employee from "./pages/Employee.js";
import Manexpenses from "./pages/Manexpenses.js";

const PrivateRoute = ({ element, role }) => {
  const storedRole = localStorage.getItem("role");
  return storedRole === role ? element : <Navigate to="/login" />;
};

function App() {
  return (
    <div className="App">
      <title>Hotel Management System</title>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        {/*Receptionist Pages*/}
        <Route path="/rp-dashboard" element={<PrivateRoute element={<RPDash />} role="receptionist" />} />
        <Route path="/receptionist" element={<PrivateRoute element={<Receptionist />} role="receptionist" />} />
        <Route path="/checkout" element={<PrivateRoute element={<Checkout />} role="receptionist" />} />
        <Route path="/feature" element={<PrivateRoute element={<Features />} role="receptionist" />} />
        <Route path="/real-checkout" element={<PrivateRoute element={<RealCheckout />} role="receptionist" />} />
        {/* Manager Pages */}
        <Route path="/manager-dashboard" element={<PrivateRoute element={<ManDash />} role="manager" />} />
        <Route path="/employee-info" element={<PrivateRoute element={<Employee />} role="manager" />} />
        <Route path="/expenses" element={<PrivateRoute element={<Manexpenses />} role="manager" />} />
      </Routes>
    </div>
  );
}

export default App;
