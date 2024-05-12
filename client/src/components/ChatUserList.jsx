import { useState, useEffect, useContext } from "react";
import { AppContext } from "./Root.jsx";
import React from "react";

// import styles from "../styles/Home.module.css";

function ChatUserList() {
  const {
    user,
    users,
    setUsers,
    openTabs,
    setOpenTabs,
    currentTab,
    setCurrentTab,
  } = useContext(AppContext);

  const storageToken = localStorage.getItem("accessToken");

  function openChat(name) {
    const isTabAlreadyOpen = openTabs.some((tab) => tab.name === name);
    if (!isTabAlreadyOpen) {
      const msgsFromDb = getMessages(name);
      if (!msgsFromDb) {
        // if there no messages in the database
        setOpenTabs([...openTabs, { name: name, messages: [] }]);
      }
    }
    setCurrentTab(name);
  }

  // get messages from the database for the open tab
  function getMessages(convoPartner) {
    fetch("/api/messages", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        authorization: storageToken,
      },
      body: JSON.stringify({
        partner: convoPartner,
      }),
    })
      .then((res) => res.json())
      .then((body) => {
        if (body.messages) {
          const parsedMsgs = JSON.parse(body.messages);
          setOpenTabs([
            ...openTabs,
            { name: convoPartner, messages: parsedMsgs },
          ]);
          return true;
        } else {
          return false;
        }
      })
      .catch((err) => console.log(err));
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
