const Sidebar = ({
  users,
  selectUser,
  currentUser,
}) => {
  return (
    <div
      style={{
        width: "250px",
        borderRight: "1px solid gray",
        padding: "10px",
      }}
    >
      <h3>Users</h3>

      {users
        .filter((u) => u.username !== currentUser)
        .map((user) => (
          <div
            key={user._id}
            onClick={() => selectUser(user)}
            style={{
              padding: "10px",
              background: "#f1f1f1",
              marginBottom: "5px",
              cursor: "pointer",
            }}
          >
            {user.username}

            <span
              style={{
                color: user.online
                  ? "green"
                  : "gray",
                marginLeft: "10px",
              }}
            >
              ●
            </span>
          </div>
        ))}
    </div>
  );
};

export default Sidebar;