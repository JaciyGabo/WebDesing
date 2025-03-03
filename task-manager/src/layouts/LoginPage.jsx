import { useState } from "react";
import Login from "../pages/Login";
import Register from "../pages/Register";
import ojosGato from "../assets/ojosGato.jpg";

const LoginPage = () => {
  const [showLogin, setShowLogin] = useState(null); // Inicializamos en null

  return (
    <div
      className="form-box"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#f0f2f5",
        backgroundImage: `url(${ojosGato})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        position: "relative", // Para poder aplicar un filtro en el fondo
      }}
    >
      {/* Fondo con difuminado */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.5)", // Filtro oscuro para mejorar la legibilidad
        }}
      ></div>

      <div style={{ zIndex: 1, textAlign: "center" }}>
        <div style={{ color: "white", fontFamily: "Zain", fontSize: "2rem" }}>
          <p>Bienvenido a</p>
        </div>
        <div
          style={{
            color: "white",
            fontFamily: "Cherry Bomb One",
            fontSize: "4rem",
            marginBottom: "20px",
          }}
        >
          PrrSaga
        </div>

        {showLogin !== null && (
          <div
            style={{
              backgroundColor: "#000",
              padding: "20px",
              borderRadius: "8px",
              boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
              maxWidth: "400px",
              margin: "0 auto",
              zIndex: 1,
            }}
          >
            {showLogin ? <Login /> : <Register />}
          </div>
        )}

        {/* Botones */}
        <div style={{ marginBottom: "20px" , marginTop: "20px"}}>
          <button
            style={{
              backgroundColor: "#09555B",
              color: "white",
              border: "1px solid white",
              padding: "12px 30px",
              fontSize: "1.2rem",
              margin: "10px",
              cursor: "pointer",
              borderRadius: "5px",
              width: "200px",
            }}
            onClick={() => setShowLogin(true)} // Muestra Login
          >
            Iniciar sesión
          </button>
          <button
            style={{
              backgroundColor: "#09555B",
              color: "white",
              border: "1px solid white",
              padding: "12px 30px",
              fontSize: "1.2rem",
              margin: "10px",
              cursor: "pointer",
              borderRadius: "5px",
              width: "200px",
            }}
            onClick={() => setShowLogin(false)} // Muestra Register
          >
            Registrarse
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
