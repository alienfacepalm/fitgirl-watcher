#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const ChromeBuilder = require("./build-chrome");
const EdgeBuilder = require("./build-edge");
const FirefoxBuilder = require("./build-firefox");

class UniversalBuilder {
  constructor() {
    this.sourceDir = process.cwd();
    this.distDir = path.join(this.sourceDir, "dist");
  }

  async build(platform = "all") {
    console.log("🚀 FitGirl Watchlist Extension Builder");
    console.log("=====================================\n");

    try {
      // Ensure dist directory exists
      if (!fs.existsSync(this.distDir)) {
        fs.mkdirSync(this.distDir, { recursive: true });
      }

      const startTime = Date.now();
      const results = [];

      if (platform === "all" || platform === "chrome") {
        console.log("🔨 Building for Chrome...");
        const chromeBuilder = new ChromeBuilder();
        await chromeBuilder.build();
        results.push("Chrome");
      }

      if (platform === "all" || platform === "edge") {
        console.log("\n🔨 Building for Edge...");
        const edgeBuilder = new EdgeBuilder();
        await edgeBuilder.build();
        results.push("Edge");
      }

      if (platform === "all" || platform === "firefox") {
        console.log("\n🔨 Building for Firefox...");
        const firefoxBuilder = new FirefoxBuilder();
        await firefoxBuilder.build();
        results.push("Firefox");
      }

      const endTime = Date.now();
      const duration = ((endTime - startTime) / 1000).toFixed(2);

      console.log("\n🎉 Build Summary");
      console.log("================");
      console.log(`✅ Successfully built for: ${results.join(", ")}`);
      console.log(`⏱️  Total build time: ${duration}s`);
      console.log(`📁 Output directory: ${this.distDir}`);

      this.showInstallationInstructions(results);
    } catch (error) {
      console.error("\n❌ Build failed:", error.message);
      process.exit(1);
    }
  }

  showInstallationInstructions(platforms) {
    console.log("\n📋 Installation Instructions");
    console.log("============================");

    if (platforms.includes("Chrome")) {
      console.log("\n🌐 Chrome:");
      console.log("  1. Open Chrome/Edge and go to chrome://extensions/");
      console.log('  2. Enable "Developer mode" (toggle in top right)');
      console.log(
        '  3. Click "Load unpacked" and select the dist/chrome/ folder'
      );
      console.log("  4. Or install the .zip file from dist/");
    }

    if (platforms.includes("Edge")) {
      console.log("\n🟦 Microsoft Edge:");
      console.log("  1. Open Edge and go to edge://extensions/");
      console.log('  2. Enable "Developer mode" (toggle in left sidebar)');
      console.log(
        '  3. Click "Load unpacked" and select the dist/edge/ folder'
      );
      console.log("  4. Or install the .zip file from dist/");
    }

    if (platforms.includes("Firefox")) {
      console.log("\n🦊 Firefox:");
      console.log("  1. Open Firefox and go to about:debugging");
      console.log('  2. Click "This Firefox" in the left sidebar');
      console.log('  3. Click "Load Temporary Add-on"');
      console.log("  4. Select the manifest.json file from dist/firefox/");
      console.log("  5. Or install the .xpi file from dist/");
    }

    console.log("\n💡 Tips:");
    console.log("  - Make sure to generate PNG icons before building");
    console.log("  - Test the extension on fitgirl-repacks.site pages");
    console.log(
      "  - Run 'pnpm run installers' to create user-friendly installers"
    );
    console.log("  - Check the browser console for any errors");
  }

  showHelp() {
    console.log("FitGirl Watchlist Extension Builder");
    console.log("===================================\n");
    console.log("Usage:");
    console.log("  node build.js [platform]\n");
    console.log("Platforms:");
    console.log("  all      Build for all platforms (default)");
    console.log("  chrome   Build for Chrome only");
    console.log("  edge     Build for Microsoft Edge only");
    console.log("  firefox  Build for Firefox only\n");
    console.log("Examples:");
    console.log("  node build.js");
    console.log("  node build.js chrome");
    console.log("  node build.js firefox\n");
  }
}

// Main execution
if (require.main === module) {
  const args = process.argv.slice(2);
  const platform = args[0] || "all";

  if (args.includes("--help") || args.includes("-h")) {
    const builder = new UniversalBuilder();
    builder.showHelp();
    process.exit(0);
  }

  if (!["all", "chrome", "edge", "firefox"].includes(platform)) {
    console.error(`❌ Invalid platform: ${platform}`);
    console.error("Valid platforms: all, chrome, edge, firefox");
    console.error("Use --help for more information");
    process.exit(1);
  }

  const builder = new UniversalBuilder();
  builder.build(platform).catch(console.error);
}

module.exports = UniversalBuilder;
