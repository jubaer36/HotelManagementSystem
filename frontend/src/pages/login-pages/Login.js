import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Axios from "axios";
import "./Login.css";

const Login = () => {
    const navigate = useNavigate();
    const [credentials, setCredentials] = useState({ username: "", password: "" });
    const [error, setError] = useState("");
    const [showResetPopup, setShowResetPopup] = useState(false);
    const [resetDetails, setResetDetails] = useState({ username: "", oldPassword: "", newPassword: "" });
    const [resetError, setResetError] = useState("");
    const [resetSuccess, setResetSuccess] = useState("");

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        handleLogin();
    };

    const handleLogin = () => {
        Axios.post("http://localhost:3001/login", credentials)
            .then((response) => {
                localStorage.setItem("token", response.data.token);
                localStorage.setItem("role", response.data.role);
                localStorage.setItem("userID", response.data.userID);
                localStorage.setItem("hotelID", response.data.hotelID);

                if (response.data.role === "receptionist") {
                    navigate("/rp-dashboard");
                } else if (response.data.role === "manager") {
                    navigate("/manager-dashboard");
                }
                else if(response.data.role === "admin"){
                    navigate("/admin-dashboard");
                }
            })
            .catch((error) => {
                console.error("Login error:", error);
                setError("Invalid username or password");
            });
    };

    const handleResetChange = (e) => {
        setResetDetails({ ...resetDetails, [e.target.name]: e.target.value });
    };

    const handleResetPassword = (e) => {
        e.preventDefault();
        Axios.post("http://localhost:3001/reset-password", resetDetails)
            .then((response) => {
                setResetSuccess("Password successfully updated!");
                setResetError("");
                setShowResetPopup(false);
            })
            .catch((error) => {
                console.error("Reset password error:", error);
                setResetError("Failed to reset password. Check your old password.");
                setResetSuccess("");
            });
    };

    return (
        <>
        <div className="login-container">
            <div className="login-box">
                <h2 className="login-heading">Login</h2>
                <form className="login-form" onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="username"
                        placeholder="Username"
                        className="login-input"
                        onChange={handleChange}
                        value={credentials.username}
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        className="login-input"
                        onChange={handleChange}
                        value={credentials.password}
                    />
                    <button type="submit" className="login-button">
                        Login
                    </button>
                </form>
                
                {/* Reset Password Link */}
                <p className="reset-password-text" onClick={() => setShowResetPopup(true)}>
                    Forgot Password? Reset here
                </p>

                {error && <p className="error">{error}</p>}

                {/* Reset Password Popup */}
                
            </div>
        </div>
        {showResetPopup && (
            <div className="popup">
                <form className="popup-form" onSubmit={handleResetPassword}>
                    <h3>Reset Password</h3>
                    <input
                        type="text"
                        name="username"
                        placeholder="Username"
                        className="login-input"
                        onChange={handleResetChange}
                        value={resetDetails.username}
                    />
                    <input
                        type="password"
                        name="oldPassword"
                        placeholder="Old Password"
                        className="login-input"
                        onChange={handleResetChange}
                        value={resetDetails.oldPassword}
                    />
                    <input
                        type="password"
                        name="newPassword"
                        placeholder="New Password"
                        className="login-input"
                        onChange={handleResetChange}
                        value={resetDetails.newPassword}
                    />
                    <button type="submit" className="login-button">
                        Reset Password
                    </button>
                    <button type="button" className="close-button" onClick={() => setShowResetPopup(false)}>
                        Cancel
                    </button>
                    {resetError && <p className="error">{resetError}</p>}
                    {resetSuccess && <p className="success">{resetSuccess}</p>}
                </form>
            </div>
        )}</>
    );
};

export default Login;
