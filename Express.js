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
    
    const isMatch = await bcrypt.compare(password, userData.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Credenciales incorrectas" });
    }

    const token = jwt.sign({ email, username: userData.username }, SECRET_KEY, { expiresIn: "10m" });

    res.json({ token, message: "Inicio de sesión exitoso" });
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


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));
