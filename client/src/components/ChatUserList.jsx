import { useState, useEffect, useContext } from "react";
import { AppContext } from "./Root.jsx";
import React from "react";

// import styles from "../styles/Home.module.css";

function ChatUserList() {
  const { users, setUsers, openTabs, setOpenTabs, currentTab, setCurrentTab } =
    useContext(AppContext);

  function openChat(name) {
    const isTabAlreadyOpen = openTabs.some((tab) => tab.name === name);
    if (!isTabAlreadyOpen) {
      setOpenTabs([...openTabs, { name: name, messages: [] }]);
    }
    setCurrentTab(name);
  }

  return (
    <div className="chat-userlist">
      <p>Online users:</p>
      {users.map((user, index) => {
        return (
          <p
            className="user"
            key={user.socketId}
            onClick={(e) => {
              openChat(user.name);
            }}
          >
            {user.name}
          </p>
        );
      })}
    </div>
  );
}

export default ChatUserList;
