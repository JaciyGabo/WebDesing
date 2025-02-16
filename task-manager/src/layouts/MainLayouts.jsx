import { Layout, Menu, Typography } from "antd";
import { Link } from "react-router-dom";
import {
  DashboardOutlined,
  UserOutlined,
  SettingOutlined,
} from "@ant-design/icons";


const { Header, Sider, Content } = Layout;
const { Title } = Typography;

const MainLayout = ({ children }) => {
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
            <Link to="/dashboard">Dashboard</Link>
          </Menu.Item>
          <Menu.Item key="2" icon={<UserOutlined />}>
            <Link to="/profile">Profile</Link>
          </Menu.Item>
          <Menu.Item key="3" icon={<SettingOutlined />}>
            <Link to="/settings">Settings</Link>
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