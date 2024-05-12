import { useState, useEffect, useContext } from "react";
import { AppContext } from "./Root.jsx";
import { ChatContext } from "./Chat.jsx";
import React from "react";
// import styles from "../styles/Home.module.css";

function ChatInput() {
  const { socket } = useContext(ChatContext);
  const { user, currentTab } = useContext(AppContext);
  const [message, setMessage] = useState("");

  function handleSendMessage(e) {
    e.preventDefault();
    if (currentTab === "All") {
      socket.emit("publicMessage", {
        name: user,
        socketId: socket.id,
        text: message,
      });
    } else {
      socket.emit("privateMsg", {
        to: currentTab,
        from: user,
        text: message,
      });
    }
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
      <button className="button" type="submit">
        Send
      </button>
    </form>
  );
}

export default ChatInput;
