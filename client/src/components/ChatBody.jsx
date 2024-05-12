import { useState, useEffect, useContext } from "react";
import { AppContext } from "./Root.jsx";
import React from "react";
// import styles from "../styles/Home.module.css";

function ChatBody() {
  const { user, currentTab, allTab, openTabs, setOpenTabs, lastMessageRef } =
    useContext(AppContext);

  if (!currentTab) {
    return (
      <div className="chat-body">
        <p>Error! Please refresh the page</p>
      </div>
    );
  } else if (currentTab === "All") {
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
        <div ref={lastMessageRef}></div>
      </div>
    );
  } else {
    console.log(currentTab);
    console.log(openTabs);
    const current = openTabs.find((tab) => tab.name === currentTab);
    console.log("current", current);
    return (
      <div className="chat-body">
        {current.messages.map((msg, index) => {
          return (
            <p key={index}>
              {msg.name}: {msg.text}
            </p>
          );
        })}
        <div ref={lastMessageRef}></div>
      </div>
    );
  }
}

export default ChatBody;
