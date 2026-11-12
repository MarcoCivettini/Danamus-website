// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

// Base path: "/" by default, "/Danamus-website/" on GitHub Pages (set by the deploy workflow).
const base = process.env.SITE_BASE ?? "/";
const site = process.env.SITE_URL ?? "https://marcocivettini.github.io";

export default defineConfig({
  site,
  base,
  output: "static",
  trailingSlash: "ignore",
  // "assets" instead of "_astro": names starting with "_" are reserved by the claude.ai preview host.
  build: { format: "directory", inlineStylesheets: "auto", assets: "assets" },
  vite: { plugins: [tailwindcss()] },
});
