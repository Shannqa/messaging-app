import { useState, useEffect, useContext } from "react";
import { AppContext } from "./Root.jsx";
import React from "react";

// import styles from "../styles/Home.module.css";

function ChatInput() {
  const { socket, username, setUsername } = useContext(AppContext);
  
  

  function handleSubmit(e) {
    e.preventDefault();
    localStorage.setItem("username", username)
  }

  return (
      <form onSubmit={handleSendMessage}>
      <label htmlFor="username">Choose your username</label>
        <input
          id="username"
          value={username}
          type="text"
          placeholder="Name"
          onChange={(e) => setUsername(e.target.value)}
        ></input>
        <button type="submit">Submit</button>
      </form>
  );
}

export default ChatInput;
