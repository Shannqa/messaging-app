// import { useRouterError } from "react-router-dom";
import React from "react";
function ErrorPage() {
  // const error = useRouterError();
  // console.error(error);

  return (
    <div id="error-page">
      <h1>Oops!</h1>
      <p>Sorry, an unexpeted error has occured.</p>
      <p>{/* {error.statusText || errorMessage} */}</p>
    </div>
  );
}

export default ErrorPage;
