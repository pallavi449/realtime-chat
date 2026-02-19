const { saveMessage } = require("../controllers/messageController");

const socketHandler = (io) => {
  io.on("connection", (socket) => {
    console.log("User Connected:", socket.id);

    socket.on("send_message", async (data) => {
      const savedMessage = await saveMessage(data);
      io.emit("receive_message", savedMessage);
    });

    socket.on("disconnect", () => {
      console.log("User Disconnected:", socket.id);
    });
  });
};

module.exports = socketHandler;