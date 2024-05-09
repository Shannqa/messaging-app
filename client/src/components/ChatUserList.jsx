import { useState, useEffect, useContext } from "react";
import { AppContext } from "./Root.jsx";
import React from "react";

// import styles from "../styles/Home.module.css";

function ChatUserList() {
  const { socket, users, setUsers, openTabs, setOpenTabs } =
    useContext(AppContext);

  function openChat(e) {
    console.log(e.target.innerText);
    setOpenTabs([...openTabs, e.target.innerText]);
  }

  return (
    <div className="chat-userlist">
      <p>Online users:</p>
      {users.map((user, index) => {
        return (
          <p
            key={user.socketID}
            onClick={(e) => {
              openChat(e);
            }}
          >
            {user.user}
          </p>
        );
      })}
    </div>
  );
}

export default ChatUserList;
