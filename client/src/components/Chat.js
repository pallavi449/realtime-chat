import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import Message from "./Message";
import "../App.css";

const socket = io("http://localhost:5000");

const Chat = () => {
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  const messagesEndRef = useRef(null);

  // ✅ send message
  const sendMessage = () => {
    if (message.trim() !== "" && username.trim() !== "") {
      const messageData = {
        username,
        message,
      };

      socket.emit("send_message", messageData);
      setMessage("");
    }
  };

  // ✅ receive message
  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessageList((list) => [...list, data]);
    });

    return () => socket.off("receive_message");
  }, []);

  // ✅ auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messageList]);

  return (
    <div className="chat-container">
      <div className="chat-title">Live Chat</div>

      {/* username input */}
      <div style={{ padding: "8px" }}>
        <input
          placeholder="Enter your name..."
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{ width: "100%", padding: "6px" }}
        />
      </div>

      {/* messages */}
      <div className="chat-messages">
        {messageList.map((msg, index) => (
          <Message key={index} msg={msg} currentUser={username} />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* input area */}
      <div className="chat-inputs">
        <input
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Chat;