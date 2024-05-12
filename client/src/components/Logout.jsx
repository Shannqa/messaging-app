import { useState, useEffect, useContext } from "react";
import { AppContext } from "./Root.jsx";
import { useNavigate } from "react-router-dom";
// import styles from "../styles/Header.module.css";

function Logout() {
  const { user, setUser } = useContext(AppContext);
  const [logged, setLogged] = useState(null);

  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("username");
    localStorage.removeItem("userId");
    setUser(null);
    setLogged(null);
    navigate("/");
  }

  return (
    <button className="button-cancel" onClick={handleLogout}>
      Log out
    </button>
  );
}

export default Logout;
