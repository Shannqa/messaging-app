import { useState, useEffect, useContext } from "react";
import { AppContext } from "./Root.jsx";
import { Link, useNavigate } from "react-router-dom";
import { API_URL } from "../api.js";
import styles from "../styles/Login.module.css";

function Login() {
  const { user, setUser, setToken } = useContext(AppContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [logged, setLogged] = useState(null);
  const [usernameError, setUsernameError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);
  const navigate = useNavigate();

  function checkUsername() {
    if (username.length === 0) {
      setUsernameError("You must enter a username.");
      return false;
    } else if (username.length < 3) {
      setUsernameError("The username must have at least 3 characters.");
      return false;
    } else {
      return true;
    }
  }

  function checkPassword() {
    if (password.length === 0) {
      setPasswordError("You must enter a password.");
      return false;
    } else if (password.length < 3) {
      setPasswordError("The password must have at least 3 characters.");
      return false;
    } else {
      return true;
    }
  }
  // log in
  function handleSubmit(e) {
    e.preventDefault();
    const nameCheck = checkUsername();
    const passCheck = checkPassword();

    if (!nameCheck || !passCheck) {
      return;
    }
    fetch(`${API_URL}/api/auth/login`, {
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
          console.log(body.user.contacts);
          localStorage.setItem("accessToken", body.jwt.token);
          localStorage.setItem("username", body.user.username);
          localStorage.setItem("dbId", body.user._id);
          setToken(body.jwt.token);
          setLogged(true);
          setUsername("");
          navigate("/chat");
        } else {
          // there are errors
          if (body.message === "Incorrect username") {
            setUsernameError("Wrong username.");
          } else if (body.message === "Incorrect password") {
            setPasswordError("Wrong password.");
          }
          setLogged(false);
        }
        setPassword("");
      });
  }

  return (
    <form onSubmit={(e) => handleSubmit(e)} className={styles.login}>
      <h2>Log in</h2>
      <label htmlFor="username">Username</label>
      <input
        className={usernameError && styles.inputError}
        id="username"
        name="username"
        value={username}
        type="text"
        onChange={(e) => {
          setUsernameError(null);
          setUsername(e.target.value);
        }}
      />
      <p className={styles.error}>{usernameError}</p>
      <label htmlFor="password">Password</label>
      <input
        className={passwordError && styles.inputError}
        id="password"
        name="password"
        value={password}
        type="password"
        onChange={(e) => {
          setPasswordError(null);
          setPassword(e.target.value);
        }}
      />
      <p className={styles.error}>{passwordError}</p>
      <button type="submit">Submit</button>
      <p>
        No account? <Link to="/signup">Sign up</Link>
      </p>
    </form>
  );
}

export default Login;
