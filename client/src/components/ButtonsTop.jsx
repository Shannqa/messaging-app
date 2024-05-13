import { useState, useEffect, useContext } from "react";
import { AppContext } from "./Root.jsx";
import React from "react";
import Logout from "./Logout.jsx";

function ButtonsTop() {
  const { userListTab, setUserListTab } = useContext(AppContext);
  return (
    <div className="chat-buttons-top">
      <button className="button" onClick={(e) => setUserListTab("Contacts")}>
        Contacts
      </button>
      <button className="button" onClick={(e) => setUserListTab("Rooms")}>
        Rooms
      </button>
    </div>
  );
}

export default ButtonsTop;
