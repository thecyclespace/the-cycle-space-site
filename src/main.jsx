import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./fonts.css";
import "./index.css";

const rootEl = document.getElementById("root");

// Prerendered pages (see scripts/prerender.mjs) are in English. Reuse that HTML
// ("hydrate") so the first paint is not thrown away, except when the visitor has
// saved French as their language: then the prerendered text would not match, so
// we render from scratch instead.
function savedLang() {
  try {
    return localStorage.getItem("tcs_lang");
  } catch {
    return null;
  }
}

const app = (
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

if (rootEl.hasChildNodes() && savedLang() !== "fr") {
  ReactDOM.hydrateRoot(rootEl, app);
} else {
  ReactDOM.createRoot(rootEl).render(app);
}
