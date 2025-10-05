#!/usr/bin/env node

/**
 * FitGirl Watchlist Extension - Installer Packager
 * Creates distributable zip packages for the installers
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

class InstallerPackager {
  constructor() {
    this.rootDir = path.resolve(__dirname, "..");
    this.distDir = path.join(this.rootDir, "dist");
    this.installersDir = path.join(this.distDir, "installers");
    this.packagesDir = path.join(this.distDir, "packages");
    this.config = {
      extensionName: "FitGirl Repacks Watchlist",
      version: "1.0.0",
    };
  }

  async packageInstallers() {
    console.log("📦 FitGirl Watchlist Extension - Installer Packager");
    console.log("==================================================\n");

    try {
      // Check if installers directory exists
      if (!fs.existsSync(this.installersDir)) {
        console.error(
          '❌ installers/ directory not found. Please run "pnpm run installers" first.'
        );
        process.exit(1);
      }

      // Create packages directory
      this.createPackagesDir();

      // Package Chrome installer
      await this.packageChromeInstaller();

      // Package Firefox installer
      await this.packageFirefoxInstaller();

      // Create combined installer package
      await this.packageCombinedInstaller();

      console.log("\n🎉 Installer Packaging Complete!");
      console.log("=================================");
      console.log(`📁 Packages created in: ${this.packagesDir}`);
      console.log("\n📋 Available Packages:");
      console.log("  - fitgirl-watchlist-chrome-installer-v1.0.0.zip");
      console.log("  - fitgirl-watchlist-firefox-installer-v1.0.0.zip");
      console.log(
        "  - fitgirl-watchlist-installers-v1.0.0.zip (both browsers)"
      );
    } catch (error) {
      console.error("❌ Error packaging installers:", error.message);
      process.exit(1);
    }
  }

  createPackagesDir() {
    if (!fs.existsSync(this.packagesDir)) {
      fs.mkdirSync(this.packagesDir, { recursive: true });
      console.log("📁 Created packages directory");
    }
  }

  async packageChromeInstaller() {
    console.log("\n🌐 Packaging Chrome/Edge installer...");

    const chromeInstallerDir = path.join(this.installersDir, "chrome");
    const packageName = `fitgirl-watchlist-chrome-installer-v${this.config.version}.zip`;
    const packagePath = path.join(this.packagesDir, packageName);

    if (!fs.existsSync(chromeInstallerDir)) {
      throw new Error(
        'Chrome installer not found. Please run "pnpm run installers" first.'
      );
    }

    try {
      // Create zip package
      this.createZipPackage(chromeInstallerDir, packagePath);
      console.log(`  ✅ Created: ${packageName}`);
    } catch (error) {
      console.error(
        `  ❌ Failed to create Chrome installer package: ${error.message}`
      );
    }
  }

  async packageFirefoxInstaller() {
    console.log("\n🦊 Packaging Firefox installer...");

    const firefoxInstallerDir = path.join(this.installersDir, "firefox");
    const packageName = `fitgirl-watchlist-firefox-installer-v${this.config.version}.zip`;
    const packagePath = path.join(this.packagesDir, packageName);

    if (!fs.existsSync(firefoxInstallerDir)) {
      throw new Error(
        'Firefox installer not found. Please run "pnpm run installers" first.'
      );
    }

    try {
      // Create zip package
      this.createZipPackage(firefoxInstallerDir, packagePath);
      console.log(`  ✅ Created: ${packageName}`);
    } catch (error) {
      console.error(
        `  ❌ Failed to create Firefox installer package: ${error.message}`
      );
    }
  }

  async packageCombinedInstaller() {
    console.log("\n📦 Creating combined installer package...");

    const combinedDir = path.join(this.packagesDir, "temp-combined");
    const packageName = `fitgirl-watchlist-installers-v${this.config.version}.zip`;
    const packagePath = path.join(this.packagesDir, packageName);

    try {
      // Create temporary combined directory
      if (fs.existsSync(combinedDir)) {
        fs.rmSync(combinedDir, { recursive: true, force: true });
      }
      fs.mkdirSync(combinedDir, { recursive: true });

      // Copy both installer directories
      this.copyDir(
        path.join(this.installersDir, "chrome"),
        path.join(combinedDir, "chrome")
      );
      this.copyDir(
        path.join(this.installersDir, "firefox"),
        path.join(combinedDir, "firefox")
      );

      // Copy installation guide
      if (fs.existsSync(path.join(this.installersDir, "INSTALL.md"))) {
        fs.copyFileSync(
          path.join(this.installersDir, "INSTALL.md"),
          path.join(combinedDir, "INSTALL.md")
        );
      }

      // Create README for combined package
      this.createCombinedReadme(combinedDir);

      // Create zip package
      this.createZipPackage(combinedDir, packagePath);

      // Clean up temporary directory
      fs.rmSync(combinedDir, { recursive: true, force: true });

      console.log(`  ✅ Created: ${packageName}`);
    } catch (error) {
      console.error(
        `  ❌ Failed to create combined installer package: ${error.message}`
      );
    }
  }

  createCombinedReadme(dir) {
    const readmeContent = `# FitGirl Repacks Watchlist - Installers

This package contains installers for both Chrome/Edge and Firefox browsers.

## Quick Start

1. **Choose your browser** and navigate to the appropriate folder:
   - \`chrome/\` - For Chrome and Edge browsers
   - \`firefox/\` - For Firefox browser

2. **Run the installer** for your operating system:
   - **Windows**: Double-click the \`.bat\` file
   - **macOS/Linux**: Run the \`.sh\` file in terminal
   - **PowerShell**: Run the \`.ps1\` file

3. **Follow the on-screen instructions** to complete the installation

## What's Included

- **Chrome/Edge Installer**: Complete extension package with installers for Windows, macOS, and Linux
- **Firefox Installer**: Complete extension package with installers for Windows, macOS, and Linux
- **Installation Guide**: Detailed instructions for manual installation if needed

## Features

- 🎮 **Easy Watchlist Management**: Add games to your watchlist with a single click
- ⏰ **Smart Reminders**: Set custom reminder intervals (default: 7 days)
- 🔔 **Desktop Notifications**: Get notified when it's time to check your watchlist
- 📱 **Modern UI**: Clean, responsive interface that works on all devices
- 💾 **Data Export/Import**: Backup and restore your watchlist data

## Usage

1. Visit \`fitgirl-repacks.site\`
2. Look for the "Add to Watchlist" button (➕) next to game items
3. Click the button to add games to your watchlist
4. Click the extension icon to manage your watchlist and set reminders

## Support

For issues or questions, please visit: https://github.com/yourusername/fitgirl-watchlist-extension

## Version

${this.config.extensionName} v${this.config.version}
`;

    fs.writeFileSync(path.join(dir, "README.md"), readmeContent);
  }

  createZipPackage(sourceDir, outputPath) {
    try {
      // Use PowerShell's Compress-Archive on Windows
      if (process.platform === "win32") {
        const command = `powershell -Command "Compress-Archive -Path '${sourceDir}\\*' -DestinationPath '${outputPath}' -Force"`;
        execSync(command, { stdio: "pipe" });
      } else {
        // Use zip command on Unix-like systems
        const command = `zip -r "${outputPath}" .`;
        execSync(command, { cwd: sourceDir, stdio: "pipe" });
      }
    } catch (error) {
      throw new Error(`Failed to create zip package: ${error.message}`);
    }
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
}

// Run the installer packager
if (require.main === module) {
  const packager = new InstallerPackager();
  packager.packageInstallers().catch(console.error);
}

module.exports = InstallerPackager;
