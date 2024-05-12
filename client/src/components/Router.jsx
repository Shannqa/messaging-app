import { createBrowserRouter, RouterProvider } from "react-router-dom";
import React from "react";
import Root from "./Root.jsx";
import ErrorPage from "./ErrorPage.jsx";
// import Placeholder from "./Placeholder.jsx";
import Login from "./Login.jsx";
import Signup from "./Signup.jsx";
import Home from "./Home.jsx";
import Account from "./Account.jsx";
import Client from "./Client.jsx";
import Chat from "./Chat.jsx";

function Router() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Root />,
      errorElement: <ErrorPage />,
      children: [
        {
          index: true,
          element: <Home />,
        },
        {
          path: "/login",
          element: <Login />,
        },
        {
          path: "/chat",
          element: <Chat />,
        },
        {
          path: "/signup",
          element: <Signup />,
        },
        {
          path: "/account",
          element: <Account />,
        },
        {
          path: "/chat",
          element: <Client />,
        },
      ],
    },
  ]);
  return <RouterProvider router={router} />;
}

export default Router;
