import { useState, useEffect, useContext } from "react";
import { AppContext } from "./Root.jsx";
import React from "react";

// import styles from "../styles/Home.module.css";

function ChatTabs() {
  const { socket, openTabs, setOpenTabs, currentTab, setCurrentTab } =
    useContext(AppContext);

  function changeTab(tabName) {
    setCurrentTab(tabName);
  }

  return (
    <div className="chat-tabs">
      <button key={"all"} onClick={() => changeTab("All")}>
        All
      </button>
      {openTabs.map((tab, index) => {
        return (
          <button key={index} onClick={() => changeTab(tab.name)}>
            {tab.name}
          </button>
        );
      })}
    </div>
  );
}

export default ChatTabs;
