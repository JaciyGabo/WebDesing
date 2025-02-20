import { useState, useEffect } from "react";
import { Modal, Input, Select, DatePicker, Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";

const { Option } = Select;

const DashboardPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState({
    name: "",
    description: "",
    deadline: null,
    status: "In Progress",
    category: "",
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    const getTasks = async () => {
      const tasks = await fetchTasks();
      if (tasks) {
        setTasks(tasks);
      }
    };

    getTasks();
  }, []);

  const showModal = () => setIsModalOpen(true);
  const handleCancel = () => setIsModalOpen(false);

  const handleInputChange = (e) => {
    setTask({ ...task, [e.target.name]: e.target.value });
  };

  const handleStatusChange = (value) => {
    setTask({ ...task, status: value });
  };

  const handleDateChange = (date, dateString) => {
    setTask({ ...task, deadline: dateString });
  };

  const handleCategoryChange = (value) => {
    setTask({ ...task, category: value });
  };

  const handleSaveTask = async () => {
    try {
      if (!task.dueDate) {
        console.error("El campo dueDate es requerido");
        return;
      }
      await addTask(task);
      console.log("Tarea guardada:", task);
      handleCancel();
      const updatedTasks = await fetchTasks();
      setTasks(updatedTasks);
      setTask({
        name: "",
        description: "",
        deadline: null,
        status: "In Progress",
        category: "",
      });
    } catch (error) {
      console.error("Error al guardar la tarea:", error);
    }
  };

  const addTask = async (task) => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch("http://localhost:3000/tasks", {
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
      const response = await fetch("http://localhost:3000/tasks", {
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
      setError("Error al obtener las tareas");
    }
  };

  const updateTask = async (taskId, updates) => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`http://localhost:3000/tasks/${taskId}`, {
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
      const response = await fetch(`http://localhost:3000/tasks/${taskId}`, {
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

  return (
    <div className="dashboard-container">
      <h2>Welcome to your Dashboard</h2>
      <p>Manage your tasks efficiently!</p>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <div className="tasks-list">
        {tasks.map((task) => (
          <div key={task.id} className="task-item">
            <h3>{task.name}</h3>
            <p>{task.description}</p>
            <p>Deadline: {task.deadline}</p>
            <p>Status: {task.status}</p>
            <p>Category: {task.category}</p>
            <Button onClick={() => deleteTask(task.id)}>Eliminar</Button>
            <Button onClick={() => updateTask(task.id, { status: "Done" })}>
              Marcar como Done
            </Button>
          </div>
        ))}
      </div>

      <button className="floating-button" onClick={showModal}>
        <PlusOutlined style={{ fontSize: "24px" }} />
      </button>

      <Modal
        title="Create New Task"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button key="save" type="primary" onClick={handleSaveTask}>
            Save Task
          </Button>,
        ]}
      >
        <Input
          placeholder="Name Task"
          name="name"
          value={task.name}
          onChange={handleInputChange}
          style={{ marginBottom: "10px" }}
        />

        <Input.TextArea
          placeholder="Description"
          name="description"
          value={task.description}
          onChange={handleInputChange}
          style={{ marginBottom: "10px" }}
        />

        <DatePicker
          placeholder="Deadline"
          style={{ width: "100%", marginBottom: "10px" }}
          onChange={(date, dateString) => setTask({ ...task, dueDate: dateString })}
        />

        <Select
          defaultValue="In Progress"
          style={{ width: "100%", marginBottom: "10px" }}
          onChange={handleStatusChange}
        >
          <Option value="In Progress">In Progress</Option>
          <Option value="Done">Done</Option>
          <Option value="Paused">Paused</Option>
          <Option value="Revision">Revision</Option>
        </Select>

        <Select
          placeholder="Category / Tag"
          style={{ width: "100%" }}
          onChange={handleCategoryChange}
        >
          <Option value="Work">Work</Option>
          <Option value="Personal">Personal</Option>
          <Option value="Study">Study</Option>
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

          .tasks-list {
            margin-top: 20px;
          }

          .task-item {
            border: 1px solid #ddd;
            padding: 10px;
            margin-bottom: 10px;
            border-radius: 5px;
          }
        `}
      </style>
    </div>
  );
};

export default DashboardPage;