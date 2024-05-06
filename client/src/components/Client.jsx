import { useState, useEffect, useContext } from "react";
import { AppContext } from "./Root.jsx";
import React from "react";

// import styles from "../styles/Home.module.css";

function Client() {
  const { socket, username } = useContext(AppContext);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.on("messageResponse", (data) => setMessages([...messages, data]));
  }, [socket, messages]);
  
  useEffect(() => {
    socket.emit("newUser", {username: username, socketID: socked.id});
  }, []);

  function handleSendMessage(e) {
    e.preventDefault();
    socket.emit("message", { text: message, socketID: socket.id });
    setMessage("");
  }

  return (
    <div className="main">
      <div>
        {messages.map((msg) => {
          return <p key={msg.socketID}>{msg.text}</p>;
        })}
      </div>
      <form onSubmit={handleSendMessage}>
        <input
          value={message}
          type="text"
          placeholder="Write message..."
          onChange={(e) => setMessage(e.target.value)}
        ></input>
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

export default Client;
