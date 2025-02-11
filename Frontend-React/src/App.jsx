//import { useState } from "react";
import "./App.css";
//import Login from "./Views/login";
//import Register from "./Views/register";
import ElementAdder from "./Views/ElementAdder";

function App() {
  /*const [showLogin, setShowLogin] = useState(true);

  const toggleView = () => {
    setShowLogin(!showLogin);
  };*/

  return (
    <div className="container">
      {/*<div className="form-box">
        {showLogin ? <Login /> : <Register />}
        <button className="switch-button" onClick={toggleView}>
          {showLogin ? "Registrarse" : "Inicio de Sesión"}
        </button>
      </div>*/}
      <ElementAdder />
    </div>
  );

}

export default App;
