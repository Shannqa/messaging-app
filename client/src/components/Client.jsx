import { useState, useEffect, useContext } from "react";
import { AppContext } from "./Root.jsx";
import React from "react";
import ChatBody from "./ChatBody.jsx";
import ChatInput from "./ChatInput.jsx";
import ChatTabs from "./ChatTabs.jsx";
import ChatUserList from "./ChatUserList.jsx";
import Buttons from "./Buttons.jsx";
// import styles from "../styles/Home.module.css";

function Client() {
  const { socket, users, setUsers, user, allTab, setAllTab } =
    useContext(AppContext);
  const [messages, setMessages] = useState([]);

  // socket connection
  useEffect(() => {
    socket.io.opts.query = { user };
    socket.connect();

    return () => {
      socket.disconnect();
    };
  }, [socket]);

  useEffect(() => {
    socket.on("publicMessageResponse", ({ name, socketId, text }) => {
      console.log(allTab);
      setAllTab([...allTab, { name: name, text: text }]);
    });
  }, [allTab]);

  // other socket events
  useEffect(() => {
    /*
    socket.on("messageResponse", ({data}) => setMessages([...messages, data]));
    */

    socket.on("privateMessageResponse", ({ from, to, text }) => {
      const isTabOpen = openTabs.some((tab) => tab.name === from);

      if (isTabOpen) {
        setOpenTabs(
          openTabs.map((tab) => {
            if (tab.name === from) {
              tab.messages.push({ user: from, text: text });
            }
          })
        );
      } else {
        setOpenTabs(...openTabs, {
          name: from,
          messages: [{ user: from, text: text }],
        });
      }
    });

    socket.on("connectionResponse", ({ name, text, users }) => {
      setAllTab([...allTab, { name: name, text: text }]);
      setUsers(users);
    });

    socket.on("disconnectResponse", ({ name, text, users }) => {
      setAllTab([...allTab, { name: name, text: text }]);
      setUsers(users);
    });
  }, [socket, allTab, users]);

  return (
    <div className="client">
      <ChatTabs />
      <ChatBody />
      <ChatInput />
      <ChatUserList />
      <Buttons />
    </div>
  );
}

export default Client;
