import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./fonts.css";
import "./index.css";

// After a new deployment, a page opened (or cached) before it still points to script files that no
// longer exist: navigating would leave a blank page. Reload once to pick up the current version.
window.addEventListener("vite:preloadError", (event) => {
  event.preventDefault();
  try {
    if (sessionStorage.getItem("tcs-reloaded")) return;
    sessionStorage.setItem("tcs-reloaded", "1");
  } catch {
    return;
  }
  window.location.reload();
});

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
