#!/usr/bin/env node

/**
 * FitGirl Watchlist Extension - Installer Creator
 * Creates installers for Chrome/Edge and Firefox extensions
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

class InstallerCreator {
  constructor() {
    this.rootDir = path.resolve(__dirname, "..");
    this.distDir = path.join(this.rootDir, "dist");
    this.installersDir = path.join(this.distDir, "installers");
    this.config = {
      extensionName: "FitGirl Repacks Watchlist",
      version: "1.0.0",
      author: "FitGirl Watchlist Team",
      description:
        "A browser extension to create a watchlist for FitGirl repacks with reminder functionality",
      homepage: "https://github.com/yourusername/fitgirl-watchlist-extension",
    };
  }

  async createInstallers() {
    console.log("🔧 FitGirl Watchlist Extension - Installer Creator");
    console.log("================================================\n");

    try {
      // Check if dist directory exists
      if (!fs.existsSync(this.distDir)) {
        console.error(
          '❌ dist/ directory not found. Please run "pnpm run build" first.'
        );
        process.exit(1);
      }

      // Create installers directory
      this.createInstallersDir();

      // Create Chrome/Edge installer
      await this.createChromeInstaller();

      // Create Firefox installer
      await this.createFirefoxInstaller();

      // Create installation guide
      this.createInstallationGuide();

      console.log("\n🎉 Installer Creation Complete!");
      console.log("===============================");
      console.log(`📁 Installers created in: ${this.installersDir}`);
      console.log("📋 Installation guide: dist/installers/INSTALL.md");
    } catch (error) {
      console.error("❌ Error creating installers:", error.message);
      process.exit(1);
    }
  }

  createInstallersDir() {
    if (!fs.existsSync(this.installersDir)) {
      fs.mkdirSync(this.installersDir, { recursive: true });
      console.log("📁 Created installers directory");
    }
  }

  async createChromeInstaller() {
    console.log("\n🌐 Creating Chrome/Edge installer...");

    const chromeDir = path.join(this.distDir, "chrome");
    const installerDir = path.join(this.installersDir, "chrome");

    if (!fs.existsSync(chromeDir)) {
      throw new Error(
        'Chrome build not found. Please run "pnpm run build" first.'
      );
    }

    // Create installer directory
    if (!fs.existsSync(installerDir)) {
      fs.mkdirSync(installerDir, { recursive: true });
    }

    // Copy extension files
    this.copyDir(chromeDir, installerDir);

    // Create batch installer for Windows
    this.createChromeBatchInstaller(installerDir);

    // Create shell installer for Unix/Linux/macOS
    this.createChromeShellInstaller(installerDir);

    // Create PowerShell installer
    this.createChromePowerShellInstaller(installerDir);

    console.log("  ✅ Chrome/Edge installer created");
  }

  async createFirefoxInstaller() {
    console.log("\n🦊 Creating Firefox installer...");

    const firefoxDir = path.join(this.distDir, "firefox");
    const installerDir = path.join(this.installersDir, "firefox");

    if (!fs.existsSync(firefoxDir)) {
      throw new Error(
        'Firefox build not found. Please run "pnpm run build" first.'
      );
    }

    // Create installer directory
    if (!fs.existsSync(installerDir)) {
      fs.mkdirSync(installerDir, { recursive: true });
    }

    // Copy extension files
    this.copyDir(firefoxDir, installerDir);

    // Create batch installer for Windows
    this.createFirefoxBatchInstaller(installerDir);

    // Create shell installer for Unix/Linux/macOS
    this.createFirefoxShellInstaller(installerDir);

    // Create PowerShell installer
    this.createFirefoxPowerShellInstaller(installerDir);

    console.log("  ✅ Firefox installer created");
  }

  createChromeBatchInstaller(installerDir) {
    const batchContent = `@echo off
echo ========================================
echo FitGirl Repacks Watchlist - Chrome/Edge
echo ========================================
echo.
echo This installer will help you install the FitGirl Repacks Watchlist extension.
echo.
echo Please follow these steps:
echo.
echo 1. Open Chrome or Edge browser
echo 2. Go to chrome://extensions/ (or edge://extensions/ for Edge)
echo 3. Enable "Developer mode" (toggle in top right corner)
echo 4. Click "Load unpacked" button
echo 5. Select this folder: %~dp0
echo 6. The extension should now appear in your extensions list
echo.
echo The extension will work on fitgirl-repacks.site
echo.
echo Press any key to open Chrome extensions page...
pause >nul
start chrome://extensions/
echo.
echo Installation complete! You can close this window.
pause
`;

    fs.writeFileSync(
      path.join(installerDir, "install-chrome.bat"),
      batchContent
    );
  }

  createChromeShellInstaller(installerDir) {
    const shellContent = `#!/bin/bash

echo "========================================"
echo "FitGirl Repacks Watchlist - Chrome/Edge"
echo "========================================"
echo ""
echo "This installer will help you install the FitGirl Repacks Watchlist extension."
echo ""
echo "Please follow these steps:"
echo ""
echo "1. Open Chrome or Edge browser"
echo "2. Go to chrome://extensions/ (or edge://extensions/ for Edge)"
echo "3. Enable 'Developer mode' (toggle in top right corner)"
echo "4. Click 'Load unpacked' button"
echo "5. Select this folder: $(pwd)"
echo "6. The extension should now appear in your extensions list"
echo ""
echo "The extension will work on fitgirl-repacks.site"
echo ""
echo "Press Enter to open Chrome extensions page..."
read -r
echo "Opening Chrome extensions page..."

# Try to open Chrome extensions page
if command -v google-chrome &> /dev/null; then
    google-chrome chrome://extensions/ &
elif command -v chromium-browser &> /dev/null; then
    chromium-browser chrome://extensions/ &
elif command -v chrome &> /dev/null; then
    chrome chrome://extensions/ &
else
    echo "Chrome not found. Please manually open chrome://extensions/"
fi

echo ""
echo "Installation complete!"
`;

    fs.writeFileSync(
      path.join(installerDir, "install-chrome.sh"),
      shellContent
    );

    // Make it executable
    try {
      execSync(`chmod +x "${path.join(installerDir, "install-chrome.sh")}"`);
    } catch (error) {
      console.log(
        "  ⚠️  Could not make shell script executable (this is normal on Windows)"
      );
    }
  }

  createChromePowerShellInstaller(installerDir) {
    const psContent = `# FitGirl Repacks Watchlist - Chrome/Edge Installer
# PowerShell Script

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "FitGirl Repacks Watchlist - Chrome/Edge" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "This installer will help you install the FitGirl Repacks Watchlist extension." -ForegroundColor Green
Write-Host ""
Write-Host "Please follow these steps:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Open Chrome or Edge browser" -ForegroundColor White
Write-Host "2. Go to chrome://extensions/ (or edge://extensions/ for Edge)" -ForegroundColor White
Write-Host "3. Enable 'Developer mode' (toggle in top right corner)" -ForegroundColor White
Write-Host "4. Click 'Load unpacked' button" -ForegroundColor White
Write-Host "5. Select this folder: $PSScriptRoot" -ForegroundColor White
Write-Host "6. The extension should now appear in your extensions list" -ForegroundColor White
Write-Host ""
Write-Host "The extension will work on fitgirl-repacks.site" -ForegroundColor Green
Write-Host ""
Write-Host "Press Enter to open Chrome extensions page..." -ForegroundColor Yellow
Read-Host

try {
    Start-Process "chrome://extensions/"
    Write-Host "Chrome extensions page opened!" -ForegroundColor Green
} catch {
    Write-Host "Could not open Chrome automatically. Please manually go to chrome://extensions/" -ForegroundColor Red
}

Write-Host ""
Write-Host "Installation complete!" -ForegroundColor Green
Write-Host "Press Enter to exit..." -ForegroundColor Yellow
Read-Host
`;

    fs.writeFileSync(path.join(installerDir, "install-chrome.ps1"), psContent);
  }

  createFirefoxBatchInstaller(installerDir) {
    const batchContent = `@echo off
echo ========================================
echo FitGirl Repacks Watchlist - Firefox
echo ========================================
echo.
echo This installer will help you install the FitGirl Repacks Watchlist extension.
echo.
echo Please follow these steps:
echo.
echo 1. Open Firefox browser
echo 2. Go to about:debugging
echo 3. Click "This Firefox" in the left sidebar
echo 4. Click "Load Temporary Add-on" button
echo 5. Select the manifest.json file in this folder
echo 6. The extension should now appear in your extensions list
echo.
echo Note: This is a temporary installation. The extension will be removed
echo when you restart Firefox. For permanent installation, you need to
echo sign the extension through Mozilla's process.
echo.
echo The extension will work on fitgirl-repacks.site
echo.
echo Press any key to open Firefox debugging page...
pause >nul
start firefox about:debugging
echo.
echo Installation complete! You can close this window.
pause
`;

    fs.writeFileSync(
      path.join(installerDir, "install-firefox.bat"),
      batchContent
    );
  }

  createFirefoxShellInstaller(installerDir) {
    const shellContent = `#!/bin/bash

echo "========================================"
echo "FitGirl Repacks Watchlist - Firefox"
echo "========================================"
echo ""
echo "This installer will help you install the FitGirl Repacks Watchlist extension."
echo ""
echo "Please follow these steps:"
echo ""
echo "1. Open Firefox browser"
echo "2. Go to about:debugging"
echo "3. Click 'This Firefox' in the left sidebar"
echo "4. Click 'Load Temporary Add-on' button"
echo "5. Select the manifest.json file in this folder: $(pwd)/manifest.json"
echo "6. The extension should now appear in your extensions list"
echo ""
echo "Note: This is a temporary installation. The extension will be removed"
echo "when you restart Firefox. For permanent installation, you need to"
echo "sign the extension through Mozilla's process."
echo ""
echo "The extension will work on fitgirl-repacks.site"
echo ""
echo "Press Enter to open Firefox debugging page..."
read -r
echo "Opening Firefox debugging page..."

# Try to open Firefox debugging page
if command -v firefox &> /dev/null; then
    firefox about:debugging &
else
    echo "Firefox not found. Please manually open about:debugging"
fi

echo ""
echo "Installation complete!"
`;

    fs.writeFileSync(
      path.join(installerDir, "install-firefox.sh"),
      shellContent
    );

    // Make it executable
    try {
      execSync(`chmod +x "${path.join(installerDir, "install-firefox.sh")}"`);
    } catch (error) {
      console.log(
        "  ⚠️  Could not make shell script executable (this is normal on Windows)"
      );
    }
  }

  createFirefoxPowerShellInstaller(installerDir) {
    const psContent = `# FitGirl Repacks Watchlist - Firefox Installer
# PowerShell Script

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "FitGirl Repacks Watchlist - Firefox" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "This installer will help you install the FitGirl Repacks Watchlist extension." -ForegroundColor Green
Write-Host ""
Write-Host "Please follow these steps:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Open Firefox browser" -ForegroundColor White
Write-Host "2. Go to about:debugging" -ForegroundColor White
Write-Host "3. Click 'This Firefox' in the left sidebar" -ForegroundColor White
Write-Host "4. Click 'Load Temporary Add-on' button" -ForegroundColor White
Write-Host "5. Select the manifest.json file in this folder: $PSScriptRoot\\manifest.json" -ForegroundColor White
Write-Host "6. The extension should now appear in your extensions list" -ForegroundColor White
Write-Host ""
Write-Host "Note: This is a temporary installation. The extension will be removed" -ForegroundColor Yellow
Write-Host "when you restart Firefox. For permanent installation, you need to" -ForegroundColor Yellow
Write-Host "sign the extension through Mozilla's process." -ForegroundColor Yellow
Write-Host ""
Write-Host "The extension will work on fitgirl-repacks.site" -ForegroundColor Green
Write-Host ""
Write-Host "Press Enter to open Firefox debugging page..." -ForegroundColor Yellow
Read-Host

try {
    Start-Process "firefox" -ArgumentList "about:debugging"
    Write-Host "Firefox debugging page opened!" -ForegroundColor Green
} catch {
    Write-Host "Could not open Firefox automatically. Please manually go to about:debugging" -ForegroundColor Red
}

Write-Host ""
Write-Host "Installation complete!" -ForegroundColor Green
Write-Host "Press Enter to exit..." -ForegroundColor Yellow
Read-Host
`;

    fs.writeFileSync(path.join(installerDir, "install-firefox.ps1"), psContent);
  }

  createInstallationGuide() {
    const guideContent = `# FitGirl Repacks Watchlist - Installation Guide

## Quick Installation

### Chrome/Edge Users
1. **Run the installer:**
   - **Windows**: Double-click \`install-chrome.bat\` or \`install-chrome.ps1\`
   - **macOS/Linux**: Run \`./install-chrome.sh\` in terminal

2. **Follow the on-screen instructions** to load the extension

### Firefox Users
1. **Run the installer:**
   - **Windows**: Double-click \`install-firefox.bat\` or \`install-firefox.ps1\`
   - **macOS/Linux**: Run \`./install-firefox.sh\` in terminal

2. **Follow the on-screen instructions** to load the extension

## Manual Installation

### Chrome/Edge
1. Open Chrome/Edge and go to \`chrome://extensions/\` (or \`edge://extensions/\`)
2. Enable "Developer mode" (toggle in top right)
3. Click "Load unpacked"
4. Select the \`chrome/\` folder from this installer package

### Firefox
1. Open Firefox and go to \`about:debugging\`
2. Click "This Firefox" in the left sidebar
3. Click "Load Temporary Add-on"
4. Select the \`manifest.json\` file from the \`firefox/\` folder

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

For issues or questions, please visit: ${this.config.homepage}

## Version

${this.config.extensionName} v${this.config.version}
`;

    fs.writeFileSync(path.join(this.installersDir, "INSTALL.md"), guideContent);
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

// Run the installer creator
if (require.main === module) {
  const creator = new InstallerCreator();
  creator.createInstallers().catch(console.error);
}

module.exports = InstallerCreator;
