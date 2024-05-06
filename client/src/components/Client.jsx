import { useState, useEffect, useContext } from "react";
import { AppContext } from "./Root.jsx";
import React from "react";
import ChatBody from "./ChatBody.jsx";
import ChatInput from "./ChatInput.jsx";
import ChatTabs from "./ChatTabs.jsx";
import ChatUserList from "./ChatUserList.jsx";

// import styles from "../styles/Home.module.css";

function Client() {
  const { socket, username, users, setUsers } = useContext(AppContext);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.io.opts.query = { username };
    socket.connect();
    socket.on("getUsers", (data) => {
      setUsers(data);
      console.log(users);
    });
    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    socket.on("getUsers", (data) => {
      setUsers(data);
      console.log(users);
    });
  }, [socket, users]);

  useEffect(() => {
    socket.on("messageResponse", (data) => setMessages([...messages, data]));
  }, [socket, messages]);

  // useEffect(() => {
  //   socket.emit("newUser", { username: username, socketID: socket.id });
  //   console.log(socket.id);
  //   return () => {
  //     if (socket) {
  //       socket.disconnect();
  //     }
  //   };
  // }, [socket]);

  return (
    <div className="client">
      <ChatBody />
      <ChatInput />
      <ChatUserList />
    </div>
  );
}

export default Client;
