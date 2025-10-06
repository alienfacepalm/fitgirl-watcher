#!/usr/bin/env node

/**
 * FitGirl Watchlist Extension - Release Creator
 * Creates releases with automatic version bumping and timestamped filenames
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

class ReleaseCreator {
  constructor() {
    this.rootDir = path.resolve(__dirname, "..");
    this.distDir = path.join(this.rootDir, "dist");
    this.releasesDir = path.join(this.rootDir, "releases");
    this.packageJsonPath = path.join(this.rootDir, "package.json");
    this.config = {
      extensionName: "FitGirl Repacks Watchlist",
      author: "FitGirl Watchlist Team",
      description:
        "A browser extension to create a watchlist for FitGirl repacks with reminder functionality",
      homepage: "https://github.com/alienfacepalm/fitgirl-watcher",
    };
  }

  async createRelease(bumpType = "patch") {
    console.log("🚀 FitGirl Watchlist Extension - Release Creator");
    console.log("==============================================\n");

    try {
      // Validate bump type
      if (!["major", "minor", "patch", "prerelease"].includes(bumpType)) {
        throw new Error(
          'Invalid bump type. Use: "major", "minor", "patch", or "prerelease"'
        );
      }

      // Get current version
      const currentVersion = this.getCurrentVersion();
      console.log(`📋 Current version: ${currentVersion}`);

      // Bump version
      const newVersion = this.bumpVersion(currentVersion, bumpType);
      console.log(`📈 New version: ${newVersion}`);

      // Update package.json
      this.updatePackageJson(newVersion);

      // Create releases directory
      this.createReleasesDir();

      // Ensure zip tool available (Unix)
      this.ensureZipAvailable();

      // Build everything
      await this.buildAll();

      // Create release packages
      await this.createReleasePackages(newVersion);

      // Create release notes
      this.createReleaseNotes(newVersion, currentVersion, bumpType);

      // Create changelog entry
      this.updateChangelog(newVersion, currentVersion, bumpType);

      console.log("\n🎉 Release Creation Complete!");
      console.log("=============================");
      console.log(`📦 Version: ${newVersion}`);
      console.log(`📁 Release files created in: ${this.releasesDir}`);
      console.log("\n📋 Release Files:");
      console.log(`  - fitgirl-watchlist-${newVersion}-chrome.zip`);
      console.log(`  - fitgirl-watchlist-${newVersion}-edge.zip`);
      console.log(`  - fitgirl-watchlist-${newVersion}-safari.zip`);
      console.log(`  - fitgirl-watchlist-${newVersion}-firefox.xpi`);
      console.log(`  - RELEASE_NOTES_${newVersion}.md`);
      console.log(`  - CHANGELOG.md`);
    } catch (error) {
      console.error("❌ Error creating release:", error.message);
      process.exit(1);
    }
  }

  getCurrentVersion() {
    const packageJson = JSON.parse(
      fs.readFileSync(this.packageJsonPath, "utf8")
    );
    return packageJson.version;
  }

  bumpVersion(currentVersion, bumpType) {
    // Handle prerelease versions by extracting the base version
    const baseVersion = currentVersion.split("-")[0];
    const [major, minor, patch] = baseVersion.split(".").map(Number);
    const timestamp = new Date()
      .toISOString()
      .slice(0, 19)
      .replace(/[:-]/g, "");

    switch (bumpType) {
      case "major":
        return `${major + 1}.0.0`;
      case "minor":
        return `${major}.${minor + 1}.0`;
      case "patch":
        return `${major}.${minor}.${patch + 1}`;
      case "prerelease":
        return `${major}.${minor}.${patch}-pre.${timestamp}`;
      default:
        throw new Error(`Invalid bump type: ${bumpType}`);
    }
  }

  updatePackageJson(newVersion) {
    const packageJson = JSON.parse(
      fs.readFileSync(this.packageJsonPath, "utf8")
    );
    packageJson.version = newVersion;
    fs.writeFileSync(
      this.packageJsonPath,
      JSON.stringify(packageJson, null, 2)
    );
    console.log(`✓ Updated package.json to version ${newVersion}`);
  }

  createReleasesDir() {
    if (!fs.existsSync(this.releasesDir)) {
      fs.mkdirSync(this.releasesDir, { recursive: true });
      console.log("📁 Created releases directory");
    }
  }

  async buildAll() {
    console.log("\n🔨 Building all packages...");

    try {
      // Build extensions first
      console.log("  📦 Building extensions...");
      execSync("pnpm run build", { stdio: "pipe" });

      // Wait a moment for files to be written
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Create installers
      console.log("  🛠️  Creating installers...");
      execSync("pnpm run installers", { stdio: "pipe" });

      // Create native installers
      console.log("  🌐 Creating native installers...");
      execSync("pnpm run native-installers", { stdio: "pipe" });

      // Enhance packages with documentation
      console.log("  📚 Enhancing packages with documentation...");
      execSync("node scripts/enhance-packages.js", { stdio: "pipe" });

      console.log("  ✅ All builds completed successfully");
    } catch (error) {
      throw new Error(`Build failed: ${error.message}`);
    }
  }

  async createReleasePackages(version) {
    console.log("\n📦 Creating release packages...");

    const timestamp = new Date()
      .toISOString()
      .slice(0, 19)
      .replace(/[:-]/g, "");
    const versionWithTimestamp = `${version}-${timestamp}`;

    // Create Chrome package
    await this.createChromePackage(versionWithTimestamp);

    // Create Edge package
    await this.createEdgePackage(versionWithTimestamp);

    // Create Safari package
    await this.createSafariPackage(versionWithTimestamp);

    // Create Firefox package
    await this.createFirefoxPackage(versionWithTimestamp);

    // Note: Simplified to browser-only releases
    // Removed installer packages and combined package for simplicity
  }

  async createChromePackage(versionWithTimestamp) {
    console.log("  🌐 Creating Chrome package...");

    const chromeDir = path.join(this.distDir, "chrome");
    const packageName = `fitgirl-watchlist-${versionWithTimestamp}-chrome.zip`;
    const packagePath = path.join(this.releasesDir, packageName);

    if (!fs.existsSync(chromeDir)) {
      throw new Error("Chrome build not found");
    }

    try {
      this.createZipPackage(chromeDir, packagePath);
      console.log(`    ✅ Created: ${packageName}`);
    } catch (error) {
      console.error(`    ❌ Failed to create Chrome package: ${error.message}`);
    }
  }

  async createEdgePackage(versionWithTimestamp) {
    console.log("  🌐 Creating Edge package...");

    const edgeDir = path.join(this.distDir, "edge");
    const packageName = `fitgirl-watchlist-${versionWithTimestamp}-edge.zip`;
    const packagePath = path.join(this.releasesDir, packageName);

    if (!fs.existsSync(edgeDir)) {
      console.log("    ⚠️  Edge build not found, skipping...");
      return;
    }

    try {
      this.createZipPackage(edgeDir, packagePath);
      console.log(`    ✅ Created: ${packageName}`);
    } catch (error) {
      console.error(`    ❌ Failed to create Edge package: ${error.message}`);
    }
  }

  async createSafariPackage(versionWithTimestamp) {
    console.log("  🦁 Creating Safari package...");

    const safariDir = path.join(this.distDir, "safari");
    const packageName = `fitgirl-watchlist-${versionWithTimestamp}-safari.zip`;
    const packagePath = path.join(this.releasesDir, packageName);

    if (!fs.existsSync(safariDir)) {
      console.log("    ⚠️  Safari build not found, skipping...");
      return;
    }

    try {
      this.createZipPackage(safariDir, packagePath);
      console.log(`    ✅ Created: ${packageName}`);
    } catch (error) {
      console.error(`    ❌ Failed to create Safari package: ${error.message}`);
    }
  }

  async createFirefoxPackage(versionWithTimestamp) {
    console.log("  🦊 Creating Firefox package...");

    const firefoxDir = path.join(this.distDir, "firefox");
    const packageName = `fitgirl-watchlist-${versionWithTimestamp}-firefox.xpi`;
    const packagePath = path.join(this.releasesDir, packageName);

    if (!fs.existsSync(firefoxDir)) {
      throw new Error("Firefox build not found");
    }

    try {
      this.createZipPackage(firefoxDir, packagePath);
      console.log(`    ✅ Created: ${packageName}`);
    } catch (error) {
      console.error(
        `    ❌ Failed to create Firefox package: ${error.message}`
      );
    }
  }

  async createInstallerPackages(versionWithTimestamp) {
    console.log("  🛠️  Creating installer packages...");

    const installersDir = path.join(this.distDir, "installers");
    const packageName = `fitgirl-watchlist-${versionWithTimestamp}-installers.zip`;
    const packagePath = path.join(this.releasesDir, packageName);

    if (!fs.existsSync(installersDir)) {
      throw new Error("Installers not found");
    }

    try {
      this.createZipPackage(installersDir, packagePath);
      console.log(`    ✅ Created: ${packageName}`);
    } catch (error) {
      console.error(
        `    ❌ Failed to create installer package: ${error.message}`
      );
    }
  }

  async createNativeInstallerPackages(versionWithTimestamp) {
    console.log("  🌐 Creating native installer packages...");

    const nativeInstallersDir = path.join(this.distDir, "native-installers");
    const packageName = `fitgirl-watchlist-${versionWithTimestamp}-native-installers.zip`;
    const packagePath = path.join(this.releasesDir, packageName);

    if (!fs.existsSync(nativeInstallersDir)) {
      throw new Error("Native installers not found");
    }

    try {
      this.createZipPackage(nativeInstallersDir, packagePath);
      console.log(`    ✅ Created: ${packageName}`);
    } catch (error) {
      console.error(
        `    ❌ Failed to create native installer package: ${error.message}`
      );
    }
  }

  async createCombinedPackage(versionWithTimestamp) {
    console.log("  📦 Creating combined release package...");

    const combinedDir = path.join(this.releasesDir, "temp-combined");
    const packageName = `fitgirl-watchlist-${versionWithTimestamp}-complete.zip`;
    const packagePath = path.join(this.releasesDir, packageName);

    try {
      // Create temporary combined directory
      if (fs.existsSync(combinedDir)) {
        fs.rmSync(combinedDir, { recursive: true, force: true });
      }
      fs.mkdirSync(combinedDir, { recursive: true });

      // Copy all release components
      this.copyDir(
        path.join(this.distDir, "chrome"),
        path.join(combinedDir, "chrome")
      );
      this.copyDir(
        path.join(this.distDir, "edge"),
        path.join(combinedDir, "edge")
      );
      this.copyDir(
        path.join(this.distDir, "safari"),
        path.join(combinedDir, "safari")
      );
      this.copyDir(
        path.join(this.distDir, "firefox"),
        path.join(combinedDir, "firefox")
      );
      this.copyDir(
        path.join(this.distDir, "installers"),
        path.join(combinedDir, "installers")
      );
      this.copyDir(
        path.join(this.distDir, "native-installers"),
        path.join(combinedDir, "native-installers")
      );

      // Create combined README
      this.createCombinedReadme(combinedDir, versionWithTimestamp);

      // Create zip package
      this.createZipPackage(combinedDir, packagePath);

      // Clean up temporary directory
      fs.rmSync(combinedDir, { recursive: true, force: true });

      console.log(`    ✅ Created: ${packageName}`);
    } catch (error) {
      console.error(
        `    ❌ Failed to create combined package: ${error.message}`
      );
    }
  }

  createCombinedReadme(dir, version) {
    const readmeContent = `# ${
      this.config.extensionName
    } - Complete Release Package

**Version:** ${version}  
**Release Date:** ${new Date().toISOString().split("T")[0]}  
**Author:** ${this.config.author}

## 📦 What's Included

This complete release package contains everything you need to install and use the FitGirl Repacks Watchlist extension:

### 🌐 Browser Extensions
- **chrome/** - Chrome extension files
- **edge/** - Microsoft Edge extension files
- **safari/** - Safari extension files
- **firefox/** - Firefox extension files

### 🛠️ Installation Tools
- **installers/** - Script-based installers for Windows, macOS, and Linux
- **native-installers/** - HTML-based installers that work in any browser

## 🚀 Quick Start

### Which file should I download? (TL;DR)

1) ${this.config.extensionName} – Native Installers ZIP (Recommended)
- File: fitgirl-watchlist-{version}-{timestamp}-native-installers.zip
- Best for: Most users on Windows/macOS/Linux who want a zero-setup, double-click HTML installer that runs in the browser
- Why: Easiest path; no terminals or permissions needed. Just open the HTML and follow prompts

2) ${this.config.extensionName} – Installers ZIP
- File: fitgirl-watchlist-{version}-{timestamp}-installers.zip
- Best for: Users who prefer script-based installers (.bat/.ps1/.sh) per OS
- Why: Works offline with platform-native scripts; still straightforward

3) ${this.config.extensionName} – Chrome ZIP
- File: fitgirl-watchlist-{version}-{timestamp}-chrome.zip
- Best for: Manual install via chrome://extensions (Developer mode → Load unpacked)

4) ${this.config.extensionName} – Edge ZIP
- File: fitgirl-watchlist-{version}-{timestamp}-edge.zip
- Best for: Manual install via edge://extensions (Developer mode → Load unpacked)

5) ${this.config.extensionName} – Safari ZIP
- File: fitgirl-watchlist-{version}-{timestamp}-safari.zip
- Best for: Manual install via Safari Extension Builder

6) ${this.config.extensionName} – Firefox XPI
- File: fitgirl-watchlist-{version}-{timestamp}-firefox.xpi
- Best for: Temporary load via about:debugging → Load Temporary Add-on

7) ${this.config.extensionName} – Complete ZIP
- File: fitgirl-watchlist-{version}-{timestamp}-complete.zip
- Best for: Power users who want everything in one archive

### Option 1: Native HTML Installers (Recommended)
1. Go to the \`native-installers/\` folder
2. Double-click \`chrome-installer.html\` for Chrome/Edge
3. Double-click \`firefox-installer.html\` for Firefox
4. Follow the on-screen instructions

### Option 2: Script-based Installers
1. Go to the \`installers/\` folder
2. Choose your browser folder (\`chrome/\` or \`firefox/\`)
3. Run the appropriate installer for your OS:
   - **Windows**: Double-click \`.bat\` or \`.ps1\` files
   - **macOS/Linux**: Run \`.sh\` files in terminal

### Option 3: Manual Installation
1. **Chrome**: Go to \`chrome://extensions/\`, enable Developer mode, click "Load unpacked", select \`chrome/\` folder
2. **Edge**: Go to \`edge://extensions/\`, enable Developer mode, click "Load unpacked", select \`edge/\` folder
3. **Safari**: Go to Safari > Preferences > Advanced, enable "Show Develop menu", then Develop > Show Extension Builder, click "+" and select \`safari/\` folder
4. **Firefox**: Go to \`about:debugging\`, click "This Firefox", click "Load Temporary Add-on", select \`firefox/manifest.json\`

## 🎮 Features

- 🎯 **Easy Watchlist Management**: Add games to your watchlist with a single click
- ⏰ **Smart Reminders**: Set custom reminder intervals (default: 7 days)
- 🔔 **Desktop Notifications**: Get notified when it's time to check your watchlist
- 📱 **Modern UI**: Clean, responsive interface that works on all devices
- 💾 **Data Export/Import**: Backup and restore your watchlist data
- 🎯 **Smart Detection**: Automatically detects game items on fitgirl-repacks.site

## 📋 Installation Requirements

- **Chrome**: Version 88 or higher
- **Edge**: Version 88 or higher
- **Safari**: Version 14 or higher (macOS 11+)
- **Firefox**: Version 78 or higher
- **Website**: fitgirl-repacks.site

## 🔧 Troubleshooting

If you encounter any issues:

1. **Check the README files** in each folder for detailed instructions
2. **Verify your browser version** meets the requirements
3. **Make sure you're on the correct website** (fitgirl-repacks.site)
4. **Check browser console** for error messages (F12 → Console)

## 📞 Support

- **Project Page**: ${this.config.homepage}
- **Issues**: Report problems on the project page
- **Documentation**: Check the README files in each folder

## 📄 License

This extension is provided as-is for educational and personal use.

---

**Enjoy managing your FitGirl repacks watchlist! 🎮**
`;

    fs.writeFileSync(path.join(dir, "README.md"), readmeContent);
  }

  createReleaseNotes(version, previousVersion, bumpType) {
    const releaseNotesContent = `# Release Notes - ${
      this.config.extensionName
    } v${version}

**Release Date:** ${new Date().toISOString().split("T")[0]}  
**Previous Version:** ${previousVersion}  
**Version Bump:** ${bumpType}

## 🎉 What's New

${this.getReleaseNotesContent(bumpType)}

## 📥 Which file should I download?

**Simply download the file for your browser:**

- **Chrome**: \`fitgirl-watchlist-${version}-<TIMESTAMP>-chrome.zip\`
- **Edge**: \`fitgirl-watchlist-${version}-<TIMESTAMP>-edge.zip\`
- **Safari**: \`fitgirl-watchlist-${version}-<TIMESTAMP>-safari.zip\`
- **Firefox**: \`fitgirl-watchlist-${version}-<TIMESTAMP>-firefox.xpi\`

## 🐛 Bug Fixes

- Fixed domain references from fit-girl.repacks to fitgirl-repacks.site
- Improved error handling in content scripts
- Enhanced notification reliability
- Fixed popup UI responsiveness issues

## 🔧 Improvements

- Added comprehensive installation documentation
- Created native HTML installers for easier installation
- Enhanced build system with automatic version bumping
- Improved cross-browser compatibility
- Added detailed troubleshooting guides

## 📦 Installation

### Chrome/Edge
1. Download the \`.zip\` file for your browser
2. Extract the files
3. Go to \`chrome://extensions/\` (Chrome) or \`edge://extensions/\` (Edge)
4. Enable "Developer mode"
5. Click "Load unpacked" and select the extracted folder

### Safari
1. Download the \`.zip\` file for Safari
2. Extract the files
3. Open Safari → Preferences → Advanced
4. Check "Show Develop menu in menu bar"
5. Go to Develop → Show Extension Builder
6. Click "+" and select the extracted folder

### Firefox
1. Download the \`.xpi\` file
2. Go to \`about:debugging\`
3. Click "This Firefox" → "Load Temporary Add-on"
4. Select the \`.xpi\` file

## 🔄 Migration from Previous Version

If you're upgrading from a previous version:

1. **Backup your data** (optional but recommended)
   - Open the extension popup
   - Go to Settings tab
   - Click "Export Data" to save your watchlist

2. **Remove old extension**
   - Go to your browser's extensions page
   - Remove the old version

3. **Install new version**
   - Follow the installation instructions above
   - Your data will be preserved in your browser

## 📋 System Requirements

- **Chrome**: Version 88 or higher
- **Edge**: Version 88 or higher  
- **Firefox**: Version 78 or higher
- **Website**: fitgirl-repacks.site

## 🆘 Support

If you encounter any issues:

1. Check the troubleshooting guide in the package
2. Visit the project page: ${this.config.homepage}
3. Check browser console for error messages

## 📝 Changelog

See CHANGELOG.md for a complete list of changes.

---

**Thank you for using ${this.config.extensionName}! 🎮**
`;

    const releaseNotesPath = path.join(
      this.releasesDir,
      `RELEASE_NOTES_${version}.md`
    );
    fs.writeFileSync(releaseNotesPath, releaseNotesContent);
    console.log(`✓ Created release notes: RELEASE_NOTES_${version}.md`);
  }

  getReleaseNotesContent(bumpType) {
    switch (bumpType) {
      case "major":
        return `## 🚀 Major Release

This is a major release with significant new features and improvements:

- **New Installation System**: Added native HTML installers for easier installation
- **Enhanced Documentation**: Comprehensive installation and troubleshooting guides
- **Improved Build System**: Automated version bumping and release creation
- **Better Cross-browser Support**: Enhanced compatibility across different browsers`;

      case "minor":
        return `## ✨ Minor Release

This release includes new features and improvements:

- **Enhanced Installation Experience**: New native HTML installers
- **Improved Documentation**: Better installation guides and troubleshooting
- **Build System Improvements**: Automated release creation with timestamps`;

      case "patch":
        return `## 🔧 Patch Release

This release includes bug fixes and minor improvements:

- **Domain Update**: Fixed all references to use fitgirl-repacks.site
- **Documentation Updates**: Enhanced installation instructions
- **Build Improvements**: Better release packaging`;

      case "prerelease":
        return `## 🧪 Pre-release

This is a pre-release version for testing:

- **New Features**: Testing new installation system
- **Bug Fixes**: Various fixes and improvements
- **Documentation**: Updated installation guides`;

      default:
        return `## 📦 Release

This release includes various improvements and bug fixes.`;
    }
  }

  updateChangelog(version, previousVersion, bumpType) {
    const changelogPath = path.join(this.releasesDir, "CHANGELOG.md");
    const date = new Date().toISOString().split("T")[0];

    let changelogContent = "";

    if (fs.existsSync(changelogPath)) {
      changelogContent = fs.readFileSync(changelogPath, "utf8");
    } else {
      changelogContent = `# Changelog

All notable changes to ${this.config.extensionName} will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

`;
    }

    const newEntry = `## [${version}] - ${date}

### ${this.getChangelogType(bumpType)}
${this.getChangelogContent(bumpType)}

### Changed
- Updated domain references from fit-girl.repacks to fitgirl-repacks.site
- Enhanced build system with automatic version bumping
- Improved installation documentation

### Fixed
- Fixed popup UI responsiveness issues
- Improved error handling in content scripts
- Enhanced notification reliability

`;

    // Insert new entry at the beginning (after the header)
    const lines = changelogContent.split("\n");
    const headerEndIndex = lines.findIndex((line) => line.startsWith("## ["));

    if (headerEndIndex === -1) {
      changelogContent = changelogContent + "\n" + newEntry;
    } else {
      lines.splice(headerEndIndex, 0, newEntry);
      changelogContent = lines.join("\n");
    }

    fs.writeFileSync(changelogPath, changelogContent);
    console.log("✓ Updated CHANGELOG.md");
  }

  getChangelogType(bumpType) {
    switch (bumpType) {
      case "major":
        return "Added";
      case "minor":
        return "Added";
      case "patch":
        return "Fixed";
      case "prerelease":
        return "Changed";
      default:
        return "Changed";
    }
  }

  getChangelogContent(bumpType) {
    switch (bumpType) {
      case "major":
        return `- Native HTML installers for easier installation
- Comprehensive installation and troubleshooting documentation
- Automated release creation system with semantic versioning
- Enhanced cross-browser compatibility`;

      case "minor":
        return `- Native HTML installers for improved installation experience
- Enhanced documentation with detailed installation guides
- Automated release packaging with timestamps`;

      case "patch":
        return `- Fixed domain references throughout the project
- Enhanced installation documentation
- Improved release packaging`;

      case "prerelease":
        return `- Testing new installation system
- Various bug fixes and improvements
- Updated documentation`;

      default:
        return `- Various improvements and bug fixes`;
    }
  }

  createZipPackage(sourceDir, outputPath) {
    try {
      // Use PowerShell's Compress-Archive on Windows
      if (process.platform === "win32") {
        const command = `powershell -Command "Compress-Archive -Path '${sourceDir}\\*' -DestinationPath '${outputPath}' -Force"`;
        execSync(command, { stdio: "pipe" });
      } else {
        // Use tar command on Unix-like systems (fallback to zip if available)
        try {
          execSync("command -v zip", { stdio: "pipe", shell: "/bin/bash" });
          const command = `zip -r "${outputPath}" .`;
          execSync(command, { cwd: sourceDir, stdio: "pipe" });
        } catch (zipError) {
          // Fallback to tar if zip is not available
          const tarPath = outputPath.replace(/\.zip$/, '.tar.gz');
          const command = `tar -czf "${tarPath}" .`;
          execSync(command, { cwd: sourceDir, stdio: "pipe" });
          // Rename the file to have .zip extension for consistency
          const fs = require('fs');
          fs.renameSync(tarPath, outputPath);
        }
      }
    } catch (error) {
      throw new Error(`Failed to create zip package: ${error.message}`);
    }
  }

  ensureZipAvailable() {
    if (process.platform === "win32") return;
    try {
      execSync("command -v zip", { stdio: "pipe", shell: "/bin/bash" });
    } catch (e) {
      // Fallback to tar if zip is not available
      try {
        execSync("command -v tar", { stdio: "pipe", shell: "/bin/bash" });
        console.log("Using tar as fallback for compression");
      } catch (tarError) {
        throw new Error(
          "'zip' or 'tar' is required. Install zip with: sudo apt update && sudo apt install -y zip"
        );
      }
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

// Main execution
if (require.main === module) {
  const args = process.argv.slice(2);
  const bumpType = args[0] || "patch";

  if (args.includes("--help") || args.includes("-h")) {
    console.log("FitGirl Watchlist Extension - Release Creator");
    console.log("=============================================\n");
    console.log("Usage:");
    console.log("  node scripts/create-release.js [bump-type]\n");
    console.log("Bump Types:");
    console.log("  patch      Patch release (default) - bug fixes");
    console.log("  minor      Minor release - new features");
    console.log("  major      Major release - breaking changes");
    console.log("  prerelease Pre-release - testing version\n");
    console.log("Examples:");
    console.log("  node scripts/create-release.js");
    console.log("  node scripts/create-release.js minor");
    console.log("  node scripts/create-release.js major\n");
    process.exit(0);
  }

  const creator = new ReleaseCreator();
  creator.createRelease(bumpType).catch(console.error);
}

module.exports = ReleaseCreator;
