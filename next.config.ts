import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Silence lockfile warning when repo has its own package-lock
  turbopack: { root: process.cwd() },
};

export default nextConfig;
