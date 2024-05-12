import { useState, useEffect, useContext } from "react";
import { AppContext } from "./Root.jsx";
import React from "react";

// import styles from "../styles/Home.module.css";

function ChatTabs() {
  const { openTabs, setOpenTabs, currentTab, setCurrentTab } =
    useContext(AppContext);

  function changeTab(tabName) {
    setCurrentTab(tabName);
  }

  function closeTab() {
    const filteredTabs = openTabs.filter((tab) => tab.name !== currentTab);
    console.log(filteredTabs);
    setOpenTabs(filteredTabs);
    setCurrentTab("All");
  }

  return (
    <div className="chat-tabs">
      <div className="left">
        <button className="button" key={"all"} onClick={() => changeTab("All")}>
          All
        </button>
        {openTabs.map((tab, index) => {
          return (
            <button
              className="button"
              key={index}
              onClick={() => changeTab(tab.name)}
            >
              {tab.name}
            </button>
          );
        })}
      </div>
      <div className="right">
        {currentTab !== "All" && (
          <button className="button-cancel" onClick={closeTab}>
            X
          </button>
        )}
      </div>
    </div>
  );
}

export default ChatTabs;
