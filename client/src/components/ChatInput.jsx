import { useState, useEffect, useContext } from "react";
import { AppContext } from "./Root.jsx";
import React from "react";

// import styles from "../styles/Home.module.css";

function ChatInput() {
  const { socket, username } = useContext(AppContext);
  const [message, setMessage] = useState("");

  function handleSendMessage(e) {
    e.preventDefault();
    socket.emit("message", {
      text: message,
      socketID: socket.id,
      username: username,
    });
    setMessage("");
  }

  return (
    <form onSubmit={handleSendMessage} className="chat-input">
      <input
        value={message}
        type="text"
        placeholder="Write message..."
        onChange={(e) => setMessage(e.target.value)}
      ></input>
      <button type="submit">Send</button>
    </form>
  );
}

export default ChatInput;
