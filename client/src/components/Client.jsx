import { useState, useEffect, useContext } from "react";
import { AppContext } from "./Root.jsx";
import React from "react";
import ChatBody from "./ChatBody.jsx";
import ChatInput from "./ChatInput.jsx";
import ChatTabs from "./ChatTabs.jsx";
import ChatUserList from "./ChatUserList.jsx";

// import styles from "../styles/Home.module.css";

function Client() {
  const { socket, username } = useContext(AppContext);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.on("messageResponse", (data) => setMessages([...messages, data]));
  }, [socket, messages]);

  useEffect(() => {
    socket.emit("newUser", { username: username, socketID: socket.id });
  }, []);

  return (
    <div className="main">
      <ChatBody />
      <ChatInput />
    </div>
  );
}

export default Client;
