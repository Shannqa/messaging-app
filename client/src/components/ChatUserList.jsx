import { useState, useEffect, useContext } from "react";
import { AppContext } from "./Root.jsx";
import React from "react";

// import styles from "../styles/Home.module.css";

function ChatUserList() {
  const { socket, users, setUsers } = useContext(AppContext);

  return (
    <div className="chat-userlist">
      <p>Online users:</p>
      {users.map((user, index) => {
        return <p key={user.socketID}>{user.user}</p>;
      })}
    </div>
  );
}

export default ChatUserList;
