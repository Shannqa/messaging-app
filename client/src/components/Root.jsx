import { useState, useEffect, createContext, useRef } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import React from "react";
import Header from "./Header.jsx";
import Footer from "./Footer.jsx";
import { API_URL } from "../api.js";
import "../styles/main.css";
// import ErrorModal from "./ErrorModal.jsx";

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
  userListTab: "",
  setUserListTab: () => {},
  contacts: [],
  setContacts: () => {},
  // error: "",
  // setError: () => {},
  userMenu: "",
  setUserMenu: () => {},
  targetUser: "",
  setTargetUser: () => {},
});

function Root() {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [openTabs, setOpenTabs] = useState([]);
  const [currentTab, setCurrentTab] = useState("All");
  // const [loading, setLoading] = useState();
  // const [error, setError] = useState(null);
  const [token, setToken] = useState(null);
  const [allTab, setAllTab] = useState([]);
  const [userListTab, setUserListTab] = useState("Rooms");
  const lastMessageRef = useRef(null);
  const navigate = useNavigate();
  const [contacts, setContacts] = useState([]);
  const [userMenu, setUserMenu] = useState(false);
  const [targetUser, setTargetUser] = useState(null);
  // verify token on refresh
  useEffect(() => {
    const storageToken = localStorage.getItem("accessToken");
    if (storageToken) {
      fetch(`${API_URL}/api/auth/check`, {
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
            navigate("/chat");
          }
        })
        .catch((err) => console.log(err));
    } else {
      console.log("not log");
    }
  }, [token]);

  return (
    <AppContext.Provider
      value={{
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
        userListTab,
        setUserListTab,
        contacts,
        setContacts,
        userMenu,
        setUserMenu,
        targetUser,
        setTargetUser,
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
