import { useState, useEffect, useContext } from "react";
import { AppContext } from "./Root.jsx";
import Logout from "./Logout.jsx";

function Account() {
  const { user, setUser } = useContext(AppContext);

  // add a post

  return (
    <div className="main">
      <p>Hello, {user}</p>

      <Logout />
    </div>
  );
}
export default Account;
