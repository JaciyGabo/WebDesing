import { useState, useEffect } from "react";
import { Modal, Input, Select, DatePicker, Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import './dash.css';
import config from "../config";

const { Option } = Select;

const DashboardPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [taskID, setTaskId] = useState(null);
  const [task, setTask] = useState({
    name: "",
    description: "",
    dueDate: null,
    status: "En progreso",
    category: "Trabajo",
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    const getTasks = async () => {
      const tasks = await fetchTasks();

      if (tasks) {
        const formattedTask = tasks.map(task => ({
          ...task,
          dueDate: task.dueDate ? dayjs(task.dueDate).format("DD/MM/YYYY") : "Sin fecha",
        }));

        setTasks(formattedTask);
      }
    };

    getTasks();
  }, []);

  const showModal = () => {
    setIsEditMode(false);
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setTask({
      name: "",
      description: "",
      dueDate: null,
      status: "En progreso",
      category: "Trabajo",
    });
  };

  const handleInputChange = (e) => {
    setTask({ ...task, [e.target.name]: e.target.value });
  };

  const handleStatusChange = (value) => {
    setTask({ ...task, status: value });
  };

  const handleCategoryChange = (value) => {
    setTask({ ...task, category: value });
  };

  const handleSaveTask = async () => {
    if (isEditMode) {
      await updateTask(taskID, {
        name: task.name,
        category: task.category,
        description: task.description,
        status: task.status,
        dueDate: task.dueDate ? task.dueDate.toISOString() : null
      });
      setIsModalOpen(false);
    } else {
      try {
        if (!task.dueDate) {
          console.error("El campo dueDate es requerido");
          return;
        }
        await addTask({ ...task, dueDate: task.dueDate.toISOString() });
        console.log("Tarea guardada:", task);
        handleCancel();
        const updatedTasks = await fetchTasks();
        setTasks(updatedTasks);
      } catch (error) {
        console.error("Error al guardar la tarea:", error);
      }
    }
  };

  const addTask = async (task) => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch( `${config.API_URL}/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(task),
      });

      const data = await response.json();
      if (response.ok) {
        console.log("Tarea creada:", data);
      } else {
        console.error("Error al crear la tarea:", data.message);
      }
    } catch (error) {
      console.error("Error al crear la tarea:", error);
    }
  };

  const fetchTasks = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`${config.API_URL}/tasks`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (response.ok) {
        return data;
      } else {
        setError(data.message || "Error al obtener las tareas");
      }
    } catch (error) {
      setError("Error al obtener las tareas", error);
    }
  };

  const updateTask = async (taskId, updates) => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`${config.API_URL}/tasks/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(updates),
      });

      const data = await response.json();
      if (response.ok) {
        console.log("Tarea actualizada:", data);
        const updatedTasks = await fetchTasks();
        setTasks(updatedTasks);
      } else {
        console.error("Error al actualizar la tarea:", data.message);
      }
    } catch (error) {
      console.error("Error al actualizar la tarea:", error);
    }
  };

  const deleteTask = async (taskId) => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`${config.API_URL}/tasks/${taskId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (response.ok) {
        console.log("Tarea eliminada:", data);
        const updatedTasks = await fetchTasks();
        setTasks(updatedTasks);
      } else {
        console.error("Error al eliminar la tarea:", data.message);
      }
    } catch (error) {
      console.error("Error al eliminar la tarea:", error);
    }
  };

  const handleEdit = (taskId, task) => {
    setTask({
      name: task.name,
      description: task.description,
      dueDate: task.dueDate ? dayjs(task.dueDate) : null,
      status: task.status,
      category: task.category,
    });
    setIsEditMode(true);
    setIsModalOpen(true);
    setTaskId(taskId);
  };

  const getTasksByStatus = (status) => {
    return tasks.filter(task => task.status === status);
  };

  return (
    <div className="dashboard-container">
      <h2>Maneja tus tareas eficientemente</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <div className="kanban-board">
        {["En progreso", "Pausado", "En revisión", "Completado"].map((status) => (
          <div key={status} className="kanban-column">
            <h3>{status}</h3>
            {getTasksByStatus(status).map((task) => (
              <div key={task.id} className="task-item">
                <h3>{task.name}</h3>
                <p>{task.description}</p>
                <p>Fecha límite: {task.dueDate}</p>
                <p>Status: {task.status}</p>
                <p>Categoria: {task.category}</p>
                <Button onClick={() => deleteTask(task.id)}>Eliminar</Button>
                <Button onClick={() => handleEdit(task.id, task)}>Editar</Button>
                <Button
                  onClick={() => updateTask(task.id, { status: "Completado" })}
                  disabled={task.status === "Completado"}
                >
                  Marcar como Completada
                </Button>
              </div>
            ))}
          </div>
        ))}
      </div>

      <button className="floating-button" onClick={showModal}>
        <PlusOutlined style={{ fontSize: "24px" }} />
      </button>

      <Modal
        title={isEditMode ? "Editar Tarea" : "Crear nueva tarea"}
        open={isModalOpen}
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            Cancelar
          </Button>,
          <Button key="save" type="primary" onClick={handleSaveTask}>
            {isEditMode ? "Guardar cambios" : "Guardar tarea"}
          </Button>,
        ]}
      >
        <Input
          placeholder="Nombre de la tarea"
          name="name"
          value={task.name}
          onChange={handleInputChange}
          style={{ marginBottom: "10px" }}
        />

        <Input.TextArea
          placeholder="Descripción"
          name="description"
          value={task.description}
          onChange={handleInputChange}
          style={{ marginBottom: "10px" }}
        />

        <DatePicker
          placeholder="Fecha Límite"
          style={{ width: "100%", marginBottom: "10px" }}
          value={task.dueDate ? dayjs(task.dueDate) : null}
          onChange={(date) => {
            setTask({ ...task, dueDate: date ? dayjs(date) : null });
          }}
        />

        <Select
          value={task.status}
          style={{ width: "100%", marginBottom: "10px" }}
          onChange={handleStatusChange}
        >
          <Option value="En progreso">En progreso</Option>
          <Option value="Pausado">Pausado</Option>
          <Option value="En revisión">En revisión</Option>
          <Option value="Completado">Completado</Option>
        </Select>

        <Select
          defaultValue="Personal"
          value={task.category}
          placeholder="Categoria"
          style={{ width: "100%" }}
          onChange={handleCategoryChange}
        >
          <Option value="Work">Trabajo</Option>
          <Option value="Personal">Personal</Option>
          <Option value="Study">Escolar</Option>
        </Select>
      </Modal>

      <style>
        {`
          .floating-button {
            position: fixed;
            bottom: 30px;
            right: 30px;
            background-color: rgb(25, 99, 173);
            color: white;
            border: none;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: background 0.3s ease;
          }
          
          .floating-button:hover {
            background-color: #40a9ff;
          }

          .kanban-board {
            display: flex;
            gap: 16px;
            margin-top: 20px;
          }

          .kanban-column {
            flex: 1;
            border: 1px solid #ddd;
            padding: 10px;
            border-radius: 5px;
            background-color: #f9f9f9;
          }

          .task-item {
            border: 1px solid #ddd;
            padding: 10px;
            margin-bottom: 10px;
            border-radius: 5px;
            background-color: white;
          }
        `}
      </style>
    </div>
  );
};

export default DashboardPage;