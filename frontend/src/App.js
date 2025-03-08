import React from "react";
import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import Receptionist from "./pages/Receptionist";
import Login from "./pages/Login";
import Checkout from "./pages/Checkout";
import Features from "./pages/feature";
import RealCheckout from "./pages/RealCheckout";
import RPDash from "./pages/ReceptionistDB.js";
import ManDash from "./pages/ManagerDash.js";
import Employee  from "./pages/Employee.js";
import Manexpenses from "./pages/Manexpenses.js";

const PrivateRoute = ({ element, role }) => {
  const storedRole = localStorage.getItem("role");
  return storedRole === role ? element : <Navigate to="/login" />;
};

function App() {
  // const navigate = useNavigate();

  return (
    <div className="App">
      <title>Hotel Management System</title>
      
    
      <Routes>
      <Route path="/" element={<Navigate to="/login" />} /> 
      <Route path="/login" element={<Login />} />

      {/*Receptionist Pages*/}
      <Route path="/rp-dashboard" element={<PrivateRoute element={<RPDash />} role="receptionist" />} />
      <Route path="/receptionist" element={<Receptionist />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/feature" element={<Features/>} />
      <Route path="/real-checkout" element={<RealCheckout/>} />

      {/* Manager Pages */}
      <Route path="/manager-dashboard" element={<PrivateRoute element={<ManDash />} role="manager" />} />
      <Route path="/employee-info" element={<Employee/>} />
      <Route path="/expenses" element={<Manexpenses/>} />

      </Routes>
    </div>
  );
}

export default App;
