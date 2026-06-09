require("dotenv").config();

const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const connectDB = require("./config/db");
const User = require("./models/User");
const Message = require("./models/Message");

const app = express();

// 🔥 Connect DB ONCE
connectDB();

// Middlewares
app.use(cors({
  origin: "*", // production safe (you can restrict later)
  methods: ["GET", "POST"]
}));

app.use(express.json());

const server = http.createServer(app);

// Socket setup
const io = new Server(server, {
  cors: {
    origin: "https://your-frontend-url.vercel.app",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("Connected:", socket.id);

  // USER ONLINE
  socket.on("user_online", async (username) => {
    try {
      let user = await User.findOne({ username });

      if (!user) {
        user = new User({
          username,
          socketId: socket.id,
          online: true,
        });
      } else {
        user.socketId = socket.id;
        user.online = true;
      }

      await user.save();

      const users = await User.find();
      io.emit("users_update", users);

    } catch (err) {
      console.log("user_online error:", err.message);
    }
  });

  // JOIN ROOM
  socket.on("join_room", ({ room }) => {
    socket.join(room);
    console.log("Joined Room:", room);
  });

  // GET OLD MESSAGES
  socket.on("get_messages", async (room) => {
    try {
      const messages = await Message.find({ room });
      socket.emit("all_messages", messages);
    } catch (err) {
      console.log("get_messages error:", err.message);
    }
  });

  // SEND MESSAGE
  socket.on("send_message", async (data) => {
    try {
      const newMessage = new Message(data);
      await newMessage.save();

      io.to(data.room).emit("receive_message", data);
    } catch (err) {
      console.log("send_message error:", err.message);
    }
  });

  // DISCONNECT
  socket.on("disconnect", async () => {
    try {
      await User.findOneAndUpdate(
        { socketId: socket.id },
        { online: false }
      );

      const users = await User.find();
      io.emit("users_update", users);

    } catch (err) {
      console.log("disconnect error:", err.message);
    }
  });
});

// ✅ IMPORTANT: Render PORT FIX
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log("Server Running On", PORT);
});