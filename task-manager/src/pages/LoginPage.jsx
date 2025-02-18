import { useState } from "react";
import Login from "../layouts/Login";
import Register from "../layouts/Register";

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