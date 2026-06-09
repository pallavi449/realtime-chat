const Message = ({ msg, currentUser }) => {
  const isMe = msg.sender === currentUser;

  return (
    <div
      style={{
        textAlign: isMe ? "right" : "left",
      }}
    >
      <div
        style={{
          display: "inline-block",
          padding: "10px",
          margin: "5px",
          borderRadius: "10px",
          background: isMe ? "#2563eb" : "#6b7280",
          color: "white",
        }}
      >
        <div>{msg.message}</div>

        <small>{msg.time}</small>
      </div>
    </div>
  );
};

export default Message;