import express from "express";
import admin from "firebase-admin";
import cors from "cors";
import dotenv from "dotenv";
import { readFileSync } from "fs";
import { createServer } from "http";
import { Server as SocketIOServer } from "socket.io";

// Load environment variables
dotenv.config();

const serviceAccountPath = process.env.FIREBASE_CREDENTIALS_PATH || "./firebase-admin-sdk.json";

try {
  const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, "utf8"));

  // Initialize Firebase
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });

  console.log("✅ Firebase initialized successfully");
} catch (error) {
  console.error("❌ Firebase initialization failed:", error.message);
  process.exit(1);
}

// Firestore database reference
const db = admin.firestore();
const attackLogsRef = db.collection("attack_logs");

// Initialize Express
const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 5000;

// Create HTTP Server
const server = createServer(app);

// ✅ Socket.IO Server
const io = new SocketIOServer(server, {
  cors: { origin: "*" },
});
io.on("connection", (socket) => {
  console.log("🟢 Client connected to Socket.IO");

  socket.on("disconnect", () => {
    console.log("🔴 Client disconnected");
  });
});

// ✅ Get All Attack Logs
app.get("/api/attacks", async (req, res) => {
  try {
    const snapshot = await attackLogsRef.get();
    const attackLogs = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    console.log(`✅ Retrieved ${attackLogs.length} Attack Logs`);
    res.status(200).json(attackLogs);
  } catch (error) {
    console.error("🔥 Error Fetching Logs:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

// ✅ Log Attacks (Handles Both Single Object & Array)
app.post("/api/attacks", async (req, res) => {
  try {
    let attackData = req.body;

    if (Array.isArray(attackData)) {
      await Promise.all(
        attackData.map(async (attack) => {
          await attackLogsRef.add(attack);
        })
      );
    } else {
      await attackLogsRef.add(attackData);
    }

    console.log("🔥 Attack(s) Logged Successfully");

    // Send update to all connected clients
    io.emit("newAttackLog", attackData);

    res.status(200).json({ message: "Attack(s) logged successfully" });
  } catch (error) {
    console.error("🔥 Error Saving Attack:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ✅ Get Attack Trends
app.get("/api/trends", async (req, res) => {
  try {
    const snapshot = await attackLogsRef.get();
    const trendData = {};

    snapshot.docs.forEach((doc) => {
      const attack = doc.data();
      trendData[attack.type] = (trendData[attack.type] || 0) + 1;
    });

    const trends = Object.keys(trendData).map((type) => ({
      type,
      count: trendData[type],
    }));

    res.status(200).json(trends);
  } catch (error) {
    console.error("🔥 Error Fetching Trends:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

// ✅ Emit Test Log Every 5 Sec (For Debugging)
setInterval(() => {
  const testLog = {
    type: "Brute Force",
    sourceIP: "192.168.1.10",
    timestamp: Date.now(),
  };
  io.emit("newAttackLog", testLog);
  console.log("🚀 Sent test log:", testLog);
}, 5000);
setInterval(() => {
  const testLog = {
    type: "DDoS",
    sourceIP: "192.158.9.33",
    timestamp: Date.now(),
  };
  io.emit("newAttackLog", testLog);
  console.log("🚀 Sent test log:", testLog);
}, 2000);

// ✅ Start Server
server.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
