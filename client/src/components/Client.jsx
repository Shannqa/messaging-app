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
    /*
    socket.on("messageResponse", ({data}) => setMessages([...messages, data]));
    */

    socket.on("privResp", ({ to, from, text }) => {
      console.log({ to, from, text });
      if (to === user && from === user) {
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

          // return {
          //   ...tab,
          //   messages: [...messages, { name: user, text: text }], // messages not defined
          // };
          // tab.map((nest) => {
          //   return {
          //     ...nest,
          //     messages: [],
          //   };
          // ...nest, nest.messages: [...tab.messages, {name: user, text: text}])
          // });

          //tab.messages = [...tab.messages, {name: user, text: text}];
          // gotta return the rest of the object, not just messages though
        }
      }
    });

    socket.on("fromAndToAsia", ({ text, to, from }) => {
      console.log({ text, to, from });
      setOpenTabs(
        openTabs.map((tab) => {
          if (tab.name === "asia") {
            tab.messages;
          }
        })
      );
    });
    socket.on(
      "privateMessageOwn",
      ({ text, to, from }) => {
        console.log("to", to, "from", from, "text", text);
        if (from === user) {
          console.log("from me to someone else");
          // tab == to
          const isTabOpen = openTabs.some((tab) => tab.name === to);

          if (isTabOpen) {
            setOpenTabs(
              openTabs.map((tab) => {
                if (tab.name === to) {
                  return {
                    ...tab,
                    messages: [...tab.messages, { name: from, text: text }],
                  };
                } else {
                  return tab;
                }
              })
            );
          } else {
            setOpenTabs([
              ...openTabs,
              {
                name: to,
                messages: [{ name: from, text: text }],
              },
            ]);
          }
        }

        if (to === user) {
          const isTabOpen = openTabs.some((tab) => tab.name === from);
          console.log("to meee");
          if (isTabOpen) {
            setOpenTabs(
              openTabs.map((tab) => {
                if (tab.name === from) {
                  return [...tab.messages, { name: from, text: text }];
                } else {
                  return tab;
                }
              })
            );
          } else {
            setOpenTabs([
              ...openTabs,
              {
                name: from,
                messages: [{ name: from, text: text }],
              },
            ]);
          }
        }
      }
      // tab == from

      // if it's an own msg, to
      // tab == to
      // from: text
    );

    socket.on("privateMessageElse", ({ text, to, from }) => {
      // tab = from
      // from:
    });
    socket.on("privateMessageSelfResp", ({ text, to, from }) => {
      console.log(text, to, from);
    });

    socket.on("privateMessageResponse", ({ text, to, from }) => {
      //if im sending a message to someone
      /*
      chatlist > open tab with "to"
      current tab "to"
      write message, from = my name, to = tab name
      send message to socket, from me, to other person
      socket responds - message is from me, to another person
      so it ends up in another person's tab name, so i send, msg is in to


      i receive a message from somebody else
      socket sends to me, from other
      open tab other
      message from other, to me, shows up in tab other person's name, so in from

      
      
      */

      const isTabOpen = openTabs.some((tab) => tab.name === from);

      if (isTabOpen) {
        setOpenTabs(
          openTabs.map((tab) => {
            if (tab.name === from) {
              return [...tab.messages, { name: from, text: text }];
            } else {
              return tab;
            }
          })
        );
      } else {
        setOpenTabs([
          ...openTabs,
          {
            name: from,
            messages: [{ name: from, text: text }],
          },
        ]);
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
