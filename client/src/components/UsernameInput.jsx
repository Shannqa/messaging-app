import { useState, useEffect, useContext } from "react";
import { AppContext } from "./Root.jsx";
import React from "react";

// import styles from "../styles/Home.module.css";

function UsernameInput() {
  const { socket, username, setUsername } = useContext(AppContext);
  const [name, setName] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    setUsername(name);
    localStorage.setItem("username", name);
    setName("");
  }

  return (
    <form onSubmit={handleSubmit} className="username-input">
      <label htmlFor="username">Choose your username</label>
      <input
        id="username"
        value={name}
        type="text"
        placeholder="Name"
        onChange={(e) => setName(e.target.value)}
      ></input>
      <button type="submit">Submit</button>
    </form>
  );
}

export default UsernameInput;
