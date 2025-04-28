import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Receptionist from "./pages/receptionist-pages/Receptionist.js";
import Login from "./pages/login-pages/Login.js";
import Checkout from "./pages/receptionist-pages/Checkout.js";
import Features from "./pages/receptionist-pages/feature.js";
import RealCheckout from "./pages/receptionist-pages/RealCheckout.js";
import RPDash from "./pages/receptionist-pages/ReceptionistDB.js";
import ManDash from "./pages/manager-pages/ManagerDash.js";
import Employee from "./pages/manager-pages/Employee.js";
import Manexpenses from "./pages/manager-pages/Manexpenses.js";
import AdminDashBoard from "./pages/admin-pages/AdminDashBoard.js";
import UpdateManager from "./pages/admin-pages/UpdateManager.js";
import AdminHotel from "./pages/admin-pages/AdminHotel.js";
import ManRoom from "./pages/manager-pages/Rooms.js";
import Inventory from "./pages/manager-pages/Inventory.js";
import Ledgerbook from "./pages/manager-pages/Ledgerbook";
import Hotelist from "./pages/admin-pages/Hotelist";
import FinancialReport from "./pages/admin-pages/FinancialReport";
import MaintenanceLedgerPage from "./pages/manager-pages/BillLedger";

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
        {/*<Route path="/expenses" element={<PrivateRoute element={<Manexpenses />} role="manager" />} />*/}
        <Route path="/rooms" element={<PrivateRoute element={<ManRoom />} role="manager" />} />
        <Route path="/inventory" element={<PrivateRoute element={<Inventory />} role="manager" />} />
        <Route path="/ledgerbook" element={<PrivateRoute element={<Ledgerbook />} role="manager" />} />
        <Route path="/billledger" element={<PrivateRoute element={<MaintenanceLedgerPage/>} role="manager" />} />
        <Route path="/financial-report-manager/:hotelId" element={<PrivateRoute element={<FinancialReport/>} role="manager"/>} />
        {/* Admin Pages */}
        <Route path="/admin-dashboard" element={<PrivateRoute element={<AdminDashBoard/>} role="admin"/>} />
        <Route path="/update-managers" element={<PrivateRoute element={<UpdateManager/>} role="admin"/>} />
        <Route path="/admin-hotels" element={<PrivateRoute element={<AdminHotel/>} role="admin"/>} />
        <Route path="/all-expenses" element={<PrivateRoute element={<Hotelist/>} role="admin"/>} />
        <Route path="/financial-report/:hotelId" element={<PrivateRoute element={<FinancialReport/>} role="admin"/>} />
      </Routes>
    </div>
  );
}

export default App;


