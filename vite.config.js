import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/the-cycle-space-site/",
  plugins: [react()],
  server: { port: 5173, host: true },
});
