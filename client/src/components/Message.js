const Message = ({ msg, currentUser }) => {
  const isOwnMessage = msg.username === currentUser;

  return (
    <div
      className={`message-row ${isOwnMessage ? "own" : "other"}`}
    >
      <div className="message-bubble">
        <div className="message-user">
          {isOwnMessage ? "You" : msg.username}
        </div>
        <div>{msg.message}</div>
      </div>
    </div>
  );
};

export default Message;