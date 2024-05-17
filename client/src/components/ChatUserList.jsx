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
    userMenu,
    setUserMenu,
    targetUser,
    setTargetUser,
  } = useContext(AppContext);

  const storageToken = localStorage.getItem("accessToken");

  function toggleUserMenu(targetId, targetName) {
    if (userMenu && targetId === targetUser.id) {
      // close the menu
      setUserMenu(false);
      setTargetUser(null);
    } else if (userMenu && targetId !== targetUser.id) {
      // open the menu for new user
      setTargetUser({ id: targetId, username: targetName });
    } else {
      // open the menu
      setUserMenu(true);
      setTargetUser({ id: targetId, username: targetName });
    }
  }

  if (userListTab === "Rooms") {
    return (
      <div className="chat-userlist">
        <p>Online users:</p>
        {users.map((user, index) => {
          return (
            <p
              className={
                targetUser && user.userId === targetUser.id
                  ? "user target"
                  : "user"
              }
              key={user.socketId}
              onClick={(e) => {
                // openChat(user.name);
                toggleUserMenu(user.userId, user.name);
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
                className={
                  targetUser && contact._id === targetUser.id
                    ? "user target"
                    : "user"
                }
                key={contact._id}
                onClick={(e) => {
                  // openChat(user.name);
                  toggleUserMenu(contact._id, contact.username);
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
