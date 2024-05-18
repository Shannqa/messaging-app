import { useState, useEffect, useContext } from "react";
import { AppContext } from "./Root.jsx";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../api.js";
import styles from "../styles/Login.module.css";

function Signup() {
  const { user, setUser, token, setToken } = useContext(AppContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
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

  // sign up
  function handleSubmit(e) {
    e.preventDefault();
    const nameCheck = checkUsername();
    const passCheck = checkPassword();

    if (!nameCheck || !passCheck) {
      return;
    }
    fetch(`${API_URL}/api/auth/signup`, {
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
          setUsername("");
          setPassword("");
          navigate("/account");
        } else {
          // there are errors
          setUsername(body.username);
          setPassword(body.password);
          if (body.errors) {
            body.errors.forEach((err) => {
              if (err.path === "username") {
                setUsernameError(err.msg);
              } else if (err.path === "password") {
                setPasswordError(err.msg);
              }
            });
          }
        }
      });
  }

  return (
    <form onSubmit={(e) => handleSubmit(e)} className={styles.login}>
      <h2>Sign up</h2>
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
    </form>
  );
}

export default Signup;
