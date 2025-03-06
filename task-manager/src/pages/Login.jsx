import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, Typography, Card, Space } from "antd";
import { LockFilled } from "@ant-design/icons";

const { Title, Text } = Typography;

const Login = ({ onChange }) => {
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [messagee, setMessagee] = useState("");


  const handleLogin = async (values) => {
    try {
      const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: values.username,
          password: values.password,
        }),
      });

      const data = await response.json();
      //console.log(data)
      if (response.status === 200) {

        localStorage.setItem("token", data.token);
        console.log(data)
        setShowModal(true)
        setMessagee(data.message)
      } else {
        setError(data.message);
      }
    } catch (error) {
      console.error(error);
      setError("Error de conexión al servidor");
    }
  };
  const cerrarModal = () => {
    setShowModal(false)
    if(messagee == "Inicio de sesión exitoso como usuario"){
      //console.log("hola");
    navigate("/dashboard");

    } else if (messagee == "Inicio de sesión exitoso como admin"){
      //console.log("hola2");
      navigate("/dashboard");
      
    }
  }


  return (
    <div>
      <Card
        style={{
          width: "100%",
          maxWidth: 350,
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          borderRadius: 20,
          paddingLeft: 20,
          paddingRight: 20,
        }}
      >
        <Space direction="vertical" size="middle" style={{ width: "100%" }}>
          <Title level={2} style={{ color: "#5c6b7e", textAlign: "center" }}>
            <LockFilled /> Inicio de sesión
          </Title>

          {error && (
            <Text type="danger" style={{ textAlign: "center", display: "block" }}>
              {error}
            </Text>
          )}

          <Form onFinish={handleLogin}>
            <Form.Item
              name="username"
              rules={[{ required: true, message: "¡Ingrese su usuario!" },   { type: "email", message: "¡Ingrese un email válido!" }]}
            >
              <Input placeholder="Email" />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[{ required: true, message: "¡Ingrese su contraseña!" }]}
            >
              <Input.Password placeholder="Contraseña" />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                style={{
                  width: "100%",
                  backgroundColor: "#5c6b7e",
                  borderColor: "#5c6b7e",
                }}
              >
                Iniciar sesión 
              </Button>
            </Form.Item>

            <Form.Item>
              <Button
                type="default"
                onClick={onChange}
                style={{
                  width: "100%",
                  backgroundColor: "#f0f2f5",
                  borderColor: "#5c6b7e",
                  color: "#5c6b7e",
                }}
              >
                Registrarse
              </Button>
            </Form.Item>
          </Form>
        </Space>
      </Card>
      
      {showModal && (
        <section
          style={{
            position: "fixed", 
            top: "40%", 
            left: "50%", 
            transform: "translate(-50%, -50%)", 
            padding: "20px", 
            backgroundColor: "white", 
            border: "1px solid rgb(48, 125, 161)", 
            boxShadow: "0 0 10px rgb(31, 91, 119)", 
            width: "300px", 
            height: "auto", 
            borderRadius: "20px", 
            display: "block", 
            textAlign: "center", 
          }}
          className="modal"
        >
          <p>
            <strong>{messagee}</strong>
          </p>
          <button
            className="cerrar"
            onClick={cerrarModal}
            style={{
              padding: "5px 10px",
              backgroundColor: "#d50404",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              marginTop: "10px",
            }}
          >
            Cerrar
          </button>
        </section>
      )}
    </div>
  );
};

export default Login;
