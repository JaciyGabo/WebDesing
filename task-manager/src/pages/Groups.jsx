import { useEffect, useState } from "react";
import { Button, Modal, Form, Input, DatePicker, Select, List, Card, message, Tag  } from "antd";
import axios from "axios";
import dayjs from "dayjs";
import { jwtDecode } from "jwt-decode";

const { Option } = Select;


const Groups = () => {
  const [groups, setGroups] = useState([]);
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [taskData, setTaskData] = useState({
    name: "",
    description: "",
    dueDate: null,
    status: "",
    category: "",
    assignedTo: "",
  });
  const [groupName, setGroupName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [visible, setVisible] = useState(false);
  const [taskModalVisible, setTaskModalVisible] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [groupTasksVisible, setGroupTasksVisible] = useState(false);
  const [role, setRole] = useState(0)


  useEffect(() => {
    const token = localStorage.getItem("token");

    fetchUsers();
    fetchGroups();

    if (token) {
      try {
        const decoded = jwtDecode(token);
        console.log("Rol del usuario:", decoded.role);
        setRole(decoded.role)
      } catch (error) {
        console.error("Error al decodificar el token:", error);
      }
    } else {
      console.log("No hay token disponible.");
    }
    // Configurar un intervalo para recargar los datos cada 3 minutos
  const intervalId = setInterval(() => {
    fetchUsers();
    fetchGroups();
  }, 180000); // 180,000 milisegundos = 3 minutos

  // Limpiar el intervalo cuando el componente se desmonte
  return () => clearInterval(intervalId);
}, []);

  // Función para obtener usuarios
  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token"); // Obtén el token del localStorage
      const res = await axios.get("http://localhost:3000/users", {
        headers: {
          Authorization: `Bearer ${token}`, // Envía el token en el encabezado
        },
      });
      setUsers(res.data.users);
    } catch (error) {
      console.error("Error al obtener usuarios", error);
      message.error("Error al obtener usuarios");
    }
  };

  // Función para obtener grupos
  const fetchGroups = async () => {
    try {
      const token = localStorage.getItem("token"); // Obtén el token del localStorage
      const res = await axios.get("http://localhost:3000/groups", {
        headers: {
          Authorization: `Bearer ${token}`, // Envía el token en el encabezado
        },
      });
      console.log("Respuesta del backend (fetchGroups):", res.data);
      setGroups(res.data.groups);
    } catch (error) {
      console.error("Error al obtener grupos", error);
      message.error("Error al obtener grupos");
    }
  };
  // Función para obtener tareas de un grupo
  const fetchGroupTasks = async (groupId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`http://localhost:3000/groups/${groupId}/tasks`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTasks(res.data.tasks);
    } catch (error) {
      console.error("Error al obtener tareas", error);
      message.error("Error al obtener tareas");
    }
  };
  // Función para abrir el modal de tareas de un grupo
  const handleOpenGroupTasks = (group) => {
    setSelectedGroup(group);
    fetchGroupTasks(group.id);
    setGroupTasksVisible(true);
  };
  // Función para actualizar el estado de una tarea
  const handleUpdateTaskStatus = async (taskId, status) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:3000/tasks/${taskId}/status`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      message.success("Estado de la tarea actualizado");
      fetchGroupTasks(selectedGroup.id); // Refrescar la lista de tareas
    } catch (error) {
      console.error("Error al actualizar el estado de la tarea", error);
      message.error("Error al actualizar el estado de la tarea");
    }
  };
  // Función para crear un grupo
  const handleCreateGroup = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "http://localhost:3000/groups",
        { name: groupName, userIds: selectedUsers },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Grupo creado:", res.data); // Verifica la respuesta
      fetchGroups(); // Vuelve a obtener los grupos
      message.success("Grupo creado exitosamente");
      setVisible(false);
      setGroupName("");
      setSelectedUsers([]);
    } catch (error) {
      console.error("Error al crear grupo", error);
      message.error("Error al crear grupo");
    }
  };
  // Función para abrir el modal de tareas
  const handleOpenTaskModal = (group) => {
    setSelectedGroup(group);
    setTaskModalVisible(true);
  };
  // Función para crear una tarea en un grupo
  const handleCreateTask = async () => {
    if (!selectedGroup) return;

    try {
      const token = localStorage.getItem("token");
      const taskDataToSend = {
        name: taskData.name,
        description: taskData.description || "", // Si description es undefined, usa un string vacío
        dueDate: taskData.dueDate ? taskData.dueDate : null, // Convierte a formato ISO
        status: taskData.status,
        category: taskData.category,
        assignedTo: taskData.assignedTo,
      };

      const res = await axios.post(
        `http://localhost:3000/groups/${selectedGroup.id}/tasks`,
        taskDataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Tarea creada:", res.data);
      message.success("Tarea creada exitosamente");
      setTaskModalVisible(false);
      setTaskData({
        name: "",
        description: "",
        dueDate: null,
        status: "",
        category: "",
        assignedTo: "",
      });
    } catch (error) {
      console.error("Error al crear tarea", error);
      message.error("Error al crear tarea");
    }
  };

  return (
    <div>
      {role === 2 && ( // Mostrar el botón solo si el rol es 2
        <Button style={{ marginBottom: "10px" }} type="primary" onClick={() => setVisible(true)}>
          Crear Grupo
        </Button>
      )}
      <List
        grid={{ gutter: 16, column: 4 }}
        dataSource={groups}
        renderItem={(group) => (
          <List.Item>
            <Card
              title={group.name}
              actions={[
                role === 2 && <Button onClick={() => handleOpenTaskModal(group)}>Agregar Tarea</Button>,
                <Button onClick={() => handleOpenGroupTasks(group)}> Ver tareas </Button>
              ]}
              
            >
              Miembros: {group.userIds && Array.isArray(group.userIds)
                ? group.userIds.map((userId) => users.find((u) => u.id === userId)?.username).join(", ")
                : "No hay miembros"}
            </Card>
          </List.Item>
        )}
      />

      {/* Modal para crear grupo */}
      <Modal visible={visible} onCancel={() => setVisible(false)} onOk={handleCreateGroup} title="Crear Grupo">
        <Form layout="vertical">
          <Form.Item label="Nombre del grupo">
            <Input value={groupName} onChange={(e) => setGroupName(e.target.value)} />
          </Form.Item>
          <Form.Item label="Seleccionar Miembros">
            <Select mode="multiple" value={selectedUsers} onChange={setSelectedUsers} style={{ width: "100%" }}>
              {users.map((user) => (
                <Option key={user.id} value={user.id}>{user.username}</Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal para agregar tareas */}
      <Modal
        visible={taskModalVisible}
        onCancel={() => setTaskModalVisible(false)}
        onOk={handleCreateTask}
        title={"Crear nueva tarea"}
        footer={[
          <Button key="cancel" onClick={() => setTaskModalVisible(false)}>
            Cancelar
          </Button>,
          <Button key="save" type="primary" onClick={handleCreateTask}>
            {"Guardar tarea"}
          </Button>,
        ]}
      >
        <Form layout="vertical">
          {/* Nombre de la tarea */}
          <Form.Item label="Nombre de la tarea">
            <Input
              value={taskData.name}
              onChange={(e) => setTaskData({ ...taskData, name: e.target.value })}
            />
          </Form.Item>

          {/* Descripción de la tarea */}
          <Form.Item label="Descripción">
            <Input.TextArea
              value={taskData.description}
              onChange={(e) =>
                setTaskData({ ...taskData, description: e.target.value })
              }
            />
          </Form.Item>

          {/* Fecha límite */}
          <Form.Item label="Fecha Límite">
            <DatePicker
              style={{ width: "100%" }}
              value={taskData.dueDate ? dayjs(taskData.dueDate) : null}
              onChange={(date) =>
                setTaskData({ ...taskData, dueDate: date ? date : null })
              }
            />
          </Form.Item>

          {/* Estado de la tarea */}
          <Form.Item label="Estado">
            <Select
              value={taskData.status}
              onChange={(value) => setTaskData({ ...taskData, status: value })}
              style={{ width: "100%" }}
            >
              <Option value="En progreso">En progreso</Option>
              <Option value="Pausado">Pausado</Option>
              <Option value="En revisión">En revisión</Option>
              <Option value="Completado">Completado</Option>
            </Select>
          </Form.Item>

          {/* Categoría de la tarea */}
          <Form.Item label="Categoría">
            <Select
              value={taskData.category}
              onChange={(value) => setTaskData({ ...taskData, category: value })}
              style={{ width: "100%" }}
            >
              <Option value="Trabajo">Trabajo</Option>
              <Option value="Personal">Personal</Option>
              <Option value="Escolar">Escolar</Option>
            </Select>
          </Form.Item>

          {/* Asignar a */}
          <Form.Item label="Asignar a">
            <Select
              value={taskData.assignedTo}
              onChange={(value) => setTaskData({ ...taskData, assignedTo: value })}
              style={{ width: "100%" }}
            >
              {selectedGroup &&
                selectedGroup.userIds.map((userId) => {
                  const user = users.find((u) => u.id === userId);
                  return user ? (
                    <Option key={user.id} value={user.id}>
                      {user.username}
                    </Option>
                  ) : null;
                })}
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal para ver tareas de un grupo */}
      <Modal
        visible={groupTasksVisible}
        onCancel={() => setGroupTasksVisible(false)}
        footer={null}
        title={`Tareas del grupo: ${selectedGroup?.name}`}
      >
        <List
          dataSource={tasks}
          renderItem={(task) => (
            <List.Item>
              <Card
                title={task.name}
                extra={<Tag color={task.status === "Done" ? "green" : "blue"}>{task.status}</Tag>}
              >
                <p>{task.description}</p>
                <p>Asignado a: {users.find((u) => u.id === task.assignedTo)?.username}</p>
                <Select
                  defaultValue={task.status}
                  onChange={(value) => handleUpdateTaskStatus(task.id, value)}
                >
                  <Option value="In Progress">En progreso</Option>
                  <Option value="Done">Completado</Option>
                  <Option value="Paused">Pausado</Option>
                  <Option value="Revision">En revisión</Option>
                </Select>
              </Card>
            </List.Item>
          )}
        />
      </Modal>
    </div>
  );
};

export default Groups;