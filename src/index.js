import React from "react";
import ReactDOM from "react-dom/client";
import App from "./app.jsx";
import "./app.css";
import { initializeSecurityMeasures } from "./utils/security.js";

// Initialize security measures
initializeSecurityMeasures();

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
