import { useState, useEffect } from "react";
import Login from "../pages/Login";
import Register from "../pages/Register";

const LoginPage = () => {
  const [showLogin, setShowLogin] = useState(true);

  const toggleView = () => {
    setShowLogin(!showLogin);
  };

  useEffect(() => {
    const logout = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          await fetch("http://localhost:3000/logout", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });
        } catch (error) {
          console.error("Error al cerrar sesión:", error);
        }
        localStorage.removeItem("token"); // Eliminar token del cliente
      }
    };

    logout();
  }, []);

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