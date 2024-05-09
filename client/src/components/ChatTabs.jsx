import { useState, useEffect, useContext } from "react";
import { AppContext } from "./Root.jsx";
import React from "react";

// import styles from "../styles/Home.module.css";

function ChatTabs() {
  const { socket, openTabs, setOpenTabs, currentTab, setCurrentTab } =
    useContext(AppContext);

  function changeTab(e) {
    setCurrentTab(e.target.innerText);
  }

  return (
    <div className="chat-tabs">
      {openTabs.map((tab, index) => {
        return (
          <button key={index} onClick={(e) => changeTab(e)}>
            {tab}
          </button>
        );
      })}
    </div>
  );
}

export default ChatTabs;
