import React, { useState, useEffect, useContext, createContext } from "react";
import { AppContext } from "./Root.jsx";
import Client from "./Client.jsx";
import Login from "./Login.jsx";
import { API_URL } from "../api.js";
// import styles from "../styles/Home.module.css";

import { io } from "socket.io-client";
const username = localStorage.getItem("username");
const authToken = localStorage.getItem("accessToken");
const dbId = localStorage.getItem("dbId");
const ioSocket = io.connect(`${API_URL}`, {
  withCredentials: true,
  autoConnect: false,
  auth: { token: authToken, username: username, userId: dbId },
});

export const ChatContext = createContext({
  socket: "",
});

function Chat() {
  const { user } = useContext(AppContext);
  const socket = ioSocket;
  useEffect(() => {
    socket.io.opts.query = { user: user };
    socket.connect();
    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <ChatContext.Provider
      value={{
        socket,
      }}
    >
      <div className="main">{user ? <Client /> : <Login />}</div>
    </ChatContext.Provider>
  );
}

export default Chat;
