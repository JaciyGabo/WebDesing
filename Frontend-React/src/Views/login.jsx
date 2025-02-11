import { useState } from "react";
import axios from "axios";

function Login() {
  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  });

  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({
      ...prev,
      [name]: value.replace(/\s/g, ""),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    console.log(loginData);
  
    try {
      // Enviar parámetros de login en la URL (query string)
      const response = await axios.get(
        `http://localhost:3000/api/login?username=${loginData.username}&password=${loginData.password}`
      );
  
      console.log("Inicio de sesión exitoso:", response.data);
      setMessage("Bienvenido c:");
      setShowModal(true);
      setLoginData({
        username: "",
        password: "",
      })
    } catch (error) {
      setMessage("Credenciales incorrectas");
      setShowModal(true);
      console.error("Error al iniciar sesión:", error);
    }
  };
  

  return (
    <>
      <h2>Iniciar Sesión</h2>
      <section>
        <form onSubmit={handleSubmit}>
          <fieldset>
            <legend>Credenciales:</legend>

            <label htmlFor="username">Nombre de Usuario:</label>
            <input
              type="text"
              id="username"
              name="username"
              placeholder="Ingresa tu usuario"
              value={loginData.username}
              onChange={handleChange}
              required
            />

            <label htmlFor="password">Contraseña:</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Ingresa tu contraseña"
              value={loginData.password}
              onChange={handleChange}
              required
            />
          </fieldset>
          <button type="submit">Iniciar Sesión</button>
        </form>

      </section>
      {showModal && (
        <section className="modal">
          <p>
            <strong>{message}</strong>
          </p>
          <button className="cerrar" onClick={() => setShowModal(false)}>
            Cerrar
          </button>
        </section>
      )}
    </>
  );
}

export default Login;