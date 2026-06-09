import React, { useEffect, useState } from "react";
import socket from "../socket";
import Sidebar from "./Sidebar";
import Message from "./Message";

function Chat() {
  const [username, setUsername] = useState("");
  const [joined, setJoined] = useState(false);

  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const room =
    selectedUser && username
      ? [username, selectedUser.username].sort().join("_")
      : "";

  // Join Chat
  const joinChat = () => {
    if (!username.trim()) return;

    socket.emit("user_online", username);
    setJoined(true);
  };

  // Receive users list
  useEffect(() => {
    socket.on("users_update", (data) => {
      console.log("Users Update:", data);
      setUsers(data);
    });

    return () => socket.off("users_update");
  }, []);

  // Join room when user selected
  useEffect(() => {
    if (room) {
      socket.emit("join_room", { room });

      // load old messages
      socket.emit("get_messages", room);
    }
  }, [room]);

  // Receive old messages
  useEffect(() => {
    socket.on("all_messages", (data) => {
      setMessages(data);
    });

    return () => socket.off("all_messages");
  }, []);

  // Receive new message
  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => socket.off("receive_message");
  }, []);

  const sendMessage = () => {
    if (!message.trim()) {
      alert("Enter message");
      return;
    }

    if (!selectedUser) {
      alert("Select User First");
      return;
    }

    const msgData = {
      room,
      sender: username,
      receiver: selectedUser.username,
      message,
      time: new Date().toLocaleTimeString(),
    };

    socket.emit("send_message", msgData);

    setMessage("");
  };

  // LOGIN SCREEN
  if (!joined) {
    return (
      <div style={{ padding: "50px" }}>
        <h2>Join Chat</h2>

        <input
          placeholder="Enter Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <button onClick={joinChat}>
          Join
        </button>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <Sidebar
        users={users}
        currentUser={username}
        selectUser={setSelectedUser}
      />

      <div style={{ flex: 1, padding: "20px" }}>
        <h2>
          Chat with {selectedUser?.username || "Select User"}
        </h2>

        <div
          style={{
            height: "70vh",
            border: "1px solid #ddd",
            overflowY: "auto",
            padding: "10px",
          }}
        >
          {messages.map((msg, index) => (
            <Message
              key={index}
              msg={msg}
              currentUser={username}
            />
          ))}
        </div>

        <div style={{ display: "flex", marginTop: "10px" }}>
          <input
            style={{
              flex: 1,
              padding: "10px",
            }}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type message..."
          />

          <button onClick={sendMessage}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default Chat;