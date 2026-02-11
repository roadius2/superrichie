#!/usr/bin/env tsx
import { config } from "dotenv";
config({ path: ".env.local" });

import { mosaic } from "../lib/mosaic";

async function checkStatus() {
  const slug = process.env.MOSAIC_PROJECT_SLUG || "superrichie";

  console.log("📊 Checking deployment status...\n");

  const statusResult = await mosaic.getDeployStatus(slug);

  if (!statusResult.ok) {
    console.error("❌ Failed to get status:", statusResult.error);
    process.exit(1);
  }

  console.log("Status:", JSON.stringify(statusResult.data, null, 2));
}

checkStatus().catch(console.error);
