import React, { useState, useEffect, useContext } from "react";
import { AppContext } from "./Root.jsx";
import Client from "./Client.jsx";
import UsernameInput from "./UsernameInput.jsx";
// import styles from "../styles/Home.module.css";

function Home() {
  const { socket, username } = useContext(AppContext);

  return (
    <div className="main">{username ? <Client /> : <UsernameInput />}</div>
  );
}

export default Home;
