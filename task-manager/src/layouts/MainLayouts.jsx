import { Layout, Menu, Dropdown, Avatar } from "antd";
import { MenuOutlined } from "@ant-design/icons";
import logo from "../assets/PrrSagaLogo.png";
import { Link } from "react-router-dom";
import './dash.css'
const { Header, Content } = Layout;

const MainLayout = ({ children }) => {

  const menu = (
    <Menu style={{ width: 200, background: "#28979f" }}>
      <Menu.Item
        key="profile"
        style={{ color: "white", fontSize: "20px", textAlign: "center" }}
      >
        Perfil
      </Menu.Item>
      <Menu.Item
        key="report"
        style={{ color: "white", fontSize: "20px", textAlign: "center" }}
      >
        Reportar error
      </Menu.Item>
      <Menu.Item
        key="logout"
        style={{ color: "white", fontSize: "20px", textAlign: "center" }}
      >
        Cerrar sesión
      </Menu.Item>
    </Menu>
  );

  return (
    <Layout style={{ minHeight: "100vh" }}>

      <Layout style={{ background: "#b0cfd1" }}>
        <Header
          style={{
            background: "#09555B",
            padding: "0 50px",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
            zIndex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: "100px"
          }}
        >
          {/* Foto y título */}
          <div style={{ display: "flex", alignItems: "center", gap: 16, }}>
            <Avatar
              src={logo} // URL de la foto
              size={80}
            />

          </div>

          {/* Menú de enlaces */}
          <Menu
            theme="light"
            mode="horizontal"
            defaultSelectedKeys={["inicio"]}
            style={{ flex: 1, justifyContent: "center", background: "transparent" }}
            className="custom-menu"
          >
            <Menu.Item key="inicio" >
              <Link to="/dashboard">Inicio</Link>
            </Menu.Item>
            <Menu.Item key="amigos" >
              <Link to="/my-friends">Mis amigos</Link>
            </Menu.Item>
            <Menu.Item key="gatos" >
              <Link to="/my-cats">Mis gatos</Link>
            </Menu.Item>
          </Menu>

          {/* Menú desplegable */}
          <Dropdown overlay={menu} trigger={["click"]}>
            <div style={{ cursor: "pointer", display: "flex", alignItems: "center" }}>
              <Avatar
                size={50}
                icon={<MenuOutlined />}
              />
            </div>
          </Dropdown>
        </Header>

        <Content
          style={{
            padding: 24,
            background: "#202020",
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

