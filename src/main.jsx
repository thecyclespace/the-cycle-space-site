import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./fonts.css";
import "./index.css";

const rootEl = document.getElementById("root");
const app = (
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Prerendered pages (scripts/prerender.mjs) already contain the page in its URL language:
// reuse that HTML. The SPA fallback (404.html, empty root) is rendered from scratch.
if (rootEl.hasChildNodes()) {
  ReactDOM.hydrateRoot(rootEl, app);
} else {
  ReactDOM.createRoot(rootEl).render(app);
}
