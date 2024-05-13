import { useState, useEffect, useContext } from "react";
import { AppContext } from "./Root.jsx";
import React from "react";

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
  } = useContext(AppContext);
  const storageToken = localStorage.getItem("accessToken");

  function addContact(targetUid) {
    console.log(targetUid);

    fetch("/api/users/contacts", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        authorization: storageToken,
      },
      body: JSON.stringify({
        target: targetUid,
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

  function getContacts() {
    fetch("/api/users/contacts", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        authorization: storageToken,
      },
      body: JSON.stringify({
        target: targetUid,
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

  return (
    <div className="user-list-tooltip">
      <button>
        <img src="/chat_24dp_FILL0_wght400_GRAD0_opsz24.svg" />
        Start chat
      </button>
      <button onClick={() => addContact(targetUser)}>
        <img src="/person_add_24dp_FILL0_wght400_GRAD0_opsz24.svg" />
        Add contact
      </button>
      <button>
        <img src="/person_remove_24dp_FILL0_wght400_GRAD0_opsz24.svg" />
        Delete contact
      </button>
    </div>
  );
}

export default MenuUserList;
