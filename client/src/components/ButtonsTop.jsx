import { useState, useEffect, useContext } from "react";
import { AppContext } from "./Root.jsx";
import React from "react";
import Logout from "./Logout.jsx";

function ButtonsTop() {
  return (
    <div className="chat-buttons-top">
      <button className="button">Contacts</button>
      <button className="button">Rooms</button>
    </div>
  );
}

export default ButtonsTop;
