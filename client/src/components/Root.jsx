import { useState, useEffect, createContext, useReducer } from "react";
import { Outlet } from "react-router-dom";
// import Header from "./Header.jsx";
// import Footer from "./Footer.jsx";
import "../styles/main.css";
// import ErrorModal from "./ErrorModal.jsx";

export const AppContext = createContext({
  // user: "",
  // setUser: () => {},
  // token: "",
  // setToken: () => {},
  // error: "",
  // setError: () => {},
});

function Root() {
  // const [user, setUser] = useState(null);
  // const [loading, setLoading] = useState();
  // const [error, setError] = useState(null);
  // const [token, setToken] = useState(null);
  /*
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
          }
        })
        .catch((err) => console.log(err));
    } else {
      console.log("not log");
    }
  }, [token]);
*/
  return (
    <AppContext.Provider
      value={
        {
          // user,
          // setUser,
          // token,
          // setToken,
          // error,
          // setError,
        }
      }
    >
      <div className="root">
        {/* <Header /> */}
        {/* {error && <ErrorModal message={error} />} */}
        <Outlet />
        {/* <Footer /> */}
      </div>
    </AppContext.Provider>
  );
}

export default Root;
