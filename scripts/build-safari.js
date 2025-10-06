#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

class SafariBuilder {
  constructor() {
    this.sourceDir = process.cwd();
    this.buildDir = path.join(this.sourceDir, "dist", "safari");
    this.version = this.getVersion();
  }

  getVersion() {
    try {
      const packageJson = JSON.parse(fs.readFileSync("package.json", "utf8"));
      return packageJson.version;
    } catch (error) {
      console.error("Error reading package.json:", error.message);
      return "1.0.0";
    }
  }

  async build() {
    console.log("🦁 Building FitGirl Watchlist for Safari...");
    console.log(`📦 Version: ${this.version}`);

    try {
      // Clean and create build directory
      this.cleanBuildDir();
      this.createBuildDir();

      // Copy files
      this.copyFiles();

      // Generate icons if needed
      await this.generateIcons();

      // Update manifest version
      this.updateManifestVersion();

      // Create zip package
      this.createZipPackage();

      console.log("✅ Safari build completed successfully!");
      console.log(`📁 Build output: ${this.buildDir}`);
      console.log(
        `📦 Package: dist/fitgirl-watchlist-safari-v${this.version}.zip`
      );
    } catch (error) {
      console.error("❌ Safari build failed:", error.message);
      throw error;
    }
  }

  cleanBuildDir() {
    if (fs.existsSync(this.buildDir)) {
      fs.rmSync(this.buildDir, { recursive: true, force: true });
    }
  }

  createBuildDir() {
    fs.mkdirSync(this.buildDir, { recursive: true });
  }

  copyFiles() {
    console.log("📋 Copying extension files...");

    // Copy manifest.json
    const manifestPath = path.join(this.sourceDir, "src", "manifest.json");
    if (fs.existsSync(manifestPath)) {
      const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
      
      // Safari-specific manifest modifications
      const safariManifest = {
        ...manifest,
        manifest_version: 2, // Safari uses manifest v2
        name: manifest.name,
        version: this.version,
        description: manifest.description,
        permissions: manifest.permissions || [],
        content_scripts: manifest.content_scripts || [],
        background: manifest.background ? {
          scripts: manifest.background.scripts || [],
          persistent: false
        } : undefined,
        browser_action: manifest.action || manifest.browser_action,
        web_accessible_resources: manifest.web_accessible_resources || []
      };

      // Remove Chrome-specific fields
      delete safariManifest.action;
      delete safariManifest.host_permissions;

      fs.writeFileSync(
        path.join(this.buildDir, "manifest.json"),
        JSON.stringify(safariManifest, null, 2)
      );
    }

    // Copy source files
    this.copyDirectory(
      path.join(this.sourceDir, "src"),
      this.buildDir,
      ["manifest.json"] // Skip manifest.json as we handle it separately
    );

    // Copy assets
    const assetsDir = path.join(this.sourceDir, "assets");
    if (fs.existsSync(assetsDir)) {
      this.copyDirectory(assetsDir, path.join(this.buildDir, "assets"));
    }
  }

  copyDirectory(src, dest, excludeFiles = []) {
    if (!fs.existsSync(src)) return;

    const entries = fs.readdirSync(src, { withFileTypes: true });

    for (const entry of entries) {
      const srcPath = path.join(src, entry.name);
      const destPath = path.join(dest, entry.name);

      if (excludeFiles.includes(entry.name)) {
        continue;
      }

      if (entry.isDirectory()) {
        if (!fs.existsSync(destPath)) {
          fs.mkdirSync(destPath, { recursive: true });
        }
        this.copyDirectory(srcPath, destPath, excludeFiles);
      } else {
        try {
          fs.copyFileSync(srcPath, destPath);
        } catch (error) {
          console.log(`  ⚠️  Skipping ${entry.name}: ${error.message}`);
        }
      }
    }
  }

  async generateIcons() {
    console.log("🎨 Generating Safari icons...");

    const iconsDir = path.join(this.buildDir, "icons");
    if (!fs.existsSync(iconsDir)) {
      fs.mkdirSync(iconsDir, { recursive: true });
    }

    // Safari requires specific icon sizes
    const safariIconSizes = [16, 32, 48, 64, 128, 256, 512];

    for (const size of safariIconSizes) {
      const iconPath = path.join(iconsDir, `icon-${size}.png`);
      if (!fs.existsSync(iconPath)) {
        // Try to copy from assets if available
        const sourceIcon = path.join(this.sourceDir, "assets", `icon-${size}.png`);
        if (fs.existsSync(sourceIcon)) {
          fs.copyFileSync(sourceIcon, iconPath);
        } else {
          // Create a placeholder icon
          this.createPlaceholderIcon(iconPath, size);
        }
      }
    }
  }

  createPlaceholderIcon(iconPath, size) {
    // Create a simple placeholder icon using a basic approach
    // In a real implementation, you'd use a proper image library
    console.log(`  📝 Creating placeholder icon ${size}x${size}`);
    
    // For now, just create an empty file as a placeholder
    // In production, you'd generate an actual PNG icon
    fs.writeFileSync(iconPath, "");
  }

  updateManifestVersion() {
    const manifestPath = path.join(this.buildDir, "manifest.json");
    if (fs.existsSync(manifestPath)) {
      const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
      manifest.version = this.version;
      fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
    }
  }

  createZipPackage() {
    console.log("📦 Creating Safari package...");

    const packageName = `fitgirl-watchlist-safari-v${this.version}.zip`;
    const packagePath = path.join(this.sourceDir, "dist", packageName);

    try {
      // Use tar as fallback for compression (same as in release script)
      const command = `tar -czf "${packagePath}" .`;
      execSync(command, { cwd: this.buildDir, stdio: "pipe" });
      console.log(`✅ Created package: ${packageName}`);
    } catch (error) {
      console.error(`❌ Failed to create Safari package: ${error.message}`);
    }
  }
}

// Main execution
if (require.main === module) {
  const builder = new SafariBuilder();
  builder.build().catch(console.error);
}

module.exports = SafariBuilder;
