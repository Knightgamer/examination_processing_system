// client\src\index.js
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { UserRoleProvider } from "./components/UserRoleContext"; // Import UserRoleProvider
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <UserRoleProvider>
      <App />
    </UserRoleProvider>
  </React.StrictMode>
);
