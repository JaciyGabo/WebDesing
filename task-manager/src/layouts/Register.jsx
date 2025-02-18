import { useState } from "react";
//import { useNavigate } from "react-router-dom";
import { Form, Input, Button, Typography, Card, Space, message } from "antd";
import { UserAddOutlined } from "@ant-design/icons";
import './modal.css';

const { Title } = Typography;

const Register = ({ onChange }) => {
  const [loading, setLoading] = useState(false);
  //const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [messagee, setMessagee] = useState(""); // Estado para el mensaje

  const handleRegister = async (values) => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:3000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await response.json();
      if (response.ok) {
        // Si la respuesta es OK, mostrar el mensaje de éxito
        message.success(data.message || "Usuario creado correctamente.");
        //onChange(); // Redirigir o cambiar la vista (si es necesario)
        setShowModal(true); // Mostrar el modal
        setMessagee(data.message || "Usuario creado correctamente"); // Actualizar el mensaje en el estado
      } else {
        // Si hubo un error en la respuesta, mostrar el mensaje de error
        message.error(data.message || "Error en el registro.");
      }
    } catch (error) {
      // En caso de un error en la solicitud, mostrar un mensaje de error genérico
      message.error("Hubo un error al realizar el registro. Intente de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const cerrarModal = () => {
    setShowModal(false)
    onChange()
  }

  return (
    <div>
      <Card
        style={{
          width: "100%",
          maxWidth: 350,
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          borderRadius: 20,
          padding: 20,
        }}
      >
        <Space direction="vertical" size="middle" style={{ width: "100%" }}>
          <Title level={2} style={{ color: "#5c6b7e", textAlign: "center" }}>
            <UserAddOutlined /> Registro
          </Title>

          <Form onFinish={handleRegister} layout="vertical">
            <Form.Item
              name="username"
              rules={[{ required: true, message: "¡Ingrese su usuario!" }]}
            >
              <Input placeholder="Usuario" />
            </Form.Item>

            <Form.Item
              name="email"
              rules={[
                { required: true, message: "¡Ingrese su email!" },
                { type: "email", message: "¡Ingrese un email válido!" }
              ]}
            >
              <Input placeholder="Correo Electrónico" />
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
                loading={loading}
                style={{ width: "100%", backgroundColor: "#5c6b7e", borderColor: "#5c6b7e" }}
              >
                Registrarse
              </Button>
            </Form.Item>
            
            <Form.Item>
              <Button
                type="default"
                onClick={onChange}
                style={{ width: "100%", backgroundColor: "#f0f2f5", borderColor: "#5c6b7e", color: "#5c6b7e" }}
              >
                ¿Ya tienes cuenta? Inicia sesión
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
            <strong>{messagee}</strong> {/* Usando el estado messagee */}
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
              marginTop: "10px", // Espacio superior para separar el botón del texto
            }}
          >
            Cerrar
          </button>
        </section>
      )}
    </div>
  );
};

export default Register;
