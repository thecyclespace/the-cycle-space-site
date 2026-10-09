import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";

// Single route table shared by the browser app (lazy pages) and the build-time
// prerender (static pages). English lives at the root, French under /fr:
// the language is read from the URL (see lib/paths.js and lib/i18n.jsx).
export default function AppRoutes({ pages }) {
  const { Home, Services, About, BlogList, BlogPost, NotFound } = pages;
  const site = (
    <>
      <Route index element={<Home />} />
      <Route path="services" element={<Services />} />
      <Route path="blog" element={<BlogList />} />
      <Route path="blog/:slug" element={<BlogPost />} />
      <Route path="about" element={<About />} />
      {/* /resources -> /blog (le guide PDF y a déménagé). */}
      <Route path="resources" element={<BlogList />} />
    </>
  );
  return (
    <Routes>
      <Route element={<Layout />}>
        {site}
        <Route path="fr">
          {site}
          <Route path="*" element={<NotFound />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
