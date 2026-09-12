import type { NextConfig } from "next";
import { PHASE_PRODUCTION_BUILD } from "next/constants";

// Vars the site needs to take payments. Missing any of these fails a production
// build early with a clear message instead of a silent "not configured" at runtime.
const REQUIRED_ENV = ["NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY", "STRIPE_SECRET_KEY"] as const;

// Vars needed for order emails. Missing these only warns — payments still work.
const RECOMMENDED_ENV = [
  "STRIPE_WEBHOOK_SECRET",
  "RESEND_API_KEY",
  "ORDER_FROM_EMAIL",
  "ORDER_NOTIFY_EMAIL",
] as const;

function validateEnv(isProductionBuild: boolean) {
  const missingRequired = REQUIRED_ENV.filter((k) => !process.env[k]);
  const missingRecommended = RECOMMENDED_ENV.filter((k) => !process.env[k]);

  if (missingRecommended.length > 0) {
    console.warn(
      `⚠️  Missing recommended env vars (order emails will be skipped): ${missingRecommended.join(", ")}.\n` +
        "    Set them in .env.local locally, or in your host's env vars (e.g. Vercel), then redeploy."
    );
  }

  if (missingRequired.length > 0) {
    const message =
      `Missing required env vars: ${missingRequired.join(", ")}.\n` +
      "Set them in .env.local locally, or in your hosting provider's environment " +
      "variables (e.g. Vercel → Settings → Environment Variables), then redeploy.";
    // Fail the production build loudly; only warn in dev so the site still runs.
    if (isProductionBuild) throw new Error(`❌ ${message}`);
    console.warn(`⚠️  ${message}`);
  }
}

const nextConfig: NextConfig = {
  /* config options here */
};

export default (phase: string) => {
  validateEnv(phase === PHASE_PRODUCTION_BUILD);
  return nextConfig;
};
