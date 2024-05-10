import { useState, useEffect, useContext } from "react";
import { AppContext } from "./Root.jsx";
import React from "react";

// import styles from "../styles/Home.module.css";

function ChatBody() {
  const { socket, user, currentTab, allTab } = useContext(AppContext);

  const [messages, setMessages, currentTab] = useState([]);

  useEffect(() => {
    socket.on("messageResponse", (data) => setMessages([...messages, data]));
  }, [socket, messages]);

  useEffect(() => {
    socket.on("connectionResponse", (data) => setMessages([...messages, data]));
  }, [socket, messages]);

  useEffect(() => {
    socket.on("private message response", ({ text, from }) => {
      console.log(text);
      setMessages([...messages, { user: from, text: text }]);
    });
  }, [socket, messages]);


const allMsgs = allTab.map(msg => {
  if (msg.name === "Server") {
    // announcement from the server
    return(<p className="msg-server">{msg.text}</p>)
  } else {
    // user message
    
    return(<p className="msg-own">
      <span>{msg.name}</span>
    </p>)
  }
  return(
    <p></p>
    )
  
})




if (currentTab === "All") {
  return(
    <div>
    {allTab.map((msg, index) => {
      return(
      <p className={msg.name === user ? "own-message" : "other-message"}>
        <span>{msg.name}</span>:
        <span>{msg.text}</span>
      </p>
      
      )
    })}
    </div>
  )
}
// all - 3 states
// own message, other user's message, announcement


  return (
    <div className="chat-body">
      {messages.map((msg, index) => {
        return (
          <>
            {msg.user === "Socket" ? (
              <p key={index}>{msg.text}</p>
            ) : (
              <p
                key={index}
                className={
                  msg.user === user.user ? "own-message" : "other-message"
                }
              >
                {msg.user}: {msg.text}
              </p>
            )}
          </>
        );
      })}
    </div>
  );
}

export default ChatBody;
