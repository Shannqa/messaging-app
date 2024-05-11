import { useState, useEffect, createContext, useRef } from "react";
import { Outlet } from "react-router-dom";
import React from "react";
import Header from "./Header.jsx";
import Footer from "./Footer.jsx";
import "../styles/main.css";
// import ErrorModal from "./ErrorModal.jsx";
import { io } from "socket.io-client";
let authToken = "zzz";
const ioSocket = io.connect("http://localhost:3003", {
  withCredentials: true,
  autoConnect: false,
  auth: { token: authToken },
});

export const AppContext = createContext({
  socket: "",
  user: "",
  setUser: () => {},
  users: [],
  setUsers: () => {},
  token: "",
  setToken: () => {},
  openTabs: [],
  setOpenTabs: () => {},
  currentTab: "",
  setCurrentTab: () => {},
  allTab: "",
  setAllTab: () => {},
  lastMessageRef: "",
  // error: "",
  // setError: () => {},
});

function Root() {
  const socket = ioSocket;
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [openTabs, setOpenTabs] = useState([]);
  const [currentTab, setCurrentTab] = useState("All");
  // const [loading, setLoading] = useState();
  // const [error, setError] = useState(null);
  const [token, setToken] = useState(null);
  const [allTab, setAllTab] = useState([]);
  const lastMessageRef = useRef(null);
  // verify token on refresh
  useEffect(() => {
    const storageToken = localStorage.getItem("accessToken");
    if (storageToken) {
      fetch("/api/auth/check", {
        method: "POST",
        headers: {
          Accept: "application/json",
          authorization: storageToken,
        },
      })
        .then((res) => res.json())
        .then((body) => {
          if (body.success) {
            setUser(body.user);
            setToken(storageToken);
            socket.io.opts.query = { user: body.user };
            authToken = storageToken;
            socket.connect();
          }
        })
        .catch((err) => console.log(err));
    } else {
      console.log("not log");
    }

    return () => {
      socket.disconnect();
    };
  }, [token]);

  return (
    <AppContext.Provider
      value={{
        socket,
        user,
        setUser,
        users,
        setUsers,
        token,
        setToken,
        openTabs,
        setOpenTabs,
        currentTab,
        setCurrentTab,
        allTab,
        setAllTab,
        lastMessageRef,
        // error,
        // setError,
      }}
    >
      <div className="root">
        <Header />
        {/* {error && <ErrorModal message={error} />} */}
        <Outlet />
        <Footer />
      </div>
    </AppContext.Provider>
  );
}

export default Root;
