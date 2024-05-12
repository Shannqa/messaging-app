import { useContext } from "react";
import { Link } from "react-router-dom";
import { AppContext } from "./Root.jsx";

function Header() {
  return (
    <div className="header">
      <h1>Chat</h1>
    </div>
  );
}

export default Header;
