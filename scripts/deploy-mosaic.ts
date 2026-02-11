#!/usr/bin/env tsx
import { config } from "dotenv";
config({ path: ".env.local" });

import { mosaic } from "../lib/mosaic";
import * as fs from "fs";

async function deploy() {
  const slug = process.env.MOSAIC_PROJECT_SLUG || "superrichie";

  console.log("📦 Preparing deployment to Mosaic Platform...\n");

  // Read all important files
  const files: { path: string; content: string }[] = [];

  const filesToDeploy = [
    "package.json",
    "next.config.ts",
    "tsconfig.json",
    "tailwind.config.ts",
    "postcss.config.mjs",
    ".gitignore",
    "app/layout.tsx",
    "app/page.tsx",
    "app/globals.css",
    "app/signup/page.tsx",
    "app/dashboard/page.tsx",
    "app/api/auth/magic-link/route.ts",
    "app/api/auth/verify/route.ts",
    "lib/mosaic.ts",
    "lib/db-mosaic.ts",
    "lib/email.ts",
  ];

  for (const filePath of filesToDeploy) {
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, "utf-8");
      files.push({ path: filePath, content });
    }
  }

  console.log(`📁 Pushing ${files.length} files to Mosaic Git and deploying...\n`);

  const pushResult = await mosaic.pushToGit(
    slug,
    files,
    "Deploy SuperRichie from API",
    true // auto-deploy
  );

  if (!pushResult.ok) {
    console.error("❌ Failed to push to Git:", pushResult.error);
    process.exit(1);
  }

  console.log("✅ Files pushed and deployment triggered!\n");
  console.log("Push result:", pushResult.data);
  console.log(`🌐 Your app will be live at: https://${slug}.mosaic.site\n`);
  console.log("📊 Check deployment status:");
  console.log(`   npm run deploy-status`);
}

deploy().catch(console.error);
