import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: [
    "playwright",
    "@playwright/test",
    "@axe-core/playwright",
    "axe-core",
  ],
};

export default nextConfig;