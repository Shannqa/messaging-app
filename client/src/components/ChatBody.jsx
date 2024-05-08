import { useState, useEffect, useContext } from "react";
import { AppContext } from "./Root.jsx";
import React from "react";

// import styles from "../styles/Home.module.css";

function ChatBody() {
  const { socket } = useContext(AppContext);

  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.on("messageResponse", (data) => setMessages([...messages, data]));
  }, [socket, messages]);

  return (
    <div className="chat-body">
      {messages.map((msg, index) => {
        return (
          <p key={index}>
            {msg.user}: {msg.text}
          </p>
        );
      })}
    </div>
  );
}

export default ChatBody;
