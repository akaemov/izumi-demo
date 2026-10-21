import type { NextConfig } from "next";
const pages = process.env.GITHUB_PAGES === "true";
const config: NextConfig = {
  distDir: process.env.NEXT_DIST_DIR || ".next",
  poweredByHeader: false,
  ...(pages
    ? {
        output: "export",
        basePath: "/izumi-demo",
        trailingSlash: true,
        images: { unoptimized: true },
      }
    : {}),
};
export default config;
