import { useEffect, useState } from "react";
import axios from "axios";
import { Table, Button, message } from "antd";
import { jwtDecode } from "jwt-decode";


const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");

  // Función para obtener usuarios
  const fetchUsers = async () => {
    const token = localStorage.getItem("token");
    const decoded = jwtDecode(token);
    console.log("Rol del usuario:", decoded.email);
    setEmail(decoded.email)
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:3000/users2", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Asegúrate de enviar el token
        },
      });
      setUsers(response.data.users);
    } catch (error) {
      message.error("Error al obtener los usuarios: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Función para actualizar el rol
  const handleRoleChange = async (email, currentRole) => {
    try {
      const response = await axios.put(
        `http://localhost:3000/users/${email}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Asegúrate de enviar el token
          },
        }
      );
      message.success(response.data.message);
      fetchUsers(); // Refrescar la lista de usuarios
    } catch (error) {
      message.error("Error al actualizar el rol: " + error.message);
    }
  };

  useEffect(() => {
    fetchUsers(); // Obtener usuarios al cargar el componente
  }, []);

  // Definir las columnas de la tabla
  const columns = [
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "Correo",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Rol",
      dataIndex: "role",
      key: "role",
      render: (role) => (role === 2 ? "Admin" : "Empleado"),
    },
    {
      title: "Acción",
      key: "action",
      render: (_, record) => (
        <Button onClick={() => handleRoleChange(record.email, record.role)}
        disabled={record.email === email}
        >
          Cambiar rol
        </Button>
      ),
    },
  ];

  return (
    <div>
      <h1>Usuarios</h1>
      <Table
        dataSource={users}
        columns={columns}
        rowKey="email"
        loading={loading} // Mostrar un spinner mientras se cargan los datos
        pagination={false} // Puedes agregar paginación si lo necesitas
      />
    </div>
  );
};

export default Users;