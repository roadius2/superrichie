#!/usr/bin/env tsx
// Setup script to initialize SuperRichie on Mosaic Platform

import { config } from "dotenv";
config({ path: ".env.local" });

import { mosaic } from "../lib/mosaic";

async function setup() {
  console.log("🚀 Setting up SuperRichie on Mosaic Platform...\n");

  // Check if project already exists
  console.log("1. Checking for existing project...");
  const listResult = await mosaic.listProjects();

  let project;
  if (listResult.ok && listResult.data?.projects) {
    const existing = listResult.data.projects.find(
      (p: any) => p.slug === "superrichie" || p.name === "SuperRichie"
    );

    if (existing) {
      console.log("✅ Found existing project!");
      // Fetch full project details
      const infoResult = await mosaic.getProjectInfo(existing.slug);
      if (infoResult.ok) {
        project = infoResult.data;
      }
    }
  }

  if (!project) {
    // Create new project
    console.log("2. Creating new Mosaic project...");
    const projectResult = await mosaic.createProject("SuperRichie", "superrichie");

    if (!projectResult.ok) {
      console.error("❌ Failed to create project:", projectResult.error);
      process.exit(1);
    }

    project = projectResult.data;
    console.log("✅ Project created!");
  }

  console.log(`   Slug: ${project.slug}`);
  if (project.database) {
    console.log(`   Database: ${project.database.name || "tenant_" + project.slug}`);
  }
  if (project.git_repo_url) {
    console.log(`   Git URL: ${project.git_repo_url}`);
  }
  console.log(`   Live URL: https://${project.slug}.mosaic.site\n`);

  // Wait a moment for database to be fully provisioned
  console.log("2. Waiting for database provisioning...");
  await new Promise((resolve) => setTimeout(resolve, 3000));

  // Initialize database schema with retry
  console.log("3. Initializing database schema...");
  let dbResult;
  let retries = 3;

  while (retries > 0) {
    dbResult = await mosaic.initializeDatabase(project.slug);
    if (dbResult.ok) break;

    console.log(`   Retry ${4 - retries}/3...`);
    retries--;
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }

  if (!dbResult || !dbResult.ok) {
    console.error("❌ Failed to initialize database:", dbResult?.error);
    console.log("\n💡 The project was created successfully.");
    console.log("   You can manually initialize the database later by running this script again.");
    process.exit(1);
  }

  console.log("✅ Database initialized with users and magic_link_tokens tables\n");

  // Save project slug to env file
  console.log("4. Saving configuration...");
  const fs = await import("fs");
  const envPath = ".env.local";
  let envContent = fs.readFileSync(envPath, "utf-8");

  if (!envContent.includes("MOSAIC_PROJECT_SLUG")) {
    envContent += `\n# Mosaic Project Configuration\nMOSAIC_PROJECT_SLUG=${project.slug}\n`;
    fs.writeFileSync(envPath, envContent);
    console.log("✅ Added MOSAIC_PROJECT_SLUG to .env.local\n");
  }

  console.log("🎉 Setup complete!");
  console.log("\nNext steps:");
  console.log("1. Update your code to use Mosaic database");
  console.log("2. Deploy with: npm run deploy");
  console.log(`3. Visit: https://${project.slug}.mosaic.site`);
}

setup().catch((error) => {
  console.error("Setup failed:", error);
  process.exit(1);
});
