import React from "react";
import "./Login.css"; // Import the CSS file
import {useNavigate} from "react-router-dom";
const Login = () => {
    const navigate = useNavigate();
    return (
        <div className="login-container">
            <div className="login-box">
                <h2 className="login-heading">Login to Your Account</h2>
                <p className="login-subheading">
                </p>
                <form className="login-form">
                    <input
                        type="email"
                        placeholder="Email Address"
                        className="login-input"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        className="login-input"
                    />
                    <button type="submit" className="login-button" onClick={() => navigate("/receptionist")}>
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
