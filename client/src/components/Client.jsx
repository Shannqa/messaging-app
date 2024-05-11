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
  const {
    socket,
    users,
    setUsers,
    user,
    allTab,
    setAllTab,
    token,
    openTabs,
    setOpenTabs,
  } = useContext(AppContext);

  useEffect(() => {
    socket.on("publicMessageResponse", ({ name, socketId, text }) => {
      console.log(allTab);
      setAllTab([...allTab, { name: name, text: text }]);
    });
  }, [allTab]);

  // other socket events
  useEffect(() => {
    // private messaging
    socket.on("privateMsgResponse", ({ to, from, text }) => {
      console.log({ to, from, text });
      if (to === user && from === user) {
        // message to yourself
        const isTabOpen = openTabs.some((tab) => tab.name === user);
        console.log(isTabOpen);
        if (isTabOpen) {
          setOpenTabs(
            openTabs.map((tab) =>
              tab.name === user
                ? {
                    ...tab,
                    messages: [...tab.messages, { name: from, text: text }],
                  }
                : tab
            )
          );
        } else {
          // just in case the tab closed before receiving the msg
          setOpenTabs([
            ...openTabs,
            { name: user, messages: [{ name: user, text: text }] },
          ]);
        }
      } else if (to === user) {
        // message to the user from someone else
        const isTabOpen = openTabs.some((tab) => tab.name === from);

        if (isTabOpen) {
          setOpenTabs(
            openTabs.map((tab) =>
              tab.name === from
                ? {
                    ...tab,
                    messages: [...tab.messages, { name: from, text: text }],
                  }
                : tab
            )
          );
        } else {
          // open the tab from the sender, add the first message
          setOpenTabs([
            ...openTabs,
            { name: from, messages: [{ name: from, text: text }] },
          ]);
        }
      } else if (from === user) {
        // message from the user to someone else
        const isTabOpen = openTabs.some((tab) => tab.name === to);

        if (isTabOpen) {
          setOpenTabs(
            openTabs.map((tab) =>
              tab.name === to
                ? {
                    ...tab,
                    messages: [...tab.messages, { name: from, text: text }],
                  }
                : tab
            )
          );
        } else {
          setOpenTabs([
            ...openTabs,
            { name: to, messages: [{ name: from, text: text }] },
          ]);
        }
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
  }, [socket, allTab, users, openTabs]);

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
