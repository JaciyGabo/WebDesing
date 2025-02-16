import  { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, Typography, Card, Space } from "antd"; 
import { LockFilled } from "@ant-design/icons";

const { Title, Text } = Typography;

const users = [{ username: "admin", password: "1234" }];

const LoginPage = () => {
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = (values) => {
    const user = users.find(
      (u) => u.username === values.username && u.password === values.password
    );

    if (user) {
      navigate("/dashboard");
    } else {
      setError("Invalid credentials");
    }
  };

  return (
    <div
    
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh", 
        backgroundColor: "#f0f2f5", 
      }}
    >
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
           <LockFilled/> Login
          </Title>

          {error && (
            <Text type="danger" style={{ textAlign: "center", display: "block" }}>
              {error}
            </Text>
          )}

          <Form onFinish={handleLogin}>
            <Form.Item
              name="username"
              rules={[{ required: true, message: "Please input your username!" }]}
            >
              <Input placeholder="Username" />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[{ required: true, message: "Please input your password!" }]}
            >
              <Input.Password placeholder="Password" />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                style={{ width: "100%", backgroundColor: "#5c6b7e", borderColor: "#5c6b7e" }}
              >
                Login
              </Button>
            </Form.Item>
          </Form>
        </Space>
      </Card>
    </div>
  );
};

export default LoginPage;