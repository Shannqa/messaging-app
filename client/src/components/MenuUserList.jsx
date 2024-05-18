import { useState, useEffect, useContext } from "react";
import { AppContext } from "./Root.jsx";
import React from "react";
import { API_URL } from "../api.js";

// import styles from "../styles/Home.module.css";

function MenuUserList({ targetUser }) {
  const {
    user,
    users,
    setUsers,
    openTabs,
    setOpenTabs,
    currentTab,
    setCurrentTab,
    contacts,
    setContacts,
  } = useContext(AppContext);
  const storageToken = localStorage.getItem("accessToken");

  function openChat(target) {
    const isTabAlreadyOpen = openTabs.some(
      (tab) => tab.name === target.username
    );
    if (!isTabAlreadyOpen) {
      const msgsFromDb = getMessages(target);
      if (!msgsFromDb) {
        // if there no messages in the database
        setOpenTabs([...openTabs, { name: target.username, messages: [] }]);
      }
    }
    setCurrentTab(target.username);
  }

  // get messages from the database for the open tab
  function getMessages(target) {
    fetch("/api/messages", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        authorization: storageToken,
      },
      body: JSON.stringify({
        partner: target.id,
      }),
    })
      .then((res) => res.json())
      .then((body) => {
        if (body.messages) {
          const parsedMsgs = JSON.parse(body.messages);
          setOpenTabs([
            ...openTabs,
            { name: target.username, messages: parsedMsgs },
          ]);
          return true;
        } else {
          return false;
        }
      })
      .catch((err) => console.log(err));
  }

  function addContact(target) {
    if (contacts.some((contact) => contact._id === target.id)) {
      return console.log("already in contacts");
    }

    fetch(`${API_URL}/api/users/contacts`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        authorization: storageToken,
      },
      body: JSON.stringify({
        target: target.id,
      }),
    })
      .then((res) => res.json())
      .then((body) => {
        if (!body.success) {
          // error
          return console.log(body);
        }
        console.log(body);
        setContacts(body.contacts);
      })
      .catch((err) => console.log(err));
  }

  function deleteContact(target) {
    if (!contacts.some((contact) => contact._id === target.id)) {
      return console.log("is not in contacts");
    }

    fetch(`${API_URL}/api/users/contacts`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        authorization: storageToken,
      },
      body: JSON.stringify({
        target: target.id,
      }),
    })
      .then((res) => res.json())
      .then((body) => {
        console.log(body);
        setContacts(body.contacts);
      })
      .catch((err) => console.log(err));
  }
  return (
    <div className="user-list-tooltip">
      <button onClick={() => openChat(targetUser)}>
        <img src="/chat_24dp_FILL0_wght400_GRAD0_opsz24.svg" />
        Start chat
      </button>
      {contacts.some((contact) => contact._id === targetUser.id) ? null : (
        <button onClick={() => addContact(targetUser)}>
          <img src="/person_add_24dp_FILL0_wght400_GRAD0_opsz24.svg" />
          Add contact
        </button>
      )}
      {contacts.some((contact) => contact._id === targetUser.id) ? (
        <button onClick={() => deleteContact(targetUser)}>
          <img src="/person_remove_24dp_FILL0_wght400_GRAD0_opsz24.svg" />
          Delete contact
        </button>
      ) : null}
    </div>
  );
}

export default MenuUserList;
