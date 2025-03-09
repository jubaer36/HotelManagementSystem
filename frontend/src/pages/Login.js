import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Axios from "axios";
import "./Login.css";

const Login = () => {
    const navigate = useNavigate();
    const [credentials, setCredentials] = useState({ username: "", password: "" });
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault(); // Prevents page reload
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
            })
            .catch((error) => {
                console.error("Login error:", error);
                setError("Invalid username or password");
            });
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h2 className="login-heading">Login to Your Account</h2>
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
                {error && <p className="error">{error}</p>}
            </div>
        </div>
    );
};

export default Login;
