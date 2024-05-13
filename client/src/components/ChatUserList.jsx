import { useState, useEffect, useContext } from "react";
import { AppContext } from "./Root.jsx";
import React from "react";
import MenuUserList from "./MenuUserList.jsx";

// import styles from "../styles/Home.module.css";

function ChatUserList() {
  const {
    user,
    users,
    setUsers,
    openTabs,
    setOpenTabs,
    currentTab,
    setCurrentTab,
    userListTab,
    setUserListTab,
    contacts,
    setContacts,
  } = useContext(AppContext);

  const [userMenu, setUserMenu] = useState(false);
  const [targetUser, setTargetUser] = useState(null);
  const storageToken = localStorage.getItem("accessToken");

  function openChat(name) {
    const isTabAlreadyOpen = openTabs.some((tab) => tab.name === name);
    if (!isTabAlreadyOpen) {
      const msgsFromDb = getMessages(name);
      if (!msgsFromDb) {
        // if there no messages in the database
        setOpenTabs([...openTabs, { name: name, messages: [] }]);
      }
    }
    setCurrentTab(name);
  }

  // get messages from the database for the open tab
  function getMessages(convoPartner) {
    fetch("/api/messages", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        authorization: storageToken,
      },
      body: JSON.stringify({
        partner: convoPartner,
      }),
    })
      .then((res) => res.json())
      .then((body) => {
        if (body.messages) {
          const parsedMsgs = JSON.parse(body.messages);
          setOpenTabs([
            ...openTabs,
            { name: convoPartner, messages: parsedMsgs },
          ]);
          return true;
        } else {
          return false;
        }
      })
      .catch((err) => console.log(err));
  }

  function toggleUserMenu(target) {
    if (userMenu) {
      // close
      setUserMenu(false);
      setTargetUser(null);
    } else {
      // open
      setUserMenu(true);
      setTargetUser(target);
    }
  }

  if (userListTab === "Rooms") {
    return (
      <div className="chat-userlist">
        <p>Online users:</p>
        {users.map((user, index) => {
          return (
            <p
              className="user"
              key={user.socketId}
              onClick={(e) => {
                // openChat(user.name);
                toggleUserMenu(user.userId);
              }}
            >
              {user.name}
            </p>
          );
        })}
        {userMenu && <MenuUserList targetUser={targetUser} />}
      </div>
    );
  } else if (userListTab === "Contacts") {
    return (
      <div className="chat-userlist">
        <p>Contacts:</p>
        {contacts.length === 0 ? (
          <p>No contacts yet!</p>
        ) : (
          contacts.map((contact) => {
            return (
              <p
                className="user"
                key={contact._id}
                onClick={(e) => {
                  // openChat(user.name);
                  toggleUserMenu(contact._id);
                }}
              >
                {contact.username}
              </p>
            );
          })
        )}
        {userMenu && <MenuUserList targetUser={targetUser} />}
      </div>
    );
  }
}

export default ChatUserList;
