import { useState, useEffect, useContext } from "react";
import { AppContext } from "./Root.jsx";
import React from "react";

// import styles from "../styles/Home.module.css";

function ChatBody() {
  const { socket, user, currentTab, allTab } = useContext(AppContext);

  return (
    <div className="chat-body">
      {allTab.map((msg, index) => {
        if (msg.name === "Server") {
          // announcement from the server
          return (
            <p className="msg-server" key={index}>
              {msg.text}
            </p>
          );
        } else {
          // user message
          return (
            <p
              className={msg.name === user ? "msg-own" : "msg-else"}
              key={index}
            >
              <span>{msg.name}: </span>
              <span>{msg.text}</span>
            </p>
          );
        }
      })}
    </div>
  );
}

export default ChatBody;
