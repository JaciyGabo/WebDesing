import { useState } from "react";
import { Form, Input, Button, Typography, Card, Space, message } from "antd";
//import { UserAddOutlined } from "@ant-design/icons";

const { Title } = Typography;

const Register = () => {
  const [loading, setLoading] = useState(false);
  //const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [messagee, setMessagee] = useState("");

  const handleRegister = async (values) => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:3000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await response.json();
      console.log(data);

      if (response.ok) {
        message.success(data.message || "Usuario creado correctamente.");
        setShowModal(true);
        setMessagee(data.message || "Usuario creado correctamente");
      } else {
        message.error(data.message || "Error en el registro.");
        setShowModal(true);
        setMessagee(data.message);
      }
    } catch (error) {
      message.error("Hubo un error al realizar el registro. Intente de nuevo.", error);
    } finally {
      setLoading(false);
    }
  };

  const cerrarModal = () => {
    setShowModal(false)
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
            Registrarse
          </Title>

          <Form onFinish={handleRegister} style={{ width: "100%" }}>
            <div style={{ color: "#fff", fontSize: "0.9rem", marginBottom: "5px", textAlign: "left" }}>
              Usuario:
            </div>
            <Form.Item
              name="username"
              rules={[{ required: true, message: "¡Ingrese su usuario!" }]}
            >
              <Input placeholder="Usuario"
                style={{
                  width: "100%",
                  backgroundColor: "transparent",
                  border: "2px solid #fff",
                  color: "#fff",
                  borderRadius: "30px",
                }} />
            </Form.Item>


            <div style={{ color: "#fff", fontSize: "0.9rem", marginBottom: "5px", textAlign: "left" }}>
              Correo:
            </div>
            <Form.Item
              name="email"
              rules={[
                { required: true, message: "¡Ingrese su email!" },
                { type: "email", message: "¡Ingrese un email válido!" }
              ]}
            >
              <Input placeholder="Correo Electrónico"
                style={{
                  width: "100%",
                  backgroundColor: "transparent",
                  border: "2px solid #fff",
                  color: "#fff",
                  borderRadius: "30px",
                }} />
            </Form.Item>
            <div style={{ color: "#fff", fontSize: "0.9rem", marginBottom: "5px", textAlign: "left" }}>
              Contraseña:
            </div>
            <Form.Item
              name="password"
              rules={[{ required: true, message: "¡Ingrese su contraseña!" }]}
            >
              <Input.Password placeholder="Contraseña"
                style={{
                  width: "100%",
                  backgroundColor: "transparent",
                  border: "2px solid #fff",
                  color: "#fff",
                  borderRadius: "30px",
                }} />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                style={{
                  width: "70%",
                  backgroundColor: "transparent",
                  border: "2px solid #fff",
                  color: "#fff",
                  borderRadius: "30px",
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
