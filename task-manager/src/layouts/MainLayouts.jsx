import { useState, useEffect } from "react";
import { Layout, Menu, Typography } from "antd";
import { Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

import {
  DashboardOutlined,
  TeamOutlined ,
  UsergroupAddOutlined,
  LogoutOutlined,
} from "@ant-design/icons";


const { Header, Sider, Content } = Layout;
const { Title } = Typography;

const MainLayout = ({ children }) => {
   const [role, setRole] = useState(0)
   
  useEffect(() => {
      const token = localStorage.getItem("token");
  

  
      if (token) {
        try {
          const decoded = jwtDecode(token);
          //console.log("Rol del usuario:", decoded.role);
          setRole(decoded.role)
        } catch (error) {
          console.error("Error al decodificar el token:", error);
        }
      } else {
        console.log("No hay token disponible.");
      }
    }, []);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider 
        width={200}
        theme="dark"
        style={{
          background: "#5c6b7e",
        }}
      >
        <div
          style={{
            padding: "16px",
            textAlign: "center",
            background: "#4a5568",
          }}
        >
          <Title level={4} style={{ color: "#fff", margin: 0 }}>
            Task Manager
          </Title>
        </div>
        <Menu
          mode="vertical"
          theme="dark"
          defaultSelectedKeys={["1"]}
          style={{ background: "#5c6b7e", borderRight: 0 }}
        >
          <Menu.Item key="1" icon={<DashboardOutlined />}>
            <Link to="/dashboard">Inicio</Link>
          </Menu.Item>
          <Menu.Item key="2" icon={<TeamOutlined  />}>
            <Link to="/groups">Grupos</Link>
          </Menu.Item>
          {role === 2 && (
            <Menu.Item key="3" icon={<UsergroupAddOutlined />}>
              <Link to="/users">Usuarios</Link>
            </Menu.Item>
          )}
          <Menu.Item key="4" icon={<LogoutOutlined />}>
            <Link to="/login">Cerrar sesión</Link>
          </Menu.Item>
        </Menu>
      </Sider>

      <Layout>
        <Header
          style={{
            background: "#fff",
            padding: "0 24px",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
            zIndex: 1, 
          }}
        >
          <Title level={4} style={{ color: "#5c6b7e", margin: 0 }}>
            Task Manager
          </Title>
        </Header>

        <Content
          style={{
            margin: "16px",
            padding: 24,
            background: "#fff",
            borderRadius: 8,
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)", 
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;

