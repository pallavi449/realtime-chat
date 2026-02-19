const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const connectDB = require("./config/db");
const socketHandler = require("./socket/socket");

require("dotenv").config();

connectDB();

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});

socketHandler(io);

server.listen(5000, () => {
  console.log("Server running on port 5000");
});