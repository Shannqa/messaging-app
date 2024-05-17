import { useState, useEffect, useContext } from "react";
import { AppContext } from "./Root.jsx";
import React from "react";
import Logout from "./Logout.jsx";

function ButtonsTop() {
  const {
    userListTab,
    setUserListTab,
    userMenu,
    setUserMenu,
    targetUser,
    setTargetUser,
  } = useContext(AppContext);

  function handleContacts() {
    setUserListTab("Contacts");
    setTargetUser(null);
    setUserMenu(false);
  }

  function handleRooms() {
    setUserListTab("Rooms");
    setTargetUser(null);
    setUserMenu(false);
  }

  return (
    <div className="chat-buttons-top">
      <button className="button" onClick={(e) => handleContacts()}>
        Contacts
      </button>
      <button className="button" onClick={(e) => handleRooms()}>
        Rooms
      </button>
    </div>
  );
}

export default ButtonsTop;
