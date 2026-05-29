import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";
import authRoutes from "./routes/authRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";

import Message from "./models/message.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);


const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// Store online users: userId -> socketId
const onlineUsers = new Map();

io.on("connection", (socket) => {
  console.log("User Connected:", socket.id);

  socket.on("join", (userId) => {
    socket.join(userId);
    onlineUsers.set(userId, socket.id);
    console.log(`User ${userId} joined room`);
  });

  socket.on("send_message", async (data) => {
    const { sender, receiver, text } = data;
    
    // Save to database
    try {
      const newMessage = await Message.create({
        sender,
        receiver,
        text,
        status: "sent"
      });

      // Emit to receiver's room
      io.to(receiver).emit("receive_message", {
        ...data,
        id: newMessage._id,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
      
      // Emit back to sender to confirm
      socket.emit("message_sent", { id: newMessage._id });

    } catch (err) {
      console.error("Error saving message:", err);
    }
  });

  socket.on("disconnect", () => {
    for (const [userId, socketId] of onlineUsers.entries()) {
      if (socketId === socket.id) {
        onlineUsers.delete(userId);
        break;
      }
    }
    console.log("User Disconnected");
  });
});

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/chat_app";

mongoose.connect(MONGODB_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("MongoDB Connection Error:", err));

app.get("/", (req, res) => {
  res.send("Chat Server Running");
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});