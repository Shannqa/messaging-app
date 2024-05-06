import { useState, useEffect, useContext } from "react";
import { AppContext } from "./Root.jsx";
import React from "react";

// import styles from "../styles/Home.module.css";

function ChatTabs() {
  const { socket, user } = useContext(AppContext);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    socket.on(
      "newUserResponse",
      (data) => {
        setUsers(data);
      },
      [socket, users]
    );
  });
  return (
    <div className="chat-tabs">
      {tabs.map((tab, index) => {
        return <button key={index}>{tab}</button>;
      })}
    </div>
  );
}

export default ChatTabs;
