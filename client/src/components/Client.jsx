import { useState, useEffect, useContext } from "react";
import { AppContext } from "./Root.jsx";
import { ChatContext } from "./Chat.jsx";
import React from "react";
import ChatBody from "./ChatBody.jsx";
import ChatInput from "./ChatInput.jsx";
import ChatTabs from "./ChatTabs.jsx";
import ChatUserList from "./ChatUserList.jsx";
import Buttons from "./Buttons.jsx";
import ButtonsTop from "./ButtonsTop.jsx";
import { API_URL } from "../api.js";
// import styles from "../styles/Home.module.css";

function Client() {
  const { socket } = useContext(ChatContext);
  const {
    user,
    setUser,
    users,
    setUsers,
    allTab,
    setAllTab,
    token,
    openTabs,
    setOpenTabs,
    lastMessageRef,
    currentTab,
    contacts,
    setContacts,
  } = useContext(AppContext);

  const storageToken = localStorage.getItem("accessToken");
  useEffect(() => {
    socket.on("publicMessageResponse", ({ name, socketId, text }) => {
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
      console.log("connection response", users); // after refresh the list of users is not checked
    });

    socket.on("disconnectResponse", ({ name, text, users }) => {
      setAllTab([...allTab, { name: name, text: text }]);
      setUsers(users);
    });
  }, [socket, allTab, users, openTabs]);

  useEffect(() => {
    // slowly scroll to the last message when receiving a new message
    lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [openTabs, allTab]);

  useEffect(() => {
    // instantly scroll to the last message when changing a tab
    lastMessageRef.current?.scrollIntoView({ behavior: "instant" });
  }, [currentTab]);

  // get user's contacts
  useEffect(() => {
    fetch(`${API_URL}/api/users/contacts`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        authorization: storageToken,
      },
    })
      .then((res) => res.json())
      .then((body) => {
        if (body) {
          console.log(body);
          setUser(body.user.username); // doesnt help // added to see if it fixes a bug where after refreshing a page the user and contacts are not visible
          setContacts(body.user.contacts);

          console.log("contacts", body.user.contacts);
          // const parsedMsgs = JSON.parse(body.messages);
          // setOpenTabs([
          //   ...openTabs,
          //   { name: convoPartner, messages: parsedMsgs },
          // ]);
          return true;
        } else {
          return false;
        }
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="client">
      <ChatTabs />
      <ButtonsTop />
      <ChatBody />
      <ChatInput />
      <ChatUserList />
      <Buttons />
    </div>
  );
}

export default Client;
