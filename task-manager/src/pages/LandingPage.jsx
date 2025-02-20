import  { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Typography, Spin, Space } from "antd";

const { Title, Paragraph, Text } = Typography;

const LandingPage = () => {
  const navigate = useNavigate();
  

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/login");
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);
 
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        background: "linear-gradient(135deg, #f0f2f5, #e2e8f0)"
      }}
    >
      <Space direction="vertical" align="center" size="large">
       
        <Title
          level={1}
          style={{ color: "#5c6b7e", marginBottom: 0 }}
        >
          ¡Bienvenido a Task Manager!
        </Title>

        <Paragraph style={{ fontSize: "18px", color: "#7f8c8d" }}>
          Administra tus tareas de manera eficiente.
        </Paragraph>

        <Spin size="large" style={{ color: "#5c6b7e" }} />

        <Text type="secondary" style={{ color: "#95a5a6" }}>
          Cargando login...
        </Text>
      </Space>
    </div>
  );
};

export default LandingPage;