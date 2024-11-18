import React from "react";
import { useNavigate } from "react-router-dom";

function Login(){
    const navigate = useNavigate();
    
    return(
        <div>
            <h1>
                Login Page
            </h1>
            <label>Email: </label>
        <input
          type="email"
          value={""}
        />
        <label>Password: </label>
        <input
          type="password"
          value={""}
        />
            <button onClick={() => navigate("/receptionist")}>Login</button>

        </div>
    );
}
export default Login;