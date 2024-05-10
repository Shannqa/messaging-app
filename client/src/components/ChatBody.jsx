import { useState, useEffect, useContext } from "react";
import { AppContext } from "./Root.jsx";
import React from "react";

// import styles from "../styles/Home.module.css";

function ChatBody() {
  const { socket, user } = useContext(AppContext);

  const [messages, setMessages, currentTab] = useState([]);

  useEffect(() => {
    socket.on("messageResponse", (data) => setMessages([...messages, data]));
  }, [socket, messages]);

  useEffect(() => {
    socket.on("connectionResponse", (data) => setMessages([...messages, data]));
  }, [socket, messages]);

  useEffect(() => {
    socket.on("private message response", ({ text, from }) => {
      console.log(text);
      setMessages([...messages, { user: from, text: text }]);
    });
  }, [socket, messages]);

  return (
    <div className="chat-body">
      {messages.map((msg, index) => {
        return (
          <>
            {msg.user === "Socket" ? (
              <p key={index}>{msg.text}</p>
            ) : (
              <p
                key={index}
                className={
                  msg.user === user.user ? "own-message" : "other-message"
                }
              >
                {msg.user}: {msg.text}
              </p>
            )}
          </>
        );
      })}
    </div>
  );
}

export default ChatBody;
