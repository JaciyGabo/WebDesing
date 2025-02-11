import { useState } from "react";
import validator from "validator";
import axios from "axios"; 

function Register() {
  const [formData, setFormData] = useState({
    username: "",
    fullname: "",
    birth_date: "", 
    email: "",
    password: "",
  });

  const [isValid, setIsValid] = useState({
    username: false,
    fullname: false,
    birth_date: false, 
    email: false,
    password: false,
  });

  const [isFormValid, setIsFormValid] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    let adjustedValue = name === "email" ? value.trim() : value.replace(/\s/g, "");

    setFormData((prev) => ({
      ...prev,
      [name]: adjustedValue,
    }));

    validateField(name, adjustedValue);
  };

  const validateField = (name, value) => {
    let valid = false;

    switch (name) {
      case "username":
        valid = !validator.isEmpty(value) && !/\s/.test(value);
        break;
      case "fullname":
        valid = !validator.isEmpty(value);
        break;
      case "birth_date":
        valid = !validator.isEmpty(value);
        break;
      case "email":
        valid = validator.isEmail(value);
        break;
      case "password":
        valid = value.length >= 6 && /[a-zA-Z]/.test(value) && /\d/.test(value);
        break;
      default:
        break;
    }

    setIsValid((prev) => ({
      ...prev,
      [name]: valid,
    }));

    setIsFormValid(
      Object.values({
        ...isValid,
        [name]: valid,
      }).every((field) => field)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log(formData); 

    if (isFormValid) {
      try {
        const response = await axios.post(
          "http://localhost:3000/api/register",
          formData
        );

        console.log("Usuario registrado:", response.data);
        setMessage("Usuario registrado correctamente");
        setShowModal(true);
        setFormData({
          username: "",
          fullname: "",
          birth_date: "", 
          email: "",
          password: "",
        })
      } catch (error) {
        if (error.response && error.response.status === 409) {
          setMessage("El usuario o correo ya existe");
          setShowModal(true)
        } else {
          setMessage("Error al registrar el usuario");
          setShowModal(true)
        }
        console.error("Error al registrar usuario:", error);
      }
    }
  };

  return (
    <>
      <h2>Registro de Usuario</h2>
      <section>
        <form onSubmit={handleSubmit}>
          <fieldset>
            <legend>Información personal:</legend>

            <label htmlFor="username">Nombre de Usuario:</label>
            <input
              type="text"
              id="username"
              name="username"
              placeholder="Ingresa tu usuario"
              value={formData.username}
              onChange={handleChange}
              required
            />

            <label htmlFor="fullname">Nombre completo:</label>
            <input
              type="text"
              id="fullname"
              name="fullname"
              placeholder="Ingresa tu nombre completo"
              value={formData.fullname}
              onChange={handleChange}
              required
            />

            <label htmlFor="birth_date">Fecha de nacimiento:</label> 
            <input
              type="date"
              id="birth_date"
              name="birth_date"
              value={formData.birth_date}
              onChange={handleChange}
              required
            />

            <label htmlFor="email">Correo:</label>
            <input
              type="text"
              id="email"
              name="email"
              placeholder="Ingresa tu correo"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <label htmlFor="password">Contraseña:</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Ingresa tu contraseña"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </fieldset>
          <button type="submit" disabled={!isFormValid}>
            Registrar
          </button>
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

export default Register;
