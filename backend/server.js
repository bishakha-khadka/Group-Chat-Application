import express, { json } from "express";
import { Server } from "socket.io";
import http from "http";
import cors from "cors";
import connectToMongoDB from "./connectToMongoDB.js";
import messageRouter from "./router/messageRouter.js";
import { Message, User } from "./schema/model.js";
import { baseURL, port } from "./constant.js";
import userRouter from "./router/userRouter.js";
import roomRouter from "./router/roomRouter.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  transports: ["websocket", "polling"],
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    // credentials: true,
  },
});

app.use(cors());
app.use(json());

connectToMongoDB();
app.use("/messages", messageRouter);
app.use("/users", userRouter);
app.use("/rooms", roomRouter);

// const activeUsers = {};
global.onlineUsers = new Map();

// Handle socket connections
io.on("connection", (socket) => {
  global.chatSocket = socket;

  // Join a specific room
  socket.on("join room", ({ roomId, userId }) => {
    if (!onlineUsers.has(roomId)) {
      onlineUsers.set(roomId, []);
    }

    // Check if user is already in the room to avoid duplicates
    const roomUsers = onlineUsers.get(roomId);
    const isUserAlreadyInRoom = roomUsers.some(
      (user) => user.userId === userId
    );

    if (!isUserAlreadyInRoom) {
      // Add user to the room
      roomUsers.push({ userId, socketId: socket.id });
    }
    // Update the users for this room
    onlineUsers.set(roomId, roomUsers);

    // Join the socket room
    socket.join(roomId);

    // Emit the updated list of online users for this specific room
    io.to(roomId).emit("online users", roomUsers);
  });

  // Send message to a specific room
  socket.on("chat message", async (msg) => {
    const { content, roomId, userId } = msg;
    const message = new Message({ content, room: roomId, userId });
    await message.save();
    io.to(msg.roomId).emit("chat message", message);
  });

  socket.on("disconnect", () => {
    // Find and remove the user from all rooms
    onlineUsers.forEach((users, roomId) => {
      const updatedUsers = users.filter((user) => user.socketId !== socket.id);

      // Update the room's user list
      onlineUsers.set(roomId, updatedUsers);

      // Emit updated user list to the specific room
      io.to(roomId).emit("online users", updatedUsers);
    });
  });

  socket.on("error", (err) => {
    console.error("Socket error:", err);
  });
});

server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
