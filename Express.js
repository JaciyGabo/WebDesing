import express from "express";
import cors from "cors";
import admin from "firebase-admin";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs"; 
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_CREDENTIALS)),
});

const db = admin.firestore();
const SECRET_KEY = process.env.JWT_SECRET;
const SALT_ROUNDS = 10; 

app.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const userRef = db.collection("users").doc(email);
    const userDoc = await userRef.get();

    if (userDoc.exists) {
      return res.status(400).json({ message: "El usuario ya existe" });
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    await userRef.set({
      username,
      email,
      password: hashedPassword, 
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      role: 3
    });

    res.status(201).json({ message: "Registro exitoso" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error en el registro", error: error.message });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const userRef = db.collection("users").doc(email);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return res.status(401).json({ message: "Credenciales incorrectas" });
    }

    const userData = userDoc.data();
    //console.log(userData.role)
    
    const isMatch = await bcrypt.compare(password, userData.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Credenciales incorrectas" });
    }

    const token = jwt.sign({ email, username: userData.username, role: userData.role }, SECRET_KEY, { expiresIn: "1hr" });
    if(userData.role == 3){
      res.json({ token, message: "Inicio de sesión exitoso como usuario" });
    } else if (userData.role == 2){
      res.json({ token, message: "Inicio de sesión exitoso como admin" });
    }

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error en el inicio de sesión", error: error.message });
  }
});

const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(403).json({ message: "Token requerido" });
  }

  const token = authHeader.split(" ")[1];
  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) return res.status(401).json({ message: "Token inválido" });
    req.user = decoded;
    next();
  });
};

app.get("/protected", verifyToken, (req, res) => {
  res.json({ message: "Acceso autorizado", user: req.user });
});

app.post("/tasks", verifyToken, async (req, res) => {
  const { name, description, dueDate, reminder, status, category } = req.body;
  const userId = req.user.email;

  if (dueDate === undefined || dueDate === null) {
    return res.status(400).json({ message: "El campo dueDate es requerido" });
  }

  try {
    const taskRef = await db.collection("tasks").add({
      userId,
      name,
      description,
      dueDate,
      status,
      category,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.status(201).json({ message: "Tarea creada", taskId: taskRef.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al crear la tarea", error: error.message });
  }
});

app.get("/tasks", verifyToken, async (req, res) => {
  const userId = req.user.email;

  try {
    const snapshot = await db.collection("tasks").where("userId", "==", userId).get();
    const tasks = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    res.json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener las tareas", error: error.message });
  }
});

app.put("/tasks/:taskId", verifyToken, async (req, res) => {
  const { taskId } = req.params;
  const userId = req.user.email;
  const updates = req.body;

  try {
    const taskRef = db.collection("tasks").doc(taskId);
    const taskDoc = await taskRef.get();

    if (!taskDoc.exists || taskDoc.data().userId !== userId) {
      return res.status(403).json({ message: "No tienes permiso para modificar esta tarea" });
    }

    await taskRef.update(updates);
    res.json({ message: "Tarea actualizada" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al actualizar la tarea", error: error.message });
  }
});

app.delete("/tasks/:taskId", verifyToken, async (req, res) => {
  const { taskId } = req.params;
  const userId = req.user.email;

  try {
    const taskRef = db.collection("tasks").doc(taskId);
    const taskDoc = await taskRef.get();

    if (!taskDoc.exists || taskDoc.data().userId !== userId) {
      return res.status(403).json({ message: "No tienes permiso para eliminar esta tarea" });
    }

    await taskRef.delete();
    res.json({ message: "Tarea eliminada" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al eliminar la tarea", error: error.message });
  }
});
// Obtener usuarios
app.get("/users", verifyToken, async (req, res) => {
  try {
    const snapshot = await db.collection("users").get();
    const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json({ message: "Usuarios obtenidos exitosamente", users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener los usuarios", error: error.message });
  }
});

// Crear un grupo
app.post("/groups", verifyToken, async (req, res) => {
  const { name, userIds } = req.body;
  const createdBy = req.user.email;
  try {
    const groupRef = await db.collection("groups").add({
      name,
      userIds,
      createdBy,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    res.status(201).json({ message: "Grupo creado exitosamente", groupId: groupRef.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al crear el grupo", error: error.message });
  }
});

// Obtener grupos del usuario
app.get("/groups", verifyToken, async (req, res) => {
  const userId = req.user.email;
  try {
    const snapshot = await db.collection("groups").where("userIds", "array-contains", userId).get();
    const groups = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json({ message: "Grupos obtenidos exitosamente", groups });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener los grupos", error: error.message });
  }
});

// Crear tarea en un grupo
app.post("/groups/:groupId/tasks", verifyToken, async (req, res) => {
  const { name, description, dueDate, status, category, assignedTo } = req.body;
  const groupId = req.params.groupId;
  const userId = req.user.email;

  // Validar campos requeridos
  if (!name || !status || !category || !assignedTo) {
    return res.status(400).json({ message: "Faltan campos requeridos" });
  }

  try {
    // Verificar si el usuario es el creador del grupo
    const groupRef = db.collection("groups").doc(groupId);
    const groupDoc = await groupRef.get();

    if (!groupDoc.exists) {
      return res.status(404).json({ message: "Grupo no encontrado" });
    }

    const groupData = groupDoc.data();
    if (groupData.createdBy !== userId) {
      return res.status(403).json({ message: "Solo el creador del grupo puede agregar tareas" });
    }

    // Crear la tarea
    const taskRef = await db.collection("tasks").add({
      groupId,
      name,
      description: description || "",
      dueDate: dueDate || null,
      status,
      category,
      assignedTo,
      createdBy: userId,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.status(201).json({ message: "Tarea creada", taskId: taskRef.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al crear la tarea", error: error.message });
  }
});

// Endpoint para obtener tareas de un grupo
app.get("/groups/:groupId/tasks", verifyToken, async (req, res) => {
  const groupId = req.params.groupId;
  const userId = req.user.email;

  try {
    // Verificar si el usuario es miembro del grupo
    const groupRef = db.collection("groups").doc(groupId);
    const groupDoc = await groupRef.get();

    if (!groupDoc.exists) {
      return res.status(404).json({ message: "Grupo no encontrado" });
    }

    const groupData = groupDoc.data();
    if (!groupData.userIds.includes(userId)) {
      return res.status(403).json({ message: "No tienes permiso para ver las tareas de este grupo" });
    }

    // Obtener las tareas del grupo
    const snapshot = await db.collection("tasks").where("groupId", "==", groupId).get();
    const tasks = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    res.json({ message: "Tareas obtenidas exitosamente", tasks });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener las tareas", error: error.message });
  }
});

// Endpoint para actualizar el estado de una tarea
app.put("/tasks/:taskId/status", verifyToken, async (req, res) => {
  const { taskId } = req.params;
  const { status } = req.body;
  const userId = req.user.email;

  try {
    const taskRef = db.collection("tasks").doc(taskId);
    const taskDoc = await taskRef.get();

    if (!taskDoc.exists) {
      return res.status(404).json({ message: "Tarea no encontrada" });
    }

    const taskData = taskDoc.data();

    // Verificar si el usuario es el asignado a la tarea
    if (taskData.assignedTo !== userId) {
      return res.status(403).json({ message: "Solo el usuario asignado puede cambiar el estado de la tarea" });
    }

    // Actualizar el estado de la tarea
    await taskRef.update({ status });

    res.json({ message: "Estado de la tarea actualizado" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al actualizar el estado de la tarea", error: error.message });
  }
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));
