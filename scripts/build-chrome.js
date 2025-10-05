#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

class ChromeBuilder {
  constructor() {
    this.sourceDir = process.cwd();
    this.buildDir = path.join(this.sourceDir, "dist", "chrome");
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
    console.log("🚀 Building FitGirl Watchlist for Chrome/Edge...");
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

      console.log("✅ Chrome/Edge build completed successfully!");
      console.log(`📁 Build output: ${this.buildDir}`);
      console.log(
        `📦 Package: dist/fitgirl-watchlist-chrome-v${this.version}.zip`
      );
    } catch (error) {
      console.error("❌ Build failed:", error.message);
      process.exit(1);
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
    const filesToCopy = [
      "src/manifest.json",
      "src/background.js",
      "src/content.js",
      "src/popup.html",
      "src/popup.js",
      "src/popup.css",
      "src/styles.css",
    ];

    const dirsToCopy = ["assets/icons"];

    console.log("📋 Copying files...");

    // Copy individual files
    filesToCopy.forEach((file) => {
      const sourcePath = path.join(this.sourceDir, file);
      const destFileName = path.basename(file); // Get just the filename
      const destPath = path.join(this.buildDir, destFileName);

      if (fs.existsSync(sourcePath)) {
        fs.copyFileSync(sourcePath, destPath);
        console.log(`  ✓ ${destFileName}`);
      } else {
        console.warn(`  ⚠️  ${file} not found, skipping...`);
      }
    });

    // Copy directories
    dirsToCopy.forEach((dir) => {
      const sourcePath = path.join(this.sourceDir, dir);
      const destDirName = path.basename(dir); // Get just the directory name
      const destPath = path.join(this.buildDir, destDirName);

      if (fs.existsSync(sourcePath)) {
        this.copyDir(sourcePath, destPath);
        console.log(`  ✓ ${destDirName}/`);
      } else {
        console.warn(`  ⚠️  ${dir}/ not found, skipping...`);
      }
    });
  }

  copyDir(src, dest) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }

    const entries = fs.readdirSync(src, { withFileTypes: true });

    for (const entry of entries) {
      const srcPath = path.join(src, entry.name);
      const destPath = path.join(dest, entry.name);

      if (entry.isDirectory()) {
        this.copyDir(srcPath, destPath);
      } else {
        fs.copyFileSync(srcPath, destPath);
      }
    }
  }

  async generateIcons() {
    const iconsDir = path.join(this.buildDir, "icons");
    const requiredIcons = ["icon16.png", "icon48.png", "icon128.png"];

    console.log("🎨 Checking icons...");

    const missingIcons = requiredIcons.filter(
      (icon) => !fs.existsSync(path.join(iconsDir, icon))
    );

    if (missingIcons.length > 0) {
      console.log(`⚠️  Missing icons: ${missingIcons.join(", ")}`);
      console.log("📝 Please generate icons using generate-icons.html");
      console.log("   or create them manually in the icons/ directory");

      // Create placeholder icons
      this.createPlaceholderIcons(iconsDir, missingIcons);
    } else {
      console.log("  ✓ All required icons found");
    }
  }

  createPlaceholderIcons(iconsDir, missingIcons) {
    console.log("🔧 Creating placeholder icons...");

    // Simple SVG-based icon generation
    const svgIcon = `
      <svg width="128" height="128" viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
          </linearGradient>
        </defs>
        <circle cx="64" cy="64" r="60" fill="url(#grad1)" stroke="#fff" stroke-width="4"/>
        <text x="64" y="75" text-anchor="middle" fill="white" font-family="Arial" font-size="24" font-weight="bold">🎮</text>
      </svg>
    `;

    missingIcons.forEach((icon) => {
      const size = parseInt(icon.match(/\d+/)[0]);
      const svgPath = path.join(iconsDir, icon.replace(".png", ".svg"));
      fs.writeFileSync(svgPath, svgIcon);
      console.log(
        `  ✓ Created ${icon.replace(".png", ".svg")} (${size}x${size})`
      );
    });

    console.log(
      "⚠️  Note: PNG icons are required for the extension to work properly"
    );
    console.log(
      "   Please convert the SVG files to PNG or use generate-icons.html"
    );
  }

  updateManifestVersion() {
    const manifestPath = path.join(this.buildDir, "manifest.json");

    if (fs.existsSync(manifestPath)) {
      const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
      manifest.version = this.version;
      fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
      console.log("  ✓ Updated manifest version");
    }
  }

  createZipPackage() {
    const zipName = `fitgirl-watchlist-chrome-v${this.version}.zip`;
    const zipPath = path.join(this.sourceDir, "dist", zipName);

    console.log("📦 Creating zip package...");

    try {
      // Use PowerShell on Windows, zip on Unix-like systems
      const isWindows = process.platform === "win32";

      if (isWindows) {
        // PowerShell Compress-Archive
        const psCommand = `Compress-Archive -Path "${this.buildDir}\\*" -DestinationPath "${zipPath}" -Force`;
        execSync(`powershell -Command "${psCommand}"`, { stdio: "pipe" });
      } else {
        // Unix zip command
        execSync(`cd "${this.buildDir}" && zip -r "${zipPath}" .`, {
          stdio: "pipe",
        });
      }

      console.log(`  ✓ Created ${zipName}`);
    } catch (error) {
      console.warn("⚠️  Failed to create zip package:", error.message);
      console.log(
        "   You can manually zip the contents of the dist/chrome/ directory"
      );
    }
  }
}

// Run the build
if (require.main === module) {
  const builder = new ChromeBuilder();
  builder.build().catch(console.error);
}

module.exports = ChromeBuilder;
