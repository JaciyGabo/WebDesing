import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, Typography, Card, Space } from "antd";

const { Title, Text } = Typography;

const Login = () => {
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
      if (response.status === 200) {
        localStorage.setItem("token", data.token);
        setShowModal(true);
        setMessagee(data.message);
      } else {
        setError(data.message);
      }
    } catch (error) {
      console.error(error);
      setError("Error de conexión al servidor");
    }
  };

  const cerrarModal = () => {
    setShowModal(false);
    if (messagee === "Inicio de sesión exitoso como usuario") {
      navigate("/dashboard");
    } else if (messagee === "Inicio de sesión exitoso como admin") {
      navigate("/dashboard");
    }
  };

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
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#09555B",
          borderWidth: "4px",
          borderColor: "#fff",
          borderStyle: "solid",
        }}
      >
        <Space direction="vertical" size="middle" style={{ width: "100%" }}>
          <Title level={2} style={{ color: "#fff", textAlign: "center" }}>
            Inicio de sesión
          </Title>

          {error && (
            <Text type="danger" style={{ textAlign: "center", display: "block" }}>
              {error}
            </Text>
          )}

          <Form onFinish={/*handleLogin*/ () => navigate("/dashboard")} style={{ width: "100%" }}>
            <div style={{ color: "#fff", fontSize: "0.9rem", marginBottom: "5px", textAlign: "left" }}>
              Correo:
            </div>
            <Form.Item
              name="username"
              rules={[{ required: true, message: "¡Ingrese su usuario!" }, { type: "email", message: "¡Ingrese un email válido!" }]}
            >
              <Input
                placeholder="Email"
                style={{
                  width: "100%",
                  backgroundColor: "transparent",
                  border: "2px solid #fff",
                  color: "#fff",
                  borderRadius: "30px",
                }}
                className="custom-placeholder"
              />
            </Form.Item>
            <div style={{ color: "#fff", fontSize: "0.9rem", marginBottom: "5px", textAlign: "left" }}>
              Contraseña:
            </div>
            <Form.Item
              name="password"
              rules={[{ required: true, message: "¡Ingrese su contraseña!" }]}
            >
              <Input.Password
                placeholder="Contraseña"
                style={{
                  width: "100%",
                  backgroundColor: "transparent",
                  border: "2px solid #fff",
                  color: "#fff",
                  borderRadius: "30px",
                }}
                className="custom-password"
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                style={{
                  width: "70%",
                  backgroundColor: "transparent",
                  border: "2px solid #fff",
                  color: "#fff",
                  borderRadius: "30px",
                }}
              >
                Ingresar
              </Button>
            </Form.Item>
          </Form>
        </Space>
      </Card>

      {showModal && (
        <section
          style={{
            position: "fixed",
            top: "50%",
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

      <style>
        {`
    .custom-password .ant-input-password-icon {
      color: white !important;
    }
    .custom-password .ant-input-password-icon:hover {
      color: white !important;
    }
    .custom-password::placeholder {
      color: white !important;
      opacity: 1; /* Asegura que el placeholder sea completamente visible */
    }
    .custom-placeholder::placeholder {
      color: white !important;
      opacity: 1; /* Asegura que el color se vea bien */
    }
    input:-ms-input-placeholder {
      color: white !important; /* Para IE */
    }
    input::-ms-input-placeholder {
      color: white !important; /* Para IE */
    }
    input::-webkit-input-placeholder {
      color: white !important; /* Para Webkit */
    }
    textarea::-webkit-input-placeholder {
      color: white !important; /* Para Webkit en textarea */
    }
  `}
      </style>
    </div>
  );
};

export default Login;

