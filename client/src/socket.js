import { io } from "socket.io-client";

const socket = io("https://realtime-chat-h2hm.onrender.com", {
  transports: ["websocket", "polling"],
  withCredentials: true,
});

export default socket;