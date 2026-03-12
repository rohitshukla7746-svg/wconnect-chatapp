import dns from "dns";
dns.setDefaultResultOrder("ipv4first");

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { createServer } from "http";
import { Server } from "socket.io";
import { initSocket } from "./lib/socket.js";

import pool from "./lib/db.js";
import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import roomRoutes from "./routes/room.route.js";
import messageRoutes from "./routes/message.route.js";

dotenv.config();

const app = express();
const httpServer = createServer(app);

export const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL,
    credentials: true,
  }
});

// ✅ Initialize socket
initSocket(io);

app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

const PORT = process.env.PORT;

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/messages", messageRoutes);

httpServer.listen(PORT, async () => {
  console.log(`🚀 Server running on ${PORT}`);
  try {
    await pool.query("SELECT 1");
    console.log("✅ DB connected");
  } catch (err) {
    console.error("❌ DB not connected", err);
  }
});