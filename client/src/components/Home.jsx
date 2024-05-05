import React, { useState, useEffect, useContext } from "react";
import { AppContext } from "./Root.jsx";
import Client from "./Client.jsx";
// import styles from "../styles/Home.module.css";

function Home() {
  const { socket } = useContext(AppContext);

  return (
    <div className="main">
      <Client />
    </div>
  );
}

export default Home;
