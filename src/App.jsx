import { lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MotionConfig } from "framer-motion";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";

// Secondary routes are loaded on demand (the calculators live in the blog bundle),
// which keeps the first mobile load smaller.
const Services = lazy(() => import("./pages/Services"));
const About = lazy(() => import("./pages/About"));
const BlogList = lazy(() => import("./pages/BlogList"));
const BlogPost = lazy(() => import("./pages/BlogPost"));

// Sous-chemin GitHub Pages (ex. "/the-cycle-space-site"). Sur domaine racine,
// BASE_URL vaut "/" -> basename "" (équivalent racine). Suit toujours `base` de Vite.
const BASENAME = import.meta.env.BASE_URL.replace(/\/$/, "");

export default function App() {
  return (
    // reducedMotion="user": animations disabled for visitors who ask for less motion.
    <MotionConfig reducedMotion="user">
      <BrowserRouter basename={BASENAME}>
          <Routes>
            <Route element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="services" element={<Services />} />
              <Route path="blog" element={<BlogList />} />
              <Route path="blog/:slug" element={<BlogPost />} />
              <Route path="about" element={<About />} />
              {/* /resources -> /blog (le guide PDF y a déménagé). */}
              <Route path="resources" element={<BlogList />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
      </BrowserRouter>
    </MotionConfig>
  );
}
