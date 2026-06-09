const Message = require("../models/Message");

exports.saveMessage = async (data) => {
  try {
    const message = new Message(data);
    await message.save();
    return message;
  } catch (error) {
    console.error("Error saving message:", error);
  }
};