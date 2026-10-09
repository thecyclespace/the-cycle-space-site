import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";

// Single route table shared by the browser app (lazy pages) and the build-time
// prerender (static pages), so both always expose the same URLs.
export default function AppRoutes({ pages }) {
  const { Home, Services, About, BlogList, BlogPost, NotFound } = pages;
  return (
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
  );
}
