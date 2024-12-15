import React from "react";
import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import Receptionist from "./pages/Receptionist";
import Login from "./pages/Login";
import Checkout from "./pages/Checkout";
import Features from "./pages/feature";
import Inventory from "./pages/Inventory";

function App() {
  // const navigate = useNavigate();

  return (
    <div className="App">
      <title>Hotel Management System</title>
      
    
      <Routes>
      <Route path="/" element={<Navigate to="/login" />} /> 
      <Route path="/login" element={<Login />} />
      <Route path="/receptionist" element={<Receptionist />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/feature" element={<Features/>} />
      <Route path="/inventory" element={<Inventory/>} />

      </Routes>
    </div>
  );
}

export default App;
