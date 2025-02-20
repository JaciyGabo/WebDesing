import { useState } from "react";
import Login from "../pages/Login";
import Register from "../pages/Register";

const LoginPage = () => {
  const [showLogin, setShowLogin] = useState(true);

  const toggleView = () => {
    setShowLogin(!showLogin);
  };

  return (
    <div className="form-box"
    
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh", 
      backgroundColor: "#f0f2f5", 
    }}
    >
        {showLogin ? <Login onChange={toggleView}/> : <Register onChange={toggleView}/>}
      
      </div>
  ) 
}

export default LoginPage