import { useState, useEffect, useContext } from "react";
import { AppContext } from "./Root.jsx";
import React from "react";

// import styles from "../styles/Home.module.css";

function ChatTabs() {
  const { socket } = useContext(AppContext);
  const [tabs, setTabs] = useState(["All"]);

  return (
    <div className="chat-tabs">
      {tabs.map((tab, index) => {
        return <button key={index}>{tab}</button>;
      })}
    </div>
  );
}

export default ChatTabs;
