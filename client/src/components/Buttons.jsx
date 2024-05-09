import { useState, useEffect, useContext } from "react";
import { AppContext } from "./Root.jsx";
import React from "react";
import Logout from "./Logout.jsx";

function Buttons() {
  const { socket } = useContext(AppContext);

  return (
    <div className="chat-buttons">
      <Logout />
    </div>
  );
}

export default Buttons;
