import { useState, useEffect, useContext } from "react";
import { AppContext } from "./Root.jsx";
import { useNavigate } from "react-router-dom";
import styles from "../styles/Login.module.css";

function Login() {
  const { user, setUser, token, setToken } = useContext(AppContext);
  const [data, setData] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [logged, setLogged] = useState(null);

  const navigate = useNavigate();

  // log in
  function handleSubmit(e) {
    e.preventDefault();

    fetch("/api/auth/login", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    })
      .then((res) => res.json())
      .then((body) => {
        if (body.success) {
          setUser(body.user.username);
          localStorage.setItem("accessToken", body.jwt.token);
          setToken(body.jwt.token);
          setLogged(true);
          navigate("/account");
        } else {
          setLogged(false);
        }
        setUsername("");
        setPassword("");
      });
  }

  return (
    <form onSubmit={(e) => handleSubmit(e)} className={styles.login}>
      <h2>Log in</h2>
      <label htmlFor="username">Username</label>
      <input
        id="username"
        name="username"
        onChange={(e) => setUsername(e.target.value)}
      />
      <label htmlFor="password">Password</label>
      <input
        id="password"
        name="password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">Submit</button>
    </form>
  );
}

export default Login;
