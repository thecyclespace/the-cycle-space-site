import { lazy } from "react";
import { BrowserRouter } from "react-router-dom";
import { MotionConfig } from "framer-motion";
import AppRoutes from "./AppRoutes";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";

// Secondary routes are loaded on demand (the calculators live in the blog bundle),
// which keeps the first mobile load smaller.
const pages = {
  Home,
  NotFound,
  Services: lazy(() => import("./pages/Services")),
  About: lazy(() => import("./pages/About")),
  BlogList: lazy(() => import("./pages/BlogList")),
  BlogPost: lazy(() => import("./pages/BlogPost")),
};

// Sous-chemin GitHub Pages (ex. "/the-cycle-space-site"). Sur domaine racine,
// BASE_URL vaut "/" -> basename "" (équivalent racine). Suit toujours `base` de Vite.
const BASENAME = import.meta.env.BASE_URL.replace(/\/$/, "");

export default function App() {
  return (
    // reducedMotion="user": animations disabled for visitors who ask for less motion.
    <MotionConfig reducedMotion="user">
      <BrowserRouter basename={BASENAME}>
        <AppRoutes pages={pages} />
      </BrowserRouter>
    </MotionConfig>
  );
}
