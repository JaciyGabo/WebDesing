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
const blacklistedTokens = new Set(); 

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
    //console.log(userDoc);

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

app.post("/logout", (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (token) {
    blacklistedTokens.add(token); // Agregar token a la lista negra
    res.json({ message: "Cierre de sesión exitoso" });
  } else {
    res.status(400).json({ message: "No se proporcionó un token" });
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
  const { name, description, dueDate, status, category } = req.body;
  const userId = req.user.email;

  if (!dueDate) {
    return res.status(400).json({ message: "El campo dueDate es requerido" });
  }

  // Convertir la fecha al formato "YYYY-MM-DD"
  const formattedDueDate = new Date(dueDate).toISOString().split("T")[0];

  try {
    const taskRef = await db.collection("tasks").add({
      userId,
      name,
      description,
      dueDate: formattedDueDate, // Guardar solo la fecha sin la hora
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

    if (updates.dueDate) {
      updates.dueDate = updates.dueDate.split("T")[0]; // Extrae solo la parte de la fecha
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
    // Obtener solo los usuarios cuyo rol sea 3 (empleados)
    const snapshot = await db.collection("users").where("role", "==", 3).get();

    if (snapshot.empty) {
      return res.json({ message: "No hay empleados registrados.", users: [] });
    }

    const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    res.json({ message: "Empleados obtenidos exitosamente", users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener los empleados", error: error.message });
  }
});

app.get("/users2", verifyToken, async (req, res) => {
  try {
    const snapshot = await db.collection("users").get();
    const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    console.log(users);
    res.json({ message: "Usuarios obtenidos exitosamente", users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener los usuarios", error: error.message });
  }
});


app.put("/users/:email", verifyToken, async (req, res) => {
  try {
    const { email } = req.params; // Email del usuario a modificar
    const adminEmail = req.user.email; // Email del usuario autenticado

    // Buscar al usuario que está haciendo la petición
    const adminQuery = await db.collection("users").where("email", "==", adminEmail).get();

    if (adminQuery.empty) {
      return res.status(403).json({ message: "Acceso denegado. Usuario no encontrado." });
    }

    const adminData = adminQuery.docs[0].data();

    // Validar que el usuario autenticado sea admin (role: 2)
    if (adminData.role !== 2) {
      return res.status(403).json({ message: "Acceso denegado. Solo un administrador puede modificar usuarios." });
    }

    // Buscar al usuario a modificar
    const userQuery = await db.collection("users").where("email", "==", email).get();

    if (userQuery.empty) {
      return res.status(404).json({ message: "Usuario no encontrado." });
    }

    const userDocRef = userQuery.docs[0].ref;
    const userData = userQuery.docs[0].data();

    // Verificar si el rol es 2 o 3 y alternarlo
    if (userData.role === 2) {
      await userDocRef.update({ role: 3 });
      res.json({ message: "Rol actualizado a 3" });
    } else if (userData.role === 3) {
      await userDocRef.update({ role: 2 });
      res.json({ message: "Rol actualizado a 2" });
    } else {
      res.status(400).json({ message: "El usuario no tiene un rol modificable (solo roles 2 y 3 pueden cambiarse)." });
    }
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar el usuario", error: error.message });
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
  const userId = req.user.email; // Obtiene el correo del usuario desde el token
  
  try {
    // Realiza dos consultas:
    // 1. Grupos donde el usuario es miembro (userIds contiene el userId)
    // 2. Grupos que el usuario ha creado (creatorId igual al userId)
    const userGroupsSnapshot = await db.collection("groups")
      .where("userIds", "array-contains", userId) // Busca los grupos donde el usuario es miembro
      .get();

    const createdGroupsSnapshot = await db.collection("groups")
      .where("createdBy", "==", userId) // Busca los grupos que el usuario ha creado
      .get();
    
    // Une los resultados de ambas consultas
    const groups = [
      ...userGroupsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })),
      ...createdGroupsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    ];

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
    // Obtener los datos del grupo
    const groupRef = db.collection("groups").doc(groupId);
    const groupDoc = await groupRef.get();

    if (!groupDoc.exists) {
      return res.status(404).json({ message: "Grupo no encontrado" });
    }

    const groupData = groupDoc.data();

    // Verificar si el usuario es miembro o creador del grupo
    if (!groupData.userIds.includes(userId) && groupData.createdBy !== userId) {
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
