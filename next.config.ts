import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: [
    "playwright",
    "playwright-core",
    "@playwright/test",
    "@axe-core/playwright",
    "axe-core",
    "@sparticuz/chromium",
  ],
};

export default nextConfig;