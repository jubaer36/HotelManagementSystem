import React from "react";
import { useNavigate } from "react-router-dom";

function Login(){
    const navigate = useNavigate();
    
    return(
        <div>
            <h1>
                Login Page
            </h1>
            <button onClick={() => navigate("/receptionist")}>
        Go to Receptionist
    </button>

        </div>
    );
}
export default Login;